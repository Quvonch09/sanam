"use client";

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Advantages } from '@/components/Advantages';
import { AboutUs } from '@/components/AboutUs';
import { ProductionGallery } from '@/components/ProductionGallery';
import { NewsSection } from '@/components/NewsSection';
import { WhyUsStats } from '@/components/WhyUsStats';
import { Testimonials } from '@/components/Testimonials';
import { ContactAndMap } from '@/components/ContactAndMap';
import { Footer } from '@/components/Footer';
import { OrderCalculatorModal } from '@/components/OrderCalculatorModal';
import { FloatingActions } from '@/components/FloatingActions';

function MainLanding() {
  const { incrementVisitors, isDarkMode, currentLang, setLanguage } = useApp();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  useEffect(() => {
    incrementVisitors();
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setLanguage}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenContact={() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 1. Hero Section */}
      <Hero
        currentLang={currentLang}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* 2. Afzalliklarimiz / Advantages */}
      <Advantages currentLang={currentLang} />

      {/* 3. Biz Haqimizda / About Us */}
      <AboutUs currentLang={currentLang} />

      {/* 4. Mahsulotlar / Gallery */}
      <ProductionGallery
        currentLang={currentLang}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />



      {/* 6. Fabrika Yangiliklari / News */}
      <NewsSection currentLang={currentLang} />

      {/* 7. Nega Biz? Statistika / Why Us */}
      <WhyUsStats currentLang={currentLang} />

      {/* 8. Mijozlar Fikri / Testimonials */}
      <Testimonials currentLang={currentLang} />

      {/* 9. Manzil va Aloqa / Contact & Google Maps */}
      <ContactAndMap currentLang={currentLang} />

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Calculator Modal */}
      <OrderCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentLang={currentLang}
      />

      {/* Floating Actions (with Scroll-to-Top Button) */}
      <FloatingActions />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainLanding />
    </AppProvider>
  );
}
