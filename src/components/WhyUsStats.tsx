"use client";

import React from 'react';
import { Language, translations } from '../data/translations';
import { Star, Clock, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface WhyUsStatsProps {
  currentLang: Language;
}

export const WhyUsStats: React.FC<WhyUsStatsProps> = ({ currentLang }) => {
  const t = translations[currentLang].whyUs;

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-[#1E1A5B] text-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFC107_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFC107] bg-white/10 px-3.5 py-1.5 rounded-full inline-block border border-white/10">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-300 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Main Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {t.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group text-center space-y-2"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FFC107] group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                {stat.label}
              </div>
              <div className="text-xs text-slate-300 font-normal">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* 3 Value Reasons Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/10">
          {t.reasons.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="p-3 rounded-xl bg-[#FFC107] text-[#1E1A5B] font-extrabold flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {reason.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Yirik Hamkorlarimiz va Buyurtmachilarimiz */}
        {t.partnersList && (
          <div className="pt-12 border-t border-white/10 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-white tracking-wide">
                {t.partnersTitle}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                {currentLang === 'uz' 
                  ? "Sanam tikuvchilik fabrikasi tomonidan maxsus va korporativ ishchi kiyimlari tikib berilgan yirik korxonalar"
                  : currentLang === 'ru'
                  ? "Крупные предприятия, для которых швейная фабрика Sanam сшила специальную рабочую одежду"
                  : "Major enterprises for which Sanam Garment Factory has manufactured specialized workwear"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.partnersList.map((partner: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 hover:bg-white/10 hover:border-[#FFC107]/40 transition-all duration-300 relative overflow-hidden group text-left"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFC107]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-md border border-[#FFC107]/20">
                      {partner.project}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white tracking-tight">
                    {partner.name}
                  </h4>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {partner.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
