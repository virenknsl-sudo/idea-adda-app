import React from 'react';
import { ArrowUp, Bookmark, Lock, Unlock } from 'lucide-react';
import { IdeaItem } from '../types/marketplace';
import { formatCreditInrEstimate } from '../utils/marketplaceLogic';

interface IdeaCardProps {
  idea: IdeaItem;
  isUnlocked: boolean;
  isSaved: boolean;
  isUpvoted: boolean;
  proposalCount: number;
  activeTag?: string;
  onSelectTag?: (tag: string) => void;
  onInspect: (idea: IdeaItem) => void;
  onToggleSave: (ideaId: string) => void;
  onToggleUpvote: (ideaId: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isUnlocked,
  isSaved,
  isUpvoted,
  proposalCount,
  activeTag,
  onSelectTag,
  onInspect,
  onToggleSave,
  onToggleUpvote,
}) => {
  const formattedDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isMasked = idea.isPremium && !isUnlocked;

  return (
    <article
      className={`flex flex-col justify-between rounded-xl border bg-white dark:bg-[#11151E] p-5 sm:p-6 transition-colors duration-150 ${
        idea.isFeatured
          ? 'border-amber-400/90 dark:border-amber-500/75 shadow-[0_0_24px_-6px_rgba(245,158,11,0.4)] dark:shadow-[0_0_28px_-6px_rgba(251,191,36,0.28)] ring-1 ring-amber-400/35 dark:ring-amber-500/25'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {idea.isFeatured && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span
              data-testid="featured-badge"
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/70 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.35)]"
            >
              <span aria-hidden="true">⭐</span>
              <span>Featured / Sponsored</span>
            </span>
            <span className="font-mono text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Pinned at Top
            </span>
          </div>
        )}

        {/* Quiet unboxed metadata line (Zero-Pill Rule) */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
              {idea.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">{idea.collaborationModel}</span>
          </div>

          {idea.isPremium ? (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                isUnlocked
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="font-mono tabular-nums">
                    {idea.unlockCredits} Cr ({formatCreditInrEstimate(idea.unlockCredits)})
                  </span>
                </>
              )}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
              Open Brief · ₹0
            </span>
          )}
        </div>

        {/* Title & Summary */}
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-slate-900 dark:text-white">
          <button
            type="button"
            onClick={() => onInspect(idea)}
            className="text-left hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
          >
            {idea.title}
          </button>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
          {idea.summary}
        </p>

        {idea.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {idea.tags.slice(0, 4).map((tag) => {
              const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();
              return onSelectTag ? (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(isSelected ? '' : tag)}
                  className={`text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'font-semibold text-blue-700 dark:text-blue-400 underline underline-offset-2'
                      : 'text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'
                  }`}
                >
                  #{tag}
                </button>
              ) : (
                <span key={tag} className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  #{tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Masked / Unmasked Execution Preview */}
        <div className="mt-4 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-3.5">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Execution Edge &amp; GTM Pitch
            </span>
            <span className="font-mono text-[11px] tabular-nums">{idea.askingTerms}</span>
          </div>

          {isMasked ? (
            <div className="relative mt-2 select-none">
              <p
                aria-hidden="true"
                className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 blur-[5px]"
              >
                {idea.secretPitch}
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onInspect(idea)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-[#181D29]/95 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>Unlock with Pro or {idea.unlockCredits} Credits</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
              {idea.secretPitch}
            </p>
          )}
        </div>
      </div>

      {/* Footer Metadata & Functional Actions */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
            {idea.authorName}
          </span>
          <span className="truncate block">
            {idea.authorRole} · {proposalCount} {proposalCount === 1 ? 'pitch' : 'pitches'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggleUpvote(idea.id)}
            aria-label={`Upvote '${idea.title}' (current upvotes: ${idea.upvotes})`}
            aria-pressed={isUpvoted}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-mono font-medium tabular-nums transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isUpvoted
                ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
            }`}
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{idea.upvotes}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleSave(idea.id)}
            aria-label={isSaved ? `Remove '${idea.title}' from saved` : `Save '${idea.title}'`}
            aria-pressed={isSaved}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isSaved
                ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onInspect(idea)}
            aria-label={`Inspect and collaborate on '${idea.title}'`}
            className="inline-flex h-9 items-center rounded-lg bg-slate-900 dark:bg-slate-100 px-3 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isMasked ? 'Preview' : 'Inspect'}
          </button>
        </div>
      </div>
    </article>
  );
};
