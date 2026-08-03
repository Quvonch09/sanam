"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SanamLogo } from './SanamLogo';
import { Language, translations } from '../data/translations';
import { Telegram, Instagram, Facebook, MapPin, Phone } from '@/components/Icons';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const { isDarkMode } = useApp();
  const t = translations[currentLang].footer;
  const navT = translations[currentLang].nav;
  const heroT = translations[currentLang].hero;

  return (
    <footer className={`transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 border-t border-slate-800 text-slate-400' : 'bg-[#1E1A5B] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <SanamLogo size="md" isDarkMode={true} gapColor={isDarkMode ? '#020617' : '#1E1A5B'} />
            <p className="text-xs leading-relaxed text-slate-300">
              {t.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFC107]">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#about" className="hover:text-[#FFC107] transition-colors">{navT.about}</a></li>
              <li><a href="#products" className="hover:text-[#FFC107] transition-colors">{navT.products}</a></li>
              <li><a href="#team" className="hover:text-[#FFC107] transition-colors">{translations[currentLang].team.title}</a></li>
              <li><a href="#news" className="hover:text-[#FFC107] transition-colors">{navT.news}</a></li>
              <li><a href="#contact" className="hover:text-[#FFC107] transition-colors">{navT.contact}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFC107]">
              {t.services}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>{heroT.service1}</li>
              <li>{heroT.service2}</li>
              <li>{heroT.service3}</li>
              <li>{translations[currentLang].about.subTitle}</li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FFC107]">
              {t.contactUs}
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFC107]" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFC107]" />
                <a href="tel:+998878056666" className="font-bold hover:text-[#FFC107]">+998 87 805 66 66</a>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a href="https://t.me/sanamfactory" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-[#FFC107] hover:text-[#1E1A5B] transition-colors">
                <Telegram className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/sanamfactory.uz/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-[#FFC107] hover:text-[#1E1A5B] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/share/18aXzYX9na/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-[#FFC107] hover:text-[#1E1A5B] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SANAM OFFICIAL - Garment Factory. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
};
