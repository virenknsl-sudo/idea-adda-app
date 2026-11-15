import React, { useState } from 'react';
import { ShieldCheck, Sparkles, X } from 'lucide-react';
import { UserProfile } from '../types/marketplace';
import { DEFAULT_STARTER_CREDITS } from '../utils/marketplaceLogic';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: (role: UserProfile['role']) => Promise<{ ok: boolean; error?: string }>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onGoogleSignIn }) => {
  const [role, setRole] = useState<UserProfile['role']>('Hybrid Creator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleClick = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await onGoogleSignIn(role);
      if (result.ok) {
        onClose();
      } else if (result.error) {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Idea Adda · Viren Dev Labs
            </p>
            <h2
              id="auth-modal-title"
              className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white"
            >
              Sign in or Create Your Account
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Every new account gets an isolated creator profile and{' '}
          <span className="font-mono font-semibold text-slate-900 dark:text-white">
            {DEFAULT_STARTER_CREDITS} free starter credits
          </span>{' '}
          to unlock execution blueprints, submit ideas, and collaborate.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="auth-onboarding-role"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Choose Your Primary Marketplace Role
            </label>
            <select
              id="auth-onboarding-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserProfile['role'])}
              disabled={loading}
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            >
              <option value="Hybrid Creator">Hybrid Creator (Give &amp; Take Ideas)</option>
              <option value="Idea Giver">Idea Giver (Publish &amp; Monetize Concepts)</option>
              <option value="Idea Taker">Idea Taker (Unlock Blueprints &amp; Co-Build)</option>
            </select>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span>Includes {DEFAULT_STARTER_CREDITS} free unlock credits upon first sign-in</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Verified Google authentication with private credit &amp; UTR ledger</span>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="flex w-full h-11 items-center justify-center gap-2.5 rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 disabled:opacity-60 transition-colors cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-900"
            >
              G
            </span>
            <span>{loading ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Continue Browsing as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
