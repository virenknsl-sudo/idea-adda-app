import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  totalIdeas: number;
  totalProposals: number;
  premiumIdeasCount: number;
  activeCreators: number;
  onExploreFeed: () => void;
  onStartSubmit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalIdeas,
  totalProposals,
  premiumIdeasCount,
  activeCreators,
  onExploreFeed,
  onStartSubmit,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <section className="border-b border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0C0F16]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
                  Viren Dev Labs · Two-Sided Creator Venture Exchange
                </p>
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="live-active-creators"
                  className="inline-flex lg:hidden items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/80 dark:bg-emerald-950/35 px-2.5 py-1 text-xs font-medium text-emerald-900 dark:text-emerald-200 whitespace-nowrap shrink-0"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 motion-safe:animate-pulse"
                  />
                  <span className="font-mono font-semibold tabular-nums">
                    {activeCreators.toLocaleString('en-US')}
                  </span>
                  <span>Creators Active Across India</span>
                </div>
              </div>

              <h1
                className="mt-4 font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
                style={{ fontSize: 'clamp(2.25rem, 4.1vw, 3.65rem)', textWrap: 'balance' }}
              >
                A marketplace for Idea Givers and Idea Takers.
              </h1>

              <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Where researchers, operators, and creative thinkers publish vetted product concepts,
                distribution edges, and content formats—and founders, builders, and studios license,
                unlock, or co-build them into shipped ventures.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExploreFeed}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-700 dark:bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onStartSubmit}
                  className="inline-flex h-11 items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Submit an Idea
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {totalIdeas}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Vetted Ideas Listed
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {premiumIdeasCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Premium Blueprints
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {totalProposals}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Active Collaborations
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  4
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Deal Structures
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Studio Photography */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              {!heroImgFailed ? (
                <img
                  src="/src/assets/images/hero_creator_atelier_1794712092897.jpg"
                  alt="Idea Adda creator atelier with product sketches and venture blueprints"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-slate-100 via-slate-200 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 p-6">
                  <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    Idea Adda Studio
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Structured briefs, masked IP blueprints, and transparent creator terms.
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5">
                <p className="text-xs font-medium text-slate-200">
                  Idea Givers publish briefs · Idea Takers unlock execution &amp; pitch terms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
