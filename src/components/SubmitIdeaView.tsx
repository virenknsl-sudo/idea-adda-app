import React, { useState } from 'react';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';
import {
  CollaborationModel,
  IdeaCategory,
  IdeaSubmissionInput,
  UserProfile,
} from '../types/marketplace';
import {
  BOOST_OPTIONS,
  validateBoostOnSubmit,
  validateIdeaSubmission,
  ValidationErrors,
} from '../utils/marketplaceLogic';

interface SubmitIdeaViewProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSubmitIdea: (input: IdeaSubmissionInput) => Promise<{ ok: boolean; error?: string }>;
  onViewMarketplace: () => void;
  onGoToPlans: () => void;
}

const SUBMIT_CATEGORIES: Exclude<IdeaCategory, IdeaCategory.ALL>[] = [
  IdeaCategory.CREATOR_REGIONAL,
  IdeaCategory.LOCAL_D2C,
  IdeaCategory.STUDENT_EDTECH,
  IdeaCategory.LOCAL_SERVICES,
];

const COLLAB_MODELS: CollaborationModel[] = [
  CollaborationModel.EQUITY_SPLIT,
  CollaborationModel.CO_FOUNDER,
  CollaborationModel.REVENUE_SHARE,
  CollaborationModel.FIXED_BUYOUT,
];

export const SubmitIdeaView: React.FC<SubmitIdeaViewProps> = ({
  user,
  onOpenAuth,
  onSubmitIdea,
  onViewMarketplace,
  onGoToPlans,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<IdeaCategory, IdeaCategory.ALL>>(
    IdeaCategory.CREATOR_REGIONAL
  );
  const [summary, setSummary] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [secretPitch, setSecretPitch] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [collaborationModel, setCollaborationModel] = useState<CollaborationModel>(
    CollaborationModel.EQUITY_SPLIT
  );
  const [askingTerms, setAskingTerms] = useState('');
  const [isPremium, setIsPremium] = useState(true);
  const [unlockCredits, setUnlockCredits] = useState(3);
  const [tagsText, setTagsText] = useState('');
  const [boostIdea, setBoostIdea] = useState(false);
  const [boostCredits, setBoostCredits] = useState<number>(10);
  const [boostError, setBoostError] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors<IdeaSubmissionInput>>({});
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    const input: IdeaSubmissionInput = {
      title,
      category,
      summary,
      detailedDescription,
      secretPitch,
      targetAudience,
      collaborationModel,
      askingTerms,
      isPremium,
      unlockCredits: isPremium ? Number(unlockCredits) : 0,
      tagsText,
      boostIdea,
      boostCredits: boostIdea ? boostCredits : 0,
    };

    const validation = validateIdeaSubmission(input);
    const boostValidationError = validateBoostOnSubmit(input, user);
    if (Object.keys(validation).length > 0 || boostValidationError) {
      setErrors(validation);
      setBoostError(boostValidationError ?? '');
      setSubmittedNotice(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await onSubmitIdea(input);
      if (!res.ok) {
        setBoostError(res.error ?? 'Could not submit idea.');
        setSubmittedNotice(false);
        return;
      }

      setTitle('');
      setSummary('');
      setDetailedDescription('');
      setSecretPitch('');
      setTargetAudience('');
      setAskingTerms('');
      setTagsText('');
      setBoostIdea(false);
      setBoostCredits(10);
      setBoostError('');
      setErrors({});
      setSubmittedNotice(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          For Idea Givers · Publish Brief
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Submit a New Idea to the Marketplace
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Share the public problem statement and protect your core execution pitch behind credit or
          Pro-tier masking so only committed Idea Takers can unlock it.
        </p>
      </div>

      {!user && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Sign in with Google to publish and track proposals
            </p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              Your submitted ideas appear immediately in your Creator Profile and the live feed.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex h-10 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      )}

      {submittedNotice && (
        <div
          role="status"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm font-medium text-emerald-800 dark:text-emerald-300"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Your idea is live on the Marketplace feed and saved to your Profile.</span>
          </div>
          <button
            type="button"
            onClick={onViewMarketplace}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            View in Marketplace →
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <label
              htmlFor="submit-title"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Idea Title
            </label>
            <input
              id="submit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., WhatsApp Automated Ordering Bot for Local Kirana Stores"
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="submit-category"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Category
            </label>
            <select
              id="submit-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Exclude<IdeaCategory, IdeaCategory.ALL>)
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            >
              {SUBMIT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="submit-summary"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Public Marketplace Summary (Visible to all browsers)
          </label>
          <input
            id="submit-summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Concise 1–2 sentence hook explaining who this helps and what pain it eliminates."
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
          />
          {errors.summary && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.summary}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="submit-description"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Detailed Problem &amp; Context Description
          </label>
          <textarea
            id="submit-description"
            rows={4}
            value={detailedDescription}
            onChange={(e) => setDetailedDescription(e.target.value)}
            placeholder="Describe the market gap, current workflow friction, and why existing solutions fall short..."
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
          />
          {errors.detailedDescription && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.detailedDescription}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Core Execution Pitch &amp; Distribution Edge
              </span>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>Mask as Premium Blueprint (blurred for free users)</span>
            </label>
          </div>

          <div>
            <label
              htmlFor="submit-pitch"
              className="block text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Execution Pitch, GTM Wedge &amp; Monetization Secret
            </label>
            <textarea
              id="submit-pitch"
              rows={3}
              value={secretPitch}
              onChange={(e) => setSecretPitch(e.target.value)}
              placeholder="Detail the unfair distribution wedge, pricing loop, or technical moat..."
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11151E] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
            {errors.secretPitch && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.secretPitch}</p>
            )}
          </div>

          {isPremium && (
            <div className="max-w-xs">
              <label
                htmlFor="submit-credits"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Unlock Credit Cost (1–25 Credits)
              </label>
              <input
                id="submit-credits"
                type="number"
                min={1}
                max={25}
                value={unlockCredits}
                onChange={(e) => setUnlockCredits(Number(e.target.value))}
                className="mt-1 w-32 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11151E] px-3 py-2 font-mono text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
              />
              {errors.unlockCredits && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.unlockCredits}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="submit-audience"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Target Audience / Buyer
            </label>
            <input
              id="submit-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Local kirana stores, CBSE students, regional creators"
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
            {errors.targetAudience && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.targetAudience}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="submit-tags"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Keywords (comma separated)
            </label>
            <input
              id="submit-tags"
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="whatsapp, upi, tier2, hyperlocal"
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="submit-collab-model"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Collaboration Model
            </label>
            <select
              id="submit-collab-model"
              value={collaborationModel}
              onChange={(e) => setCollaborationModel(e.target.value as CollaborationModel)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            >
              {COLLAB_MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="submit-terms"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Asking Price / Collaboration Terms
            </label>
            <input
              id="submit-terms"
              type="text"
              value={askingTerms}
              onChange={(e) => setAskingTerms(e.target.value)}
              placeholder="e.g., ₹499 Blueprint · 15% Equity"
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
            {errors.askingTerms && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.askingTerms}
              </p>
            )}
          </div>
        </div>

        {/* Optional Boost / Featured Pin Section */}
        <div
          className={`rounded-xl border p-5 space-y-4 transition-colors ${
            boostIdea
              ? 'border-amber-400/90 dark:border-amber-500/70 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Boost / Feature This Idea (Optional)
              </span>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={boostIdea}
                onChange={(e) => {
                  setBoostIdea(e.target.checked);
                  setBoostError('');
                }}
                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
              />
              <span>Pin at Top with ⭐ Featured / Sponsored Badge</span>
            </label>
          </div>

          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Featured ideas stay pinned at the top of the marketplace feed for maximum buyer visibility.{' '}
            {user && (
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                Available balance: {user.credits} Credits
              </span>
            )}
          </p>

          {boostIdea && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BOOST_OPTIONS.map((option) => {
                  const selected = boostCredits === option.credits;
                  return (
                    <button
                      key={option.credits}
                      type="button"
                      onClick={() => {
                        setBoostCredits(option.credits);
                        setBoostError('');
                      }}
                      aria-pressed={selected}
                      className={`text-left rounded-lg border p-3.5 transition-colors cursor-pointer ${
                        selected
                          ? 'border-amber-500 bg-white dark:bg-[#11151E] ring-1 ring-amber-500/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#11151E]/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {option.label}
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                          {option.credits} Credits
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {user && user.credits < boostCredits && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#11151E] px-3.5 py-2.5 text-xs">
                  <span className="font-medium text-amber-900 dark:text-amber-200">
                    You have {user.credits} credits and need {boostCredits} credits for this boost.
                  </span>
                  <button
                    type="button"
                    onClick={onGoToPlans}
                    className="font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Buy Credits on Plans &amp; Credits →
                  </button>
                </div>
              )}

              {boostError && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {boostError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {user
              ? submitting
                ? 'Publishing...'
                : boostIdea
                ? `Publish & Boost (${boostCredits} Cr)`
                : 'Publish Idea Brief'
              : 'Sign In to Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};
