"use client";

import React, { useState } from 'react';
import { useApp, ProductItem } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import { Eye, Shirt, Scissors, Factory, Sparkles, Layers, X } from '@/components/Icons';

interface ProductionGalleryProps {
  currentLang: Language;
  onOpenCalculator: () => void;
}

export const ProductionGallery: React.FC<ProductionGalleryProps> = ({
  currentLang,
  onOpenCalculator,
}) => {
  const { products, categories, isDarkMode } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<ProductItem | null>(null);

  const t = translations[currentLang].products;

  const filteredItems =
    activeCategory === 'all'
      ? products
      : products.filter((item) => item.category === activeCategory);

  const getCardIcon = (category: string) => {
    switch (category) {
      case 'workshop':
        return <Factory className="w-8 h-8 text-[#FFC107]" />;
      case 'uniforms':
        return <Scissors className="w-8 h-8 text-[#FFC107]" />;
      case 'fashion':
        return <Shirt className="w-8 h-8 text-[#FFC107]" />;
      default:
        return <Layers className="w-8 h-8 text-[#FFC107]" />;
    }
  };

  const getTranslatedCategoryLabel = (key: string, defaultLabel: string) => {
    const mapped = (t.categories as Record<string, string>)[key];
    return mapped || defaultLabel;
  };

  const getTranslatedBadge = (badge?: string) => {
    if (!badge) return 'SANAM GARMENT';
    const lower = badge.toLowerCase();
    if (lower.includes('top')) return t.badges.top;
    if (lower.includes('mustahkam') || lower.includes('прочн') || lower.includes('durable')) return t.badges.sturdy;
    if (lower.includes('paxta') || lower.includes('хлопок') || lower.includes('cotton')) return t.badges.cotton100;
    if (lower.includes('korporativ') || lower.includes('корпоратив') || lower.includes('corporate')) return t.badges.corp;
    if (lower.includes('sport')) return t.badges.sport;
    if (lower.includes('to‘qimachilik') || lower.includes('текстиль') || lower.includes('textile')) return t.badges.textile;
    return badge;
  };

  return (
    <section id="products" className={`py-16 sm:py-24 transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className={`text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block ${isDarkMode ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'text-[#1E1A5B] bg-[#1E1A5B]/10'}`}>
            {t.badge}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
            {t.title}
          </h2>
          <p className={`text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Dynamic Category Filters (Translated) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeCategory === 'all'
                ? 'bg-[#FFC107] text-[#1E1A5B] shadow-md'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {t.categories.all} ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#1E1A5B] text-white shadow-md'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {getTranslatedCategoryLabel(cat.key, cat.label)}
            </button>
          ))}
        </div>

        {/* Dynamic Products Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col group ${
                isDarkMode
                  ? 'bg-slate-800/80 border-slate-700 shadow-lg hover:border-slate-600'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              {/* Card Banner / Image Display */}
              <div className="relative h-56 bg-gradient-to-br from-[#1E1A5B] to-[#13103D] p-5 flex flex-col justify-between overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFC107_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 flex items-center justify-center my-auto">
                      <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                        {getCardIcon(item.category)}
                      </div>
                    </div>
                  </>
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E1A5B] bg-[#FFC107] px-2.5 py-1 rounded-md shadow">
                    {getTranslatedBadge(item.badge)}
                  </span>
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-md transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Product Specifications */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      Model: {item.model}
                    </span>
                    <h3 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
                      {item.name}
                    </h3>
                  </div>

                  <div className={`space-y-1.5 text-xs p-3 rounded-xl border font-medium ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                  }`}>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{t.sizeLabel}:</span>
                      <span className="font-extrabold">{item.sizes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{t.materialLabel}:</span>
                      <span className="font-extrabold">{item.material}</span>
                    </div>
                    <div className={`flex justify-between pt-1 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{t.priceLabel}:</span>
                      <span className="font-black text-[#FFC107]">{item.price}</span>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <span className="text-[11px] font-semibold flex items-center gap-1 text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
                    <span>SANAM Factory</span>
                  </span>

                  <button
                    onClick={onOpenCalculator}
                    className="text-xs font-extrabold text-[#FFC107] hover:underline underline-offset-4"
                  >
                    {t.priceLabel} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Product Details Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  MODEL: {selectedImage.model}
                </span>
                <h3 className="text-xl font-extrabold text-[#FFC107]">
                  {selectedImage.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedImage.imageUrl ? (
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                className="w-full h-56 object-cover rounded-2xl border border-slate-700"
              />
            ) : (
              <div className="h-44 bg-gradient-to-tr from-[#1E1A5B] to-[#13103D] rounded-2xl p-6 flex flex-col items-center justify-center text-white text-center space-y-3">
                {getCardIcon(selectedImage.category)}
                <div className="text-lg font-bold text-[#FFC107]">SANAM OFFICIAL</div>
              </div>
            )}

            <div className="space-y-2 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-xs font-semibold">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="font-extrabold">{selectedImage.model}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.sizeLabel}:</span>
                <span className="font-extrabold">{selectedImage.sizes}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.materialLabel}:</span>
                <span className="font-extrabold">{selectedImage.material}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-slate-200 dark:border-slate-700 text-[#FFC107]">
                <span>{t.priceLabel}:</span>
                <span className="font-black">{selectedImage.price}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {selectedImage.desc}
            </p>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  onOpenCalculator();
                }}
                className="flex-1 py-3 text-xs font-extrabold text-[#1E1A5B] bg-[#FFC107] hover:bg-amber-400 rounded-xl shadow"
              >
                {t.priceLabel}
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-5 py-3 text-xs font-bold text-slate-300 bg-slate-800 rounded-xl"
              >
                {translations[currentLang].modal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
