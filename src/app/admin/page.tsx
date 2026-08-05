"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppProvider, useApp, ProductItem, NewsItem, TeamMember, CategoryItem } from '@/context/AppContext';
import { SanamLogo } from '@/components/SanamLogo';
import { Language, translations } from '@/data/translations';
import { slugify } from '@/utils/slugify';

import {
  Globe,
  Sun,
  Moon,
  Edit,
  Trash,
  X,
  ChevronDown,
} from '@/components/Icons';

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const {
    isDarkMode,
    toggleTheme,
    currentLang,
    setLanguage,
    visitorsCount,
    calcCount,
    leadsCount,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    newsList,
    addNews,
    updateNews,
    deleteNews,
    teamList,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    leads,
    calcInquiries,
    feedbacks,
    updateLeadStatus,
    updateCalcStatus,
    deleteLead,
    deleteCalcInquiry,
    toggleApproveFeedback,
    deleteFeedback,
  } = useApp();

  const tAdmin = translations[currentLang].admin;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'team' | 'news' | 'leads' | 'feedback'>('dashboard');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals visibility state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form States - Product
  const [prodModel, setProdModel] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodMaterial, setProdMaterial] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodBadge, setProdBadge] = useState('Yangi');
  const [prodImageBase64, setProdImageBase64] = useState<string>('');

  // Form States - Team
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('Директор');
  const [teamImageBase64, setTeamImageBase64] = useState<string>('');

  // Form States - News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Texnologiya');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageBase64, setNewsImageBase64] = useState<string>('');

  // Form States - Category
  const [catLabel, setCatLabel] = useState('');
  const [catKey, setCatKey] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (pName: string, pId: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/product/${slugify(pName)}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopiedId(pId);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'uz', name: "O'zbekcha", flag: "🇺🇿" },
    { code: 'ru', name: "Русский", flag: "🇷🇺" },
    { code: 'en', name: "English", flag: "🇬🇧" },
  ];

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setBase64: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Product Modal
  const openEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProdModel(p.model);
    setProdName(p.name);
    setProdSizes(p.sizes);
    setProdMaterial(p.material);
    setProdPrice(p.price);
    setProdCategory(p.category);
    setProdDesc(p.desc);
    setProdBadge(p.badge || 'Yangi');
    setProdImageBase64(p.imageUrl || '');
    setShowProductModal(true);
  };

  // Open Edit Team Modal
  const openEditTeam = (t: TeamMember) => {
    setEditingTeam(t);
    setTeamName(t.name);
    setTeamRole(t.role);
    setTeamImageBase64(t.imageUrl || '');
    setShowTeamModal(true);
  };

  // Open Edit News Modal
  const openEditNews = (n: NewsItem) => {
    setEditingNews(n);
    setNewsTitle(n.title);
    setNewsCategory(n.category);
    setNewsSummary(n.summary);
    setNewsContent(n.content);
    setNewsImageBase64(n.imageUrl || '');
    setShowNewsModal(true);
  };

  // Open Edit Category Modal
  const openEditCategory = (c: CategoryItem) => {
    setEditingCategory(c);
    setCatLabel(c.label);
    setCatKey(c.key);
    setShowCategoryModal(true);
  };

  // Handlers
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodModel || !prodSizes || !prodMaterial || !prodPrice) return;
    const cat = prodCategory || (categories[0]?.key || 'fashion');

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        model: prodModel,
        sizes: prodSizes,
        material: prodMaterial,
        price: prodPrice,
        category: cat,
        desc: prodDesc,
        badge: prodBadge,
        imageUrl: prodImageBase64 || undefined,
      });
    } else {
      addProduct({
        name: prodName,
        model: prodModel,
        sizes: prodSizes,
        material: prodMaterial,
        price: prodPrice,
        category: cat,
        desc: prodDesc || `${prodName} model ${prodModel}`,
        badge: prodBadge,
        imageUrl: prodImageBase64 || undefined,
      });
    }

    setEditingProduct(null);
    setShowProductModal(false);
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !teamRole) return;

    if (editingTeam) {
      updateTeamMember(editingTeam.id, {
        name: teamName,
        role: teamRole,
        imageUrl: teamImageBase64 || undefined,
      });
    } else {
      addTeamMember({
        name: teamName,
        role: teamRole,
        imageUrl: teamImageBase64 || undefined,
      });
    }

    setEditingTeam(null);
    setShowTeamModal(false);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary || !newsContent) return;

    if (editingNews) {
      updateNews(editingNews.id, {
        title: newsTitle,
        category: newsCategory,
        summary: newsSummary,
        content: newsContent,
        imageUrl: newsImageBase64 || undefined,
      });
    } else {
      addNews({
        title: newsTitle,
        category: newsCategory,
        date: new Date().toISOString().split('T')[0],
        summary: newsSummary,
        content: newsContent,
        imageUrl: newsImageBase64 || undefined,
      });
    }

    setEditingNews(null);
    setShowNewsModal(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel) return;
    const generatedKey = catKey.trim().toLowerCase().replace(/\s+/g, '-') || 'cat-' + Date.now();

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        label: catLabel,
        key: generatedKey,
      });
    } else {
      addCategory({
        label: catLabel,
        key: generatedKey,
      });
    }

    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>

      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 1. LEFT SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        w-72 lg:w-64 h-screen
        border-r flex flex-col justify-between p-4 flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        <div className="space-y-6">
          
          {/* Logo & Header */}
          <div className={`px-2 pt-2 border-b pb-4 space-y-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <SanamLogo size="sm" showText={true} isDarkMode={isDarkMode} gapColor={isDarkMode ? '#0f172a' : '#ffffff'} />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">SANAM Admin</span>
            </div>
          </div>

          <nav className="space-y-1" style={{ fontFamily: 'var(--font-roboto-mono), monospace' }}>
            {[
              { id: 'dashboard', label: tAdmin.tabs.dashboard, icon: '📊' },
              { id: 'products', label: tAdmin.tabs.products, icon: '👕', badge: products.length },
              { id: 'categories', label: tAdmin.tabs.categories, icon: '🏷️', badge: categories.length },
              { id: 'team', label: tAdmin.tabs.team, icon: '👔', badge: teamList.length },
              { id: 'news', label: tAdmin.tabs.news, icon: '📰', badge: newsList.length },
              { id: 'leads', label: tAdmin.tabs.leads, icon: '📥', badge: leads.length + calcInquiries.length },
              { id: 'feedback', label: tAdmin.tabs.feedback, icon: '⭐', badge: feedbacks.length },
            ].map((item) => (
              <button
                key={item.id}
            onClick={() => {
                setActiveTab(item.id as any);
                setSidebarOpen(false);
              }}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-[13px] tracking-tight font-semibold transition-all flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-[#FFC107] text-[#1E1A5B] shadow-lg scale-[1.01]'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base" style={{ fontFamily: 'initial' }}>{item.icon}</span>
                  <span style={{ fontFamily: 'var(--font-roboto-mono), monospace', letterSpacing: '-0.02em' }}>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === item.id ? 'bg-[#1E1A5B] text-white' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

        </div>

        {/* Sidebar Footer — just logout */}
        <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>🔴 {tAdmin.actions.logout}</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden lg:ml-0">

        {/* TOP HEADER BAR */}
        <header className={`sticky top-0 z-40 border-b flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 flex-shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Left: Hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all flex-shrink-0 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              aria-label="Menu"
            >
              <span className={`block w-4.5 h-0.5 rounded-full transition-all ${isDarkMode ? 'bg-white' : 'bg-slate-700'} ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`} style={{width:'18px', height:'2px', display:'block', borderRadius:'2px', background: isDarkMode ? 'white' : '#475569', transition:'all 0.2s'}} />
              <span className={`transition-all ${sidebarOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} style={{width:'18px', height:'2px', display:'block', borderRadius:'2px', background: isDarkMode ? 'white' : '#475569', transition:'all 0.2s'}} />
              <span className={`transition-all ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{width:'18px', height:'2px', display:'block', borderRadius:'2px', background: isDarkMode ? 'white' : '#475569', transition:'all 0.2s'}} />
            </button>

            <span className="text-lg">
              {activeTab === 'dashboard' && '📊'}
              {activeTab === 'products' && '👕'}
              {activeTab === 'categories' && '🏷️'}
              {activeTab === 'team' && '👔'}
              {activeTab === 'news' && '📰'}
              {activeTab === 'leads' && '📥'}
              {activeTab === 'feedback' && '⭐'}
            </span>
            <div>
              <h1 className={`text-sm font-extrabold leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'dashboard' && tAdmin.tabs.dashboard}
                {activeTab === 'products' && tAdmin.tabs.products}
                {activeTab === 'categories' && tAdmin.tabs.categories}
                {activeTab === 'team' && tAdmin.tabs.team}
                {activeTab === 'news' && tAdmin.tabs.news}
                {activeTab === 'leads' && tAdmin.tabs.leads}
                {activeTab === 'feedback' && tAdmin.tabs.feedback}
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">SANAM Admin Panel</p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">

            {/* Dark / Light Mode Toggle — hidden on mobile */}
            <button
              onClick={toggleTheme}
              className={`hidden lg:flex w-9 h-9 rounded-xl items-center justify-center border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-[#FFC107] hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              title={isDarkMode ? tAdmin.actions.lightMode : tAdmin.actions.darkMode}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher — hidden on mobile */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                  isDarkMode ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#FFC107]" />
                <span className="uppercase">{currentLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-36 rounded-2xl shadow-2xl border py-1.5 z-50 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                        currentLang === lang.code
                          ? 'text-[#FFC107] bg-[#FFC107]/10'
                          : isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Site Link — hidden on mobile */}
            <Link
              href="/"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>{tAdmin.actions.goToSite}</span>
            </Link>

            {/* Divider — hidden on mobile */}
            <div className={`hidden lg:block h-8 w-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

            {/* Admin Profile — always visible */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E1A5B] to-[#312d8a] border-2 border-[#FFC107]/30 flex items-center justify-center text-[#FFC107] font-black text-sm flex-shrink-0">
                A
              </div>
              <div className="hidden md:block">
                <p className={`text-xs font-extrabold leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Administrator</p>
                <p className="text-[10px] text-slate-400 mt-0.5">admin@sanam.uz</p>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {tAdmin.title}
              </h2>
              <p className="text-xs text-slate-400">
                {tAdmin.subtitle}
              </p>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`border rounded-3xl p-6 space-y-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{tAdmin.stats.visitors}</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">👁️</div>
                </div>
                <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{visitorsCount}</div>
                <div className="text-[10px] text-slate-400 font-medium">↑ online</div>
              </div>

              <div className={`border rounded-3xl p-6 space-y-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{tAdmin.stats.calc}</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">🧮</div>
                </div>
                <div className="text-3xl font-black text-[#FFC107]">{calcCount}</div>
                <div className="text-[10px] text-slate-400 font-medium">{calcInquiries.filter(c => c.status === 'new').length} yangi</div>
              </div>

              <div className={`border rounded-3xl p-6 space-y-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{tAdmin.stats.leads}</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">📩</div>
                </div>
                <div className="text-3xl font-black text-emerald-500">{leadsCount}</div>
                <div className="text-[10px] text-slate-400 font-medium">{leads.filter(l => l.status === 'new').length} yangi ariza</div>
              </div>

              <div className={`border rounded-3xl p-6 space-y-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{tAdmin.stats.rating}</span>
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">⭐</div>
                </div>
                <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4.7 ★</div>
                <div className="text-[10px] text-slate-400 font-medium">{feedbacks.filter(f => f.approved).length} tasdiqlangan fikr</div>
              </div>
            </div>

            {/* Row 2: Product Analytics + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Category Breakdown */}
              <div className={`border rounded-3xl p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">🗂️</span>
                  <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Kategoriyalar bo'yicha mahsulotlar</h3>
                </div>
                <div className="space-y-3">
                  {categories.map(cat => {
                    const count = products.filter(p => p.category === cat.key).length;
                    const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{cat.label}</span>
                          <span className="text-[#FFC107]">{count} ta ({pct}%)</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <div className="h-full bg-gradient-to-r from-[#1E1A5B] to-[#FFC107] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {categories.length === 0 && <p className="text-xs text-slate-400">Kategoriyalar yo'q</p>}
                </div>
              </div>

              {/* Most Requested Products from Calculator */}
              <div className={`border rounded-3xl p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ko'p so'ralgan mahsulotlar</h3>
                </div>
                <div className="space-y-2">
                  {(() => {
                    const freq: Record<string, number> = {};
                    calcInquiries.forEach(c => { freq[c.productType] = (freq[c.productType] || 0) + 1; });
                    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    const max = sorted[0]?.[1] || 1;
                    return sorted.length > 0 ? sorted.map(([name, count], i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ${
                          i === 0 ? 'bg-[#FFC107] text-[#1E1A5B]' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-xs font-bold mb-0.5">
                            <span className={`truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{name}</span>
                            <span className="text-emerald-400 ml-2">{count}x</span>
                          </div>
                          <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-6">
                        <p className="text-2xl mb-2">📊</p>
                        <p className="text-xs text-slate-400">Hali so'rovlar yo'q</p>
                        <p className="text-[10px] text-slate-500 mt-1">Buyurtma hisoblagich ishlatilganda bu yerda ko'rinadi</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Row 3: Recent Leads + Feedback Ratings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Leads */}
              <div className={`border rounded-3xl p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>So'nggi arizalar</h3>
                  </div>
                  <button onClick={() => setActiveTab('leads')} className="text-[10px] text-[#FFC107] font-bold hover:underline">Barchasini ko'rish →</button>
                </div>
                <div className="space-y-2">
                  {leads.slice(0, 4).map(lead => (
                    <div key={lead.id} className={`flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{lead.name}</p>
                        <p className="text-[10px] text-slate-400">{lead.phone} · {lead.date}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lead.status === 'new' ? 'bg-emerald-500/20 text-emerald-400' :
                        lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>{lead.status === 'new' ? 'Yangi' : lead.status === 'contacted' ? "Bog'landi" : 'Bajarildi'}</span>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Arizalar yo'q</p>}
                </div>
              </div>

              {/* Feedback Ratings Breakdown */}
              <div className={`border rounded-3xl p-6 space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⭐</span>
                    <h3 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mijozlar baholari</h3>
                  </div>
                  <button onClick={() => setActiveTab('feedback')} className="text-[10px] text-[#FFC107] font-bold hover:underline">Barchasini ko'rish →</button>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = feedbacks.filter(f => f.rating === star).length;
                    const pct = feedbacks.length > 0 ? Math.round((count / feedbacks.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 w-4">{star}</span>
                        <span className="text-[#FFC107] text-xs">★</span>
                        <div className={`flex-1 h-2 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <div className="h-full bg-[#FFC107] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold w-6">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-center">
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '—'}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">o'rtacha / {feedbacks.length} ta fikr</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tAdmin.tabs.products}</h2>
                <p className="text-xs text-slate-400">{tAdmin.form.tabDescProducts}</p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdModel('');
                  setProdName('');
                  setProdSizes('');
                  setProdMaterial('');
                  setProdPrice('');
                  setProdDesc('');
                  setProdImageBase64('');
                  setShowProductModal(true);
                }}
                className="px-5 py-3 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>➕ {tAdmin.actions.addProduct}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`border rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover rounded-2xl border border-slate-700" />
                    ) : (
                      <div className="h-32 bg-slate-950/20 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold">{tAdmin.form.noImage}</div>
                    )}

                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFC107] text-[#1E1A5B]">Model: {p.model}</span>
                      <h3 className={`text-base font-extrabold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                    </div>

                    <div className={`text-xs space-y-1 p-3 rounded-xl border font-medium ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      <div><span className="text-slate-400">{tAdmin.form.sizes}:</span> {p.sizes}</div>
                      <div><span className="text-slate-400">{tAdmin.form.material}:</span> {p.material}</div>
                      <div className="text-[#FFC107] font-bold"><span className="text-slate-400">{tAdmin.form.price}:</span> {p.price}</div>
                      
                      {/* Shareable Link */}
                      <div className="pt-2 mt-2 border-t border-slate-800/10 dark:border-slate-800/40 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">GMC uchun havola:</span>
                        <div className="flex items-center justify-between gap-1 bg-slate-950/20 dark:bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/20">
                          <span className="truncate select-all text-[10px] font-mono text-slate-400 max-w-[120px] sm:max-w-[150px]">
                            {typeof window !== 'undefined' ? `${window.location.origin}/product/${slugify(p.name)}` : `/product/${slugify(p.name)}`}
                          </span>
                          <button
                            onClick={() => handleCopyLink(p.name, p.id)}
                            className="text-[10px] font-bold text-[#FFC107] hover:underline"
                          >
                            {copiedId === p.id ? '✓ OK' : '📋'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800/40">
                    <button
                      onClick={() => openEditProduct(p)}
                      className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> <span>{tAdmin.actions.edit}</span>
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tAdmin.tabs.categories}</h2>
                <p className="text-xs text-slate-400">{tAdmin.form.tabDescCategories}</p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCatLabel('');
                  setCatKey('');
                  setShowCategoryModal(true);
                }}
                className="px-5 py-3 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] text-xs font-extrabold rounded-2xl shadow-lg flex items-center gap-2"
              >
                <span>🏷️ {tAdmin.actions.addCategory}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className={`border rounded-3xl p-5 flex items-center justify-between gap-4 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Key: {c.key}</span>
                    <h4 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.label}</h4>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditCategory(c)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RAHBARIYAT TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tAdmin.tabs.team}</h2>
                <p className="text-xs text-slate-400">{tAdmin.form.tabDescTeam}</p>
              </div>

              <button
                onClick={() => {
                  setEditingTeam(null);
                  setTeamName('');
                  setTeamRole('Директор');
                  setTeamImageBase64('');
                  setShowTeamModal(true);
                }}
                className="px-5 py-3 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] text-xs font-extrabold rounded-2xl shadow-lg flex items-center gap-2"
              >
                <span>👔 {tAdmin.actions.addTeam}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamList.map((m) => (
                <div
                  key={m.id}
                  className={`border rounded-3xl p-5 flex items-center justify-between gap-4 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-white font-extrabold flex items-center justify-center overflow-hidden flex-shrink-0">
                      {m.imageUrl ? <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" /> : <span>{m.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]/40 block mb-1">{m.role}</span>
                      <h4 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.name}</h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button onClick={() => openEditTeam(m)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTeamMember(m.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tAdmin.tabs.news}</h2>
                <p className="text-xs text-slate-400">{tAdmin.form.tabDescNews}</p>
              </div>

              <button
                onClick={() => {
                  setEditingNews(null);
                  setNewsTitle('');
                  setNewsCategory('Texnologiya');
                  setNewsSummary('');
                  setNewsContent('');
                  setNewsImageBase64('');
                  setShowNewsModal(true);
                }}
                className="px-5 py-3 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] text-xs font-extrabold rounded-2xl shadow-lg flex items-center gap-2"
              >
                <span>📰 {tAdmin.actions.addNews}</span>
              </button>
            </div>

            <div className="space-y-4">
              {newsList.map((n) => (
                <div
                  key={n.id}
                  className={`border rounded-3xl p-5 flex items-center justify-between gap-4 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E1A5B] text-[#FFC107]">{n.category}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{n.date}</span>
                    </div>
                    <h4 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{n.title}</h4>
                    <p className="text-xs text-slate-400">{n.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEditNews(n)} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-xl">
                      {tAdmin.actions.edit}
                    </button>
                    <button onClick={() => deleteNews(n.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl">
                      {tAdmin.actions.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADS & SMETA TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tAdmin.tabs.leads}</h2>
              <p className="text-xs text-slate-400">Formadan kelgan arizalar va buyurtma hisoblagich so'rovlari</p>
            </div>

            {/* Contact Form Leads */}
            <div className="space-y-4">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">📩</span>
                Bog'lanish Arizalari ({leads.length} ta)
              </h3>
              {leads.length === 0 ? (
                <div className={`border rounded-3xl p-10 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-sm text-slate-400">Hali arizalar yo'q</p>
                </div>
              ) : (
                <div className={`overflow-x-auto border rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        <th className="py-3.5 px-4 font-black">Mijoz</th>
                        <th className="py-3.5 px-4 font-black">Telefon</th>
                        <th className="py-3.5 px-4 font-black">Xizmat</th>
                        <th className="py-3.5 px-4 font-black">Xabar</th>
                        <th className="py-3.5 px-4 font-black">Sana</th>
                        <th className="py-3.5 px-4 font-black">Status</th>
                        <th className="py-3.5 px-4 font-black text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y text-xs font-medium ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                      {leads.map(lead => (
                        <tr key={lead.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors`}>
                          <td className="py-3 px-4 font-bold">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[#1E1A5B] text-[#FFC107] flex items-center justify-center font-black text-xs flex-shrink-0">
                                {lead.name.charAt(0)}
                              </div>
                              <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{lead.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold">{lead.phone}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-md">
                              {lead.service}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-[200px] truncate" title={lead.message || ''}>
                            {lead.message || <span className="text-slate-500 font-normal italic">- bo'sh -</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">{lead.date}</td>
                          <td className="py-3 px-4">
                            <select
                              value={lead.status}
                              onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none ${
                                lead.status === 'new' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                lead.status === 'contacted' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                'bg-slate-500/10 border-slate-500/30 text-slate-400'
                              }`}
                            >
                              <option value="new">🟢 Yangi</option>
                              <option value="contacted">🔵 Bog'landi</option>
                              <option value="completed">✅ Bajarildi</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Haqiqatan ham ushbu arizani o\'chirmoqchimisiz?')) {
                                  deleteLead(lead.id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg group transition-colors inline-block"
                              title="O'chirish"
                            >
                              <Trash className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Calculator Inquiries */}
            <div className="space-y-4">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">🧮</span>
                Smeta So'rovlari ({calcInquiries.length} ta)
              </h3>
              {calcInquiries.length === 0 ? (
                <div className={`border rounded-3xl p-10 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className="text-3xl mb-2">🧮</p>
                  <p className="text-sm text-slate-400">Hali smeta so'rovlari yo'q</p>
                </div>
              ) : (
                <div className={`overflow-x-auto border rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDarkMode ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        <th className="py-3.5 px-4 font-black">Mahsulot turi</th>
                        <th className="py-3.5 px-4 font-black">Miqdori</th>
                        <th className="py-3.5 px-4 font-black">Muddat</th>
                        <th className="py-3.5 px-4 font-black">Telefon</th>
                        <th className="py-3.5 px-4 font-black">Sana</th>
                        <th className="py-3.5 px-4 font-black">Status</th>
                        <th className="py-3.5 px-4 font-black text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y text-xs font-medium ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                      {calcInquiries.map(calc => (
                        <tr key={calc.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors`}>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">🧮</span>
                              <span>{calc.productType}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              📦 {calc.quantity} dona
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-amber-500">⏱ ~{calc.estimatedDays} kun</td>
                          <td className="py-3 px-4 font-semibold">{calc.phone}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">{calc.date}</td>
                          <td className="py-3 px-4">
                            <select
                              value={calc.status}
                              onChange={e => updateCalcStatus(calc.id, e.target.value as any)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none ${
                                calc.status === 'new' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                calc.status === 'contacted' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                'bg-slate-500/10 border-slate-500/30 text-slate-400'
                              }`}
                            >
                              <option value="new">🟢 Yangi</option>
                              <option value="contacted">🔵 Bog'landi</option>
                              <option value="completed">✅ Bajarildi</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm('Haqiqatan ham ushbu smeta so\'rovini o\'chirmoqchimisiz?')) {
                                  deleteCalcInquiry(calc.id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg group transition-colors inline-block"
                              title="O'chirish"
                            >
                              <Trash className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tAdmin.tabs.feedback}</h2>
              <p className="text-xs text-slate-400">Mijozlardan kelgan izohlar — tasdiqlang yoki o'chiring</p>
            </div>

            {/* Feedback Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{label: 'Jami', value: feedbacks.length, color: 'text-white'},
                {label: 'Tasdiqlangan', value: feedbacks.filter(f=>f.approved).length, color: 'text-emerald-400'},
                {label: 'Kutmoqda', value: feedbacks.filter(f=>!f.approved).length, color: 'text-amber-400'},
              ].map(s => (
                <div key={s.label} className={`border rounded-2xl p-4 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {feedbacks.length === 0 ? (
              <div className={`border rounded-3xl p-10 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm text-slate-400">Hali mijozlar fikri yo'q</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map(fb => (
                  <div key={fb.id} className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-start justify-between gap-4 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  } ${fb.approved ? (isDarkMode ? 'border-emerald-800/50' : 'border-emerald-200') : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E1A5B] to-[#13103D] text-[#FFC107] flex items-center justify-center font-black text-sm flex-shrink-0">
                        {fb.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{fb.name}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            fb.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>{fb.approved ? '✓ Tasdiqlangan' : '⏳ Kutmoqda'}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < fb.rating ? 'text-[#FFC107]' : 'text-slate-600'}`}>★</span>
                          ))}
                        </div>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{fb.text}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{fb.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleApproveFeedback(fb.id)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-xl border transition-all ${
                          fb.approved
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {fb.approved ? '↩ Bekor' : '✓ Tasdiqlash'}
                      </button>
                      <button
                        onClick={() => deleteFeedback(fb.id)}
                        className="px-3 py-1.5 text-[10px] font-extrabold rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      </div>

      {/* MODALS */}
      {/* 1. PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                👕 {editingProduct ? tAdmin.form.editProduct : tAdmin.actions.addProduct}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.model} *</label>
                  <input type="text" required value={prodModel} onChange={(e) => setProdModel(e.target.value)} placeholder="SN-WORK-102" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.productName} *</label>
                  <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="Erkaklar Kostyumi" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.sizes} *</label>
                  <input type="text" required value={prodSizes} onChange={(e) => setProdSizes(e.target.value)} placeholder="46 - 56 / M, L, XL" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.material} *</label>
                  <input type="text" required value={prodMaterial} onChange={(e) => setProdMaterial(e.target.value)} placeholder="100% Paxta Saten" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.price} *</label>
                  <input type="text" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="180 000 UZS" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.category}</label>
                  <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]">
                    {categories.map((c) => (
                      <option key={c.id} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.imageUpload}</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setProdImageBase64)} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#FFC107] file:text-[#1E1A5B] cursor-pointer" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-[#FFC107] text-[#1E1A5B] font-extrabold text-xs rounded-xl shadow">{tAdmin.actions.save}</button>
                <button type="button" onClick={() => setShowProductModal(false)} className="px-5 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">{tAdmin.actions.close}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h3 className="text-xl font-black">🏷️ {editingCategory ? tAdmin.form.editCategory : tAdmin.actions.addCategory}</h3>
              <button onClick={() => setShowCategoryModal(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.categoryName} *</label>
                <input type="text" required value={catLabel} onChange={(e) => setCatLabel(e.target.value)} placeholder="Ishchi Kiyimlar" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.categoryKey}</label>
                <input type="text" value={catKey} onChange={(e) => setCatKey(e.target.value)} placeholder="uniforms" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-[#FFC107] text-[#1E1A5B] font-extrabold text-xs rounded-xl shadow">{tAdmin.actions.save}</button>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">{tAdmin.actions.close}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. TEAM MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h3 className="text-xl font-black">👔 {editingTeam ? tAdmin.form.editTeam : tAdmin.actions.addTeam}</h3>
              <button onClick={() => setShowTeamModal(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.fullName} *</label>
                <input type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Karimov Alisher" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.position} *</label>
                <input type="text" required value={teamRole} onChange={(e) => setTeamRole(e.target.value)} placeholder="Директор" className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.photo}</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setTeamImageBase64)} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#FFC107] file:text-[#1E1A5B] cursor-pointer" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-[#FFC107] text-[#1E1A5B] font-extrabold text-xs rounded-xl shadow">{tAdmin.actions.save}</button>
                <button type="button" onClick={() => setShowTeamModal(false)} className="px-5 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">{tAdmin.actions.close}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. NEWS MODAL */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h3 className="text-xl font-black">📰 {editingNews ? tAdmin.form.editNews : tAdmin.actions.addNews}</h3>
              <button onClick={() => setShowNewsModal(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleNewsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.newsTitle} *</label>
                <input type="text" required value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder={tAdmin.form.newsPlaceholder} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.newsSummary} *</label>
                <input type="text" required value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} placeholder={tAdmin.form.summaryPlaceholder} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107]" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">{tAdmin.form.newsContent} *</label>
                <textarea rows={4} required value={newsContent} onChange={(e) => setNewsContent(e.target.value)} placeholder={tAdmin.form.contentPlaceholder} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#FFC107] resize-none" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-[#FFC107] text-[#1E1A5B] font-extrabold text-xs rounded-xl shadow">{tAdmin.actions.save}</button>
                <button type="button" onClick={() => setShowNewsModal(false)} className="px-5 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">{tAdmin.actions.close}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Protected Admin Wrapper with Persistent Login State & Logout
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLang, setLoginLang] = useState<Language>('uz');

  // Check persistent login session on mount (refresh check)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('sanam_admin_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
      const storedLang = localStorage.getItem('sanam_lang') as Language;
      if (storedLang && ['uz', 'ru', 'en'].includes(storedLang)) {
        setLoginLang(storedLang);
      }
    }
  }, []);

  const tLogin = translations[loginLang].admin.login;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'sanam2026') {
      setIsAuthenticated(true);
      localStorage.setItem('sanam_admin_auth', 'true');
      setError('');
    } else {
      setError(tLogin.errorMsg);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sanam_admin_auth');
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <SanamLogo size="md" className="justify-center" isDarkMode={true} gapColor="#0f172a" />
            <h2 className="text-xl font-extrabold text-white">{tLogin.title}</h2>
            <p className="text-xs text-slate-400 font-mono">
              SANAM Garment Factory Control Center
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase">
                {tLogin.loginLabel}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-[#FFC107] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase">
                {tLogin.passwordLabel}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-[#FFC107] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FFC107] hover:bg-amber-400 text-[#1E1A5B] font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              {tLogin.loginBtn}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-white underline">
              {tLogin.backBtn}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <AdminDashboard onLogout={handleLogout} />
    </AppProvider>
  );
}
