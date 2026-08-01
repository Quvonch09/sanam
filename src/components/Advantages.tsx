"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import { Award, ShieldCheck, Truck, ShoppingBag } from '@/components/Icons';

interface AdvantagesProps {
  currentLang: Language;
}

export const Advantages: React.FC<AdvantagesProps> = ({ currentLang }) => {
  const { isDarkMode } = useApp();
  const t = translations[currentLang].advantages;

  const items = [
    {
      icon: <Award className="w-8 h-8 text-[#FFC107]" />,
      title: t.card1.title,
      desc: t.card1.desc,
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#FFC107]" />,
      title: t.card2.title,
      desc: t.card2.desc,
    },
    {
      icon: <Truck className="w-8 h-8 text-[#FFC107]" />,
      title: t.card3.title,
      desc: t.card3.desc,
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-[#FFC107]" />,
      title: t.card4.title,
      desc: t.card4.desc,
    },
  ];

  return (
    <section className={`py-16 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-900 border-y border-slate-800 text-white' : 'bg-white border-y border-slate-100 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block ${
            isDarkMode ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'bg-[#1E1A5B]/10 text-[#1E1A5B]'
          }`}>
            {t.badge}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
            {t.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="p-3.5 rounded-2xl bg-[#1E1A5B] w-fit shadow-md">
                {item.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
