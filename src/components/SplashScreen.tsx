import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface SplashScreenProps {
  visible: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ visible }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="idea-adda-splash"
          data-testid="splash-screen"
          role="status"
          aria-live="polite"
          aria-label="Loading Idea Adda by Viren Dev Labs"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.02,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 px-6 text-white select-none"
        >
          {/* Ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-64 w-64 rounded-full bg-blue-600/15 blur-3xl"
          />

          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center"
          >
            {/* Glowing pulse aura behind logo */}
            <motion.div
              aria-hidden="true"
              animate={
                prefersReducedMotion
                  ? { opacity: 0.35 }
                  : { opacity: [0.28, 0.6, 0.28], scale: [0.95, 1.08, 0.95] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-blue-500/30 blur-xl"
            />

            {/* Brand Emblem SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="none"
              aria-hidden="true"
              className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl shadow-2xl shadow-blue-950/70 ring-1 ring-white/10"
            >
              <defs>
                <linearGradient
                  id="splashIaBg"
                  x1="32"
                  y1="24"
                  x2="480"
                  y2="488"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="52%" stopColor="#1D4ED8" />
                  <stop offset="100%" stopColor="#0B1120" />
                </linearGradient>
                <linearGradient
                  id="splashIaGold"
                  x1="176"
                  y1="96"
                  x2="336"
                  y2="332"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="112" fill="url(#splashIaBg)" />
              <rect
                x="14"
                y="14"
                width="484"
                height="484"
                rx="100"
                stroke="#FFFFFF"
                strokeOpacity="0.16"
                strokeWidth="6"
              />
              <path
                d="M256 92C184 92 132 144 132 214C132 260 156 296 190 322C200 330 206 340 208 354H304C306 340 312 330 322 322C356 296 380 260 380 214C380 144 328 92 256 92Z"
                fill="#090D16"
                fillOpacity="0.34"
                stroke="#BFDBFE"
                strokeOpacity="0.7"
                strokeWidth="14"
                strokeLinejoin="round"
              />
              <path
                d="M266 138L198 228H252L238 306L314 208H258L266 138Z"
                fill="url(#splashIaGold)"
              />
              <rect x="210" y="372" width="92" height="18" rx="9" fill="#FFFFFF" fillOpacity="0.95" />
              <rect x="226" y="404" width="60" height="16" rx="8" fill="#93C5FD" />
            </svg>

            <motion.h1
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
              className="mt-5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white"
            >
              Idea Adda
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22, ease: 'easeOut' }}
              className="mt-1.5 text-sm font-medium tracking-wide text-zinc-400"
            >
              Viren Dev Labs
            </motion.p>

            {/* Minimal loading track */}
            <div
              aria-hidden="true"
              className="mt-7 h-0.5 w-32 overflow-hidden rounded-full bg-zinc-800"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0.3 : 1.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: 'left' }}
                className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-amber-400"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
