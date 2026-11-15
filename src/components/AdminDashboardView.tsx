import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  CreditPurchaseRequest,
  IdeaItem,
  UserProfile,
} from '../types/marketplace';
import { CREATOR_ADMIN_EMAIL, CREATOR_UPI_ID, isAdminUser } from '../utils/marketplaceLogic';

interface AdminDashboardViewProps {
  user: UserProfile | null;
  ideas: IdeaItem[];
  paymentRequests: CreditPurchaseRequest[];
  onOpenAuth: () => void;
  onApprovePayment: (req: CreditPurchaseRequest) => Promise<{ ok: boolean; error?: string }>;
  onRejectPayment: (req: CreditPurchaseRequest) => Promise<{ ok: boolean; error?: string }>;
  onAdminBoostIdea: (idea: IdeaItem, boostCredits: number) => Promise<{ ok: boolean; error?: string }>;
  onAdminUnfeatureIdea: (idea: IdeaItem) => Promise<{ ok: boolean; error?: string }>;
  onAdminDeleteIdea: (idea: IdeaItem) => Promise<{ ok: boolean; error?: string }>;
  onInspectIdea: (idea: IdeaItem) => void;
}

type AdminTab = 'payments' | 'submissions';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  user,
  ideas,
  paymentRequests,
  onOpenAuth,
  onApprovePayment,
  onRejectPayment,
  onAdminBoostIdea,
  onAdminUnfeatureIdea,
  onAdminDeleteIdea,
  onInspectIdea,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isAdminUser(user)) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-8 text-center space-y-4">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Creator Admin Access Restricted
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This dashboard for UTR payment verification, idea moderation, and featured boosts is
            strictly restricted to the verified creator account ({CREATOR_ADMIN_EMAIL}).
          </p>
          {!user && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="mt-2 inline-flex h-10 items-center rounded-lg bg-blue-700 dark:bg-blue-600 px-5 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 cursor-pointer"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    );
  }

  const pendingRequests = paymentRequests.filter((r) => r.status === 'Pending Verification');
  const approvedRevenue = paymentRequests
    .filter((r) => r.status === 'Approved')
    .reduce((sum, r) => sum + r.amountInr, 0);
  const featuredIdeasCount = ideas.filter((i) => i.isFeatured).length;

  const filteredIdeas = ideas.filter((idea) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      idea.title.toLowerCase().includes(q) ||
      idea.authorName.toLowerCase().includes(q) ||
      idea.category.toLowerCase().includes(q)
    );
  });

  const handleApprove = async (req: CreditPurchaseRequest) => {
    setBusyId(req.id);
    const res = await onApprovePayment(req);
    setBusyId(null);
    if (res.ok) {
      setNotice({
        type: 'success',
        text: `Approved UTR ${req.utr}: released ${req.credits} credits${
          req.packType === 'pro' ? ' + Pro Tier membership' : ''
        } to ${req.userName} (${req.userEmail}).`,
      });
    } else if (res.error) {
      setNotice({ type: 'error', text: res.error });
    }
  };

  const handleReject = async (req: CreditPurchaseRequest) => {
    setBusyId(req.id);
    const res = await onRejectPayment(req);
    setBusyId(null);
    if (res.ok) {
      setNotice({
        type: 'success',
        text: `Marked UTR ${req.utr} as Rejected. No credits were released.`,
      });
    } else if (res.error) {
      setNotice({ type: 'error', text: res.error });
    }
  };

  const handleBoost = async (idea: IdeaItem, credits: number) => {
    setBusyId(idea.id);
    const res = await onAdminBoostIdea(idea, credits);
    setBusyId(null);
    if (res.ok) {
      setNotice({
        type: 'success',
        text: `Pinned "${idea.title}" to top of marketplace feed (${credits} Cr tier).`,
      });
    } else if (res.error) {
      setNotice({ type: 'error', text: res.error });
    }
  };

  const handleUnfeature = async (idea: IdeaItem) => {
    setBusyId(idea.id);
    const res = await onAdminUnfeatureIdea(idea);
    setBusyId(null);
    if (res.ok) {
      setNotice({
        type: 'success',
        text: `Removed featured pin from "${idea.title}".`,
      });
    } else if (res.error) {
      setNotice({ type: 'error', text: res.error });
    }
  };

  const handleDelete = async (idea: IdeaItem) => {
    setBusyId(idea.id);
    const res = await onAdminDeleteIdea(idea);
    setBusyId(null);
    setConfirmDeleteId(null);
    if (res.ok) {
      setNotice({
        type: 'success',
        text: `Removed "${idea.title}" from the live marketplace.`,
      });
    } else if (res.error) {
      setNotice({ type: 'error', text: res.error });
    }
  };

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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Creator Admin Console · {CREATOR_UPI_ID}</span>
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Marketplace Operations &amp; UTR Approvals
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            Verify FamPay UTRs to release credits, manage live marketplace submissions, and pin
            featured startup briefs.
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5">
          <p className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {pendingRequests.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Pending UTR Reviews</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5">
          <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            ₹{approvedRevenue.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Verified UPI Revenue</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5">
          <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {ideas.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Live Marketplace Ideas</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-5">
          <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {featuredIdeasCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Featured Pinned Briefs</p>
        </div>
      </div>

      {notice && (
        <div
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium ${
            notice.type === 'success'
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
              : 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{notice.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div role="tablist" aria-label="Admin management sections" className="flex items-center gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'payments'}
          onClick={() => setActiveTab('payments')}
          className={`h-10 rounded-lg px-4 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-[#181D29] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          UTR Payment Queue ({pendingRequests.length} Pending)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'submissions'}
          onClick={() => setActiveTab('submissions')}
          className={`h-10 rounded-lg px-4 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-[#181D29] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          Manage Submissions &amp; Boosts ({ideas.length})
        </button>
      </div>

      {activeTab === 'payments' ? (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] p-6">
          {paymentRequests.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No UTR payment submissions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Order</th>
                    <th className="py-3 pr-4">12-Digit UTR</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 text-right">Creator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {paymentRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {req.userName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {req.userEmail}
                        </p>
                      </td>
                      <td className="py-3.5 pr-4 font-mono tabular-nums text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {req.packType === 'pro'
                          ? `Pro Tier + ${req.credits} Cr`
                          : `${req.credits} Credits`}{' '}
                        · {req.priceLabel}
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                        {req.utr}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        {renderStatusBadge(req.status)}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        {req.status === 'Pending Verification' ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              disabled={busyId === req.id}
                              onClick={() => handleApprove(req)}
                              className="inline-flex h-8 items-center rounded-md bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busyId === req.id}
                              onClick={() => handleReject(req)}
                              className="inline-flex h-8 items-center rounded-md border border-slate-300 dark:border-slate-700 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter ideas by title, author, or category..."
              aria-label="Filter ideas in admin console"
              className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11151E] pl-9 pr-3 text-sm text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E]">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {idea.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/70 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                        <span aria-hidden="true">⭐</span>
                        <span>Featured ({idea.boostCredits ?? 10} Cr)</span>
                      </span>
                    )}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {idea.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{idea.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{idea.upvotes} upvotes</span>
                  </div>
                  <h3 className="mt-1 font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {idea.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {!idea.isFeatured ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === idea.id}
                        onClick={() => handleBoost(idea, 10)}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        <span>Feature</span>
                      </button>
                      <button
                        type="button"
                        disabled={busyId === idea.id}
                        onClick={() => handleBoost(idea, 15)}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-amber-500 hover:bg-amber-600 px-2.5 text-xs font-semibold text-slate-950 cursor-pointer"
                      >
                        <span>Top Pin</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === idea.id}
                      onClick={() => handleUnfeature(idea)}
                      className="inline-flex h-8 items-center rounded-md border border-slate-300 dark:border-slate-700 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Unpin
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onInspectIdea(idea)}
                    className="inline-flex h-8 items-center rounded-md border border-slate-300 dark:border-slate-700 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Inspect
                  </button>

                  {confirmDeleteId === idea.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={busyId === idea.id}
                        onClick={() => handleDelete(idea)}
                        className="inline-flex h-8 items-center rounded-md bg-red-600 px-2.5 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                      >
                        Confirm Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="inline-flex h-8 items-center rounded-md border border-slate-300 dark:border-slate-700 px-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(idea.id)}
                      aria-label={`Remove '${idea.title}'`}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-red-200 dark:border-red-900/60 px-2.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
