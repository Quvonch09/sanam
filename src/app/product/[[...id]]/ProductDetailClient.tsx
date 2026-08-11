"use client";

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OrderCalculatorModal } from '@/components/OrderCalculatorModal';
import { Factory, Scissors, Shirt, Layers } from '@/components/Icons';
import { slugify } from '@/utils/slugify';
import { translations } from '@/data/translations';
import { ArrowLeft, Copy, Check, Sparkles, Share2 } from 'lucide-react';

function ProductDetailContent() {
  const { products, isDarkMode, currentLang, setLanguage } = useApp();
  const [slug, setSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Client side routing check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      const searchParams = new URLSearchParams(window.location.search);
      const queryId = searchParams.get('id') || searchParams.get('slug');

      if (queryId) {
        setSlug(queryId);
      } else if (lastPart && lastPart !== 'product') {
        setSlug(decodeURIComponent(lastPart));
      }
    }
  }, []);

  const product = products.find(
    (p) => p.id === slug || slugify(p.name) === slug || slugify(p.model) === slug
  );

  const [activeImg, setActiveImg] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImg(product.imageUrl || '');
    }
  }, [product]);

  const getCardIcon = (category: string) => {
    switch (category) {
      case 'workshop':
        return <Factory className="w-12 h-12 text-[#FFC107]" />;
      case 'uniforms':
        return <Scissors className="w-12 h-12 text-[#FFC107]" />;
      case 'fashion':
        return <Shirt className="w-12 h-12 text-[#FFC107]" />;
      default:
        return <Layers className="w-12 h-12 text-[#FFC107]" />;
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: product?.name || 'SANAM Product',
        text: product?.desc || 'Sanam tikuvchilik fabrikasi mahsuloti',
        url: window.location.href,
      }).catch((err) => console.log(err));
    } else {
      handleCopyLink();
    }
  };

  // Safe translations lookup with fallbacks
  const tDetail = (translations[currentLang] as any).productDetail || {
    backToHome: currentLang === 'ru' ? 'Вернуться на главную' : currentLang === 'en' ? 'Back to Homepage' : 'Bosh sahifaga qaytish',
    notFound: currentLang === 'ru' ? 'Товар не найден' : currentLang === 'en' ? 'Product Not Found' : 'Mahsulot topilmadi',
    notFoundDesc: currentLang === 'ru' ? 'К сожалению, запрашиваемый товар не существует.' : currentLang === 'en' ? 'Sorry, the product you are looking for does not exist.' : 'Kechirasiz, siz qidirayotgan mahsulot mavjud emas.',
    orderNow: currentLang === 'ru' ? 'Заказать / Рассчитать смету' : currentLang === 'en' ? 'Order Now / Calculate' : 'Buyurtma berish / Smetani hisoblash',
    model: currentLang === 'ru' ? 'Модель' : currentLang === 'en' ? 'Model' : 'Model',
    sizes: currentLang === 'ru' ? 'Размеры' : currentLang === 'en' ? 'Sizes' : 'Razmerlari',
    material: currentLang === 'ru' ? 'Материал' : currentLang === 'en' ? 'Material' : 'Material turi',
    price: currentLang === 'ru' ? 'Цена' : currentLang === 'en' ? 'Price' : 'Narxi',
    specification: currentLang === 'ru' ? 'Описание товара' : currentLang === 'en' ? 'Product Description' : 'Mahsulot tavsifi',
    copyLink: currentLang === 'ru' ? 'Копировать ссылку' : currentLang === 'en' ? 'Copy Link' : 'Havolani nusxalash',
    copied: currentLang === 'ru' ? 'Скопировано!' : currentLang === 'en' ? 'Copied!' : 'Nusxalandi!',
  };

  // Wait for client check
  if (slug === null) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC107]"></div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Header
          currentLang={currentLang}
          onLanguageChange={setLanguage}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenContact={() => { window.location.href = '/#contact'; }}
        />
        <main className="flex-grow flex items-center justify-center px-4 py-32">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex p-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
              <Layers className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-black">{tDetail.notFound}</h1>
            <p className="text-slate-400 text-sm">{tDetail.notFoundDesc}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] font-extrabold text-sm rounded-xl transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{tDetail.backToHome}</span>
            </a>
          </div>
        </main>
        <Footer currentLang={currentLang} />
        <OrderCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} currentLang={currentLang} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setLanguage}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenContact={() => { window.location.href = '/#contact'; }}
      />

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors border ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{tDetail.backToHome}</span>
          </a>
        </div>

        {/* Product Card Container */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
            {/* Left Column: Image Area */}
            <div className="flex flex-col gap-4">
              {activeImg ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner group bg-slate-950">
                  <img
                    src={activeImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider text-[#1E1A5B] bg-[#FFC107] px-3 py-1.5 rounded-md shadow">
                      {product.badge}
                    </span>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-tr from-[#1E1A5B] to-[#13103D] rounded-2xl p-8 flex flex-col items-center justify-center text-white text-center space-y-4">
                  {getCardIcon(product.category)}
                  <div className="text-xl font-bold text-[#FFC107]">SANAM OFFICIAL</div>
                  <span className="text-[10px] text-slate-400">PRODUCT IMAGE</span>
                </div>
              )}

              {/* Thumbnails Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex flex-wrap gap-2 pt-2 justify-center">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === img
                          ? 'border-[#FFC107] scale-105 shadow-md'
                          : 'border-transparent hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details Area */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                    isDarkMode ? 'bg-[#FFC107]/10 text-[#FFC107]' : 'bg-[#1E1A5B]/10 text-[#1E1A5B]'
                  }`}>
                    {product.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
                    SANAM Factory
                  </span>
                </div>

                {/* Title & Model */}
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
                    {product.name}
                  </h1>
                  <span className="inline-block mt-2 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    {tDetail.model}: {product.model}
                  </span>
                </div>

                {/* Specs Table */}
                <div className={`space-y-3 p-5 rounded-2xl border font-semibold text-sm ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">{tDetail.sizes}</span>
                    <span className="font-extrabold">{product.sizes}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-slate-800/20 dark:border-slate-800/60">
                    <span className="text-slate-400">{tDetail.material}</span>
                    <span className="font-extrabold">{product.material}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-t border-slate-800/20 dark:border-slate-800/60 text-[#FFC107]">
                    <span className="text-slate-400">{tDetail.price}</span>
                    <span className="font-black text-lg">{product.price}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h2 className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {tDetail.specification}
                  </h2>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {product.desc}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800/20 dark:border-slate-800/40 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="flex-1 py-4 px-6 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-95 text-center"
                >
                  {tDetail.orderNow}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    title={tDetail.copyLink}
                    className={`p-4 rounded-xl border transition-colors flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-[#FFC107] hover:bg-slate-700' 
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleShare}
                    title="Share"
                    className={`p-4 rounded-xl border transition-colors flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-[#FFC107] hover:bg-slate-700' 
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Order Calculator Modal */}
      <OrderCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}

export function ProductDetailClient() {
  return (
    <AppProvider>
      <ProductDetailContent />
    </AppProvider>
  );
}
