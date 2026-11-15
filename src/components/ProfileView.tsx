import React, { useState } from 'react';
import { CheckCircle2, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import {
  CollaborationProposal,
  IdeaItem,
  SubscriptionTier,
  UserProfile,
} from '../types/marketplace';
import { getUserStats } from '../utils/marketplaceLogic';

interface ProfileViewProps {
  user: UserProfile | null;
  ideas: IdeaItem[];
  proposals: CollaborationProposal[];
  onOpenAuth: () => void;
  onSignOut: () => void;
  onUpdateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'role' | 'bio'>>) => void;
  onInspectIdea: (idea: IdeaItem) => void;
  onBoostIdea: (ideaId: string, boostCredits: number) => Promise<{ ok: boolean; error?: string }>;
  onGoToPlans: () => void;
  onGoToSubmit: () => void;
  onGoToExplore: () => void;
}

type ProfileTab = 'submitted' | 'unlocked' | 'saved' | 'proposals';

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  ideas,
  proposals,
  onOpenAuth,
  onSignOut,
  onUpdateProfile,
  onInspectIdea,
  onBoostIdea,
  onGoToPlans,
  onGoToSubmit,
  onGoToExplore,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('submitted');
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user?.bio ?? '');
  const [roleDraft, setRoleDraft] = useState<UserProfile['role']>(
    user?.role ?? 'Hybrid Creator'
  );
  const [boostFeedback, setBoostFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [boostingIdeaId, setBoostingIdeaId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-8 sm:p-10">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Sign in to view your Creator Profile
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Track your submitted ideas, saved concepts, unlocked premium blueprints, and active
            collaboration pitches.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const stats = getUserStats(user, ideas, proposals);
  const submittedIdeas = ideas.filter((i) => i.authorId === user.id);
  const unlockedIdeas = ideas.filter((i) => user.unlockedIdeaIds.includes(i.id));
  const savedIdeas = ideas.filter((i) => user.savedIdeaIds.includes(i.id));
  const sentProposals = proposals.filter((p) => p.senderId === user.id);

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ bio: bioDraft.trim() || user.bio, role: roleDraft });
    setEditingBio(false);
  };

  const handleBoostClick = async (idea: IdeaItem, credits: number) => {
    setBoostingIdeaId(idea.id);
    try {
      const res = await onBoostIdea(idea.id, credits);
      if (res.ok) {
        setBoostFeedback({
          type: 'success',
          message: `"${idea.title}" boosted for ${credits} credits! It is now pinned at the top of the marketplace feed.`,
        });
      } else {
        setBoostFeedback({
          type: 'error',
          message: res.error ?? 'Could not boost idea.',
        });
      }
    } finally {
      setBoostingIdeaId(null);
    }
  };

  const renderIdeaList = (
    list: IdeaItem[],
    emptyText: string,
    showSubmitBtn = false,
    allowBoost = false
  ) => {
    if (list.length === 0) {
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{emptyText}</p>
          {showSubmitBtn && (
            <button
              type="button"
              onClick={onGoToSubmit}
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 cursor-pointer"
            >
              Submit Your First Idea
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E]">
        {list.map((idea) => (
          <div
            key={idea.id}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {idea.isFeatured && (
                  <span
                    data-testid="profile-featured-badge"
                    className="inline-flex items-center gap-1 rounded-md border border-amber-400/70 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  >
                    <span aria-hidden="true">⭐</span>
                    <span>Featured / Sponsored</span>
                  </span>
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {idea.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{idea.collaborationModel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{idea.upvotes} upvotes</span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-white">
                {idea.title}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                {idea.summary}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {allowBoost && !idea.isFeatured && (
                <>
                  <button
                    type="button"
                    disabled={boostingIdeaId === idea.id}
                    onClick={() => handleBoostClick(idea, 10)}
                    aria-label={`Boost '${idea.title}' for 10 credits`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-400 dark:border-amber-500/70 bg-amber-50 dark:bg-amber-950/40 px-3 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Boost (10 Cr)</span>
                  </button>
                  <button
                    type="button"
                    disabled={boostingIdeaId === idea.id}
                    onClick={() => handleBoostClick(idea, 15)}
                    aria-label={`Priority boost '${idea.title}' for 15 credits`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 px-3 text-xs font-semibold text-slate-950 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Top Pin (15 Cr)</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => onInspectIdea(idea)}
                className="inline-flex h-9 shrink-0 items-center rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Open Brief
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      {/* Account Summary Header */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {user.role}
              </span>
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{user.email}</span>
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  user.tier === SubscriptionTier.PRO
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{user.tier === SubscriptionTier.PRO ? 'Pro Tier Member' : 'Free Tier'}</span>
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {user.name}
            </h1>

            {!editingBio ? (
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {user.bio}
              </p>
            ) : (
              <form onSubmit={handleSaveProfileEdit} className="mt-3 space-y-3">
                <div>
                  <label
                    htmlFor="profile-role"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400"
                  >
                    Marketplace Role
                  </label>
                  <select
                    id="profile-role"
                    value={roleDraft}
                    onChange={(e) => setRoleDraft(e.target.value as UserProfile['role'])}
                    className="mt-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3 py-1.5 text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Hybrid Creator">Hybrid Creator</option>
                    <option value="Idea Giver">Idea Giver</option>
                    <option value="Idea Taker">Idea Taker</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="profile-bio"
                    className="block text-xs font-medium text-slate-600 dark:text-slate-400"
                  >
                    Creator Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    rows={2}
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3 py-2 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="h-9 rounded-lg bg-blue-700 dark:bg-blue-600 px-3.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBio(false)}
                    className="h-9 rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setBioDraft(user.bio);
                setRoleDraft(user.role);
                setEditingBio((prev) => !prev);
              }}
              className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 px-4 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={onGoToPlans}
              className="h-10 rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 cursor-pointer"
            >
              {user.tier === SubscriptionTier.PRO ? 'Manage Credits' : 'Upgrade to Pro'}
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Metrics Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-6">
          <div>
            <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
              {user.credits}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Available Credits</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
              {stats.submittedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Submitted Ideas</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
              {stats.unlockedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Unlocked Blueprints</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
              {stats.savedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Saved Ideas</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
              {stats.proposalsCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Sent Pitches</p>
          </div>
        </div>
      </section>

      {/* Profile Content Tabs */}
      <div className="space-y-5">
        <div role="tablist" aria-label="Profile lists" className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'submitted' as const, label: `Submitted (${submittedIdeas.length})` },
            { id: 'unlocked' as const, label: `Unlocked (${unlockedIdeas.length})` },
            { id: 'saved' as const, label: `Saved (${savedIdeas.length})` },
            { id: 'proposals' as const, label: `Proposals (${sentProposals.length})` },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-[#181D29] text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'submitted' && (
          <div className="space-y-4">
            {boostFeedback && (
              <div
                role={boostFeedback.type === 'error' ? 'alert' : 'status'}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-xs font-medium ${
                  boostFeedback.type === 'success'
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {boostFeedback.type === 'success' && (
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{boostFeedback.message}</span>
                </div>
                {boostFeedback.type === 'success' ? (
                  <button
                    type="button"
                    onClick={onGoToExplore}
                    className="font-semibold underline hover:no-underline cursor-pointer"
                  >
                    View Pinned in Marketplace →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGoToPlans}
                    className="font-semibold underline hover:no-underline cursor-pointer"
                  >
                    Buy Credits →
                  </button>
                )}
              </div>
            )}
            {renderIdeaList(
              submittedIdeas,
              'You have not published any ideas yet.',
              true,
              true
            )}
          </div>
        )}

        {activeTab === 'unlocked' &&
          renderIdeaList(
            unlockedIdeas,
            user.tier === SubscriptionTier.PRO
              ? 'As a Pro member, every premium blueprint in the marketplace is unlocked for you automatically.'
              : 'No individual premium blueprints unlocked yet. Spend credits on any premium card to unlock.'
          )}

        {activeTab === 'saved' &&
          renderIdeaList(
            savedIdeas,
            'You have no saved ideas yet. Use the bookmark icon on any idea card to save it here.'
          )}

        {activeTab === 'proposals' && (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E]">
            {sentProposals.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                No collaboration proposals sent yet. Open any idea and switch to its Collaboration
                tab to pitch.
              </div>
            ) : (
              sentProposals.map((prop) => {
                const targetIdea = ideas.find((i) => i.id === prop.ideaId);
                return (
                  <div key={prop.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-blue-700 dark:text-blue-400">
                        {prop.status} · {prop.proposedTerms}
                      </p>
                      <h3 className="mt-1 font-display text-base font-bold text-slate-900 dark:text-white">
                        {targetIdea?.title ?? 'Idea Brief'}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {prop.message}
                      </p>
                    </div>
                    {targetIdea && (
                      <button
                        type="button"
                        onClick={() => onInspectIdea(targetIdea)}
                        className="h-9 shrink-0 rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        View Thread
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
