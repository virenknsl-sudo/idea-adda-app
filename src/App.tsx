import { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import { CollaborateHubView } from './components/CollaborateHubView';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { MarketplaceFeed } from './components/MarketplaceFeed';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PlansAndCreditsView } from './components/PlansAndCreditsView';
import { ProfileView } from './components/ProfileView';
import { SplashScreen } from './components/SplashScreen';
import { SubmitIdeaView } from './components/SubmitIdeaView';
import { SEED_IDEAS, SEED_PROPOSALS } from './data/seedIdeas';
import { auth, googleProvider } from './firebase';
import {
  approvePaymentAsAdmin,
  boostIdeaInFirestore,
  deleteIdeaAsAdmin,
  ensureUserProfile,
  publishIdeaToFirestore,
  rejectPaymentAsAdmin,
  submitProposalToFirestore,
  submitUtrPaymentToFirestore,
  subscribeIdeas,
  subscribePaymentRequests,
  subscribeProposals,
  subscribeUserProfile,
  toggleSavedIdeaInFirestore,
  toggleUpvoteIdeaInFirestore,
  unfeatureIdeaAsAdmin,
  unlockIdeaInFirestore,
  updateUserProfileInFirestore,
} from './services/firestoreService';
import {
  AccessFilter,
  AppView,
  CollaborationProposal,
  CreditPack,
  CreditPurchaseRequest,
  FilterOptions,
  IdeaCategory,
  IdeaItem,
  IdeaSubmissionInput,
  ProposalSubmissionInput,
  SortOption,
  UserProfile,
} from './types/marketplace';
import {
  ACTIVE_CREATORS_INITIAL,
  boostIdeaWithCredits,
  CREATOR_ADMIN_EMAIL,
  createCreditPurchaseRequest,
  filterAndSortIdeas,
  isAdminUser,
  mergeCatalogIdeas,
  nextActiveCreatorsCount,
  toggleSavedIdea,
  toggleUpvoteIdea,
  unlockIdeaWithCredits,
  validateBoostOnSubmit,
} from './utils/marketplaceLogic';

const THEME_STORAGE_KEY = 'idea_adda_theme';

const VIEW_PATHS: Record<AppView, string> = {
  explore: '/',
  submit: '/submit',
  collaborate: '/collaborate',
  plans: '/plans',
  profile: '/profile',
  admin: '/admin',
};

function getInitialViewFromUrl(): AppView {
  if (typeof window === 'undefined') return 'explore';
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/submit') return 'submit';
  if (path === '/collaborate') return 'collaborate';
  if (path === '/plans') return 'plans';
  if (path === '/profile') return 'profile';
  if (path === '/admin') return 'admin';
  return 'explore';
}

function formatActionError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code?: unknown }).code ?? '');
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return 'Google sign-in popup was closed before completing.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Popup blocked by your browser. Please allow popups for this site and try again.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'This domain is not authorized for Google Sign-In in Firebase Auth settings.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection error during sign-in. Check your connection and retry.';
    }
  }
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message) as { error?: string };
      if (parsed?.error) {
        if (parsed.error.toLowerCase().includes('permission')) {
          return 'Permission denied by database security rules. Ensure you are signed in with your Google account and try again.';
        }
        return parsed.error;
      }
    } catch {
      // Plain error message
    }
    return err.message || fallback;
  }
  return fallback;
}

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [activeView, setActiveView] = useState<AppView>(() => getInitialViewFromUrl());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cloudIdeas, setCloudIdeas] = useState<IdeaItem[]>([]);
  const [cloudProposals, setCloudProposals] = useState<CollaborationProposal[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<CreditPurchaseRequest[]>([]);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: IdeaCategory.ALL,
    access: AccessFilter.ALL,
    sortBy: SortOption.POPULAR,
    tag: '',
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [detailInitialTab, setDetailInitialTab] = useState<'overview' | 'collaborate'>('overview');
  const [activeCreators, setActiveCreators] = useState<number>(ACTIVE_CREATORS_INITIAL);
  const [authReady, setAuthReady] = useState(false);
  const [minSplashDone, setMinSplashDone] = useState(false);
  const [forceSplashDone, setForceSplashDone] = useState(false);

  const pendingRoleRef = useRef<UserProfile['role']>('Hybrid Creator');

  const seedIdeaIds = useMemo(() => new Set(SEED_IDEAS.map((idea) => idea.id)), []);
  const cloudIdeaIds = useMemo(() => new Set(cloudIdeas.map((idea) => idea.id)), [cloudIdeas]);

  const ideas = useMemo(() => mergeCatalogIdeas(SEED_IDEAS, cloudIdeas), [cloudIdeas]);

  const proposals = useMemo(() => {
    const seen = new Set<string>();
    const combined: CollaborationProposal[] = [];
    for (const item of [...cloudProposals, ...SEED_PROPOSALS]) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      combined.push(item);
    }
    return combined;
  }, [cloudProposals]);

  const adminAuthorized = useMemo(() => isAdminUser(user), [user]);

  useEffect(() => {
    const minTimer = window.setTimeout(() => setMinSplashDone(true), 1550);
    const maxTimer = window.setTimeout(() => setForceSplashDone(true), 2050);
    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveCreators((prev) => nextActiveCreatorsCount(prev));
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setActiveView(getInitialViewFromUrl());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDark]);

  // Public catalog listeners (guest readable)
  useEffect(() => {
    const unsubIdeas = subscribeIdeas(setCloudIdeas);
    const unsubProposals = subscribeProposals(setCloudProposals);
    return () => {
      unsubIdeas();
      unsubProposals();
    };
  }, []);

  // Multi-user Firebase Auth session & private user/payment listeners
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubPayments: (() => void) | null = null;
    let active = true;

    const clearPrivateSubs = () => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (unsubPayments) {
        unsubPayments();
        unsubPayments = null;
      }
    };

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      clearPrivateSubs();

      if (!fbUser) {
        if (active) {
          setUser(null);
          setPaymentRequests([]);
          setAuthReady(true);
        }
        return;
      }

      try {
        const ensured = await ensureUserProfile(fbUser, pendingRoleRef.current);
        if (!active) return;
        setUser(ensured);

        const verifiedAdmin =
          (fbUser.email ?? '').trim().toLowerCase() === CREATOR_ADMIN_EMAIL &&
          fbUser.emailVerified === true;

        unsubProfile = subscribeUserProfile(fbUser.uid, fbUser.emailVerified, (profile) => {
          if (active) setUser(profile);
        });
        unsubPayments = subscribePaymentRequests(fbUser.uid, verifiedAdmin, (requests) => {
          if (active) setPaymentRequests(requests);
        });
      } catch (err) {
        console.error('Auth profile sync warning:', err);
      } finally {
        if (active) setAuthReady(true);
      }
    });

    return () => {
      active = false;
      clearPrivateSubs();
      unsubAuth();
    };
  }, []);

  const showSplash = !forceSplashDone && (!minSplashDone || !authReady);

  const filteredIdeas = useMemo(() => filterAndSortIdeas(ideas, filters), [ideas, filters]);

  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === selectedIdeaId) ?? null,
    [ideas, selectedIdeaId]
  );

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    const targetPath = VIEW_PATHS[view];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignIn = async (
    role: UserProfile['role']
  ): Promise<{ ok: boolean; error?: string }> => {
    pendingRoleRef.current = role;
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const profile = await ensureUserProfile(credential.user, role);
      setUser(profile);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not complete Google Sign-In.'),
      };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setPaymentRequests([]);
      handleNavigate('explore');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleToggleSave = async (ideaId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const nextUser = toggleSavedIdea(user, ideaId);
    setUser(nextUser);
    try {
      await toggleSavedIdeaInFirestore(user.id, nextUser.savedIdeaIds);
    } catch (err) {
      console.error('Save toggle warning:', err);
      setUser(user);
    }
  };

  const handleToggleUpvote = async (ideaId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const result = toggleUpvoteIdea(ideas, user, ideaId);
    const updatedIdea = result.ideas.find((i) => i.id === ideaId);
    if (!updatedIdea) return;

    const previousUser = user;
    setUser(result.user);
    if (cloudIdeaIds.has(ideaId)) {
      setCloudIdeas((prev) =>
        prev.map((item) =>
          item.id === ideaId ? { ...item, upvotes: updatedIdea.upvotes } : item
        )
      );
    }

    try {
      await toggleUpvoteIdeaInFirestore({
        uid: user.id,
        upvotedIdeaIds: result.user.upvotedIdeaIds,
        ideaId,
        nextUpvotes: updatedIdea.upvotes,
        isCloudDoc: cloudIdeaIds.has(ideaId),
      });
    } catch (err) {
      console.error('Upvote sync warning:', err);
      setUser(previousUser);
    }
  };

  const handleUnlockWithCredits = async (
    idea: IdeaItem
  ): Promise<{ ok: boolean; error?: string }> => {
    const res = unlockIdeaWithCredits(idea, user);
    if (!res.ok) {
      return { ok: false, error: res.error };
    }
    if (res.user === user) {
      return { ok: true };
    }
    try {
      await unlockIdeaInFirestore({
        uid: res.user.id,
        nextCredits: res.user.credits,
        unlockedIdeaIds: res.user.unlockedIdeaIds,
      });
      setUser(res.user);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not unlock idea blueprint.'),
      };
    }
  };

  const handleBoostIdea = async (
    ideaId: string,
    boostCredits = 10
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user) {
      setAuthModalOpen(true);
      return { ok: false, error: 'Sign in with Google to boost your idea.' };
    }
    const res = boostIdeaWithCredits({
      ideas,
      user,
      ideaId,
      boostCredits,
    });
    if (!res.ok) {
      return { ok: false, error: res.error };
    }
    const target = res.ideas.find((i) => i.id === ideaId);
    if (!target) {
      return { ok: false, error: 'Idea not found.' };
    }
    try {
      await boostIdeaInFirestore({
        idea: target,
        user,
        boostCredits,
        featuredAt: target.featuredAt ?? new Date().toISOString(),
        isCloudDoc: cloudIdeaIds.has(ideaId),
        adminBypass: adminAuthorized,
      });
      setUser(res.user);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not boost your idea.'),
      };
    }
  };

  const handleSubmitIdea = async (
    input: IdeaSubmissionInput
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user) {
      setAuthModalOpen(true);
      return { ok: false, error: 'Sign in required.' };
    }

    const boostError = validateBoostOnSubmit(input, user);
    if (boostError) {
      return { ok: false, error: boostError };
    }

    const tags = input.tagsText
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const nowIso = new Date().toISOString();
    const shouldBoost = Boolean(input.boostIdea);
    const boostCost = shouldBoost ? Number(input.boostCredits ?? 10) : 0;

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: input.title.trim(),
      category: input.category,
      summary: input.summary.trim(),
      detailedDescription: input.detailedDescription.trim(),
      secretPitch: input.secretPitch.trim(),
      executionRoadmap: [
        'Validate core demand with 10 target buyers',
        'Ship minimal workflow prototype & pilot pricing',
        'Scale via partner channel highlighted in pitch',
      ],
      targetAudience: input.targetAudience.trim(),
      collaborationModel: input.collaborationModel,
      askingTerms: input.askingTerms.trim(),
      isPremium: input.isPremium,
      unlockCredits: input.isPremium ? input.unlockCredits : 0,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorHandle: `@${user.email.split('@')[0]}`,
      createdAt: nowIso,
      upvotes: 1,
      tags: tags.length > 0 ? tags : [input.category.toLowerCase()],
      isFeatured: shouldBoost,
      boostCredits: shouldBoost ? boostCost : undefined,
      featuredAt: shouldBoost ? nowIso : undefined,
    };

    const chargeCredits = adminAuthorized ? 0 : boostCost;

    try {
      await publishIdeaToFirestore({
        idea: newIdea,
        user,
        boostCost: chargeCredits,
      });

      if (shouldBoost && chargeCredits > 0) {
        setUser((prev) =>
          prev ? { ...prev, credits: Math.max(0, prev.credits - chargeCredits) } : null
        );
      }

      setFilters({
        searchQuery: '',
        category: IdeaCategory.ALL,
        access: AccessFilter.ALL,
        sortBy: SortOption.RECENT,
        tag: '',
      });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not publish your idea. Please try again.'),
      };
    }
  };

  const handleSubmitProposal = async (
    ideaId: string,
    input: ProposalSubmissionInput
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user) {
      setAuthModalOpen(true);
      return { ok: false, error: 'Sign in required to send a pitch.' };
    }

    const targetIdea = ideas.find((i) => i.id === ideaId);
    const newProposal: CollaborationProposal = {
      id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ideaId,
      ideaAuthorId: targetIdea?.authorId ?? 'catalog-creator',
      senderId: user.id,
      senderName: user.name,
      roleOffering: input.roleOffering.trim(),
      proposedTerms: input.proposedTerms.trim(),
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    try {
      await submitProposalToFirestore(newProposal);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not send collaboration pitch.'),
      };
    }
  };

  const handleInspectIdea = (idea: IdeaItem, tab: 'overview' | 'collaborate' = 'overview') => {
    setDetailInitialTab(tab);
    setSelectedIdeaId(idea.id);
  };

  const handleSubmitUtrPayment = async (
    pack: CreditPack,
    utr: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user) {
      setAuthModalOpen(true);
      return { ok: false, error: 'Sign in required.' };
    }
    const result = createCreditPurchaseRequest({
      user,
      pack,
      utr,
      existingRequests: paymentRequests,
    });
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    try {
      await submitUtrPaymentToFirestore(result.request);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not submit UTR verification request.'),
      };
    }
  };

  const handleApprovePayment = async (
    req: CreditPurchaseRequest
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !adminAuthorized) {
      return { ok: false, error: 'Creator admin verification required.' };
    }
    if (req.status !== 'Pending Verification') {
      return { ok: false, error: `Request is already ${req.status}.` };
    }
    try {
      await approvePaymentAsAdmin(req, user.id);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not approve payment request.'),
      };
    }
  };

  const handleRejectPayment = async (
    req: CreditPurchaseRequest
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !adminAuthorized) {
      return { ok: false, error: 'Creator admin verification required.' };
    }
    try {
      await rejectPaymentAsAdmin(req, user.id);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not reject payment request.'),
      };
    }
  };

  const handleAdminBoostIdea = async (
    idea: IdeaItem,
    boostCredits: number
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !adminAuthorized) {
      return { ok: false, error: 'Creator admin verification required.' };
    }
    try {
      await boostIdeaInFirestore({
        idea,
        user,
        boostCredits,
        featuredAt: new Date().toISOString(),
        isCloudDoc: cloudIdeaIds.has(idea.id),
        adminBypass: true,
      });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not pin idea.'),
      };
    }
  };

  const handleAdminUnfeatureIdea = async (
    idea: IdeaItem
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !adminAuthorized) {
      return { ok: false, error: 'Creator admin verification required.' };
    }
    try {
      await unfeatureIdeaAsAdmin(idea, cloudIdeaIds.has(idea.id));
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not unpin idea.'),
      };
    }
  };

  const handleAdminDeleteIdea = async (
    idea: IdeaItem
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !adminAuthorized) {
      return { ok: false, error: 'Creator admin verification required.' };
    }
    try {
      await deleteIdeaAsAdmin(idea, seedIdeaIds.has(idea.id));
      if (selectedIdeaId === idea.id) {
        setSelectedIdeaId(null);
      }
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: formatActionError(err, 'Could not remove idea.'),
      };
    }
  };

  const handleUpdateProfile = async (
    updates: Partial<Pick<UserProfile, 'name' | 'role' | 'bio'>>
  ) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    try {
      await updateUserProfileInFirestore(user.id, updates);
    } catch (err) {
      console.error('Profile update warning:', err);
    }
  };

  const scrollToFeed = () => {
    const el = document.getElementById('marketplace-feed');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090B10] dark:text-slate-100">
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        user={user}
        isAdmin={adminAuthorized}
        onOpenAuth={() => setAuthModalOpen(true)}
        activeCreators={activeCreators}
      />

      <main className="flex-1">
        {activeView === 'explore' && (
          <>
            <HeroSection
              totalIdeas={ideas.length}
              totalProposals={proposals.length}
              premiumIdeasCount={ideas.filter((i) => i.isPremium).length}
              activeCreators={activeCreators}
              onExploreFeed={scrollToFeed}
              onStartSubmit={() => handleNavigate('submit')}
            />
            <MarketplaceFeed
              ideas={ideas}
              filteredIdeas={filteredIdeas}
              proposals={proposals}
              user={user}
              filters={filters}
              onUpdateFilters={(next) => setFilters((prev) => ({ ...prev, ...next }))}
              onResetFilters={() =>
                setFilters({
                  searchQuery: '',
                  category: IdeaCategory.ALL,
                  access: AccessFilter.ALL,
                  sortBy: SortOption.POPULAR,
                  tag: '',
                })
              }
              onInspectIdea={(idea) => handleInspectIdea(idea, 'overview')}
              onToggleSave={handleToggleSave}
              onToggleUpvote={handleToggleUpvote}
            />
          </>
        )}

        {activeView === 'submit' && (
          <SubmitIdeaView
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSubmitIdea={handleSubmitIdea}
            onViewMarketplace={() => handleNavigate('explore')}
            onGoToPlans={() => handleNavigate('plans')}
          />
        )}

        {activeView === 'collaborate' && (
          <CollaborateHubView
            ideas={ideas}
            proposals={proposals}
            user={user}
            onOpenCollaboration={(idea) => handleInspectIdea(idea, 'collaborate')}
          />
        )}

        {activeView === 'plans' && (
          <PlansAndCreditsView
            user={user}
            paymentRequests={paymentRequests}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenAdmin={() => handleNavigate('admin')}
            onSubmitUtrPayment={handleSubmitUtrPayment}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            user={user}
            ideas={ideas}
            proposals={proposals}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSignOut={handleSignOut}
            onUpdateProfile={handleUpdateProfile}
            onInspectIdea={(idea) => handleInspectIdea(idea, 'overview')}
            onBoostIdea={handleBoostIdea}
            onGoToPlans={() => handleNavigate('plans')}
            onGoToSubmit={() => handleNavigate('submit')}
            onGoToExplore={() => handleNavigate('explore')}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboardView
            user={user}
            ideas={ideas}
            paymentRequests={paymentRequests}
            onOpenAuth={() => setAuthModalOpen(true)}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
            onAdminBoostIdea={handleAdminBoostIdea}
            onAdminUnfeatureIdea={handleAdminUnfeatureIdea}
            onAdminDeleteIdea={handleAdminDeleteIdea}
            onInspectIdea={(idea) => handleInspectIdea(idea, 'overview')}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
      />

      <IdeaDetailModal
        idea={selectedIdea}
        initialTab={detailInitialTab}
        user={user}
        proposals={proposals}
        onClose={() => setSelectedIdeaId(null)}
        onUnlockWithCredits={handleUnlockWithCredits}
        onUpgradeToPro={() => {
          setSelectedIdeaId(null);
          handleNavigate('plans');
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleSave={handleToggleSave}
        onToggleUpvote={handleToggleUpvote}
        onSubmitProposal={handleSubmitProposal}
        onBoostIdea={handleBoostIdea}
      />

      <OfflineIndicator />
      <SplashScreen visible={showSplash} />
    </div>
  );
}
