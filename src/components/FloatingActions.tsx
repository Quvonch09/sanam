"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Phone, Telegram, Instagram, Facebook, ArrowUp } from '@/components/Icons';

export const FloatingActions: React.FC = () => {
  const { currentLang } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const titles = {
    uz: {
      scrollTop: "Tepaga qaytish",
      call: "Qo'ng'iroq qilish: +998 87 805 66 66",
      tg: "Telegram: @sanamfactory",
      ig: "Instagram: @sanamfactory.uz",
      fb: "Facebook sahifa",
    },
    ru: {
      scrollTop: "Наверх",
      call: "Позвонить: +998 87 805 66 66",
      tg: "Telegram: @sanamfactory",
      ig: "Instagram: @sanamfactory.uz",
      fb: "Страница Facebook",
    },
    en: {
      scrollTop: "Scroll to top",
      call: "Call Us: +998 87 805 66 66",
      tg: "Telegram: @sanamfactory",
      ig: "Instagram: @sanamfactory.uz",
      fb: "Facebook Page",
    },
  };

  const t = titles[currentLang || 'uz'];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-center">
      {/* Scroll To Top Button (Appears when scrolled down) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-11 h-11 rounded-full bg-[#FFC107] text-[#1E1A5B] flex items-center justify-center shadow-2xl hover:scale-110 transition-all border border-amber-300 font-extrabold animate-in fade-in zoom-in duration-200"
          title={t.scrollTop}
        >
          <ArrowUp className="w-5 h-5 text-[#1E1A5B]" />
        </button>
      )}

      {/* Phone Call Floating Action */}
      <a
        href="tel:+998878056666"
        aria-label="Direct Phone Call"
        className="w-12 h-12 rounded-full bg-[#1E1A5B] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border border-[#FFC107]/40 group"
        title={t.call}
      >
        <Phone className="w-5 h-5 text-[#FFC107] animate-pulse" />
      </a>

      {/* Telegram Floating Action */}
      <a
        href="https://t.me/sanamfactory"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="w-12 h-12 rounded-full bg-[#24A1DE] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        title={t.tg}
      >
        <Telegram className="w-5 h-5" />
      </a>

      {/* Instagram Floating Action */}
      <a
        href="https://www.instagram.com/sanamfactory.uz/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        title={t.ig}
      >
        <Instagram className="w-5 h-5" />
      </a>

      {/* Facebook Floating Action */}
      <a
        href="https://www.facebook.com/share/18aXzYX9na/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        title={t.fb}
      >
        <Facebook className="w-5 h-5" />
      </a>
    </div>
  );
};
