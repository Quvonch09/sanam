"use client";

import React from 'react';

interface SanamLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  isDarkMode?: boolean;
  gapColor?: string;
}

export const SanamLogo: React.FC<SanamLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  isDarkMode = false,
  gapColor,
}) => {
  const dimensions = {
    sm: { width: 38, height: 38, textClass: 'text-[11px]' },
    md: { width: 48, height: 48, textClass: 'text-xs' },
    lg: { width: 60, height: 60, textClass: 'text-sm' },
  }[size];

  // Static colors matching the uploaded logo image exactly (colors do not change based on dark/light mode)
  const primaryColor = '#1E1A5B';
  const ribbonFill = '#1E1A5B';
  const ribbonTextColor = '#FFFFFF';
  const shadowColor = '#13103D';
  const strokeColor = '#FFFFFF';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Circle Logo with white background badge to match the uploaded image exactly */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 filter drop-shadow-sm"
      >
        {/* Base white circle background matching the original image background */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#FFFFFF"
        />

        {/* Outer Concentric Circle */}
        <circle
          cx="50"
          cy="40"
          r="34"
          stroke={primaryColor}
          strokeWidth="2.5"
          fill="#FFFFFF"
        />

        {/* Inner Concentric Circle */}
        <circle
          cx="50"
          cy="40"
          r="29"
          stroke={primaryColor}
          strokeWidth="1.2"
          fill="#FFFFFF"
        />

        {/* Sewing Machine Silhouette */}
        <g>
          {/* Main Solid Body */}
          <path
            d="M 33 42.5 L 67 42.5 L 67 40 L 61 40 L 61 26 C 61 22 58 20 50 20 L 36 20 C 33 20 33 22 33 25 L 33 33 L 35 33 L 35 40 Z"
            fill={primaryColor}
          />
          {/* Spool Pin & Spool */}
          <line x1="41" y1="20" x2="41" y2="16" stroke={primaryColor} strokeWidth="1" />
          <rect x="39" y="14" width="4" height="2.5" rx="0.5" fill={primaryColor} />
          
          {/* Needle Bar & Foot */}
          <line x1="34" y1="33" x2="34" y2="39" stroke={primaryColor} strokeWidth="1" />
          
          {/* Handwheel */}
          <rect x="65" y="24" width="2.5" height="11" rx="0.8" fill={primaryColor} />
          <rect x="61" y="28.5" width="4" height="2" fill={primaryColor} />
          {/* Handwheel Spokes */}
          <path
            d="M 67.5 26.5 L 70.5 26.5 M 67.5 29.5 L 70.5 29.5 M 67.5 32.5 L 70.5 32.5"
            stroke={primaryColor}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>

        {/* "Garment Factory" Text */}
        <text
          x="50"
          y="53"
          fill={primaryColor}
          fontSize="4.8"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="sans-serif"
          letterSpacing="0.2"
        >
          Garment Factory
        </text>

        {/* Curved Banner/Ribbon at Bottom */}
        <g>
          {/* Left Wing */}
          <path
            d="M 19 65 L 10 58 L 14 65 L 7 71 L 17 73 Z"
            fill={ribbonFill}
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Right Wing */}
          <path
            d="M 81 65 L 90 58 L 86 65 L 93 71 L 83 73 Z"
            fill={ribbonFill}
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Left Fold Shadow */}
          <path
            d="M 19 65 L 17 73 L 22 79 Z"
            fill={shadowColor}
          />

          {/* Right Fold Shadow */}
          <path
            d="M 81 65 L 83 73 L 78 79 Z"
            fill={shadowColor}
          />

          {/* Main Ribbon Body */}
          <path
            d="M 19 65 Q 50 74 81 65 L 78 79 Q 50 88 22 79 Z"
            fill={ribbonFill}
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Curved Text Path for SANAM */}
          <path
            id="sanamTextPath"
            d="M 23 74 Q 50 83 77 74"
            fill="none"
          />

          {/* SANAM Text */}
          <text
            fill={ribbonTextColor}
            fontSize="8.5"
            fontWeight="900"
            letterSpacing="1.8"
            textAnchor="middle"
          >
            <textPath href="#sanamTextPath" startOffset="50%">
              SANAM
            </textPath>
          </text>
        </g>
      </svg>

      {/* Brand Text beside the Logo badge */}
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
