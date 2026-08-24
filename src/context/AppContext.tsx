"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../data/translations';
import { CategoryItem, ProductItem, initialCategories, initialProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';

export type { CategoryItem, ProductItem };

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
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
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  visitorsCount: number;
  calcCount: number;
  leadsCount: number;
  incrementVisitors: () => void;
  incrementCalc: () => void;
  incrementLeads: () => void;
  categories: CategoryItem[];
  addCategory: (cat: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  products: ProductItem[];
  addProduct: (product: Omit<ProductItem, 'id'>) => void;
  updateProduct: (id: string, product: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  newsList: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  teamList: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  leads: LeadItem[];
  calcInquiries: CalcInquiry[];
  addLead: (lead: Omit<LeadItem, 'id' | 'date' | 'status'>) => void;
  addCalcInquiry: (inquiry: Omit<CalcInquiry, 'id' | 'date' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadItem['status']) => void;
  updateCalcStatus: (id: string, status: CalcInquiry['status']) => void;
  deleteLead: (id: string) => void;
  deleteCalcInquiry: (id: string) => void;
  feedbacks: FeedbackItem[];
  addFeedback: (feedback: Omit<FeedbackItem, 'id' | 'date' | 'approved'>) => void;
  toggleApproveFeedback: (id: string) => void;
  deleteFeedback: (id: string) => void;
  isLoading: boolean;
  syncLocalStorageToSupabase: () => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialTeam: TeamMember[] = [
  { id: 'team-7', name: 'Saliyev Jamshid Joʻrayevich', role: 'supply', imageUrl: '/team/saliyev.png' },
  { id: 'team-8', name: 'Kodirov Akmal Ochilovich', role: 'production', imageUrl: '/team/kodirov.png' },
  { id: 'team-9', name: 'Boboqulov Akmal Abdullayevich', role: 'hr', imageUrl: '/team/boboqulov.png' },
  { id: 'team-10', name: 'Raximberdiyeva Shohista', role: 'pr', imageUrl: '/team/raximberdiyeva.png' },
  { id: 'team-11', name: 'Jumayeva Nasiba Ibodullayevna', role: 'inspector', imageUrl: '/team/jumayeva.png' },
];

const initialNews: NewsItem[] = [
  {
    id: 'news-vacany-2026',
    title: 'SANAM Tikuvchilik Fabrikasi Tajribali Tikuvchilarni Ishga Taklif Qiladi!',
    date: '2026-08-24',
    category: 'Vakansiya',
    summary: '3 000 000 – 3 500 000 so\'m oylik, bepul tushlik, yotoqxona, bog\'cha va bepul xizmat avtobusi bilan ishga taklif qilamiz.',
    content: 'SANAM Tikuvchilik Fabrikasi tajribali tikuvchilarni ishga taklif etadi! Davlat buyurtmalari asosida erkaklar ko\'ylaklari, maktab formalari, kurtkalar, mudofaa va IIV xodimlari dalaviy formalari va eksport ishchi kiyimlari tikiladi.\n\n💰 Oylik maosh: 3 000 000 – 3 500 000 so\'m (Ishbay 08:00-17:00)\n\n🎁 Bepul sharoitlar:\n- 150 o\'rinli oshxonada bepul tushlik\n- 20 o\'rinli yotoqxona va 20 o\'rinli bog\'cha\n- Qarshi tumanining Xonyon, Ertepa, Mirmiron, Avrora, Kochkak, Kamandi, Boston yo\'nalishida bepul xizmat avtobusi!\n\n📍 Manzil: Qarshi sh., I.Karimov k., 221-uy.\n📞 Tel: +998 88 805 22 28, +998 97 902 18 18, +998 75 221 75 65',
  },
  {
    id: 'news-store-school',
    title: 'Sanam Tikuvchilik Fabrikasi Savdo Do\'koni va Maktab Formalari',
    date: '2026-08-22',
    category: 'Savdo do\'koni',
    summary: 'Qarshi shahridagi do\'konimizda erkaklar klassik ko\'ylaklari (40.000 so\'m) va maktab formalari (200.000 so\'m) sotuvda!',
    content: '🏢 Sanam Tikuvchilik Fabrikasi savdo do\'koni Qarshi shahrida sizning xizmatingizda!\n\n👔 Keng assortimentda:\n- Erkaklar uchun klassik oq va rangli ko\'ylaklar (40.000 so\'m)\n- Maktab formalari to\'plami (200.000 so\'m)\n- Korxona, shifoxona, harbiy va qo\'riqlash xizmati uniformalari\n\n✂️ O\'z o\'lchamingizda, istalgan uslubda va sifatli matolardan tikib beriladi!\n📞 Buyurtma uchun: +998 90 313 77 88 / +998 87 805 66 66',
  },
  {
    id: 'news-jeans-turkish',
    title: 'Erkaklar Uchun Jinsi Dvoyka - Turkiya Stili',
    date: '2026-08-18',
    category: 'Yangi to\'plam',
    summary: 'Turkiya stili asosida tikilgan 48-56 razmerdagi zamonaviy va chidamli erkaklar jinsi dvoyka to\'plami sotuvda.',
    content: 'Erkaklar uchun jinsi dvoyka Turkiya stili asosida tikilgan.\nRazmer: 48-56 razmergacha sotuvda bor.\nIkki xil ko\'rkam ranglari mavjud.\nSifatli 100% denim matosi va qulay bichim.\n\n☎️ Buyurtma uchun: +998 87 805 66 66',
  },
  {
    id: 'news-quality-principle',
    title: 'Sifat — Bizning Ustuvor Tamoyilimiz!',
    date: '2026-08-12',
    category: 'Sifat nazorati',
    summary: 'Sanam tikuvchilik fabrikasida har bir mahsulot mijoz qo\'liga yetib borishidan oldin sifat nazoratidan puxta o\'tkaziladi.',
    content: '✅ Sifat — bizning ustuvor tamoyilimiz!\nSanam tikuvchilik fabrikasida har bir mahsulot mijoz qo\'liga yetib borishidan oldin sifat nazoratidan puxta o\'tkaziladi.\n✨ Sifat tasodif emas, u mehnat va mas\'uliyat natijasidir.\n\n📩 Buyurtmalar va hamkorlik uchun biz bilan bog\'laning!',
  },
  {
    id: 'news-special-uniforms',
    title: 'Sifatli va Qulay Maxsus Ish Kiyimlari',
    date: '2026-08-08',
    category: 'Spetsodejda',
    summary: 'Sanoat korxonalari, tibbiyot, harbiy va qo\'riqlash xizmatlari uchun maxsus ish kiyimlari va uniformalar.',
    content: 'Siz sifatli va qulay maxsus ish kiyimlarini izlayapsizmi? Unda Sanam tikuvchilik fabrikasining savdo do\'koniga tashrif buyuring!\n\nBizda:\n- Korxona va tashkilotlar uchun maxsus ish kiyimlari\n- Tibbiyot xodimlari formasi\n- Harbiy va qo\'riqlash xizmati kiyimlari\n- Erkaklar klassik ko\'ylaklari\n\n📍 Manzil: Qarshi shahri, Sanam tikuvchilik fabrikasi savdo do\'koni.',
  },
  {
    id: 'news-1',
    title: 'SANAM Fabrikasiga Yangi Yapon Tikuv Komplekslari Keltirildi',
    date: '2026-07-28',
    category: 'Texnologiya',
    summary: 'Fabrikamiz ishlab chiqarish unumdorligini 40% ga oshiradigan avtomatlashtirilgan yangi dastgohlarni ishga tushirdi.',
    content: 'SANAM OFFICIAL fabrikasi Qashqadaryo viloyatida eng zamonaviy tikuv uskunalarini ornatishda davom etmoqda.',
  },
];

const initialFeedbacks: FeedbackItem[] = [
  { id: 'fb-1', name: 'Parvina', rating: 5, text: 'Quality products! Fabrikada tikilgan mahsulotlar juda sifatli va toza tikilgan. Buyurtmamiz alo darajada tayyorlandi. Katta rahmat!', date: '2026-07-20', approved: true },
  { id: 'fb-2', name: 'Venera', rating: 5, text: 'Quality products! Narxlari juda qulay, tikuv sifati xalqaro andozalarga mos. Xodimlari juda xushmuomala.', date: '2026-07-18', approved: true },
  { id: 'fb-3', name: 'Jasurbek K.', rating: 5, text: 'Qarshi shahridagi eng yaxshi tikuvchilik fabrikasi. Korporativ kiyimlarni qisqa fursatda va alo sifatda tikib berishdi.', date: '2026-07-10', approved: true },
];

// Helper: map supabase product row → ProductItem
function mapProduct(row: any): ProductItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? '',
    desc: row.description ?? row.desc ?? '',
    imageUrl: row.image_url ?? '',
    images: row.images ?? [],
    model: row.model ?? '',
    sizes: row.sizes ?? '',
    material: row.material ?? '',
    price: row.price ?? '',
    badge: row.badge ?? '',
  };
}

// Helper: map supabase category row → CategoryItem
function mapCategory(row: any): CategoryItem {
  return {
    id: row.id,
    key: row.key ?? '',
    label: row.label ?? '',
  };
}

// Helper: map supabase news row → NewsItem
function mapNews(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    date: row.date ?? '',
    category: row.category ?? '',
    summary: row.summary ?? '',
    content: row.content ?? '',
    imageUrl: row.image_url,
    videoUrl: row.video_url,
  };
}

// Helper: map supabase team row → TeamMember
function mapTeam(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? '',
    imageUrl: row.image_url,
    phone: row.phone,
  };
}

// Helper: map supabase feedback row → FeedbackItem
function mapFeedback(row: any): FeedbackItem {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating ?? 5,
    text: row.text ?? '',
    date: row.date ?? '',
    approved: row.approved ?? false,
  };
}

// Helper: map supabase lead row → LeadItem
function mapLead(row: any): LeadItem {
  return {
    id: row.id,
    name: row.name ?? '',
    phone: row.phone ?? '',
    service: row.service ?? '',
    message: row.message ?? '',
    date: row.date ?? '',
    status: row.status ?? 'new',
  };
}

// Helper: map supabase calc row → CalcInquiry
function mapCalc(row: any): CalcInquiry {
  return {
    id: row.id,
    productType: row.product_type ?? '',
    quantity: row.quantity ?? 0,
    estimatedDays: row.estimated_days ?? 0,
    phone: row.phone ?? '',
    date: row.date ?? '',
    status: row.status ?? 'new',
  };
}

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Initial immediate load from LocalStorage as fallback cache on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('sanam_theme');
      if (storedTheme === 'dark') setIsDarkMode(true);

      const storedLang = localStorage.getItem('sanam_lang') as Language;
      if (storedLang && ['uz', 'ru', 'en'].includes(storedLang)) setCurrentLangState(storedLang);

      const storedProducts = localStorage.getItem('sanam_products_v3') || localStorage.getItem('sanam_products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }

      const storedCategories = localStorage.getItem('sanam_categories');
      if (storedCategories) {
        const parsed = JSON.parse(storedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }

      const storedNews = localStorage.getItem('sanam_news');
      if (storedNews) {
        const parsed = JSON.parse(storedNews);
        if (Array.isArray(parsed) && parsed.length > 0) setNewsList(parsed);
      }

      const storedTeam = localStorage.getItem('sanam_team');
      if (storedTeam) {
        const parsed = JSON.parse(storedTeam);
        if (Array.isArray(parsed) && parsed.length > 0) setTeamList(parsed);
      }

      const storedFeedbacks = localStorage.getItem('sanam_feedbacks');
      if (storedFeedbacks) {
        const parsed = JSON.parse(storedFeedbacks);
        if (Array.isArray(parsed) && parsed.length > 0) setFeedbacks(parsed);
      }

      const storedLeads = localStorage.getItem('sanam_leads');
      if (storedLeads) {
        const parsed = JSON.parse(storedLeads);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads(parsed);
          setLeadsCount(parsed.length);
        }
      }

      const storedCalc = localStorage.getItem('sanam_calc_inquiries');
      if (storedCalc) {
        const parsed = JSON.parse(storedCalc);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCalcInquiries(parsed);
          setCalcCount(parsed.length);
        }
      }
    } catch (e) {
      console.error('LocalStorage load cache error:', e);
    }
  }, []);

  // 2. Load all data from Supabase and auto-sync missing items
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadProducts(),
        loadCategories(),
        loadNews(),
        loadTeam(),
        loadFeedbacks(),
        loadLeads(),
        loadCalcInquiries(),
      ]);
    } catch (e) {
      console.error('Error loading data from Supabase:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      
      // Read local cache
      let localList: ProductItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_products_v3') || localStorage.getItem('sanam_products');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        console.error('products load error:', error);
        if (localList.length > 0) setProducts(localList);
        return;
      }

      const dbMapped = (data || []).map(mapProduct);
      const dbIds = new Set(dbMapped.map((p) => p.id));

      // Items in localStorage or initial list not yet in Supabase
      const candidateList = localList.length > 0 ? localList : initialProducts;
      const missingInDb = candidateList.filter((p) => !dbIds.has(p.id));

      if (missingInDb.length > 0) {
        // Auto-migrate missing items to Supabase
        const rowsToInsert = missingInDb.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.desc,
          image_url: p.imageUrl,
          images: p.images ?? [],
          model: p.model,
          sizes: p.sizes,
          material: p.material,
          price: p.price,
          badge: p.badge ?? '',
        }));
        await supabase.from('products').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      const resultList = finalCombined.length > 0 ? finalCombined : initialProducts;
      setProducts(resultList);
      localStorage.setItem('sanam_products_v3', JSON.stringify(resultList));
    } catch (e) {
      console.error('loadProducts exception:', e);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      
      let localList: CategoryItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_categories');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        if (localList.length > 0) setCategories(localList);
        return;
      }

      const dbMapped = (data || []).map(mapCategory);
      const dbIds = new Set(dbMapped.map((c) => c.id));
      const candidateList = localList.length > 0 ? localList : initialCategories;
      const missingInDb = candidateList.filter((c) => !dbIds.has(c.id));

      if (missingInDb.length > 0) {
        const rowsToInsert = missingInDb.map((c) => ({
          id: c.id,
          key: c.key,
          label: c.label,
        }));
        await supabase.from('categories').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      const resultList = finalCombined.length > 0 ? finalCombined : initialCategories;
      setCategories(resultList);
      localStorage.setItem('sanam_categories', JSON.stringify(resultList));
    } catch (e) {
      console.error('loadCategories exception:', e);
    }
  };

  const loadNews = async () => {
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      
      let localList: NewsItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_news');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        if (localList.length > 0) setNewsList(localList);
        return;
      }

      const dbMapped = (data || []).map(mapNews);
      const dbIds = new Set(dbMapped.map((n) => n.id));
      const candidateList = localList.length > 0 ? localList : initialNews;
      const missingInDb = candidateList.filter((n) => !dbIds.has(n.id));

      if (missingInDb.length > 0) {
        const rowsToInsert = missingInDb.map((n) => ({
          id: n.id,
          title: n.title,
          date: n.date,
          category: n.category,
          summary: n.summary,
          content: n.content,
          image_url: n.imageUrl ?? null,
          video_url: n.videoUrl ?? null,
        }));
        await supabase.from('news').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      const resultList = finalCombined.length > 0 ? finalCombined : initialNews;
      setNewsList(resultList);
      localStorage.setItem('sanam_news', JSON.stringify(resultList));
    } catch (e) {
      console.error('loadNews exception:', e);
    }
  };

  const loadTeam = async () => {
    try {
      const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
      
      let localList: TeamMember[] = [];
      try {
        const raw = localStorage.getItem('sanam_team');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        if (localList.length > 0) setTeamList(localList);
        return;
      }

      const dbMapped = (data || []).map(mapTeam);
      const dbIds = new Set(dbMapped.map((t) => t.id));
      const candidateList = localList.length > 0 ? localList : initialTeam;
      const missingInDb = candidateList.filter((t) => !dbIds.has(t.id));

      if (missingInDb.length > 0) {
        const rowsToInsert = missingInDb.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          image_url: t.imageUrl ?? null,
          phone: t.phone ?? null,
        }));
        await supabase.from('team_members').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      const resultList = finalCombined.length > 0 ? finalCombined : initialTeam;
      setTeamList(resultList);
      localStorage.setItem('sanam_team', JSON.stringify(resultList));
    } catch (e) {
      console.error('loadTeam exception:', e);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
      
      let localList: FeedbackItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_feedbacks');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        if (localList.length > 0) setFeedbacks(localList);
        return;
      }

      const dbMapped = (data || []).map(mapFeedback);
      const dbIds = new Set(dbMapped.map((f) => f.id));
      const candidateList = localList.length > 0 ? localList : initialFeedbacks;
      const missingInDb = candidateList.filter((f) => !dbIds.has(f.id));

      if (missingInDb.length > 0) {
        const rowsToInsert = missingInDb.map((f) => ({
          id: f.id,
          name: f.name,
          rating: f.rating,
          text: f.text,
          date: f.date,
          approved: f.approved,
        }));
        await supabase.from('feedbacks').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      const resultList = finalCombined.length > 0 ? finalCombined : initialFeedbacks;
      setFeedbacks(resultList);
      localStorage.setItem('sanam_feedbacks', JSON.stringify(resultList));
    } catch (e) {
      console.error('loadFeedbacks exception:', e);
    }
  };

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      let localList: LeadItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_leads');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        if (localList.length > 0) setLeads(localList);
        return;
      }

      const dbMapped = (data || []).map(mapLead);
      const dbIds = new Set(dbMapped.map((l) => l.id));
      const missingInDb = localList.filter((l) => !dbIds.has(l.id));

      if (missingInDb.length > 0) {
        const rowsToInsert = missingInDb.map((l) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          service: l.service,
          message: l.message,
          date: l.date,
          status: l.status,
        }));
        await supabase.from('leads').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      setLeads(finalCombined);
      setLeadsCount(finalCombined.length);
      localStorage.setItem('sanam_leads', JSON.stringify(finalCombined));
    } catch (e) {
      console.error('loadLeads exception:', e);
    }
  };

  const loadCalcInquiries = async () => {
    try {
      const { data, error } = await supabase.from('calc_inquiries').select('*').order('created_at', { ascending: false });
      
      let localList: CalcInquiry[] = [];
      try {
        const raw = localStorage.getItem('sanam_calc_inquiries');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error) {
        if (localList.length > 0) setCalcInquiries(localList);
        return;
      }

      const dbMapped = (data || []).map(mapCalc);
      const dbIds = new Set(dbMapped.map((c) => c.id));
      const missingInDb = localList.filter((c) => !dbIds.has(c.id));

      if (missingInDb.length > 0) {
        const rowsToInsert = missingInDb.map((c) => ({
          id: c.id,
          product_type: c.productType,
          quantity: c.quantity,
          estimated_days: c.estimatedDays,
          phone: c.phone,
          date: c.date,
          status: c.status,
        }));
        await supabase.from('calc_inquiries').upsert(rowsToInsert);
      }

      const finalCombined = [...dbMapped, ...missingInDb];
      setCalcInquiries(finalCombined);
      setCalcCount(finalCombined.length);
      localStorage.setItem('sanam_calc_inquiries', JSON.stringify(finalCombined));
    } catch (e) {
      console.error('loadCalcInquiries exception:', e);
    }
  };

  // Explicit full sync method for Admin Panel button
  const syncLocalStorageToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      let totalPushed = 0;

      // 1. Products
      const rawProducts = localStorage.getItem('sanam_products_v3') || localStorage.getItem('sanam_products');
      if (rawProducts) {
        const pList: ProductItem[] = JSON.parse(rawProducts);
        if (pList.length > 0) {
          const rows = pList.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.desc,
            image_url: p.imageUrl,
            images: p.images ?? [],
            model: p.model,
            sizes: p.sizes,
            material: p.material,
            price: p.price,
            badge: p.badge ?? '',
          }));
          await supabase.from('products').upsert(rows);
          totalPushed += rows.length;
        }
      }

      // 2. Categories
      const rawCategories = localStorage.getItem('sanam_categories');
      if (rawCategories) {
        const cList: CategoryItem[] = JSON.parse(rawCategories);
        if (cList.length > 0) {
          const rows = cList.map((c) => ({
            id: c.id,
            key: c.key,
            label: c.label,
          }));
          await supabase.from('categories').upsert(rows);
          totalPushed += rows.length;
        }
      }

      // 3. News
      const rawNews = localStorage.getItem('sanam_news');
      if (rawNews) {
        const nList: NewsItem[] = JSON.parse(rawNews);
        if (nList.length > 0) {
          const rows = nList.map((n) => ({
            id: n.id,
            title: n.title,
            date: n.date,
            category: n.category,
            summary: n.summary,
            content: n.content,
            image_url: n.imageUrl ?? null,
            video_url: n.videoUrl ?? null,
          }));
          await supabase.from('news').upsert(rows);
          totalPushed += rows.length;
        }
      }

      // 4. Team
      const rawTeam = localStorage.getItem('sanam_team');
      if (rawTeam) {
        const tList: TeamMember[] = JSON.parse(rawTeam);
        if (tList.length > 0) {
          const rows = tList.map((t) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            image_url: t.imageUrl ?? null,
            phone: t.phone ?? null,
          }));
          await supabase.from('team_members').upsert(rows);
          totalPushed += rows.length;
        }
      }

      // 5. Feedbacks
      const rawFb = localStorage.getItem('sanam_feedbacks');
      if (rawFb) {
        const fList: FeedbackItem[] = JSON.parse(rawFb);
        if (fList.length > 0) {
          const rows = fList.map((f) => ({
            id: f.id,
            name: f.name,
            rating: f.rating,
            text: f.text,
            date: f.date,
            approved: f.approved,
          }));
          await supabase.from('feedbacks').upsert(rows);
          totalPushed += rows.length;
        }
      }

      // Reload all
      await loadAllData();
      return {
        success: true,
        message: `Muvaffaqiyatli! LocalStoragedan ${totalPushed} ta ma'lumot Supabase bazasiga yuklandi.`,
      };
    } catch (err: any) {
      console.error('syncLocalStorageToSupabase error:', err);
      return {
        success: false,
        message: `Xatolik yuz berdi: ${err?.message || 'Noma\'lum xato'}`,
      };
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadProducts())
      .subscribe();

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => loadCategories())
      .subscribe();

    const newsChannel = supabase
      .channel('news-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => loadNews())
      .subscribe();

    const teamChannel = supabase
      .channel('team-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => loadTeam())
      .subscribe();

    const feedbacksChannel = supabase
      .channel('feedbacks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, () => loadFeedbacks())
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(newsChannel);
      supabase.removeChannel(teamChannel);
      supabase.removeChannel(feedbacksChannel);
    };
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

  const incrementVisitors = () => setVisitorsCount((prev) => prev + 1);
  const incrementCalc = () => setCalcCount((prev) => prev + 1);
  const incrementLeads = () => setLeadsCount((prev) => prev + 1);

  // ==================== CATEGORIES CRUD ====================
  const addCategory = async (cat: Omit<CategoryItem, 'id'>) => {
    const newItem: CategoryItem = { ...cat, id: 'cat-' + Date.now() };
    const updated = [...categories, newItem];
    setCategories(updated);
    localStorage.setItem('sanam_categories', JSON.stringify(updated));
    const { error } = await supabase.from('categories').insert({
      id: newItem.id,
      key: newItem.key,
      label: newItem.label,
    });
    if (error) { console.error('addCategory error:', error); }
  };

  const updateCategory = async (id: string, updatedFields: Partial<CategoryItem>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    setCategories(updated);
    localStorage.setItem('sanam_categories', JSON.stringify(updated));

    const dbFields: any = {};
    if (updatedFields.key !== undefined) dbFields.key = updatedFields.key;
    if (updatedFields.label !== undefined) dbFields.label = updatedFields.label;
    const { error } = await supabase.from('categories').update(dbFields).eq('id', id);
    if (error) { console.error('updateCategory error:', error); }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('sanam_categories', JSON.stringify(updated));
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { console.error('deleteCategory error:', error); }
  };

  // ==================== PRODUCTS CRUD ====================
  const addProduct = async (product: Omit<ProductItem, 'id'>) => {
    const newItem: ProductItem = { ...product, id: 'prod-' + Date.now() };
    const updated = [newItem, ...products];
    setProducts(updated);
    localStorage.setItem('sanam_products_v3', JSON.stringify(updated));

    const { error } = await supabase.from('products').insert({
      id: newItem.id,
      name: newItem.name,
      category: newItem.category,
      description: newItem.desc,
      image_url: newItem.imageUrl,
      images: newItem.images ?? [],
      model: newItem.model,
      sizes: newItem.sizes,
      material: newItem.material,
      price: newItem.price,
      badge: newItem.badge ?? '',
    });
    if (error) { console.error('addProduct error:', error); }
  };

  const updateProduct = async (id: string, updatedFields: Partial<ProductItem>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    localStorage.setItem('sanam_products_v3', JSON.stringify(updated));

    const dbFields: any = {};
    if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
    if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
    if (updatedFields.desc !== undefined) dbFields.description = updatedFields.desc;
    if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
    if (updatedFields.images !== undefined) dbFields.images = updatedFields.images;
    if (updatedFields.model !== undefined) dbFields.model = updatedFields.model;
    if (updatedFields.sizes !== undefined) dbFields.sizes = updatedFields.sizes;
    if (updatedFields.material !== undefined) dbFields.material = updatedFields.material;
    if (updatedFields.price !== undefined) dbFields.price = updatedFields.price;
    if (updatedFields.badge !== undefined) dbFields.badge = updatedFields.badge;
    const { error } = await supabase.from('products').update(dbFields).eq('id', id);
    if (error) { console.error('updateProduct error:', error); }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { console.error('deleteProduct error:', error); }
  };

  // ==================== NEWS CRUD ====================
  const addNews = async (news: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = { ...news, id: 'news-' + Date.now() };
    const updated = [newItem, ...newsList];
    setNewsList(updated);
    localStorage.setItem('sanam_news', JSON.stringify(updated));

    const { error } = await supabase.from('news').insert({
      id: newItem.id,
      title: newItem.title,
      date: newItem.date,
      category: newItem.category,
      summary: newItem.summary,
      content: newItem.content,
      image_url: newItem.imageUrl ?? null,
      video_url: newItem.videoUrl ?? null,
    });
    if (error) { console.error('addNews error:', error); }
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsItem>) => {
    const updated = newsList.map((n) => (n.id === id ? { ...n, ...updatedFields } : n));
    setNewsList(updated);
    localStorage.setItem('sanam_news', JSON.stringify(updated));

    const dbFields: any = {};
    if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
    if (updatedFields.date !== undefined) dbFields.date = updatedFields.date;
    if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
    if (updatedFields.summary !== undefined) dbFields.summary = updatedFields.summary;
    if (updatedFields.content !== undefined) dbFields.content = updatedFields.content;
    if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
    if (updatedFields.videoUrl !== undefined) dbFields.video_url = updatedFields.videoUrl;
    const { error } = await supabase.from('news').update(dbFields).eq('id', id);
    if (error) { console.error('updateNews error:', error); }
  };

  const deleteNews = async (id: string) => {
    const updated = newsList.filter((n) => n.id !== id);
    setNewsList(updated);
    localStorage.setItem('sanam_news', JSON.stringify(updated));
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) { console.error('deleteNews error:', error); }
  };

  // ==================== TEAM CRUD ====================
  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    const newItem: TeamMember = { ...member, id: 'team-' + Date.now() };
    const updated = [...teamList, newItem];
    setTeamList(updated);
    localStorage.setItem('sanam_team', JSON.stringify(updated));

    const { error } = await supabase.from('team_members').insert({
      id: newItem.id,
      name: newItem.name,
      role: newItem.role,
      image_url: newItem.imageUrl ?? null,
      phone: newItem.phone ?? null,
    });
    if (error) { console.error('addTeamMember error:', error); }
  };

  const updateTeamMember = async (id: string, updatedFields: Partial<TeamMember>) => {
    const updated = teamList.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTeamList(updated);
    localStorage.setItem('sanam_team', JSON.stringify(updated));

    const dbFields: any = {};
    if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
    if (updatedFields.role !== undefined) dbFields.role = updatedFields.role;
    if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
    if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone;
    const { error } = await supabase.from('team_members').update(dbFields).eq('id', id);
    if (error) { console.error('updateTeamMember error:', error); }
  };

  const deleteTeamMember = async (id: string) => {
    const updated = teamList.filter((t) => t.id !== id);
    setTeamList(updated);
    localStorage.setItem('sanam_team', JSON.stringify(updated));

    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) { console.error('deleteTeamMember error:', error); }
  };

  // ==================== LEADS ====================
  const addLead = async (lead: Omit<LeadItem, 'id' | 'date' | 'status'>) => {
    const newItem: LeadItem = {
      ...lead,
      id: 'lead-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updated = [newItem, ...leads];
    setLeads(updated);
    localStorage.setItem('sanam_leads', JSON.stringify(updated));

    const { error } = await supabase.from('leads').insert({
      id: newItem.id,
      name: newItem.name,
      phone: newItem.phone,
      service: newItem.service,
      message: newItem.message,
      date: newItem.date,
      status: newItem.status,
    });
    if (error) { console.error('addLead error:', error); }
    incrementLeads();
  };

  const addCalcInquiry = async (inquiry: Omit<CalcInquiry, 'id' | 'date' | 'status'>) => {
    const newItem: CalcInquiry = {
      ...inquiry,
      id: 'calc-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updated = [newItem, ...calcInquiries];
    setCalcInquiries(updated);
    localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));

    const { error } = await supabase.from('calc_inquiries').insert({
      id: newItem.id,
      product_type: newItem.productType,
      quantity: newItem.quantity,
      estimated_days: newItem.estimatedDays,
      phone: newItem.phone,
      date: newItem.date,
      status: newItem.status,
    });
    if (error) { console.error('addCalcInquiry error:', error); }
    incrementCalc();
  };

  const updateLeadStatus = async (id: string, status: LeadItem['status']) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    setLeads(updated);
    localStorage.setItem('sanam_leads', JSON.stringify(updated));

    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) { console.error('updateLeadStatus error:', error); }
  };

  const updateCalcStatus = async (id: string, status: CalcInquiry['status']) => {
    const updated = calcInquiries.map((c) => (c.id === id ? { ...c, status } : c));
    setCalcInquiries(updated);
    localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));

    const { error } = await supabase.from('calc_inquiries').update({ status }).eq('id', id);
    if (error) { console.error('updateCalcStatus error:', error); }
  };

  const deleteLead = async (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    setLeadsCount(updated.length);
    localStorage.setItem('sanam_leads', JSON.stringify(updated));

    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) { console.error('deleteLead error:', error); }
  };

  const deleteCalcInquiry = async (id: string) => {
    const updated = calcInquiries.filter((c) => c.id !== id);
    setCalcInquiries(updated);
    setCalcCount(updated.length);
    localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));

    const { error } = await supabase.from('calc_inquiries').delete().eq('id', id);
    if (error) { console.error('deleteCalcInquiry error:', error); }
  };

  // ==================== FEEDBACKS ====================
  const addFeedback = async (feedback: Omit<FeedbackItem, 'id' | 'date' | 'approved'>) => {
    const newItem: FeedbackItem = {
      ...feedback,
      id: 'fb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      approved: false,
    };
    const updated = [newItem, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));

    const { error } = await supabase.from('feedbacks').insert({
      id: newItem.id,
      name: newItem.name,
      rating: newItem.rating,
      text: newItem.text,
      date: newItem.date,
      approved: newItem.approved,
    });
    if (error) { console.error('addFeedback error:', error); }
  };

  const toggleApproveFeedback = async (id: string) => {
    const fb = feedbacks.find((f) => f.id === id);
    if (!fb) return;
    const newApproved = !fb.approved;
    const updated = feedbacks.map((f) => (f.id === id ? { ...f, approved: newApproved } : f));
    setFeedbacks(updated);
    localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));

    const { error } = await supabase.from('feedbacks').update({ approved: newApproved }).eq('id', id);
    if (error) { console.error('toggleApproveFeedback error:', error); }
  };

  const deleteFeedback = async (id: string) => {
    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));

    const { error } = await supabase.from('feedbacks').delete().eq('id', id);
    if (error) { console.error('deleteFeedback error:', error); }
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
        deleteLead,
        deleteCalcInquiry,
        feedbacks,
        addFeedback,
        toggleApproveFeedback,
        deleteFeedback,
        isLoading,
        syncLocalStorageToSupabase,
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
