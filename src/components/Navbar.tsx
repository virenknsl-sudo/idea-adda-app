import React, { useState } from 'react';
import { Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import { AppView, SubscriptionTier, UserProfile } from '../types/marketplace';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  user: UserProfile | null;
  isAdmin: boolean;
  onOpenAuth: () => void;
  activeCreators: number;
}

const BASE_NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'submit', label: 'Submit Idea' },
  { id: 'collaborate', label: 'Collaborate' },
  { id: 'plans', label: 'Plans & Credits' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  isDark,
  onToggleTheme,
  user,
  isAdmin,
  onOpenAuth,
  activeCreators,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isAdmin
    ? [...BASE_NAV_ITEMS, { id: 'admin' as AppView, label: 'Admin' }]
    : BASE_NAV_ITEMS;

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#090B10]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 lg:gap-6 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand icon + Idea Adda (Viren Dev Labs) wordmark */}
        <a
          href="#explore"
          onClick={(e) => {
            e.preventDefault();
            handleNav('explore');
          }}
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded-lg"
        >
          <BrandLogo />
        </a>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-blue-600 dark:bg-blue-500"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Live activity indicator + Theme toggle + single primary action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            role="status"
            aria-live="polite"
            data-testid="header-active-creators"
            className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/85 dark:bg-emerald-950/35 px-2.5 py-1.5 text-xs font-medium text-emerald-900 dark:text-emerald-200 whitespace-nowrap shrink-0"
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

          <PWAInstallButton />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && (
                <span
                  data-testid="header-owner-badge"
                  className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-lg border border-amber-400/70 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/45 px-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap shrink-0"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>Owner / Admin</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  activeView === 'profile'
                    ? 'bg-blue-700 dark:bg-blue-600 text-white'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                }`}
              >
                <span className="max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                <span aria-hidden="true" className="opacity-50">
                  ·
                </span>
                <span className="font-mono text-xs tabular-nums">
                  {isAdmin
                    ? '∞ Unlimited'
                    : user.tier === SubscriptionTier.PRO
                      ? 'PRO'
                      : `${user.credits} Cr`}
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex h-10 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090B10] px-4 py-3 space-y-1"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {user && (
            <button
              type="button"
              onClick={() => handleNav('profile')}
              className={`flex w-full items-center justify-between gap-2 text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'profile'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <span>
                My Profile (
                {isAdmin
                  ? '∞ Unlimited'
                  : user.tier === SubscriptionTier.PRO
                    ? 'Pro'
                    : `${user.credits} Credits`}
                )
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/70 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/45 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                  Owner / Admin
                </span>
              )}
            </button>
          )}
        </nav>
      )}
    </header>
  );
};
