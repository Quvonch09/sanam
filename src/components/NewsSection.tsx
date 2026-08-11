"use client";

import React, { useState } from 'react';
import { useApp, NewsItem } from '@/context/AppContext';
import { Language, translations } from '@/data/translations';
import { Calendar, ArrowRight, X } from '@/components/Icons';

interface NewsSectionProps {
  currentLang: Language;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ currentLang }) => {
  const { newsList, isDarkMode } = useApp();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const t = translations[currentLang].news;

  if (!newsList || newsList.length === 0) return null;

  return (
    <section id="news" className={`py-16 sm:py-24 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <article
              key={item.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="p-6 space-y-4">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover rounded-2xl border border-slate-800" />
                ) : item.videoUrl ? (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <video src={item.videoUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="p-3.5 rounded-full bg-black/70 text-[#FFC107] text-sm font-bold shadow-md hover:scale-110 transition-transform">▶</span>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-md bg-[#FFC107] text-[#1E1A5B] font-extrabold uppercase text-[10px]">
                    {item.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className={`text-lg font-extrabold transition-colors line-clamp-2 ${
                  isDarkMode ? 'text-white group-hover:text-[#FFC107]' : 'text-[#1E1A5B] group-hover:text-blue-900'
                }`}>
                  {item.title}
                </h3>

                <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.summary}
                </p>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedNews(item)}
                  className="w-full py-3 text-xs font-extrabold text-[#1E1A5B] bg-[#FFC107] hover:bg-amber-400 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <span>{t.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFC107] text-[#1E1A5B]">
                  {selectedNews.category}
                </span>
                <span className="text-xs text-slate-400 font-mono ml-2">{selectedNews.date}</span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#FFC107]">{selectedNews.title}</h3>

            {/* News Media Area */}
            <div className="space-y-4">
              {selectedNews.imageUrl && (
                <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-60 object-cover rounded-2xl border border-slate-700" />
              )}
              {selectedNews.videoUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                  <video src={selectedNews.videoUrl} controls className="w-full max-h-80 mx-auto object-contain" />
                </div>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {selectedNews.content}
            </p>

            <div className="pt-4 text-right">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
