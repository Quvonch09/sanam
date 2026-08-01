"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import {
  MapPin,
  ShoppingBag,
  Truck,
  Car,
  Star,
  ArrowRight,
  ShieldCheck,
  Award,
} from '@/components/Icons';

interface HeroProps {
  currentLang: Language;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onOpenCalculator }) => {
  const { isDarkMode } = useApp();
  const t = translations[currentLang].hero;

  return (
    <section
      id="hero"
      className={`relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-white'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900'
      }`}
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#1E1A5B]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#FFC107]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Location Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#1E1A5B]/10 dark:bg-[#FFC107]/10 text-[#1E1A5B] dark:text-[#FFC107] border border-[#1E1A5B]/20 dark:border-[#FFC107]/30 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>{t.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {t.title}{' '}
              <span className="text-[#FFC107] block lg:inline-block">
                {t.brandName}
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-base sm:text-lg font-medium max-w-2xl mx-auto lg:mx-0 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {t.subtitle}
            </p>

            {/* Services Tags */}
            <div className="pt-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                {t.servicesPill}
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span>{t.service1}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Car className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span>{t.service2}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Truck className="w-3.5 h-3.5 text-[#FFC107]" />
                  <span>{t.service3}</span>
                </div>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>{t.ctaOrder}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://maps.google.com/?q=RQWW%2BJ4+Qarshi"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-extrabold text-sm border transition-all flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-md'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#FFC107]" />
                <span>{t.ctaMap}</span>
              </a>
            </div>

            {/* Google Rating Badge */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#FFC107]" />
                ))}
              </div>
              <span className="text-xs font-black tracking-wide">
                {t.ratingBadge}
              </span>
              <span className="text-slate-400 text-xs italic hidden sm:inline">
                {t.quoteHighlight}
              </span>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 relative overflow-hidden ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-800 text-white'
                : 'bg-gradient-to-br from-[#1E1A5B] to-[#13103D] text-white'
            }`}>
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t.openBadge}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#FFC107]">
                  SANAM OFFICIAL
                </span>
              </div>

              {/* Graphic Icon Display */}
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-4 backdrop-blur-md shadow-inner">
                  <svg className="w-16 h-16 text-[#FFC107]" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 3" />
                    <rect x="25" y="42" width="50" height="25" rx="3" fill="currentColor" />
                    <circle cx="75" cy="54" r="7" fill="#1E1A5B" />
                    <rect x="30" y="32" width="4" height="10" fill="currentColor" />
                    <rect x="25" y="67" width="50" height="4" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{t.heroCardTitle}</h3>
                  <p className="text-xs text-slate-300 mt-1">{t.heroCardAddress}</p>
                </div>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div className="font-extrabold text-white">{t.quality100}</div>
                  <div className="text-[10px] text-slate-300">{t.qualityGuarantee}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
                  <Award className="w-4 h-4 text-[#FFC107]" />
                  <div className="font-extrabold text-white">{t.wholesalePrice}</div>
                  <div className="text-[10px] text-slate-300">{t.directFactory}</div>
                </div>
              </div>

              {/* Calculator Launcher CTA */}
              <button
                onClick={onOpenCalculator}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all text-center"
              >
                {t.calcEstimateBtn}
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
