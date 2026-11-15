import React from 'react';
import { AppView } from '../types/marketplace';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090B10]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Idea Adda
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              A Viren Dev Labs marketplace connecting Idea Givers and Idea Takers.
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Explore Ideas
            </button>
            <button
              type="button"
              onClick={() => onNavigate('submit')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Submit Idea
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collaborate')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Collaborate
            </button>
            <button
              type="button"
              onClick={() => onNavigate('plans')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Plans &amp; Credits
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Viren Dev Labs. All rights reserved.</p>
          <p>Built for founders, builders, and independent thinkers.</p>
        </div>
      </div>
    </footer>
  );
};
