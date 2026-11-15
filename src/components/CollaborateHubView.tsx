import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  CollaborationModel,
  CollaborationProposal,
  IdeaItem,
  UserProfile,
} from '../types/marketplace';

interface CollaborateHubViewProps {
  ideas: IdeaItem[];
  proposals: CollaborationProposal[];
  user: UserProfile | null;
  onOpenCollaboration: (idea: IdeaItem) => void;
}

const DEAL_FILTERS: ('All' | CollaborationModel)[] = [
  'All',
  CollaborationModel.CO_FOUNDER,
  CollaborationModel.EQUITY_SPLIT,
  CollaborationModel.REVENUE_SHARE,
  CollaborationModel.FIXED_BUYOUT,
];

export const CollaborateHubView: React.FC<CollaborateHubViewProps> = ({
  ideas,
  proposals,
  user,
  onOpenCollaboration,
}) => {
  const [dealFilter, setDealFilter] = useState<'All' | CollaborationModel>('All');

  const matchingIdeas = ideas.filter(
    (idea) => dealFilter === 'All' || idea.collaborationModel === dealFilter
  );

  const userProposals = user ? proposals.filter((p) => p.senderId === user.id) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-10">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Two-Sided Partnerships
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Creator Collaboration Hub
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Browse active co-founder, revenue-share, and licensing opportunities. Pitch your
          engineering, content, or distribution skills directly to Idea Givers.
        </p>

        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1">
          {DEAL_FILTERS.map((model) => {
            const active = dealFilter === model;
            return (
              <button
                key={model}
                type="button"
                onClick={() => setDealFilter(model)}
                className={`h-9 rounded-lg px-3.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-[#181D29] text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                {model === 'All' ? 'All Deal Structures' : model}
              </button>
            );
          })}
        </div>
      </div>

      {/* User's Outbound Pitches (if any) */}
      {user && (
        <section aria-labelledby="my-pitches-heading" className="space-y-4">
          <h2
            id="my-pitches-heading"
            className="font-display text-xl font-bold text-slate-900 dark:text-white"
          >
            Your Sent Collaboration Proposals ({userProposals.length})
          </h2>

          {userProposals.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-6 text-sm text-slate-600 dark:text-slate-400">
              You have not sent any collaboration proposals yet. Select any opportunity below to
              send a pitch.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProposals.map((prop) => {
                const targetIdea = ideas.find((i) => i.id === prop.ideaId);
                return (
                  <div
                    key={prop.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {prop.status}
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {prop.proposedTerms}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-white">
                      {targetIdea?.title ?? 'Idea Brief'}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {prop.message}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Open Collaboration Opportunities */}
      <section aria-labelledby="open-collabs-heading" className="space-y-4">
        <h2
          id="open-collabs-heading"
          className="font-display text-xl font-bold text-slate-900 dark:text-white"
        >
          Open Collaboration Briefs ({matchingIdeas.length})
        </h2>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E]">
          {matchingIdeas.map((idea) => {
            const count = proposals.filter((p) => p.ideaId === idea.id).length;
            return (
              <div
                key={idea.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {idea.collaborationModel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{idea.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {idea.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{idea.askingTerms}</span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {idea.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
                    {idea.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {count} {count === 1 ? 'pitch' : 'pitches'}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenCollaboration(idea)}
                    className="inline-flex h-10 items-center rounded-lg bg-slate-900 dark:bg-white px-4 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Pitch Proposal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
