"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '@/data/translations';
import { ShieldCheck } from '@/components/Icons';

interface TeamSectionProps {
  currentLang: Language;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ currentLang }) => {
  const { teamList, isDarkMode } = useApp();
  const t = translations[currentLang].team;

  if (!teamList || teamList.length === 0) return null;

  const getTranslatedRole = (role: string) => {
    const lower = role.toLowerCase().trim();
    // Exact short keys (used by new members)
    if (lower === 'supply') return t.roles.supplyHead;
    if (lower === 'production') return t.roles.prodHead;
    if (lower === 'hr') return t.roles.hrHead;
    if (lower === 'pr') return t.roles.pr;
    if (lower === 'inspector') return t.roles.inspector;
    // Legacy Cyrillic / full-text patterns
    if (lower.includes('директор') || lower.includes('director')) return t.roles.director;
    if (lower.includes('кадрлар') || lower.includes('кадров')) return t.roles.hrHead;
    if (lower.includes('ишлаб чикариш') || lower.includes('производственного')) return t.roles.prodHead;
    if (lower.includes('таъминот') || lower.includes('снабжения')) return t.roles.supplyHead;
    if (lower.includes('бригада') || lower.includes('мастера') || lower.includes('master')) return t.roles.masters;
    if (lower.includes('тажриба') || lower.includes('экспериментального') || lower.includes('exp')) return t.roles.expHead;
    return role;
  };

  return (
    <section id="team" className={`py-16 sm:py-24 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className={`text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block ${
            isDarkMode ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'text-[#1E1A5B] bg-[#1E1A5B]/10'
          }`}>
            {t.badge}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
            {t.title}
          </h2>
          <p className={`text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamList.map((member) => (
            <div
              key={member.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex items-center gap-5 group ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              {/* Member Photo or Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1E1A5B] to-[#13103D] text-white flex-shrink-0 flex items-center justify-center font-black text-2xl shadow-md overflow-hidden relative">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span>{member.name.charAt(0)}</span>
                )}
              </div>

              {/* Member Info */}
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E1A5B] bg-[#FFC107] px-2.5 py-0.5 rounded-md inline-block">
                  {getTranslatedRole(member.role)}
                </span>
                <h3 className={`text-base font-extrabold transition-colors leading-tight ${
                  isDarkMode ? 'text-white group-hover:text-[#FFC107]' : 'text-[#1E1A5B] group-hover:text-blue-900'
                }`}>
                  {member.name}
                </h3>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.verified}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
