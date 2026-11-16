import React, { useState } from 'react';
import {
  ArrowUp,
  Bookmark,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  Unlock,
  X,
} from 'lucide-react';
import {
  CollaborationProposal,
  IdeaItem,
  ProposalSubmissionInput,
  SubscriptionTier,
  UserProfile,
} from '../types/marketplace';
import {
  canViewFullIdea,
  formatCreditInrEstimate,
  isAdminUser,
  validateProposal,
  ValidationErrors,
} from '../utils/marketplaceLogic';

interface IdeaDetailModalProps {
  idea: IdeaItem | null;
  initialTab?: 'overview' | 'collaborate';
  user: UserProfile | null;
  proposals: CollaborationProposal[];
  onClose: () => void;
  onUnlockWithCredits: (idea: IdeaItem) => Promise<{ ok: boolean; error?: string }>;
  onUpgradeToPro: () => void;
  onOpenAuth: () => void;
  onToggleSave: (ideaId: string) => void;
  onToggleUpvote: (ideaId: string) => void;
  onSubmitProposal: (
    ideaId: string,
    input: ProposalSubmissionInput
  ) => Promise<{ ok: boolean; error?: string }>;
  onBoostIdea: (ideaId: string, boostCredits: number) => Promise<{ ok: boolean; error?: string }>;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  initialTab = 'overview',
  user,
  proposals,
  onClose,
  onUnlockWithCredits,
  onUpgradeToPro,
  onOpenAuth,
  onToggleSave,
  onToggleUpvote,
  onSubmitProposal,
  onBoostIdea,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'collaborate'>(initialTab);
  const [unlockFeedback, setUnlockFeedback] = useState<string>('');
  const [boostFeedback, setBoostFeedback] = useState<string>('');
  const [roleOffering, setRoleOffering] = useState('');
  const [proposedTerms, setProposedTerms] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ValidationErrors<ProposalSubmissionInput>>({});
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalError, setProposalError] = useState('');
  const [submittingProposal, setSubmittingProposal] = useState(false);

  React.useEffect(() => {
    setActiveTab(initialTab);
    setUnlockFeedback('');
    setBoostFeedback('');
    setProposalSuccess(false);
    setProposalError('');
    setErrors({});
  }, [idea?.id, initialTab]);

  if (!idea) return null;

  const isOwnerAdmin = isAdminUser(user);
  const isUnlocked = canViewFullIdea(idea, user);
  const isSaved = Boolean(user?.savedIdeaIds.includes(idea.id));
  const isUpvoted = Boolean(user?.upvotedIdeaIds.includes(idea.id));
  const ideaProposals = proposals.filter((p) => p.ideaId === idea.id);

  const handleUnlockClick = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const res = await onUnlockWithCredits(idea);
    if (!res.ok && res.error) {
      setUnlockFeedback(res.error);
    } else {
      setUnlockFeedback('');
    }
  };

  const handleProposalForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    const input: ProposalSubmissionInput = {
      roleOffering,
      proposedTerms,
      message,
    };
    const validation = validateProposal(input);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setProposalError('');
    setSubmittingProposal(true);
    try {
      const res = await onSubmitProposal(idea.id, input);
      if (!res.ok) {
        setProposalError(res.error ?? 'Could not submit collaboration pitch.');
        setProposalSuccess(false);
        return;
      }
      setRoleOffering('');
      setProposedTerms('');
      setMessage('');
      setErrors({});
      setProposalSuccess(true);
    } finally {
      setSubmittingProposal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="my-8 w-full max-w-3xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {idea.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/70 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
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
                <span>By {idea.authorName} ({idea.authorHandle})</span>
              </div>

              <h2
                id="detail-modal-title"
                className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {idea.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close idea detail dialog"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action Bar & Internal Tabs */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" aria-label="Idea sections" className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#181D29] p-1 rounded-lg">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-[#090B10] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Overview &amp; Blueprint
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'collaborate'}
                onClick={() => setActiveTab('collaborate')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'collaborate'
                    ? 'bg-white dark:bg-[#090B10] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Collaboration ({ideaProposals.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleUpvote(idea.id)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-mono font-semibold tabular-nums transition-colors cursor-pointer ${
                  isUpvoted
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{idea.upvotes} Upvotes</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleSave(idea.id)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors cursor-pointer ${
                  isSaved
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Problem &amp; Concept Overview
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {idea.detailedDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Target Audience</p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                    {idea.targetAudience}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Asking Price / Collaboration Terms
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                    {idea.askingTerms}
                  </p>
                </div>
              </div>

              {user && user.id === idea.authorId && !idea.isFeatured && (
                <div className="rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Boost / Feature Your Idea</span>
                    </p>
                    <p className="mt-0.5 text-xs text-amber-900/80 dark:text-amber-200/80">
                      Pin this idea to the top of the marketplace feed with the ⭐ Featured / Sponsored badge.
                    </p>
                    {boostFeedback && (
                      <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                        {boostFeedback}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await onBoostIdea(idea.id, 10);
                        if (!res.ok && res.error) setBoostFeedback(res.error);
                      }}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-amber-400 dark:border-amber-600 bg-white dark:bg-[#11151E] px-3 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer"
                    >
                      <span>{isOwnerAdmin ? 'Boost (Owner Free)' : 'Boost (10 Cr)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await onBoostIdea(idea.id, 15);
                        if (!res.ok && res.error) setBoostFeedback(res.error);
                      }}
                      className="inline-flex h-9 items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 text-xs font-semibold text-slate-950 cursor-pointer"
                    >
                      <span>{isOwnerAdmin ? 'Top Pin (Owner Free)' : 'Top Pin (15 Cr)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sensitive Blueprint Section (Masked if Premium & Locked) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {isUnlocked ? (
                      <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    )}
                    <span>Exclusive Execution Pitch &amp; Distribution Edge</span>
                  </h3>
                  {idea.isPremium && (
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isUnlocked
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {isUnlocked
                        ? 'Unlocked'
                        : `${idea.unlockCredits} Credits (${formatCreditInrEstimate(idea.unlockCredits)})`}
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <div className="mt-3 space-y-4">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {idea.secretPitch}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Execution Roadmap
                      </p>
                      <ol className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {idea.executionRoadmap.map((step, index) => (
                          <li key={step} className="flex items-start gap-2.5">
                            <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 mt-0.5 tabular-nums">
                              0{index + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="relative mt-4">
                    <div aria-hidden="true" className="select-none blur-[6px] space-y-3 opacity-70">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {idea.secretPitch}
                      </p>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        {idea.executionRoadmap.map((step) => (
                          <li key={step}>• {step}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11151E] p-4 sm:p-5 text-center shadow-sm">
                      <p className="font-display text-base font-bold text-slate-900 dark:text-white">
                        Premium Blueprint Protected for Serious Builders
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {user
                          ? `You have ${user.credits} credits on the ${
                              user.tier === SubscriptionTier.PRO ? 'Pro' : 'Free'
                            } tier.`
                          : 'Sign in with your Google account to unlock with credits or Pro access.'}
                      </p>

                      {unlockFeedback && (
                        <p
                          role="alert"
                          className="mt-2.5 text-xs font-medium text-red-600 dark:text-red-400"
                        >
                          {unlockFeedback}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleUnlockClick}
                          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                        >
                          <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {user
                              ? `Unlock Now (${idea.unlockCredits} Credits)`
                              : 'Sign In to Unlock'}
                          </span>
                        </button>

                        {(!user || user.tier !== SubscriptionTier.PRO) && (
                          <button
                            type="button"
                            onClick={onUpgradeToPro}
                            className="inline-flex h-10 items-center rounded-lg border border-slate-300 dark:border-slate-700 px-4 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            View Pro Tier Plans
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Tags: {idea.tags.join(' · ')}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('collaborate')}
                  className="font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Pitch a collaboration on this idea →
                </button>
              </div>
            </div>
          ) : (
            /* Collaboration Tab */
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Collaborate with {idea.authorName}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Idea Giver seeks: <span className="font-semibold text-slate-900 dark:text-slate-200">{idea.collaborationModel}</span> · Terms: <span className="font-mono">{idea.askingTerms}</span>
                </p>
              </div>

              {/* Submit Collaboration Pitch Form */}
              <form
                onSubmit={handleProposalForm}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-4 sm:p-5 space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="proposal-role"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Your Role / Capability
                    </label>
                    <input
                      id="proposal-role"
                      type="text"
                      value={roleOffering}
                      onChange={(e) => setRoleOffering(e.target.value)}
                      placeholder="Full-Stack Engineer / Growth Creator"
                      className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11151E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                    />
                    {errors.roleOffering && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.roleOffering}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="proposal-terms"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      Proposed Terms
                    </label>
                    <input
                      id="proposal-terms"
                      type="text"
                      value={proposedTerms}
                      onChange={(e) => setProposedTerms(e.target.value)}
                      placeholder="50/50 Co-Founder Equity or ₹1,50,000 License"
                      className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11151E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                    />
                    {errors.proposedTerms && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.proposedTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="proposal-message"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Execution Pitch &amp; Relevant Track Record
                  </label>
                  <textarea
                    id="proposal-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain how you will build, distribute, or acquire customers for this idea..."
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11151E] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                {proposalError && (
                  <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                    {proposalError}
                  </p>
                )}

                {proposalSuccess && (
                  <p
                    role="status"
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Collaboration pitch sent and recorded in your profile.</span>
                  </p>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {user ? `Sending as ${user.name} (${user.email})` : 'Sign in required to send pitch'}
                  </span>
                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className="inline-flex h-10 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {user
                      ? submittingProposal
                        ? 'Sending Pitch...'
                        : 'Send Collaboration Pitch'
                      : 'Sign In & Send Pitch'}
                  </button>
                </div>
              </form>

              {/* Existing Proposals Thread */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Pitches ({ideaProposals.length})
                </h4>

                {ideaProposals.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No pitches submitted yet. Be the first Idea Taker to propose a collaboration.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {ideaProposals.map((prop) => (
                      <div
                        key={prop.id}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {prop.senderName}
                            </span>
                            <span aria-hidden="true" className="text-slate-400">
                              ·
                            </span>
                            <span className="text-slate-600 dark:text-slate-300">
                              {prop.roleOffering}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                            {prop.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {prop.message}
                        </p>
                        <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                          Proposed Terms: {prop.proposedTerms}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
