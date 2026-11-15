import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AccessFilter,
  CollaborationModel,
  IdeaCategory,
  IdeaItem,
  SortOption,
  SubscriptionTier,
  UserProfile,
} from '../types/marketplace';
import { SEED_IDEAS } from '../data/seedIdeas';
import {
  ACTIVE_CREATORS_INITIAL,
  ACTIVE_CREATORS_MAX,
  ACTIVE_CREATORS_MIN,
  approveCreditPurchaseRequest,
  boostIdeaWithCredits,
  buildUpiIntentUrl,
  canViewFullIdea,
  CREATOR_ADMIN_EMAIL,
  CREDIT_PACKS,
  createCreditPurchaseRequest,
  CREATOR_UPI_ID,
  DEFAULT_STARTER_CREDITS,
  filterAndSortIdeas,
  formatCreditInrEstimate,
  getPopularTags,
  isAdminUser,
  mergeCatalogIdeas,
  nextActiveCreatorsCount,
  PRO_TIER_PASS,
  rejectCreditPurchaseRequest,
  toggleSavedIdea,
  toggleUpvoteIdea,
  unlockIdeaWithCredits,
  validateBoostOnSubmit,
  validateIdeaSubmission,
  validateProposal,
  validateUtrCode,
} from './marketplaceLogic';

const sampleUserFree: UserProfile = {
  id: 'u-1',
  name: 'Viren Kansal',
  email: 'virenknsl@gmail.com',
  role: 'Hybrid Creator',
  bio: 'Building digital products.',
  tier: SubscriptionTier.FREE,
  credits: 5,
  savedIdeaIds: [],
  unlockedIdeaIds: [],
  upvotedIdeaIds: [],
  joinedAt: '2026-10-01T10:00:00Z',
};

const sampleIdeas: IdeaItem[] = [
  {
    id: 'idea-free',
    title: 'Podcast Clip Auto-B-Roll Matcher',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary: 'Matches spoken podcast topics with royalty-free archival B-roll automatically.',
    detailedDescription: 'Long-form podcasters spend hours scrubbing footage for visual hooks.',
    secretPitch: 'Pre-index 40k public domain reels with transcript embeddings and sell LUT packs.',
    executionRoadmap: ['Build transcript parser', 'Index clips'],
    targetAudience: 'Video essayists & podcast studios',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '30% Revenue Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'u-other',
    authorName: 'Rohan Mehta',
    authorRole: 'Video Producer',
    authorHandle: '@rohanedits',
    createdAt: '2026-11-10T09:00:00Z',
    upvotes: 84,
    tags: ['podcast', 'video', 'editing'],
  },
  {
    id: 'idea-premium',
    title: 'Zero-Touch GST & Trade Classifier for D2C Exporters',
    category: IdeaCategory.LOCAL_D2C,
    summary: 'Automates HS code classification and landed duty calculation for Shopify brands.',
    detailedDescription: 'Cross-border D2C shipments get stuck at customs due to wrong HS codes.',
    secretPitch: 'Partner with boutique 3PL freight forwarders in Mumbai & Surat for instant B2B distribution.',
    executionRoadmap: ['Train classifier on GST & WCO tariffs', 'Build Shopify checkout widget'],
    targetAudience: 'D2C apparel and homeware brands',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹999 Blueprint · 15% Advisor Equity',
    isPremium: true,
    unlockCredits: 3,
    authorId: 'u-other-2',
    authorName: 'Ananya Rao',
    authorRole: 'Trade Ops Strategist',
    authorHandle: '@ananyatrade',
    createdAt: '2026-11-12T12:00:00Z',
    upvotes: 142,
    tags: ['logistics', 'shopify', 'ai'],
  },
];

test('filterAndSortIdeas filters by category, access, and search query', () => {
  const byCategory = filterAndSortIdeas(sampleIdeas, {
    searchQuery: '',
    category: IdeaCategory.LOCAL_D2C,
    access: AccessFilter.ALL,
    sortBy: SortOption.POPULAR,
  });
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].id, 'idea-premium');

  const bySearch = filterAndSortIdeas(sampleIdeas, {
    searchQuery: 'podcast',
    category: IdeaCategory.ALL,
    access: AccessFilter.ALL,
    sortBy: SortOption.POPULAR,
  });
  assert.equal(bySearch.length, 1);
  assert.equal(bySearch[0].id, 'idea-free');

  const sortedRecent = filterAndSortIdeas(sampleIdeas, {
    searchQuery: '',
    category: IdeaCategory.ALL,
    access: AccessFilter.ALL,
    sortBy: SortOption.RECENT,
  });
  assert.equal(sortedRecent[0].id, 'idea-premium');
});

test('canViewFullIdea enforces free, unlocked, author, and Pro tier access', () => {
  assert.equal(canViewFullIdea(sampleIdeas[0], null), true);
  assert.equal(canViewFullIdea(sampleIdeas[1], null), false);
  assert.equal(canViewFullIdea(sampleIdeas[1], sampleUserFree), false);

  const proUser: UserProfile = { ...sampleUserFree, tier: SubscriptionTier.PRO };
  assert.equal(canViewFullIdea(sampleIdeas[1], proUser), true);

  const authorUser: UserProfile = { ...sampleUserFree, id: 'u-other-2' };
  assert.equal(canViewFullIdea(sampleIdeas[1], authorUser), true);
});

test('unlockIdeaWithCredits deducts credits and records unlock, or errors if insufficient', () => {
  const result = unlockIdeaWithCredits(sampleIdeas[1], sampleUserFree);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.user.credits, 2);
    assert.ok(result.user.unlockedIdeaIds.includes('idea-premium'));
    assert.equal(canViewFullIdea(sampleIdeas[1], result.user), true);
  }

  const brokeUser: UserProfile = { ...sampleUserFree, credits: 1 };
  const failResult = unlockIdeaWithCredits(sampleIdeas[1], brokeUser);
  assert.equal(failResult.ok, false);
});

test('toggleSavedIdea and toggleUpvoteIdea update state deterministically', () => {
  const saved = toggleSavedIdea(sampleUserFree, 'idea-premium');
  assert.deepEqual(saved.savedIdeaIds, ['idea-premium']);
  const unsaved = toggleSavedIdea(saved, 'idea-premium');
  assert.deepEqual(unsaved.savedIdeaIds, []);

  const upvoted = toggleUpvoteIdea(sampleIdeas, sampleUserFree, 'idea-free');
  assert.equal(upvoted.ideas[0].upvotes, 85);
  assert.deepEqual(upvoted.user.upvotedIdeaIds, ['idea-free']);
});

test('validateIdeaSubmission and validateProposal catch missing or short fields', () => {
  const invalidIdea = validateIdeaSubmission({
    title: 'Short',
    category: IdeaCategory.LOCAL_SERVICES,
    summary: 'Too short',
    detailedDescription: 'Too short',
    secretPitch: 'Short',
    targetAudience: 'All',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: 'No',
    isPremium: true,
    unlockCredits: 0,
    tagsText: '',
  });
  assert.ok(invalidIdea.title);
  assert.ok(invalidIdea.summary);
  assert.ok(invalidIdea.detailedDescription);
  assert.ok(invalidIdea.secretPitch);
  assert.ok(invalidIdea.unlockCredits);

  const invalidProposal = validateProposal({
    roleOffering: 'Dev',
    proposedTerms: 'Ok',
    message: 'Interested!',
  });
  assert.ok(invalidProposal.proposedTerms);
  assert.ok(invalidProposal.message);
});

test('buildUpiIntentUrl uses creator FamPay UPI ID and pack amount', () => {
  const url = buildUpiIntentUrl(CREDIT_PACKS[0]);
  assert.ok(url.startsWith('upi://pay?'));
  assert.ok(url.includes(`pa=${encodeURIComponent(CREATOR_UPI_ID)}`));
  assert.ok(url.includes(`am=${CREDIT_PACKS[0].amountInr}`));
});

test('createCreditPurchaseRequest validates 12-digit UTR and creates Pending Verification without crediting', () => {
  assert.ok(validateUtrCode('12345', []));
  assert.ok(validateUtrCode('12345678901A', []));
  assert.equal(validateUtrCode('431982047112', []), null);

  const created = createCreditPurchaseRequest({
    user: sampleUserFree,
    pack: CREDIT_PACKS[1],
    utr: '431982047112',
    existingRequests: [],
  });
  assert.equal(created.ok, true);
  if (created.ok) {
    assert.equal(created.request.status, 'Pending Verification');
    assert.equal(created.request.credits, 100);
    assert.equal(created.request.amountInr, 400);
    assert.equal(sampleUserFree.credits, 5);

    const dup = createCreditPurchaseRequest({
      user: sampleUserFree,
      pack: CREDIT_PACKS[1],
      utr: '431982047112',
      existingRequests: [created.request],
    });
    assert.equal(dup.ok, false);
  }
});

test('approveCreditPurchaseRequest approves pending UTR once and rejectCreditPurchaseRequest marks Rejected', () => {
  const created = createCreditPurchaseRequest({
    user: sampleUserFree,
    pack: CREDIT_PACKS[2],
    utr: '998877665544',
    existingRequests: [],
  });
  assert.equal(created.ok, true);
  if (!created.ok) return;

  const approved = approveCreditPurchaseRequest({
    requestId: created.request.id,
    requests: [created.request],
  });
  assert.equal(approved.ok, true);
  if (!approved.ok) return;
  assert.equal(approved.approvedRequest.status, 'Approved');
  assert.equal(approved.approvedRequest.credits, 500);

  const doubleApprove = approveCreditPurchaseRequest({
    requestId: created.request.id,
    requests: approved.requests,
  });
  assert.equal(doubleApprove.ok, false);

  const second = createCreditPurchaseRequest({
    user: sampleUserFree,
    pack: CREDIT_PACKS[0],
    utr: '112233445566',
    existingRequests: approved.requests,
  });
  assert.equal(second.ok, true);
  if (!second.ok) return;

  const rejectedList = rejectCreditPurchaseRequest({
    requestId: second.request.id,
    requests: [second.request],
  });
  assert.equal(rejectedList[0].status, 'Rejected');
});

test('SEED_IDEAS ships 50-100 Indian-market ideas across all 4 required categories with 70-600 upvotes', () => {
  assert.ok(SEED_IDEAS.length >= 50 && SEED_IDEAS.length <= 100, `Expected 50-100 ideas, got ${SEED_IDEAS.length}`);

  const requiredCategories = [
    IdeaCategory.CREATOR_REGIONAL,
    IdeaCategory.LOCAL_D2C,
    IdeaCategory.STUDENT_EDTECH,
    IdeaCategory.LOCAL_SERVICES,
  ];
  for (const category of requiredCategories) {
    const count = SEED_IDEAS.filter((idea) => idea.category === category).length;
    assert.ok(count >= 12, `Expected at least 12 ideas in ${category}, got ${count}`);
  }

  for (const idea of SEED_IDEAS) {
    assert.ok(idea.title.trim().length > 5);
    assert.ok(idea.summary.trim().length > 15);
    assert.ok(idea.authorName.trim().length > 2);
    assert.ok(idea.secretPitch.trim().length > 15);
    assert.ok(
      idea.upvotes >= 70 && idea.upvotes <= 600,
      `Expected upvotes in [70, 600] for ${idea.id}, got ${idea.upvotes}`
    );
    if (idea.isPremium) {
      assert.ok(idea.unlockCredits > 0);
      assert.ok(idea.askingTerms.includes('₹'), `Expected INR pricing in askingTerms for ${idea.id}`);
    }
  }
});

test('nextActiveCreatorsCount fluctuates organically within [1050, 1250]', () => {
  let count = ACTIVE_CREATORS_INITIAL;
  const seen = new Set<number>([count]);
  for (let i = 0; i < 200; i += 1) {
    count = nextActiveCreatorsCount(count);
    assert.ok(
      count >= ACTIVE_CREATORS_MIN && count <= ACTIVE_CREATORS_MAX,
      `Out of range count: ${count}`
    );
    seen.add(count);
  }
  assert.ok(seen.size > 5, 'Expected active creator count to fluctuate dynamically');
  assert.equal(nextActiveCreatorsCount(900, () => 0.9), ACTIVE_CREATORS_MIN);
  assert.equal(formatCreditInrEstimate(10), '₹40');
});

test('filterAndSortIdeas filters by Indian category and topic tag across SEED_IDEAS', () => {
  const edtechIdeas = filterAndSortIdeas(SEED_IDEAS, {
    searchQuery: '',
    category: IdeaCategory.STUDENT_EDTECH,
    access: AccessFilter.ALL,
    sortBy: SortOption.POPULAR,
    tag: '',
  });
  assert.ok(edtechIdeas.length >= 12);
  assert.ok(edtechIdeas.every((idea) => idea.category === IdeaCategory.STUDENT_EDTECH));

  const whatsappIdeas = filterAndSortIdeas(SEED_IDEAS, {
    searchQuery: '',
    category: IdeaCategory.ALL,
    access: AccessFilter.ALL,
    sortBy: SortOption.POPULAR,
    tag: 'whatsapp',
  });
  assert.ok(whatsappIdeas.length >= 5);
  assert.ok(whatsappIdeas.every((idea) => idea.tags.includes('whatsapp')));

  const popularTags = getPopularTags(SEED_IDEAS, 8);
  assert.equal(popularTags.length, 8);
});

test('filterAndSortIdeas always pins featured ideas to the very top across sort modes', () => {
  const unfeaturedHighUpvotes: IdeaItem = {
    ...sampleIdeas[1],
    id: 'unfeatured-high',
    upvotes: 999,
    createdAt: '2026-11-14T20:00:00Z',
    isFeatured: false,
  };
  const featuredStandard: IdeaItem = {
    ...sampleIdeas[0],
    id: 'featured-10',
    upvotes: 10,
    createdAt: '2026-11-01T10:00:00Z',
    isFeatured: true,
    boostCredits: 10,
    featuredAt: '2026-11-14T12:00:00Z',
  };
  const featuredPriority: IdeaItem = {
    ...sampleIdeas[0],
    id: 'featured-15',
    upvotes: 2,
    createdAt: '2026-10-01T10:00:00Z',
    isFeatured: true,
    boostCredits: 15,
    featuredAt: '2026-11-14T10:00:00Z',
  };

  for (const sortBy of [SortOption.POPULAR, SortOption.RECENT, SortOption.CREDITS_ASC]) {
    const sorted = filterAndSortIdeas(
      [unfeaturedHighUpvotes, featuredStandard, featuredPriority],
      {
        searchQuery: '',
        category: IdeaCategory.ALL,
        access: AccessFilter.ALL,
        sortBy,
        tag: '',
      }
    );
    assert.deepEqual(
      sorted.map((i) => i.id),
      ['featured-15', 'featured-10', 'unfeatured-high']
    );
  }
});

test('boostIdeaWithCredits and validateBoostOnSubmit enforce ownership, balance, and pin status', () => {
  const authorLowCredits: UserProfile = { ...sampleUserFree, id: 'u-other', credits: 5 };
  const ownIdea = sampleIdeas[0];

  const insufficientErr = validateBoostOnSubmit(
    {
      title: 'Test Idea Title',
      category: IdeaCategory.LOCAL_D2C,
      summary: 'A clear summary that is over twenty characters.',
      detailedDescription: 'A detailed description that comfortably exceeds forty characters.',
      secretPitch: 'A concrete distribution pitch exceeding twenty-five chars.',
      targetAudience: 'Local kirana stores',
      collaborationModel: CollaborationModel.EQUITY_SPLIT,
      askingTerms: '₹500',
      isPremium: true,
      unlockCredits: 3,
      tagsText: 'upi',
      boostIdea: true,
      boostCredits: 10,
    },
    authorLowCredits
  );
  assert.ok(insufficientErr && insufficientErr.includes('10 credits'));

  const failLow = boostIdeaWithCredits({
    ideas: sampleIdeas,
    user: authorLowCredits,
    ideaId: ownIdea.id,
    boostCredits: 10,
  });
  assert.equal(failLow.ok, false);

  const nonOwner: UserProfile = { ...sampleUserFree, id: 'someone-else', credits: 50 };
  const failOwner = boostIdeaWithCredits({
    ideas: sampleIdeas,
    user: nonOwner,
    ideaId: ownIdea.id,
    boostCredits: 10,
  });
  assert.equal(failOwner.ok, false);

  const authorRich: UserProfile = { ...sampleUserFree, id: 'u-other', credits: 30 };
  const boosted = boostIdeaWithCredits({
    ideas: sampleIdeas,
    user: authorRich,
    ideaId: ownIdea.id,
    boostCredits: 15,
    nowIso: '2026-11-15T00:00:00Z',
  });
  assert.equal(boosted.ok, true);
  if (boosted.ok) {
    assert.equal(boosted.user.credits, 15);
    const updatedIdea = boosted.ideas.find((i) => i.id === ownIdea.id);
    assert.equal(updatedIdea?.isFeatured, true);
    assert.equal(updatedIdea?.boostCredits, 15);
    assert.equal(updatedIdea?.featuredAt, '2026-11-15T00:00:00Z');

    const sorted = filterAndSortIdeas(boosted.ideas, {
      searchQuery: '',
      category: IdeaCategory.ALL,
      access: AccessFilter.ALL,
      sortBy: SortOption.POPULAR,
      tag: '',
    });
    assert.equal(sorted[0].id, ownIdea.id);

    const doubleBoost = boostIdeaWithCredits({
      ideas: boosted.ideas,
      user: boosted.user,
      ideaId: ownIdea.id,
      boostCredits: 10,
    });
    assert.equal(doubleBoost.ok, false);
  }
});

test('isAdminUser strictly requires verified creator email virenknsl@gmail.com', () => {
  assert.equal(isAdminUser(null), false);
  assert.equal(isAdminUser({ ...sampleUserFree, emailVerified: false }), false);
  assert.equal(isAdminUser({ ...sampleUserFree, emailVerified: undefined }), false);
  assert.equal(
    isAdminUser({
      ...sampleUserFree,
      email: 'someone.else@gmail.com',
      emailVerified: true,
    }),
    false
  );
  assert.equal(
    isAdminUser({
      ...sampleUserFree,
      email: CREATOR_ADMIN_EMAIL.toUpperCase(),
      emailVerified: true,
    }),
    true
  );
  assert.equal(DEFAULT_STARTER_CREDITS, 5);
});

test('mergeCatalogIdeas combines cloud submissions, seed overrides, and hides admin-deleted seeds', () => {
  const customCloudIdea: IdeaItem = {
    ...sampleIdeas[0],
    id: 'idea-custom-1',
    title: 'Cloud Submitted Idea',
  };
  const pinnedSeedOverride: IdeaItem = {
    ...sampleIdeas[0],
    isFeatured: true,
    boostCredits: 15,
    featuredAt: '2026-11-15T01:00:00Z',
  };
  const deletedSeedOverride: IdeaItem = {
    ...sampleIdeas[1],
    isDeleted: true,
  };

  const merged = mergeCatalogIdeas(sampleIdeas, [
    customCloudIdea,
    pinnedSeedOverride,
    deletedSeedOverride,
  ]);
  assert.deepEqual(
    merged.map((i) => i.id),
    ['idea-custom-1', 'idea-free']
  );
  assert.equal(merged[1].isFeatured, true);
  assert.equal(merged[1].boostCredits, 15);
});

test('PRO_TIER_PASS creates Pro pack UTR purchase request and rejects oversized blueprint inputs', () => {
  assert.equal(PRO_TIER_PASS.packType, 'pro');
  assert.equal(PRO_TIER_PASS.amountInr, 499);
  assert.equal(PRO_TIER_PASS.credits, 25);

  const proOrder = createCreditPurchaseRequest({
    user: sampleUserFree,
    pack: PRO_TIER_PASS,
    utr: '554433221100',
    existingRequests: [],
  });
  assert.equal(proOrder.ok, true);
  if (proOrder.ok) {
    assert.equal(proOrder.request.packType, 'pro');
    assert.equal(proOrder.request.packId, 'pro-tier-pass');
    assert.equal(proOrder.request.amountInr, 499);
  }

  const oversizedErrors = validateIdeaSubmission({
    title: 'A'.repeat(150),
    category: IdeaCategory.LOCAL_D2C,
    summary: 'Valid summary over twenty characters.',
    detailedDescription: 'Valid detailed description over forty characters long.',
    secretPitch: 'Valid execution pitch over twenty-five chars.',
    targetAudience: 'Indian D2C founders',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹500',
    isPremium: true,
    unlockCredits: 30,
    tagsText: 'd2c',
  });
  assert.ok(oversizedErrors.title);
  assert.ok(oversizedErrors.unlockCredits);
});

