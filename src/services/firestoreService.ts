import { User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { ADMIN_EMAIL, db, handleFirestoreError, OperationType } from '../firebase';
import {
  CollaborationProposal,
  CreditPurchaseRequest,
  IdeaItem,
  SubscriptionTier,
  UserProfile,
} from '../types/marketplace';
import { DEFAULT_STARTER_CREDITS } from '../utils/marketplaceLogic';

function tsToIso(value: unknown, fallback?: string): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return fallback ?? new Date().toISOString();
}

function sanitizeDisplayName(raw: string | null | undefined, email: string): string {
  const base = (raw && raw.trim()) || email.split('@')[0] || 'Creator';
  const normalized = base.trim().slice(0, 80);
  return normalized.length >= 2 ? normalized : 'Creator';
}

function mapUserDoc(uid: string, data: Record<string, unknown>, emailVerified?: boolean): UserProfile {
  return {
    id: uid,
    name: String(data.name ?? 'Creator'),
    email: String(data.email ?? ''),
    emailVerified,
    role: (data.role as UserProfile['role']) ?? 'Hybrid Creator',
    bio: String(data.bio ?? ''),
    tier: (data.tier as SubscriptionTier) ?? SubscriptionTier.FREE,
    credits: Number(data.credits ?? DEFAULT_STARTER_CREDITS),
    savedIdeaIds: Array.isArray(data.savedIdeaIds) ? data.savedIdeaIds.map(String) : [],
    unlockedIdeaIds: Array.isArray(data.unlockedIdeaIds) ? data.unlockedIdeaIds.map(String) : [],
    upvotedIdeaIds: Array.isArray(data.upvotedIdeaIds) ? data.upvotedIdeaIds.map(String) : [],
    joinedAt: tsToIso(data.joinedAt),
  };
}

function mapIdeaDoc(id: string, data: Record<string, unknown>): IdeaItem {
  const item: IdeaItem = {
    id,
    title: String(data.title ?? ''),
    category: data.category as IdeaItem['category'],
    summary: String(data.summary ?? ''),
    detailedDescription: String(data.detailedDescription ?? ''),
    secretPitch: String(data.secretPitch ?? ''),
    executionRoadmap: Array.isArray(data.executionRoadmap) ? data.executionRoadmap.map(String) : [],
    targetAudience: String(data.targetAudience ?? ''),
    collaborationModel: data.collaborationModel as IdeaItem['collaborationModel'],
    askingTerms: String(data.askingTerms ?? ''),
    isPremium: Boolean(data.isPremium),
    unlockCredits: Number(data.unlockCredits ?? 0),
    authorId: String(data.authorId ?? ''),
    authorName: String(data.authorName ?? ''),
    authorRole: String(data.authorRole ?? ''),
    authorHandle: String(data.authorHandle ?? ''),
    createdAt: tsToIso(data.createdAt),
    upvotes: Number(data.upvotes ?? 0),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    isFeatured: Boolean(data.isFeatured),
    isDeleted: Boolean(data.isDeleted),
  };

  if (typeof data.boostCredits === 'number') {
    item.boostCredits = data.boostCredits;
  }
  if (typeof data.featuredAt === 'string') {
    item.featuredAt = data.featuredAt;
  }
  return item;
}

function mapProposalDoc(id: string, data: Record<string, unknown>): CollaborationProposal {
  return {
    id,
    ideaId: String(data.ideaId ?? ''),
    ideaAuthorId: typeof data.ideaAuthorId === 'string' ? data.ideaAuthorId : undefined,
    senderId: String(data.senderId ?? ''),
    senderName: String(data.senderName ?? ''),
    roleOffering: String(data.roleOffering ?? ''),
    proposedTerms: String(data.proposedTerms ?? ''),
    message: String(data.message ?? ''),
    status: (data.status as CollaborationProposal['status']) ?? 'Pending',
    createdAt: tsToIso(data.createdAt),
  };
}

function mapPaymentRequestDoc(id: string, data: Record<string, unknown>): CreditPurchaseRequest {
  const req: CreditPurchaseRequest = {
    id,
    userId: String(data.userId ?? ''),
    userName: String(data.userName ?? ''),
    userEmail: String(data.userEmail ?? ''),
    packId: String(data.packId ?? ''),
    packType: (data.packType as 'credits' | 'pro') ?? 'credits',
    credits: Number(data.credits ?? 0),
    amountInr: Number(data.amountInr ?? 0),
    priceLabel: String(data.priceLabel ?? ''),
    utr: String(data.utr ?? ''),
    status: (data.status as CreditPurchaseRequest['status']) ?? 'Pending Verification',
    createdAt: tsToIso(data.createdAt),
  };

  if (data.reviewedAt) {
    req.reviewedAt = tsToIso(data.reviewedAt);
  }
  if (typeof data.reviewedBy === 'string') {
    req.reviewedBy = data.reviewedBy;
  }
  return req;
}

function buildIdeaFirestorePayload(idea: IdeaItem, includeCreatedAt: boolean) {
  const payload: Record<string, unknown> = {
    id: idea.id,
    title: idea.title.slice(0, 140),
    category: idea.category,
    summary: idea.summary.slice(0, 320),
    detailedDescription: idea.detailedDescription.slice(0, 2500),
    secretPitch: idea.secretPitch.slice(0, 2000),
    executionRoadmap: idea.executionRoadmap.slice(0, 10),
    targetAudience: idea.targetAudience.slice(0, 160),
    collaborationModel: idea.collaborationModel,
    askingTerms: idea.askingTerms.slice(0, 120),
    isPremium: Boolean(idea.isPremium),
    unlockCredits: idea.isPremium ? idea.unlockCredits : 0,
    authorId: idea.authorId,
    authorName: idea.authorName.slice(0, 80),
    authorRole: idea.authorRole.slice(0, 60),
    authorHandle: idea.authorHandle.slice(0, 60),
    upvotes: idea.upvotes,
    tags: idea.tags.slice(0, 10),
    isFeatured: Boolean(idea.isFeatured),
    updatedAt: serverTimestamp(),
  };

  if (includeCreatedAt) {
    payload.createdAt = serverTimestamp();
  }
  if (typeof idea.boostCredits === 'number') {
    payload.boostCredits = idea.boostCredits;
  }
  if (idea.featuredAt) {
    payload.featuredAt = idea.featuredAt;
  }
  if (typeof idea.isDeleted === 'boolean') {
    payload.isDeleted = idea.isDeleted;
  }

  return payload;
}

export async function ensureUserProfile(
  fbUser: FirebaseUser,
  preferredRole: UserProfile['role'] = 'Hybrid Creator'
): Promise<UserProfile> {
  const uid = fbUser.uid;
  const email = (fbUser.email ?? '').trim();
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  let snap;
  try {
    snap = await getDoc(userRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
  }

  if (email.toLowerCase() === ADMIN_EMAIL && fbUser.emailVerified) {
    const adminRef = doc(db, 'admins', uid);
    try {
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        await setDoc(adminRef, {
          uid,
          email,
          grantedAt: serverTimestamp(),
        });
      }
    } catch {
      // Admin verified email rule still authorizes Viren cleanly
    }
  }

  if (snap.exists()) {
    return mapUserDoc(uid, snap.data() as Record<string, unknown>, fbUser.emailVerified);
  }

  const displayName = sanitizeDisplayName(fbUser.displayName, email);
  const newProfileData = {
    uid,
    name: displayName,
    email,
    role: preferredRole,
    bio: 'Building and exploring real-world Indian market ideas on Idea Adda.',
    tier: SubscriptionTier.FREE,
    credits: DEFAULT_STARTER_CREDITS,
    savedIdeaIds: [] as string[],
    unlockedIdeaIds: [] as string[],
    upvotedIdeaIds: [] as string[],
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(userRef, newProfileData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, userPath);
  }

  return {
    id: uid,
    name: displayName,
    email,
    emailVerified: fbUser.emailVerified,
    role: preferredRole,
    bio: newProfileData.bio,
    tier: SubscriptionTier.FREE,
    credits: DEFAULT_STARTER_CREDITS,
    savedIdeaIds: [],
    unlockedIdeaIds: [],
    upvotedIdeaIds: [],
    joinedAt: new Date().toISOString(),
  };
}

export function subscribeUserProfile(
  uid: string,
  emailVerified: boolean,
  onData: (profile: UserProfile) => void
) {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (snap.exists()) {
        onData(mapUserDoc(uid, snap.data() as Record<string, unknown>, emailVerified));
      }
    },
    (err) => {
      console.error(`Firestore listener warning (${path}):`, err);
    }
  );
}

export function subscribeIdeas(onData: (ideas: IdeaItem[]) => void) {
  const path = 'ideas';
  const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => mapIdeaDoc(d.id, d.data() as Record<string, unknown>));
      onData(items);
    },
    (err) => {
      console.error(`Firestore listener warning (${path}):`, err);
    }
  );
}

export function subscribeProposals(onData: (proposals: CollaborationProposal[]) => void) {
  const path = 'proposals';
  const q = query(collection(db, 'proposals'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) =>
        mapProposalDoc(d.id, d.data() as Record<string, unknown>)
      );
      onData(items);
    },
    (err) => {
      console.error(`Firestore listener warning (${path}):`, err);
    }
  );
}

export function subscribePaymentRequests(
  uid: string,
  isAdmin: boolean,
  onData: (requests: CreditPurchaseRequest[]) => void
) {
  const path = 'paymentRequests';
  const q = isAdmin
    ? query(collection(db, 'paymentRequests'), orderBy('createdAt', 'desc'))
    : query(collection(db, 'paymentRequests'), where('userId', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => mapPaymentRequestDoc(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(items);
    },
    (err) => {
      console.error(`Firestore listener warning (${path}):`, err);
    }
  );
}

export async function publishIdeaToFirestore(params: {
  idea: IdeaItem;
  user: UserProfile;
  boostCost: number;
}): Promise<void> {
  const { idea, user, boostCost } = params;
  const ideaRef = doc(db, 'ideas', idea.id);
  const ideaPayload = buildIdeaFirestorePayload(idea, true);

  if (boostCost > 0) {
    const batch = writeBatch(db);
    batch.set(ideaRef, ideaPayload);
    batch.update(doc(db, 'users', user.id), {
      credits: Math.max(0, user.credits - boostCost),
      updatedAt: serverTimestamp(),
    });
    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `ideas/${idea.id}`);
    }
    return;
  }

  try {
    await setDoc(ideaRef, ideaPayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `ideas/${idea.id}`);
  }
}

export async function boostIdeaInFirestore(params: {
  idea: IdeaItem;
  user: UserProfile;
  boostCredits: number;
  featuredAt: string;
  isCloudDoc: boolean;
  adminBypass?: boolean;
}): Promise<void> {
  const { idea, user, boostCredits, featuredAt, isCloudDoc, adminBypass = false } = params;
  const ideaRef = doc(db, 'ideas', idea.id);

  if (adminBypass) {
    try {
      if (!isCloudDoc) {
        await setDoc(
          ideaRef,
          buildIdeaFirestorePayload(
            {
              ...idea,
              isFeatured: true,
              boostCredits,
              featuredAt,
            },
            true
          )
        );
      } else {
        await updateDoc(ideaRef, {
          isFeatured: true,
          boostCredits,
          featuredAt,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `ideas/${idea.id}`);
    }
    return;
  }

  const batch = writeBatch(db);
  batch.update(ideaRef, {
    isFeatured: true,
    boostCredits,
    featuredAt,
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(db, 'users', user.id), {
    credits: user.credits - boostCredits,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `ideas/${idea.id}`);
  }
}

export async function unfeatureIdeaAsAdmin(idea: IdeaItem, isCloudDoc: boolean): Promise<void> {
  const ideaRef = doc(db, 'ideas', idea.id);
  try {
    if (!isCloudDoc) {
      await setDoc(
        ideaRef,
        buildIdeaFirestorePayload(
          {
            ...idea,
            isFeatured: false,
          },
          true
        )
      );
    } else {
      await updateDoc(ideaRef, {
        isFeatured: false,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `ideas/${idea.id}`);
  }
}

export async function deleteIdeaAsAdmin(idea: IdeaItem, isSeedId: boolean): Promise<void> {
  const ideaRef = doc(db, 'ideas', idea.id);
  try {
    if (isSeedId) {
      await setDoc(
        ideaRef,
        buildIdeaFirestorePayload(
          {
            ...idea,
            isDeleted: true,
            isFeatured: false,
          },
          true
        )
      );
    } else {
      await deleteDoc(ideaRef);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `ideas/${idea.id}`);
  }
}

export async function updateUserProfileInFirestore(
  uid: string,
  updates: Partial<Pick<UserProfile, 'name' | 'role' | 'bio'>>
): Promise<void> {
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (updates.name !== undefined) payload.name = updates.name.trim().slice(0, 80);
  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.bio !== undefined) payload.bio = updates.bio.trim().slice(0, 400);

  try {
    await updateDoc(doc(db, 'users', uid), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function toggleSavedIdeaInFirestore(
  uid: string,
  savedIdeaIds: string[]
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      savedIdeaIds,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function toggleUpvoteIdeaInFirestore(params: {
  uid: string;
  upvotedIdeaIds: string[];
  ideaId: string;
  nextUpvotes: number;
  isCloudDoc: boolean;
}): Promise<void> {
  const { uid, upvotedIdeaIds, ideaId, nextUpvotes, isCloudDoc } = params;
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', uid), {
    upvotedIdeaIds,
    updatedAt: serverTimestamp(),
  });
  if (isCloudDoc) {
    batch.update(doc(db, 'ideas', ideaId), {
      upvotes: nextUpvotes,
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
  }
}

export async function unlockIdeaInFirestore(params: {
  uid: string;
  nextCredits: number;
  unlockedIdeaIds: string[];
}): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', params.uid), {
      credits: params.nextCredits,
      unlockedIdeaIds: params.unlockedIdeaIds,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${params.uid}`);
  }
}

export async function submitProposalToFirestore(proposal: CollaborationProposal): Promise<void> {
  try {
    await setDoc(doc(db, 'proposals', proposal.id), {
      id: proposal.id,
      ideaId: proposal.ideaId,
      ideaAuthorId: proposal.ideaAuthorId ?? 'catalog-creator',
      senderId: proposal.senderId,
      senderName: proposal.senderName.slice(0, 80),
      roleOffering: proposal.roleOffering.slice(0, 100),
      proposedTerms: proposal.proposedTerms.slice(0, 120),
      message: proposal.message.slice(0, 1200),
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `proposals/${proposal.id}`);
  }
}

export async function submitUtrPaymentToFirestore(
  request: CreditPurchaseRequest
): Promise<void> {
  try {
    await setDoc(doc(db, 'paymentRequests', request.id), {
      id: request.id,
      userId: request.userId,
      userName: request.userName.slice(0, 80),
      userEmail: request.userEmail.slice(0, 160),
      packId: request.packId,
      packType: request.packType,
      credits: request.credits,
      amountInr: request.amountInr,
      priceLabel: request.priceLabel,
      utr: request.utr,
      status: 'Pending Verification',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `paymentRequests/${request.id}`);
  }
}

export async function approvePaymentAsAdmin(
  req: CreditPurchaseRequest,
  adminUid: string
): Promise<void> {
  const userRef = doc(db, 'users', req.userId);
  const reqRef = doc(db, 'paymentRequests', req.id);

  let userSnap;
  try {
    userSnap = await getDoc(userRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${req.userId}`);
  }

  const batch = writeBatch(db);
  batch.update(reqRef, {
    status: 'Approved',
    reviewedAt: serverTimestamp(),
    reviewedBy: adminUid,
    updatedAt: serverTimestamp(),
  });

  if (userSnap.exists()) {
    const currentData = userSnap.data() as Record<string, unknown>;
    const currentCredits = Number(currentData.credits ?? 0);
    const userUpdates: Record<string, unknown> = {
      credits: currentCredits + req.credits,
      updatedAt: serverTimestamp(),
    };
    if (req.packType === 'pro') {
      userUpdates.tier = SubscriptionTier.PRO;
    }
    batch.update(userRef, userUpdates);
  }

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `paymentRequests/${req.id}`);
  }
}

export async function rejectPaymentAsAdmin(
  req: CreditPurchaseRequest,
  adminUid: string
): Promise<void> {
  try {
    await updateDoc(doc(db, 'paymentRequests', req.id), {
      status: 'Rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminUid,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `paymentRequests/${req.id}`);
  }
}
