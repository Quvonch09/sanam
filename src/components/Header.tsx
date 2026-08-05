"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SanamLogo } from './SanamLogo';
import { Language, translations } from '../data/translations';
import { Globe, Menu, X, Phone, Calculator, ChevronDown, Sun, Moon } from '@/components/Icons';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCalculator: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenCalculator,
  onOpenContact,
}) => {
  const { isDarkMode, toggleTheme } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isSubPage, setIsSubPage] = useState(false);

  const t = translations[currentLang].nav;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSubPage(window.location.pathname !== '/' && window.location.pathname !== '');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed "Bosh sahifa" link as requested
  const navLinks = [
    { href: isSubPage ? "/#about" : "#about", label: t.about },
    { href: isSubPage ? "/#products" : "#products", label: t.products },
    { href: isSubPage ? "/#team" : "#team", label: t.team },
    { href: isSubPage ? "/#news" : "#news", label: t.news },
    { href: isSubPage ? "/#why-us" : "#why-us", label: t.whyUs },
    { href: isSubPage ? "/#testimonials" : "#testimonials", label: t.testimonials },
    { href: isSubPage ? "/#contact" : "#contact", label: t.contact },
  ];

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'uz', name: "O'zbekcha", flag: "🇺🇿" },
    { code: 'ru', name: "Русский", flag: "🇷🇺" },
    { code: 'en', name: "English", flag: "🇬🇧" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 py-2 shadow-xl'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-2 shadow-md'
          : isDarkMode
          ? 'bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/50 py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-1 sm:gap-2">
        
        {/* Logo */}
        <a href={isSubPage ? "/" : "#hero"} className="focus:outline-none flex-shrink-0">
          <SanamLogo size="md" isDarkMode={isDarkMode} />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-xs xl:text-[13px] font-extrabold whitespace-nowrap rounded-xl transition-all ${
                isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-700 hover:text-[#1E1A5B] hover:bg-slate-100'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center space-x-1.5 flex-shrink-0">
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-[#1E1A5B] bg-[#FFC107] hover:bg-amber-400 rounded-xl shadow transition-all transform active:scale-95"
          >
            <Calculator className="w-3.5 h-3.5 text-[#1E1A5B]" />
            <span className="whitespace-nowrap">{t.calculatorBtn}</span>
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? 'bg-slate-800 text-[#FFC107] border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title={isDarkMode ? "Yoritilgan rejimga o'tish" : "Tungi rejimga o'tish"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#FFC107]" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-2 text-xs font-extrabold rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#FFC107]" />
              <span className="uppercase">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-36 rounded-xl shadow-2xl border py-1 z-50 ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
              }`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-800/40 transition-colors ${
                      currentLang === lang.code ? 'text-[#FFC107] bg-slate-800/20' : 'text-slate-400'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={isSubPage ? "/#contact" : "#contact"}
            onClick={onOpenContact}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-white bg-[#1E1A5B] hover:bg-[#13103D] rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>{t.orderBtn}</span>
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border ${
              isDarkMode ? 'bg-slate-800 text-[#FFC107] border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              const nextLang: Language = currentLang === 'uz' ? 'ru' : currentLang === 'ru' ? 'en' : 'uz';
              onLanguageChange(nextLang);
            }}
            className={`px-2.5 py-1.5 text-xs font-extrabold rounded-lg uppercase border ${
              isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-[#1E1A5B] border-slate-200'
            }`}
          >
            {currentLang}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isDarkMode ? 'text-white' : 'text-slate-700'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-3 pb-[#FFC107] space-y-3 shadow-2xl ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 text-sm font-extrabold rounded-lg ${
                  isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
