import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  AccessFilter,
  CollaborationProposal,
  FilterOptions,
  IdeaCategory,
  IdeaItem,
  SortOption,
  UserProfile,
} from '../types/marketplace';
import { canViewFullIdea, getPopularTags } from '../utils/marketplaceLogic';
import { IdeaCard } from './IdeaCard';

interface MarketplaceFeedProps {
  ideas: IdeaItem[];
  filteredIdeas: IdeaItem[];
  proposals: CollaborationProposal[];
  user: UserProfile | null;
  filters: FilterOptions;
  onUpdateFilters: (next: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  onInspectIdea: (idea: IdeaItem) => void;
  onToggleSave: (ideaId: string) => void;
  onToggleUpvote: (ideaId: string) => void;
}

const CATEGORIES: IdeaCategory[] = [
  IdeaCategory.ALL,
  IdeaCategory.CREATOR_REGIONAL,
  IdeaCategory.LOCAL_D2C,
  IdeaCategory.STUDENT_EDTECH,
  IdeaCategory.LOCAL_SERVICES,
];

const PAGE_SIZE = 18;

const CURATED_SPOTLIGHTS: {
  category: IdeaCategory;
  title: string;
  subtitle: string;
  image: string;
}[] = [
  {
    category: IdeaCategory.CREATOR_REGIONAL,
    title: 'Creator Economy & Regional Content',
    subtitle: 'Hindi, Haryanvi & Punjabi AI script tools, city meme ad networks, and shaadi kits.',
    image: '/src/assets/images/spotlight_content_studio_1794712093634.jpg',
  },
  {
    category: IdeaCategory.LOCAL_D2C,
    title: 'Local & D2C Businesses',
    subtitle: 'WhatsApp kirana ordering, bridal & mehndi funnels, and mandi cloud kitchen supply.',
    image: '/src/assets/images/spotlight_commerce_venture_1794712093705.jpg',
  },
  {
    category: IdeaCategory.LOCAL_SERVICES,
    title: 'Local Services & Automation',
    subtitle: 'Chai tapri QR menus, WhatsApp GST billing plugins, and hyperlocal SMB ops.',
    image: '/src/assets/images/spotlight_ai_automation_1794712092308.jpg',
  },
];

export const MarketplaceFeed: React.FC<MarketplaceFeedProps> = ({
  ideas,
  filteredIdeas,
  proposals,
  user,
  filters,
  onUpdateFilters,
  onResetFilters,
  onInspectIdea,
  onToggleSave,
  onToggleUpvote,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters.searchQuery, filters.category, filters.access, filters.sortBy, filters.tag]);

  const popularTags = useMemo(() => getPopularTags(ideas, 8), [ideas]);
  const visibleIdeas = useMemo(
    () => filteredIdeas.slice(0, visibleCount),
    [filteredIdeas, visibleCount]
  );

  const getProposalCount = (ideaId: string) =>
    proposals.filter((p) => p.ideaId === ideaId).length;

  return (
    <div id="marketplace-feed" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-10">
      {/* Curated Category Spotlights */}
      <section aria-labelledby="spotlight-heading">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2
              id="spotlight-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Curated Exchange Tracks
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Select a track to filter live briefs or browse the full marketplace below.
            </p>
          </div>
          {filters.category !== IdeaCategory.ALL && (
            <button
              type="button"
              onClick={() => onUpdateFilters({ category: IdeaCategory.ALL })}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Show all categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CURATED_SPOTLIGHTS.map((spot) => {
            const count = ideas.filter((i) => i.category === spot.category).length;
            const isSelected = filters.category === spot.category;
            return (
              <button
                key={spot.category}
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    category: isSelected ? IdeaCategory.ALL : spot.category,
                  })
                }
                className={`group text-left overflow-hidden rounded-xl border transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/25'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={spot.image}
                    alt={`${spot.title} visual showcase`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {spot.title}
                    </span>
                    <span className="font-mono tabular-nums whitespace-nowrap shrink-0">
                      {count} {count === 1 ? 'brief' : 'briefs'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {spot.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section aria-labelledby="feed-heading" className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
          <div>
            <h2
              id="feed-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Live Idea Marketplace
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Showing{' '}
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                {visibleIdeas.length}
              </span>{' '}
              of{' '}
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                {filteredIdeas.length}
              </span>{' '}
              matching ({ideas.length} total ideas)
            </p>
          </div>

          {/* Search + Sort + Access Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[240px] sm:w-64">
              <label htmlFor="idea-search" className="sr-only">
                Search ideas by title, topic, or author
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="idea-search"
                type="search"
                value={filters.searchQuery}
                onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
                placeholder="Search ideas, tags, founders..."
                className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="idea-access-filter" className="sr-only">
                Filter by access tier
              </label>
              <select
                id="idea-access-filter"
                value={filters.access}
                onChange={(e) =>
                  onUpdateFilters({ access: e.target.value as AccessFilter })
                }
                className="h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] px-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                <option value={AccessFilter.ALL}>All Access Tiers</option>
                <option value={AccessFilter.FREE}>Open Briefs Only</option>
                <option value={AccessFilter.PREMIUM}>Premium Blueprints</option>
              </select>

              <div className="relative flex items-center">
                <SlidersHorizontal
                  className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400"
                  aria-hidden="true"
                />
                <label htmlFor="idea-sort" className="sr-only">
                  Sort ideas
                </label>
                <select
                  id="idea-sort"
                  value={filters.sortBy}
                  onChange={(e) =>
                    onUpdateFilters({ sortBy: e.target.value as SortOption })
                  }
                  className="h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] pl-8 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:border-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value={SortOption.POPULAR}>Most Popular</option>
                  <option value={SortOption.RECENT}>Newest First</option>
                  <option value={SortOption.CREDITS_ASC}>Lowest Credit Cost</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Functional Segmented Buttons) */}
        <div className="space-y-3">
          <div
            role="tablist"
            aria-label="Filter ideas by category"
            className="flex flex-wrap items-center gap-1.5"
          >
            {CATEGORIES.map((category) => {
              const active = filters.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onUpdateFilters({ category })}
                  className={`h-9 rounded-lg px-3.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    active
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                      : 'bg-slate-100 dark:bg-[#181D29] text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Interactive Topic Filter Tags */}
          {popularTags.length > 0 && (
            <div
              aria-label="Filter ideas by popular topic tag"
              className="flex flex-wrap items-center gap-2 pt-1 text-xs"
            >
              <span className="font-medium text-slate-500 dark:text-slate-400 mr-1">
                Topics:
              </span>
              <button
                type="button"
                onClick={() => onUpdateFilters({ tag: '' })}
                aria-pressed={!filters.tag}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !filters.tag
                    ? 'bg-blue-700 dark:bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-[#181D29] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                All Topics
              </button>
              {popularTags.map(({ tag, count }) => {
                const active = filters.tag?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onUpdateFilters({ tag: active ? '' : tag })}
                    aria-pressed={active}
                    className={`rounded-md px-2.5 py-1 font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-blue-700 dark:bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-[#181D29] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    #{tag} <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ideas Grid or Empty State */}
        {visibleIdeas.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="ideas-grid">
              {visibleIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isUnlocked={canViewFullIdea(idea, user)}
                  isSaved={Boolean(user?.savedIdeaIds.includes(idea.id))}
                  isUpvoted={Boolean(user?.upvotedIdeaIds.includes(idea.id))}
                  proposalCount={getProposalCount(idea.id)}
                  activeTag={filters.tag}
                  onSelectTag={(tag) => onUpdateFilters({ tag })}
                  onInspect={onInspectIdea}
                  onToggleSave={onToggleSave}
                  onToggleUpvote={onToggleUpvote}
                />
              ))}
            </div>

            {visibleCount < filteredIdeas.length && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) => Math.min(filteredIdeas.length, prev + PAGE_SIZE))
                  }
                  className="inline-flex h-11 items-center rounded-lg bg-slate-900 dark:bg-white px-5 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Load {Math.min(PAGE_SIZE, filteredIdeas.length - visibleCount)} More Ideas (
                  {filteredIdeas.length - visibleCount} remaining)
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleCount(filteredIdeas.length)}
                  className="inline-flex h-11 items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  Show All {filteredIdeas.length}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] px-6 py-14 text-center">
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              No matching ideas found
            </p>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Adjust your search keywords, topic tag, access tier, or category filter to view more
              marketplace briefs.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
