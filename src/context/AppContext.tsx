"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../data/translations';

export interface CategoryItem {
  id: string;
  key: string;
  label: string;
}

export interface ProductItem {
  id: string;
  name: string;      // Nomi
  model: string;     // Model
  sizes: string;     // Razmeri
  material: string;  // Material turi
  price: string;     // Narxi
  category: string;  // Category key
  desc: string;
  imageUrl?: string;
  badge?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;  // Ism Familiya
  role: string;  // Lavozimi
  imageUrl?: string;
  phone?: string;
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface CalcInquiry {
  id: string;
  productType: string;
  quantity: number;
  estimatedDays: number;
  phone: string;
  date: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface FeedbackItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
}

interface AppContextType {
  // Theme State
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Language State
  currentLang: Language;
  setLanguage: (lang: Language) => void;

  // Stats
  visitorsCount: number;
  calcCount: number;
  leadsCount: number;
  incrementVisitors: () => void;
  incrementCalc: () => void;
  incrementLeads: () => void;

  // Categories CRUD
  categories: CategoryItem[];
  addCategory: (cat: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Products CRUD
  products: ProductItem[];
  addProduct: (product: Omit<ProductItem, 'id'>) => void;
  updateProduct: (id: string, product: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;

  // News CRUD
  newsList: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  // Team CRUD
  teamList: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Leads & Inquiries
  leads: LeadItem[];
  calcInquiries: CalcInquiry[];
  addLead: (lead: Omit<LeadItem, 'id' | 'date' | 'status'>) => void;
  addCalcInquiry: (inquiry: Omit<CalcInquiry, 'id' | 'date' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadItem['status']) => void;
  updateCalcStatus: (id: string, status: CalcInquiry['status']) => void;

  // Feedback
  feedbacks: FeedbackItem[];
  addFeedback: (feedback: Omit<FeedbackItem, 'id' | 'date' | 'approved'>) => void;
  toggleApproveFeedback: (id: string) => void;
  deleteFeedback: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCategories: CategoryItem[] = [
  { id: 'cat-1', key: 'fashion', label: "Erkaklar va ayollar kiyimlari" },
  { id: 'cat-2', key: 'uniforms', label: "Ishchi va korporativ uniforma" },
  { id: 'cat-3', key: 'workshop', label: "Fabrika sexi & Texnologiya" },
  { id: 'cat-4', key: 'bedding', label: "To'qimachilik va mato" },
];

const initialProducts: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Korporativ Erkaklar Kostyumi',
    model: 'SN-SUIT-2026',
    sizes: '46 - 56 (M, L, XL, XXL)',
    material: 'Jun-Paxta Aralashmasi (70/30)',
    price: 'Kelishilgan narxda',
    category: 'fashion',
    desc: 'Korxonalar va rasmiy tadbirlar uchun klassik uslubdagi premium erkaklar kostyum-shim to‘plami.',
    badge: 'Top Sotuv',
  },
  {
    id: 'prod-2',
    name: 'Ishchi Maxsus Formasi (Spetsodejda)',
    model: 'SN-WORK-102',
    sizes: '44 - 60',
    material: 'Zichligi 240g/m² Ripstop paxta',
    price: '180 000 UZS',
    category: 'uniforms',
    desc: 'Sanoat sexi va qurilish obektlari uchun mustahkam, yirtilishga chidamli va cho‘ntakli ishchi formasi.',
    badge: 'Mustahkam',
  },
  {
    id: 'prod-3',
    name: 'Klassik Paxtali Erkaklar Ko‘ylagi',
    model: 'SN-SHIRT-05',
    sizes: 'S, M, L, XL, XXL',
    material: '100% Tabiiy O‘zbek Paxtasi',
    price: '95 000 UZS',
    category: 'fashion',
    desc: 'Nafas oluvchi toza paxtadan tikilgan, ajin bosmaydigan qulay kundalik ko‘ylak.',
    badge: '100% Paxta',
  },
  {
    id: 'prod-4',
    name: 'Ayollar Korporativ Forma To‘plami',
    model: 'SN-FEMALE-22',
    sizes: 'S - 3XL',
    material: 'Elastik Paxta & Poliester',
    price: 'Kelishilgan narxda',
    category: 'uniforms',
    desc: 'Kompaniya xodimalari uchun zamonaviy bichimdagi kostyum-yubka va nimchalar.',
    badge: 'Korporativ',
  },
  {
    id: 'prod-5',
    name: 'Bolalar va Sport Uniformalari',
    model: 'SN-SPORT-88',
    sizes: '32 - 44 (Bolalar va O‘smirlar)',
    material: 'Yumshoq Paxtali Trikotaj',
    price: '75 000 UZS',
    category: 'fashion',
    desc: 'Sport to‘garaklari va maktablar uchun yumshoq, harakatlanishga qulay sport to‘plami.',
    badge: 'Sport',
  },
  {
    id: 'prod-6',
    name: 'Mehmonxona & Shifoxona Choyshab To‘plami',
    model: 'SN-BED-300',
    sizes: 'Bir kishilik / Ikki kishilik',
    material: '100% Paxta Saten / Biaz',
    price: 'Kelishilgan narxda',
    category: 'bedding',
    desc: 'Mehmonxonalar va sanatoriylar uchun uzoq yillik yuvishga chidamli toza paxta choyshablari.',
    badge: 'To‘qimachilik',
  },
];

const initialTeam: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Akramov Bahodir Salomovich',
    role: 'Директор',
  },
  {
    id: 'team-2',
    name: 'Narzullayeva Dilfuza Rahimzoda',
    role: 'Кадрлар булими бошлиги',
  },
  {
    id: 'team-3',
    name: 'Qodirov Alisher Jo‘rayevich',
    role: 'Ишлаб чикариш сехи бошлиги',
  },
  {
    id: 'team-4',
    name: 'Karimov Jamshid Obidovich',
    role: 'Таъминот ва савдо булим бошлиги',
  },
  {
    id: 'team-5',
    name: 'Xolmurodov Otabek',
    role: 'Бригада мастерлари',
  },
  {
    id: 'team-6',
    name: 'Sultonov Jasur Ro‘zimurodovich',
    role: 'Тажриба сехи булими бошлиги',
  },
  {
    id: 'team-7',
    name: 'Saliyev Jamshid Joʻrayevich',
    role: 'supply',
    imageUrl: '/team/saliyev.png',
  },
  {
    id: 'team-8',
    name: 'Kodirov Akmal Ochilovich',
    role: 'production',
    imageUrl: '/team/kodirov.png',
  },
  {
    id: 'team-9',
    name: 'Boboqulov Akmal Abdullayevich',
    role: 'hr',
    imageUrl: '/team/boboqulov.png',
  },
  {
    id: 'team-10',
    name: 'Raximberdiyeva Shohista',
    role: 'pr',
    imageUrl: '/team/raximberdiyeva.png',
  },
  {
    id: 'team-11',
    name: 'Jumayeva Nasiba Ibodullayevna',
    role: 'inspector',
    imageUrl: '/team/jumayeva.png',
  },
];

const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'SANAM Fabrikasiga Yangi Yapon Tikuv Komplekslari Keltirildi',
    date: '2026-07-28',
    category: 'Texnologiya',
    summary: 'Fabrikamiz ishlab chiqarish unumdorligini 40% ga oshiradigan avtomatlashtirilgan yangi dastgohlarni ishga tushirdi.',
    content: 'SANAM OFFICIAL fabrikasi Qashqadaryo viloyatida eng zamonaviy tikuv uskunalarini o’rnatishda davom etmoqda.',
  },
  {
    id: 'news-2',
    title: 'Korporativ Uniforma Tikish Bo‘yicha Katta Shartnoma Imzolandi',
    date: '2026-07-15',
    category: 'Hamkorlik',
    summary: 'Qarshi shahridagi yirik sanoat korxonasi uchun 2000 dan ortiq maxsus ishchi kiyimlari tayyorlanmoqda.',
    content: 'SANAM Garment Factory hududiy korxonalar uchun sifatli va chidamli ishchi uniformalarini ishlab chiqarishda yetakchilikni saqlab qolmoqda.',
  },
];

const initialFeedbacks: FeedbackItem[] = [
  {
    id: 'fb-1',
    name: 'Parvina',
    rating: 5,
    text: "Quality products! Fabrikada tikilgan mahsulotlar juda sifatli va toza tikilgan. Buyurtmamiz a'lo darajada tayyorlandi. Katta rahmat!",
    date: '2026-07-20',
    approved: true,
  },
  {
    id: 'fb-2',
    name: 'Venera',
    rating: 5,
    text: 'Quality products! Narxlari juda qulay, tikuv sifati xalqaro andozalarga mos. Xodimlari juda xushmuomala.',
    date: '2026-07-18',
    approved: true,
  },
  {
    id: 'fb-3',
    name: 'Jasurbek K.',
    rating: 5,
    text: "Qarshi shahridagi eng yaxshi tikuvchilik fabrikasi. Korporativ kiyimlarni qisqa fursatda va a'lo sifatda tikib berishdi.",
    date: '2026-07-10',
    approved: true,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentLang, setCurrentLangState] = useState<Language>('uz');

  const [visitorsCount, setVisitorsCount] = useState<number>(452);
  const [calcCount, setCalcCount] = useState<number>(89);
  const [leadsCount, setLeadsCount] = useState<number>(64);

  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [teamList, setTeamList] = useState<TeamMember[]>(initialTeam);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [calcInquiries, setCalcInquiries] = useState<CalcInquiry[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);

  // Load theme and data from localStorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('sanam_theme');
      if (storedTheme === 'dark') setIsDarkMode(true);

      const storedLang = localStorage.getItem('sanam_lang') as Language;
      if (storedLang && ['uz', 'ru', 'en'].includes(storedLang)) {
        setCurrentLangState(storedLang);
      }

      const storedVisitors = localStorage.getItem('sanam_visitors');
      if (storedVisitors) setVisitorsCount(parseInt(storedVisitors, 10));

      const storedCalc = localStorage.getItem('sanam_calc_count');
      if (storedCalc) setCalcCount(parseInt(storedCalc, 10));

      const storedLeadsCount = localStorage.getItem('sanam_leads_count');
      if (storedLeadsCount) setLeadsCount(parseInt(storedLeadsCount, 10));

      const storedCategories = localStorage.getItem('sanam_categories');
      if (storedCategories) setCategories(JSON.parse(storedCategories));

      const storedProducts = localStorage.getItem('sanam_products_v3');
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedTeam = localStorage.getItem('sanam_team');
      if (storedTeam) setTeamList(JSON.parse(storedTeam));

      const storedNews = localStorage.getItem('sanam_news');
      if (storedNews) setNewsList(JSON.parse(storedNews));

      const storedLeads = localStorage.getItem('sanam_leads');
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedCalcInquiries = localStorage.getItem('sanam_calc_inquiries');
      if (storedCalcInquiries) setCalcInquiries(JSON.parse(storedCalcInquiries));

      const storedFeedbacks = localStorage.getItem('sanam_feedbacks');
      if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));
    } catch (e) {
      console.error('LocalStorage load error', e);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('sanam_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setCurrentLangState(lang);
    localStorage.setItem('sanam_lang', lang);
  };

  const incrementVisitors = () => {
    setVisitorsCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('sanam_visitors', next.toString());
      return next;
    });
  };

  const incrementCalc = () => {
    setCalcCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('sanam_calc_count', next.toString());
      return next;
    });
  };

  const incrementLeads = () => {
    setLeadsCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('sanam_leads_count', next.toString());
      return next;
    });
  };

  // Categories CRUD
  const addCategory = (cat: Omit<CategoryItem, 'id'>) => {
    const newItem: CategoryItem = { ...cat, id: 'cat-' + Date.now() };
    const updated = [...categories, newItem];
    setCategories(updated);
    localStorage.setItem('sanam_categories', JSON.stringify(updated));
  };

  const updateCategory = (id: string, updatedFields: Partial<CategoryItem>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    setCategories(updated);
    localStorage.setItem('sanam_categories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('sanam_categories', JSON.stringify(updated));
  };

  // Product CRUD
  const addProduct = (product: Omit<ProductItem, 'id'>) => {
    const newItem: ProductItem = { ...product, id: 'prod-' + Date.now() };
    const updated = [newItem, ...products];
    setProducts(updated);
    localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
  };

  const updateProduct = (id: string, updatedFields: Partial<ProductItem>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
  };

  // News CRUD
  const addNews = (news: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = { ...news, id: 'news-' + Date.now() };
    const updated = [newItem, ...newsList];
    setNewsList(updated);
    localStorage.setItem('sanam_news', JSON.stringify(updated));
  };

  const updateNews = (id: string, updatedFields: Partial<NewsItem>) => {
    const updated = newsList.map((n) => (n.id === id ? { ...n, ...updatedFields } : n));
    setNewsList(updated);
    localStorage.setItem('sanam_news', JSON.stringify(updated));
  };

  const deleteNews = (id: string) => {
    const updated = newsList.filter((n) => n.id !== id);
    setNewsList(updated);
    localStorage.setItem('sanam_news', JSON.stringify(updated));
  };

  // Team CRUD
  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newItem: TeamMember = { ...member, id: 'team-' + Date.now() };
    const updated = [...teamList, newItem];
    setTeamList(updated);
    localStorage.setItem('sanam_team', JSON.stringify(updated));
  };

  const updateTeamMember = (id: string, updatedFields: Partial<TeamMember>) => {
    const updated = teamList.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTeamList(updated);
    localStorage.setItem('sanam_team', JSON.stringify(updated));
  };

  const deleteTeamMember = (id: string) => {
    const updated = teamList.filter((t) => t.id !== id);
    setTeamList(updated);
    localStorage.setItem('sanam_team', JSON.stringify(updated));
  };

  // Leads & Inquiries
  const addLead = (lead: Omit<LeadItem, 'id' | 'date' | 'status'>) => {
    const newItem: LeadItem = {
      ...lead,
      id: 'lead-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updated = [newItem, ...leads];
    setLeads(updated);
    localStorage.setItem('sanam_leads', JSON.stringify(updated));
    incrementLeads();
  };

  const addCalcInquiry = (inquiry: Omit<CalcInquiry, 'id' | 'date' | 'status'>) => {
    const newItem: CalcInquiry = {
      ...inquiry,
      id: 'calc-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updated = [newItem, ...calcInquiries];
    setCalcInquiries(updated);
    localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));
    incrementCalc();
  };

  const updateLeadStatus = (id: string, status: LeadItem['status']) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    setLeads(updated);
    localStorage.setItem('sanam_leads', JSON.stringify(updated));
  };

  const updateCalcStatus = (id: string, status: CalcInquiry['status']) => {
    const updated = calcInquiries.map((c) => (c.id === id ? { ...c, status } : c));
    setCalcInquiries(updated);
    localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));
  };

  // Feedback
  const addFeedback = (feedback: Omit<FeedbackItem, 'id' | 'date' | 'approved'>) => {
    const newItem: FeedbackItem = {
      ...feedback,
      id: 'fb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      approved: false,
    };
    const updated = [newItem, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));
  };

  const toggleApproveFeedback = (id: string) => {
    const updated = feedbacks.map((f) => (f.id === id ? { ...f, approved: !f.approved } : f));
    setFeedbacks(updated);
    localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));
  };

  const deleteFeedback = (id: string) => {
    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        currentLang,
        setLanguage,
        visitorsCount,
        calcCount,
        leadsCount,
        incrementVisitors,
        incrementCalc,
        incrementLeads,
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
        addLead,
        addCalcInquiry,
        updateLeadStatus,
        updateCalcStatus,
        feedbacks,
        addFeedback,
        toggleApproveFeedback,
        deleteFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
