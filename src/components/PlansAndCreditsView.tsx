import React, { useState } from 'react';
import { Check, CheckCircle2, Clock, ShieldCheck, XCircle } from 'lucide-react';
import {
  CreditPack,
  CreditPurchaseRequest,
  SubscriptionTier,
  UserProfile,
} from '../types/marketplace';
import {
  CREDIT_PACKS,
  CREATOR_UPI_ID,
  isAdminUser,
  PRO_TIER_PASS,
} from '../utils/marketplaceLogic';
import { UpiPaymentModal } from './UpiPaymentModal';

interface PlansAndCreditsViewProps {
  user: UserProfile | null;
  paymentRequests: CreditPurchaseRequest[];
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onSubmitUtrPayment: (pack: CreditPack, utr: string) => Promise<{ ok: boolean; error?: string }>;
}

const TIER_COMPARISON = [
  {
    feature: 'Browse Marketplace & Open Briefs',
    free: 'Unlimited',
    pro: 'Unlimited',
  },
  {
    feature: 'Submit & Publish Ideas',
    free: 'Unlimited briefs',
    pro: 'Unlimited + Priority Placement',
  },
  {
    feature: 'Premium Masked Blueprints',
    free: 'Unlock per idea using Credits',
    pro: 'Unlimited Instant Access',
  },
  {
    feature: 'Starter & Bonus Credits',
    free: '5 Starter Credits on Sign-up',
    pro: '25 Bonus Credits included',
  },
  {
    feature: 'Collaboration Proposals',
    free: 'Pitch any open brief',
    pro: 'Unlimited + Pro Verified Badge',
  },
];

export const PlansAndCreditsView: React.FC<PlansAndCreditsViewProps> = ({
  user,
  paymentRequests,
  onOpenAuth,
  onOpenAdmin,
  onSubmitUtrPayment,
}) => {
  const [notice, setNotice] = useState<string>('');
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const adminAuthorized = isAdminUser(user);

  const handleOpenCreditModal = (pack: CreditPack) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setSelectedPack(pack);
  };

  const handleSubmitUtr = async (pack: CreditPack, utr: string) => {
    const res = await onSubmitUtrPayment(pack, utr);
    if (res.ok) {
      setNotice(
        'Payment submitted successfully! Your UTR is under review. Credits will be added after manual verification by the creator.'
      );
    }
    return res;
  };

  const userRequests = user
    ? paymentRequests.filter((r) => r.userId === user.id)
    : [];
  const pendingAdminCount = paymentRequests.filter(
    (r) => r.status === 'Pending Verification'
  ).length;

  const renderStatusBadge = (status: CreditPurchaseRequest['status']) => {
    if (status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Approved</span>
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Pending Verification</span>
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Membership &amp; Access Tiers
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transparent Tiers for Idea Givers and Builders
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Explore open briefs free forever, purchase unlock credits securely via FamPay / UPI
            verification, or upgrade to Pro for unrestricted access across the exchange.
          </p>
        </div>

        {adminAuthorized && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/50 px-4 text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Open Creator Admin ({pendingAdminCount} Pending)</span>
          </button>
        )}
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}

      {/* Two Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <section className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Free Tier
              </h2>
              {(!user || user.tier === SubscriptionTier.FREE) && (
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  {user ? 'Current Plan' : 'Included on Sign-Up'}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              For casual explorers and first-time Idea Givers
            </p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                ₹0
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Full access to all Open Briefs and community discussions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>5 starter credits included upon Google sign-up</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Publish ideas with credit masking and optional top-feed boosts</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!user) onOpenAuth();
            }}
            disabled={Boolean(user)}
            className="mt-8 h-11 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-sm font-semibold text-slate-600 dark:text-slate-300 disabled:cursor-default cursor-pointer"
          >
            {user
              ? user.tier === SubscriptionTier.FREE
                ? 'Active on Free Tier'
                : 'Included with Membership'
              : 'Get Started Free (5 Credits)'}
          </button>
        </section>

        {/* Pro Tier */}
        <section className="flex flex-col justify-between rounded-xl border border-blue-600 dark:border-blue-500 bg-white dark:bg-[#11151E] p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Pro Tier
              </h2>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                {user?.tier === SubscriptionTier.PRO
                  ? 'Active Pro Membership'
                  : 'Recommended for Builders'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              For active founders, studios, and serial Idea Takers
            </p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                ₹499
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>Unmasked access to every Premium Execution Blueprint</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>Includes 25 Bonus Credits to boost &amp; feature your own ideas</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>Unlimited idea submissions &amp; priority collaboration matching</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCreditModal(PRO_TIER_PASS)}
            disabled={user?.tier === SubscriptionTier.PRO}
            className={`mt-8 h-11 w-full rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-default ${
              user?.tier === SubscriptionTier.PRO
                ? 'bg-emerald-700 text-white'
                : 'bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-500'
            }`}
          >
            {user?.tier === SubscriptionTier.PRO
              ? 'Pro Tier Active'
              : user
              ? 'Upgrade to Pro via FamPay / UPI (₹499)'
              : 'Sign In to Upgrade to Pro'}
          </button>
        </section>
      </div>

      {/* Top-Up Credit Packs (FamPay / UPI Verification) */}
      <section aria-labelledby="credits-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="credits-heading"
              className="font-display text-xl font-bold text-slate-900 dark:text-white"
            >
              Buy Unlock Credits via FamPay / UPI
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Pay directly to{' '}
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {CREATOR_UPI_ID}
              </span>{' '}
              and submit your 12-digit UTR. Credits are released after creator verification.
            </p>
          </div>
          {user && (
            <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
              Current Balance: {user.credits} Credits
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                    {pack.credits} Credits
                  </span>
                  <span className="font-mono text-base font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                    {pack.priceLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {pack.note}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCreditModal(pack)}
                className="mt-5 h-10 w-full rounded-lg bg-slate-900 dark:bg-white text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Buy {pack.credits} Credits ({pack.priceLabel})
              </button>
            </div>
          ))}
        </div>

        {/* User's Payment Verification Requests */}
        {user && userRequests.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Your UPI Payment Submissions
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {userRequests.length} {userRequests.length === 1 ? 'request' : 'requests'}
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {userRequests.map((req) => (
                <div
                  key={req.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                      {req.packType === 'pro'
                        ? `Pro Tier + ${req.credits} Cr (${req.priceLabel})`
                        : `${req.credits} Credits (${req.priceLabel})`}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">
                      ·
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">
                      UTR: {req.utr}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">
                      ·
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>{renderStatusBadge(req.status)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Concrete Comparison Matrix */}
      <section aria-labelledby="matrix-heading" className="space-y-4">
        <h2
          id="matrix-heading"
          className="font-display text-xl font-bold text-slate-900 dark:text-white"
        >
          Feature &amp; Allowance Comparison
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3.5">Capability</th>
                <th className="px-5 py-3.5">Free Tier</th>
                <th className="px-5 py-3.5 text-blue-700 dark:text-blue-400">Pro Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {TIER_COMPARISON.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{row.free}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FamPay / UPI Verification Modal */}
      <UpiPaymentModal
        pack={selectedPack}
        user={user}
        onClose={() => setSelectedPack(null)}
        onSubmitUtr={handleSubmitUtr}
      />
    </div>
  );
};
