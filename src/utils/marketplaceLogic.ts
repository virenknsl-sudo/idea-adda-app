import {
  AccessFilter,
  CollaborationProposal,
  CreditPack,
  CreditPurchaseRequest,
  FilterOptions,
  IdeaCategory,
  IdeaItem,
  IdeaSubmissionInput,
  ProposalSubmissionInput,
  SubscriptionTier,
  UserProfile,
} from '../types/marketplace';

export function filterAndSortIdeas(ideas: IdeaItem[], options: FilterOptions): IdeaItem[] {
  const query = options.searchQuery.trim().toLowerCase();
  const activeTag = options.tag?.trim().toLowerCase() ?? '';

  const filtered = ideas.filter((idea) => {
    if (options.category !== IdeaCategory.ALL && idea.category !== options.category) {
      return false;
    }

    if (options.access === AccessFilter.FREE && idea.isPremium) {
      return false;
    }
    if (options.access === AccessFilter.PREMIUM && !idea.isPremium) {
      return false;
    }

    if (activeTag && !idea.tags.some((t) => t.toLowerCase() === activeTag)) {
      return false;
    }

    if (!query) return true;

    const haystack = [
      idea.title,
      idea.summary,
      idea.category,
      idea.authorName,
      idea.collaborationModel,
      idea.askingTerms,
      ...idea.tags,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  return [...filtered].sort((a, b) => {
    const aFeatured = Boolean(a.isFeatured);
    const bFeatured = Boolean(b.isFeatured);
    if (aFeatured !== bFeatured) {
      return aFeatured ? -1 : 1;
    }
    if (aFeatured && bFeatured) {
      const aBoost = a.boostCredits ?? 10;
      const bBoost = b.boostCredits ?? 10;
      if (aBoost !== bBoost) {
        return bBoost - aBoost;
      }
      const aFeatTime = new Date(a.featuredAt ?? a.createdAt).getTime();
      const bFeatTime = new Date(b.featuredAt ?? b.createdAt).getTime();
      if (aFeatTime !== bFeatTime) {
        return bFeatTime - aFeatTime;
      }
    }

    if (options.sortBy === 'popular') {
      return b.upvotes - a.upvotes;
    }
    if (options.sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (options.sortBy === 'credits_asc') {
      if (a.unlockCredits !== b.unlockCredits) {
        return a.unlockCredits - b.unlockCredits;
      }
      return b.upvotes - a.upvotes;
    }
    return 0;
  });
}

export function canViewFullIdea(idea: IdeaItem, user: UserProfile | null): boolean {
  if (!idea.isPremium) {
    return true;
  }
  if (!user) {
    return false;
  }
  if (isAdminUser(user)) {
    return true;
  }
  if (idea.authorId === user.id) {
    return true;
  }
  if (user.tier === SubscriptionTier.PRO) {
    return true;
  }
  return user.unlockedIdeaIds.includes(idea.id);
}

export function unlockIdeaWithCredits(
  idea: IdeaItem,
  user: UserProfile | null
): { ok: true; user: UserProfile } | { ok: false; error: string } {
  if (!user) {
    return { ok: false, error: 'Sign in with Google to unlock premium idea blueprints.' };
  }
  if (canViewFullIdea(idea, user)) {
    return { ok: true, user };
  }
  if (user.credits < idea.unlockCredits) {
    return {
      ok: false,
      error: `Need ${idea.unlockCredits} credits to unlock (you currently have ${user.credits}). Upgrade to Pro or add credits.`,
    };
  }

  return {
    ok: true,
    user: {
      ...user,
      credits: user.credits - idea.unlockCredits,
      unlockedIdeaIds: [...user.unlockedIdeaIds, idea.id],
    },
  };
}

export const BOOST_OPTIONS = [
  {
    credits: 10,
    label: 'Featured Spot',
    description: 'Pins your idea above organic listings with the ⭐ Featured / Sponsored badge.',
  },
  {
    credits: 15,
    label: 'Priority Top Pin',
    description: 'Highest top-of-feed priority above standard 10-credit featured listings.',
  },
] as const;

export const ALLOWED_BOOST_CREDITS: readonly number[] = [10, 15];

export function validateBoostOnSubmit(
  input: IdeaSubmissionInput,
  user: UserProfile | null
): string | null {
  if (!input.boostIdea) return null;
  const cost = Number(input.boostCredits ?? 10);
  if (!ALLOWED_BOOST_CREDITS.includes(cost)) {
    return 'Select a valid boost tier (10 or 15 credits).';
  }
  if (!user) {
    return 'Sign in with Google to boost your idea using credits.';
  }
  if (isAdminUser(user)) {
    return null;
  }
  if (user.credits < cost) {
    return `Need ${cost} credits to boost & feature this idea (you have ${user.credits} credits). Add credits on Plans & Credits or uncheck Boost to publish normally.`;
  }
  return null;
}

export function boostIdeaWithCredits(params: {
  ideas: IdeaItem[];
  user: UserProfile | null;
  ideaId: string;
  boostCredits?: number;
  nowIso?: string;
}): { ok: true; ideas: IdeaItem[]; user: UserProfile } | { ok: false; error: string } {
  const { ideas, user, ideaId, boostCredits = 10, nowIso } = params;

  if (!user) {
    return { ok: false, error: 'Sign in with Google to boost your submitted idea.' };
  }
  if (!ALLOWED_BOOST_CREDITS.includes(boostCredits)) {
    return { ok: false, error: 'Select a valid boost tier (10 or 15 credits).' };
  }

  const target = ideas.find((i) => i.id === ideaId);
  if (!target) {
    return { ok: false, error: 'Idea not found.' };
  }

  const adminBypass = isAdminUser(user);
  if (target.authorId !== user.id && !adminBypass) {
    return { ok: false, error: 'You can only boost ideas you submitted.' };
  }
  if (target.isFeatured) {
    return { ok: false, error: 'This idea is already Featured / Sponsored at the top of the feed.' };
  }
  if (!adminBypass && user.credits < boostCredits) {
    return {
      ok: false,
      error: `Need ${boostCredits} credits to boost this idea (you currently have ${user.credits}). Add credits on Plans & Credits.`,
    };
  }

  const featuredAt = nowIso ?? new Date().toISOString();
  return {
    ok: true,
    user: adminBypass
      ? user
      : {
          ...user,
          credits: user.credits - boostCredits,
        },
    ideas: ideas.map((item) =>
      item.id === ideaId
        ? {
            ...item,
            isFeatured: true,
            boostCredits,
            featuredAt,
          }
        : item
    ),
  };
}

export function toggleSavedIdea(user: UserProfile, ideaId: string): UserProfile {
  const exists = user.savedIdeaIds.includes(ideaId);
  return {
    ...user,
    savedIdeaIds: exists
      ? user.savedIdeaIds.filter((id) => id !== ideaId)
      : [...user.savedIdeaIds, ideaId],
  };
}

export function toggleUpvoteIdea(
  ideas: IdeaItem[],
  user: UserProfile,
  ideaId: string
): { ideas: IdeaItem[]; user: UserProfile } {
  const alreadyUpvoted = user.upvotedIdeaIds.includes(ideaId);
  const delta = alreadyUpvoted ? -1 : 1;

  return {
    ideas: ideas.map((idea) =>
      idea.id === ideaId ? { ...idea, upvotes: Math.max(0, idea.upvotes + delta) } : idea
    ),
    user: {
      ...user,
      upvotedIdeaIds: alreadyUpvoted
        ? user.upvotedIdeaIds.filter((id) => id !== ideaId)
        : [...user.upvotedIdeaIds, ideaId],
    },
  };
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateIdeaSubmission(
  input: IdeaSubmissionInput
): ValidationErrors<IdeaSubmissionInput> {
  const errors: ValidationErrors<IdeaSubmissionInput> = {};

  if (input.title.trim().length < 6 || input.title.trim().length > 140) {
    errors.title = 'Title must be between 6 and 140 characters.';
  }
  if (input.summary.trim().length < 20 || input.summary.trim().length > 320) {
    errors.summary = 'Provide a clear summary between 20 and 320 characters.';
  }
  if (input.detailedDescription.trim().length < 40 || input.detailedDescription.trim().length > 2500) {
    errors.detailedDescription = 'Detailed description must be between 40 and 2,500 characters.';
  }
  if (input.secretPitch.trim().length < 25 || input.secretPitch.trim().length > 2000) {
    errors.secretPitch = 'Execution pitch must be between 25 and 2,000 characters.';
  }
  if (input.targetAudience.trim().length < 4 || input.targetAudience.trim().length > 160) {
    errors.targetAudience = 'Specify the target audience (4–160 characters).';
  }
  if (input.askingTerms.trim().length < 3 || input.askingTerms.trim().length > 120) {
    errors.askingTerms = 'Specify asking price or terms (3–120 characters).';
  }
  if (input.isPremium && (input.unlockCredits < 1 || input.unlockCredits > 25)) {
    errors.unlockCredits = 'Premium unlock credits must be between 1 and 25.';
  }

  return errors;
}

export function validateProposal(
  input: ProposalSubmissionInput
): ValidationErrors<ProposalSubmissionInput> {
  const errors: ValidationErrors<ProposalSubmissionInput> = {};

  if (input.roleOffering.trim().length < 3 || input.roleOffering.trim().length > 100) {
    errors.roleOffering = 'Specify what you bring (3–100 characters).';
  }
  if (input.proposedTerms.trim().length < 3 || input.proposedTerms.trim().length > 120) {
    errors.proposedTerms = 'State your proposed collaboration terms (3–120 characters).';
  }
  if (input.message.trim().length < 20 || input.message.trim().length > 1200) {
    errors.message = 'Write a concrete pitch between 20 and 1,200 characters.';
  }

  return errors;
}

export function validateEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export const CREATOR_ADMIN_EMAIL = 'virenknsl@gmail.com';
export const DEFAULT_STARTER_CREDITS = 5;

export function isAdminUser(user: UserProfile | null): boolean {
  if (!user) return false;
  return (
    user.email.trim().toLowerCase() === CREATOR_ADMIN_EMAIL &&
    user.emailVerified === true
  );
}

export function hasUnlimitedCredits(user: UserProfile | null): boolean {
  return isAdminUser(user);
}

export function mergeCatalogIdeas(
  seedIdeas: IdeaItem[],
  cloudIdeas: IdeaItem[]
): IdeaItem[] {
  const cloudById = new Map<string, IdeaItem>();
  for (const item of cloudIdeas) {
    cloudById.set(item.id, item);
  }

  const merged: IdeaItem[] = [];
  const seen = new Set<string>();

  for (const cloud of cloudIdeas) {
    if (cloud.isDeleted) {
      seen.add(cloud.id);
      continue;
    }
    const isSeedId = seedIdeas.some((s) => s.id === cloud.id);
    if (!isSeedId) {
      merged.push(cloud);
      seen.add(cloud.id);
    }
  }

  for (const seed of seedIdeas) {
    if (seen.has(seed.id)) continue;
    const override = cloudById.get(seed.id);
    if (override) {
      if (!override.isDeleted) {
        merged.push(override);
      }
    } else {
      merged.push(seed);
    }
    seen.add(seed.id);
  }

  return merged;
}

export function getUserStats(
  user: UserProfile | null,
  ideas: IdeaItem[],
  proposals: CollaborationProposal[]
) {
  if (!user) {
    return {
      submittedCount: 0,
      savedCount: 0,
      unlockedCount: 0,
      proposalsCount: 0,
    };
  }

  return {
    submittedCount: ideas.filter((i) => i.authorId === user.id).length,
    savedCount: user.savedIdeaIds.length,
    unlockedCount: user.unlockedIdeaIds.length,
    proposalsCount: proposals.filter((p) => p.senderId === user.id).length,
  };
}

export const CREATOR_UPI_ID = '8930773885@fam';

export const PRO_TIER_PASS: CreditPack = {
  id: 'pro-tier-pass',
  packType: 'pro',
  credits: 25,
  amountInr: 499,
  priceLabel: '₹499',
  note: 'Pro Tier Membership + 25 Bonus Credits for boosting & priority access',
};

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'pack-50',
    packType: 'credits',
    credits: 50,
    amountInr: 150,
    priceLabel: '₹150',
    note: 'Ideal for starter creators',
  },
  {
    id: 'pack-100',
    packType: 'credits',
    credits: 100,
    amountInr: 400,
    priceLabel: '₹400',
    note: 'Most popular builder pack',
  },
  {
    id: 'pack-500',
    packType: 'credits',
    credits: 500,
    amountInr: 1500,
    priceLabel: '₹1,500',
    note: 'Studio volume pack for agencies',
  },
];

export function buildUpiIntentUrl(pack: CreditPack): string {
  const params = new URLSearchParams({
    pa: CREATOR_UPI_ID,
    pn: 'Viren Dev Labs',
    am: String(pack.amountInr),
    cu: 'INR',
    tn: pack.packType === 'pro' ? 'IdeaAdda-ProTier' : `IdeaAdda-${pack.credits}Credits`,
  });
  return `upi://pay?${params.toString()}`;
}

export function validateUtrCode(
  utr: string,
  existingRequests: CreditPurchaseRequest[]
): string | null {
  const normalized = utr.trim();
  if (!/^\d{12}$/.test(normalized)) {
    return 'Enter a valid 12-digit numeric UPI Transaction Reference ID (UTR).';
  }
  const duplicate = existingRequests.some(
    (req) => req.utr === normalized && req.status !== 'Rejected'
  );
  if (duplicate) {
    return 'This 12-digit UTR has already been submitted for verification.';
  }
  return null;
}

export function createCreditPurchaseRequest(params: {
  user: UserProfile;
  pack: CreditPack;
  utr: string;
  existingRequests: CreditPurchaseRequest[];
  nowIso?: string;
}): { ok: true; request: CreditPurchaseRequest } | { ok: false; error: string } {
  const utrError = validateUtrCode(params.utr, params.existingRequests);
  if (utrError) {
    return { ok: false, error: utrError };
  }

  return {
    ok: true,
    request: {
      id: `utr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: params.user.id,
      userName: params.user.name,
      userEmail: params.user.email,
      packId: params.pack.id,
      packType: params.pack.packType,
      credits: params.pack.credits,
      amountInr: params.pack.amountInr,
      priceLabel: params.pack.priceLabel,
      utr: params.utr.trim(),
      status: 'Pending Verification',
      createdAt: params.nowIso ?? new Date().toISOString(),
    },
  };
}

export function approveCreditPurchaseRequest(params: {
  requestId: string;
  requests: CreditPurchaseRequest[];
  nowIso?: string;
}):
  | {
      ok: true;
      requests: CreditPurchaseRequest[];
      approvedRequest: CreditPurchaseRequest;
    }
  | { ok: false; error: string } {
  const target = params.requests.find((r) => r.id === params.requestId);
  if (!target) {
    return { ok: false, error: 'Payment request not found.' };
  }
  if (target.status !== 'Pending Verification') {
    return { ok: false, error: `Request is already ${target.status}.` };
  }

  const reviewedAt = params.nowIso ?? new Date().toISOString();
  const approvedRequest: CreditPurchaseRequest = {
    ...target,
    status: 'Approved',
    reviewedAt,
  };

  return {
    ok: true,
    approvedRequest,
    requests: params.requests.map((r) => (r.id === params.requestId ? approvedRequest : r)),
  };
}

export function rejectCreditPurchaseRequest(params: {
  requestId: string;
  requests: CreditPurchaseRequest[];
  nowIso?: string;
}): CreditPurchaseRequest[] {
  const reviewedAt = params.nowIso ?? new Date().toISOString();
  return params.requests.map((r) =>
    r.id === params.requestId && r.status === 'Pending Verification'
      ? { ...r, status: 'Rejected', reviewedAt }
      : r
  );
}

export const ACTIVE_CREATORS_MIN = 1050;
export const ACTIVE_CREATORS_MAX = 1250;
export const ACTIVE_CREATORS_INITIAL = 1142;

export function nextActiveCreatorsCount(
  current: number,
  randomFn: () => number = Math.random
): number {
  const clampedCurrent = Math.min(
    ACTIVE_CREATORS_MAX,
    Math.max(ACTIVE_CREATORS_MIN, Math.round(current))
  );
  // Organic non-zero delta between -11 and +11, nudged gently toward center near bounds
  const rawStep = Math.floor(randomFn() * 11) + 1;
  const biasTowardCenter =
    clampedCurrent <= ACTIVE_CREATORS_MIN + 15
      ? 0.8
      : clampedCurrent >= ACTIVE_CREATORS_MAX - 15
        ? 0.2
        : 0.5;
  const direction = randomFn() < biasTowardCenter ? 1 : -1;
  const candidate = clampedCurrent + direction * rawStep;
  return Math.min(ACTIVE_CREATORS_MAX, Math.max(ACTIVE_CREATORS_MIN, candidate));
}

export function formatCreditInrEstimate(credits: number): string {
  if (credits <= 0) return '₹0';
  // Based on ₹4/credit builder pack benchmark (100 Credits = ₹400)
  const inr = Math.round(credits * 4);
  return `₹${inr.toLocaleString('en-IN')}`;
}

export function getPopularTags(ideas: IdeaItem[], limit = 10): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const idea of ideas) {
    for (const rawTag of idea.tags) {
      const tag = rawTag.trim().toLowerCase();
      if (!tag) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.tag.localeCompare(b.tag)))
    .slice(0, limit);
}

