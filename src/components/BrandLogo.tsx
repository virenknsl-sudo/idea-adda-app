import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  showSubtext?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  compact = false,
  showSubtext = true,
}) => {
  return (
    <span className="inline-flex items-center gap-2.5 shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="none"
        aria-hidden="true"
        className={`${compact ? 'h-8 w-8' : 'h-9 w-9'} shrink-0 rounded-lg shadow-xs`}
      >
        <defs>
          <linearGradient id="navIaBg" x1="32" y1="24" x2="480" y2="488" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="52%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0B1120" />
          </linearGradient>
          <linearGradient id="navIaGold" x1="176" y1="96" x2="336" y2="332" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="112" fill="url(#navIaBg)" />
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
          fill="url(#navIaGold)"
        />
        <rect x="210" y="372" width="92" height="18" rx="9" fill="#FFFFFF" fillOpacity="0.95" />
        <rect x="226" y="404" width="60" height="16" rx="8" fill="#93C5FD" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Idea Adda
        </span>
        {showSubtext && (
          <span className="mt-0.5 text-[10px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Viren Dev Labs
          </span>
        )}
      </span>
    </span>
  );
};
