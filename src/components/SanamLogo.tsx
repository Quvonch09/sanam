"use client";

import React from 'react';

interface SanamLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  isDarkMode?: boolean;
}

export const SanamLogo: React.FC<SanamLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  isDarkMode = false,
}) => {
  const dimensions = {
    sm: { width: 38, height: 38, textClass: 'text-[11px]' },
    md: { width: 48, height: 48, textClass: 'text-xs' },
    lg: { width: 60, height: 60, textClass: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Circle Logo */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={isDarkMode ? '#0F172A' : '#1E1A5B'}
          stroke="#FFC107"
          strokeWidth="3"
        />

        {/* Outer Concentric Ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Top Arc Curved Text "GARMENT FACTORY" */}
        <path id="topArcPath" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
        <text fill="#FFC107" fontSize="7.5" fontWeight="900" letterSpacing="0.8">
          <textPath href="#topArcPath" startOffset="50%" textAnchor="middle">
            GARMENT FACTORY
          </textPath>
        </text>

        {/* Center Sewing Machine Silhouette */}
        <g transform="translate(26, 26) scale(0.48)">
          <path
            d="M 12 55 L 12 25 C 12 18, 20 12, 35 12 L 75 12 C 85 12, 88 20, 88 30 L 88 55 Z"
            fill="#FFFFFF"
          />
          <circle cx="82" cy="30" r="10" fill="#FFC107" />
          <line x1="82" y1="20" x2="82" y2="40" stroke="#1E1A5B" strokeWidth="2.5" />
          <line x1="72" y1="30" x2="92" y2="30" stroke="#1E1A5B" strokeWidth="2.5" />
          <rect x="25" y="55" width="6" height="15" fill="#FFFFFF" />
          <polygon points="28,70 24,78 32,78" fill="#FFC107" />
          <rect x="5" y="78" width="90" height="7" rx="3.5" fill="#FFC107" />
        </g>

        {/* Bottom Banner Ribbon with SANAM */}
        <path
          d="M 15 72 L 85 72 L 78 86 L 22 86 Z"
          fill={isDarkMode ? '#FFC107' : '#1E1A5B'}
          stroke={isDarkMode ? '#FFFFFF' : '#FFC107'}
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="82"
          fill={isDarkMode ? '#1E1A5B' : '#FFFFFF'}
          fontSize="11"
          fontWeight="900"
          letterSpacing="2"
          textAnchor="middle"
        >
          SANAM
        </text>
      </svg>

      {/* Brand Text - "Qarshi" text removed as requested */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight leading-none ${dimensions.textClass} ${
                isDarkMode ? 'text-white' : 'text-[#1E1A5B]'
              }`}
            >
              SANAM
            </span>
            <span className="bg-[#FFC107] text-[#1E1A5B] font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase leading-none shadow-sm">
              OFFICIAL
            </span>
          </div>
          <span
            className={`text-[9px] font-mono font-bold tracking-wider leading-tight uppercase ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            GARMENT FACTORY
          </span>
        </div>
      )}
    </div>
  );
};
