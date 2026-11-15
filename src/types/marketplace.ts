export enum IdeaCategory {
  ALL = 'All',
  CREATOR_REGIONAL = 'Creator Economy & Regional Content',
  LOCAL_D2C = 'Local & D2C Businesses',
  STUDENT_EDTECH = 'Student & EdTech Hacks',
  LOCAL_SERVICES = 'Local Services & Automation',
}

export enum CollaborationModel {
  EQUITY_SPLIT = 'Equity Split',
  FIXED_BUYOUT = 'Fixed Buyout',
  REVENUE_SHARE = 'Revenue Share',
  CO_FOUNDER = 'Co-Founder Search',
}

export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
}

export enum SortOption {
  POPULAR = 'popular',
  RECENT = 'recent',
  CREDITS_ASC = 'credits_asc',
}

export enum AccessFilter {
  ALL = 'all',
  FREE = 'free',
  PREMIUM = 'premium',
}

export type AppView = 'explore' | 'submit' | 'collaborate' | 'plans' | 'profile' | 'admin';

export interface IdeaItem {
  id: string;
  title: string;
  category: Exclude<IdeaCategory, IdeaCategory.ALL>;
  summary: string;
  detailedDescription: string;
  secretPitch: string;
  executionRoadmap: string[];
  targetAudience: string;
  collaborationModel: CollaborationModel;
  askingTerms: string;
  isPremium: boolean;
  unlockCredits: number;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorHandle: string;
  createdAt: string;
  upvotes: number;
  tags: string[];
  coverImage?: string;
  isFeatured?: boolean;
  boostCredits?: number;
  featuredAt?: string;
  isDeleted?: boolean;
}

export interface CollaborationProposal {
  id: string;
  ideaId: string;
  ideaAuthorId?: string;
  senderId: string;
  senderName: string;
  senderEmail?: string;
  roleOffering: string;
  proposedTerms: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'In Review' | 'Accepted';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  role: 'Idea Giver' | 'Idea Taker' | 'Hybrid Creator';
  bio: string;
  tier: SubscriptionTier;
  credits: number;
  savedIdeaIds: string[];
  unlockedIdeaIds: string[];
  upvotedIdeaIds: string[];
  joinedAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: IdeaCategory;
  access: AccessFilter;
  sortBy: SortOption;
  tag?: string;
}

export interface IdeaSubmissionInput {
  title: string;
  category: Exclude<IdeaCategory, IdeaCategory.ALL>;
  summary: string;
  detailedDescription: string;
  secretPitch: string;
  targetAudience: string;
  collaborationModel: CollaborationModel;
  askingTerms: string;
  isPremium: boolean;
  unlockCredits: number;
  tagsText: string;
  boostIdea?: boolean;
  boostCredits?: number;
}

export interface ProposalSubmissionInput {
  roleOffering: string;
  proposedTerms: string;
  message: string;
}

export type PaymentRequestStatus = 'Pending Verification' | 'Approved' | 'Rejected';

export interface CreditPack {
  id: string;
  packType: 'credits' | 'pro';
  credits: number;
  amountInr: number;
  priceLabel: string;
  note: string;
}

export interface CreditPurchaseRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packId: string;
  packType: 'credits' | 'pro';
  credits: number;
  amountInr: number;
  priceLabel: string;
  utr: string;
  status: PaymentRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
