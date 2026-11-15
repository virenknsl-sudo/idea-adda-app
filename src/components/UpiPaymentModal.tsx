import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CreditPack, CreditPurchaseRequest, UserProfile } from '../types/marketplace';
import { buildUpiIntentUrl, CREATOR_UPI_ID } from '../utils/marketplaceLogic';

interface UpiPaymentModalProps {
  pack: CreditPack | null;
  user: UserProfile | null;
  onClose: () => void;
  onSubmitUtr: (pack: CreditPack, utr: string) => Promise<{ ok: boolean; error?: string }>;
}

const FAMPAY_QR_IMAGE =
  '/assets/aistudio/Screenshot_2026-11-15-09-52-30-75_ba41e9a642e6e0e2b03656bfbbffd6e4_38b39fcf.jpg';

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  pack,
  user,
  onClose,
  onSubmitUtr,
}) => {
  const [utr, setUtr] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<{
    utr: string;
    credits: number;
    priceLabel: string;
    packType: CreditPack['packType'];
  } | null>(null);

  useEffect(() => {
    setUtr('');
    setError('');
    setCopied(false);
    setSubmittedRequest(null);
  }, [pack?.id]);

  if (!pack || !user) return null;

  const upiIntentUrl = buildUpiIntentUrl(pack);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await onSubmitUtr(pack, utr);
      if (!res.ok) {
        setError(res.error ?? 'Enter a valid 12-digit UTR.');
        return;
      }
      setError('');
      setSubmittedRequest({
        utr: utr.trim(),
        credits: pack.credits,
        priceLabel: pack.priceLabel,
        packType: pack.packType,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-modal-title"
    >
      <div className="my-6 w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151E] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Manual FamPay / UPI Verification · Viren Dev Labs
            </p>
            <h2
              id="upi-modal-title"
              className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white"
            >
              {pack.packType === 'pro'
                ? `Pro Tier + ${pack.credits} Bonus Credits (${pack.priceLabel})`
                : `Buy ${pack.credits} Unlock Credits (${pack.priceLabel})`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close UPI payment dialog"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[78vh] overflow-y-auto p-5 sm:p-6">
          {submittedRequest ? (
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Status: Pending Verification
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900 dark:text-white">
                  UTR Reference Recorded
                </h3>
                <p
                  role="status"
                  className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  Payment submitted successfully! Your UTR is under review. Credits will be added
                  after manual verification by the creator.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Pack Selected</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                    {submittedRequest.credits} Credits ({submittedRequest.priceLabel})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">12-Digit UTR</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                    {submittedRequest.utr}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Account Balance</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {user.credits} Credits (unchanged until approved)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-10 w-full rounded-lg bg-slate-900 dark:bg-white text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Done &amp; View Request Status
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Step 1: QR Code + UPI ID + Pay Intent Button */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C0F16] p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* QR Code Container cropped cleanly to Viren's FamPay QR */}
                  <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-[#141414]">
                    {!qrFailed ? (
                      <img
                        src={FAMPAY_QR_IMAGE}
                        alt="FamPay UPI QR Code for 8930773885@fam"
                        onError={() => setQrFailed(true)}
                        className="h-full w-full object-cover object-[50%_36%] scale-[1.38]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-slate-300">
                        <QrCode className="h-10 w-10" aria-hidden="true" />
                        <span className="font-mono text-[11px]">{CREATOR_UPI_ID}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        1. Scan QR or Pay via UPI
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        Scan using FamPay, Google Pay, PhonePe, or Paytm and send{' '}
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {pack.priceLabel}
                        </span>
                        .
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11151E] px-3 py-2">
                      <div className="min-w-0 text-left">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                          Creator FamPay UPI ID
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white select-all">
                          {CREATOR_UPI_ID}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        aria-label="Copy creator FamPay UPI ID"
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <a
                      href={upiIntentUrl}
                      className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-700 dark:bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors"
                    >
                      <span>Pay via UPI App</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2: 12-Digit UTR Submission Form */}
              <form onSubmit={handleConfirmPayment} className="space-y-3.5" noValidate>
                <div>
                  <label
                    htmlFor="upi-utr-input"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    2. Enter 12-Digit UPI Transaction Reference ID (UTR)
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Find the 12-digit UTR / Ref No. in your FamPay, GPay, PhonePe, or Paytm payment
                    receipt.
                  </p>
                  <input
                    id="upi-utr-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    value={utr}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setUtr(digitsOnly);
                      if (error) setError('');
                    }}
                    placeholder="e.g., 431982047112"
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090B10] px-3.5 font-mono text-sm tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                  {error && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <span>
                    Credits are released after manual verification by Viren (no instant auto-credit).
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-10 rounded-lg bg-slate-900 dark:bg-white px-5 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
