import React from "react";

export default function ToothOrbitalBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Outer Concentric Glow & Rings */}
      <div className="relative size-36 sm:size-44 rounded-full bg-white p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-200/90 flex items-center justify-center">
        {/* Inner concentric ring */}
        <div className="relative size-full rounded-full bg-gradient-to-b from-slate-50 to-teal-50/40 border border-slate-200/80 flex items-center justify-center p-3 overflow-hidden shadow-inner">
          {/* Orbital cyan ring swoosh */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="toothGradient" x1="50" y1="20" x2="150" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#F1F5F9" />
                <stop offset="65%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
              <linearGradient id="orbitalRing1" x1="20" y1="70" x2="180" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#0D9488" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="orbitalRing2" x1="180" y1="75" x2="20" y2="125" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0D9488" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
              <filter id="toothGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Orbital Ring (Back half) */}
            <path
              d="M 28 100 C 28 72 172 65 172 98"
              stroke="url(#orbitalRing1)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.6"
            />

            {/* 3D Anatomical Tooth Body */}
            <g filter="url(#toothGlow)">
              {/* Tooth Crown & Roots */}
              <path
                d="M 68 46 
                   C 60 46, 52 54, 50 68 
                   C 48 84, 52 102, 58 116 
                   C 63 128, 70 148, 74 165
                   C 76 172, 82 174, 85 168
                   C 89 158, 92 136, 96 122
                   C 98 115, 102 115, 104 122
                   C 108 136, 111 158, 115 168
                   C 118 174, 124 172, 126 165
                   C 130 148, 137 128, 142 116
                   C 148 102, 152 84, 150 68
                   C 148 54, 140 46, 132 46
                   C 120 46, 112 52, 100 52
                   C 88 52, 80 46, 68 46 Z"
                fill="url(#toothGradient)"
                stroke="#94A3B8"
                strokeWidth="2"
              />

              {/* Enamel Highlight Glare */}
              <path
                d="M 64 54 C 58 62, 58 76, 62 88 C 64 80, 68 64, 78 58 C 72 56, 68 54, 64 54 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />

              {/* Secondary Root Shadow */}
              <path
                d="M 98 116 C 96 130, 93 148, 88 160 C 92 150, 96 130, 98 120 Z"
                fill="#94A3B8"
                opacity="0.5"
              />
            </g>

            {/* Foreground Orbital Swoosh (Front half - crossing in front of tooth) */}
            <path
              d="M 172 100 C 172 126, 28 132, 28 102"
              stroke="url(#orbitalRing2)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Tiny accent spark on the orbit */}
            <circle cx="160" cy="108" r="3" fill="#38BDF8" className="animate-pulse" />
            <circle cx="42" cy="118" r="2.5" fill="#0D9488" />
          </svg>
        </div>
      </div>

      {/* Vertical Pointer Line Dropping Down */}
      <div className="w-px h-10 sm:h-12 bg-slate-400/80 my-1" />

      {/* Caption under the badge */}
      <p className="text-[11px] sm:text-xs text-slate-600 font-medium tracking-tight text-center max-w-[210px] leading-tight bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
        We believe the world revolves around your oral health.
      </p>
    </div>
  );
}

