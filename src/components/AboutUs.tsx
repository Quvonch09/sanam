"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import { CheckCircle2 } from '@/components/Icons';

interface AboutUsProps {
  currentLang: Language;
}

export const AboutUs: React.FC<AboutUsProps> = ({ currentLang }) => {
  const { isDarkMode } = useApp();
  const t = translations[currentLang].about;

  return (
    <section id="about" className={`py-16 sm:py-24 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase Block */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`p-8 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-br from-[#1E1A5B] to-[#13103D] text-white'
            }`}>
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFC107] bg-[#FFC107]/20 px-3 py-1 rounded-full border border-[#FFC107]/30">
                  {t.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {t.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {t.description1}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#FFC107]">{t.stats.years}</div>
                    <div className="text-[11px] text-slate-300 font-semibold">{t.stats.exp}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">{t.stats.rating}</div>
                    <div className="text-[11px] text-slate-300 font-semibold">{t.stats.reviews}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className={`text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block ${
                isDarkMode ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'text-[#1E1A5B] bg-[#1E1A5B]/10'
              }`}>
                {t.badge}
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
                {t.subTitle}
              </h2>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.description2}
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {t.features.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {point}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
