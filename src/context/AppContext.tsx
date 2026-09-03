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

export interface ServiceTypeItem {
  id: string;
  name: string;
  nameRu?: string;
  nameEn?: string;
}

export const initialServiceTypes: ServiceTypeItem[] = [
  { id: 'srv-1', name: "Ulgurji kiyim tikish", nameRu: "Оптовый пошив одежды", nameEn: "Wholesale garment manufacturing" },
  { id: 'srv-2', name: "Ishchi maxsus forma (Spetsodejda)", nameRu: "Рабочая спецодежда", nameEn: "Workwear & Uniforms" },
  { id: 'srv-3', name: "Korporativ uniformalar", nameRu: "Корпоративная униформа", nameEn: "Corporate uniforms" },
  { id: 'srv-4', name: "To'qimachilik va choyshablar", nameRu: "Текстиль и постельное белье", nameEn: "Textiles & Bed linen" },
  { id: 'srv-5', name: "Erkaklar kostyum va ko'ylaklari", nameRu: "Мужские костюмы и рубашки", nameEn: "Men suits and shirts" },
  { id: 'srv-6', name: "Ayollar kiyimlari", nameRu: "Женская одежда", nameEn: "Women clothing" },
  { id: 'srv-7', name: "Bolalar va sport kiyimlari", nameRu: "Детская и спортивная одежда", nameEn: "Kids & sportswear" },
  { id: 'srv-8', name: "Maktab formalari", nameRu: "Школьная форма", nameEn: "School uniforms" },
  { id: 'srv-9', name: "Tibbiyot formalari", nameRu: "Медицинская форма", nameEn: "Medical uniforms" },
  { id: 'srv-10', name: "Oshpaz va xizmatchi formalari", nameRu: "Форма для поваров и персонала", nameEn: "Chef & staff uniforms" },
  { id: 'srv-11', name: "Kombinezonlar", nameRu: "Комбинезоны", nameEn: "Overalls & Coveralls" },
  { id: 'srv-12', name: "Jiletlar", nameRu: "Жилеты", nameEn: "Vests" },
  { id: 'srv-13', name: "Futbolkalar", nameRu: "Футболки", nameEn: "T-shirts & Polos" },
  { id: 'srv-14', name: "Shimlar", nameRu: "Брюки", nameEn: "Trousers & Pants" },
  { id: 'srv-15', name: "Yotoq anjomlari", nameRu: "Постельные принадлежности", nameEn: "Bedding accessories" },
  { id: 'srv-16', name: "Mehmonxona tapochkalar", nameRu: "Гостиничные тапочки", nameEn: "Hotel slippers" },
  { id: 'srv-17', name: "Boshqa zakaz", nameRu: "Другой заказ", nameEn: "Other custom order" },
];

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
  serviceTypes: ServiceTypeItem[];
  addServiceType: (srv: Omit<ServiceTypeItem, 'id'>) => void;
  updateServiceType: (id: string, srv: Partial<ServiceTypeItem>) => void;
  deleteServiceType: (id: string) => void;
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
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'news-store-school',
    title: 'Sanam Tikuvchilik Fabrikasi Savdo Do\'koni va Maktab Formalari',
    date: '2026-08-22',
    category: 'Savdo do\'koni',
    summary: 'Qarshi shahridagi do\'konimizda erkaklar klassik ko\'ylaklari (40.000 so\'m) va maktab formalari (200.000 so\'m) sotuvda!',
    content: '🏢 Sanam Tikuvchilik Fabrikasi savdo do\'koni Qarshi shahrida sizning xizmatingizda!\n\n👔 Keng assortimentda:\n- Erkaklar uchun klassik oq va rangli ko\'ylaklar (40.000 so\'m)\n- Maktab formalari to\'plami (200.000 so\'m)\n- Korxona, shifoxona, harbiy va qo\'riqlash xizmati uniformalari\n\n✂️ O\'z o\'lchamingizda, istalgan uslubda va sifatli matolardan tikib beriladi!\n📞 Buyurtma uchun: +998 90 313 77 88 / +998 87 805 66 66',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'news-jeans-turkish',
    title: 'Erkaklar Uchun Jinsi Dvoyka - Turkiya Stili',
    date: '2026-08-18',
    category: 'Yangi to\'plam',
    summary: 'Turkiya stili asosida tikilgan 48-56 razmerdagi zamonaviy va chidamli erkaklar jinsi dvoyka to\'plami sotuvda.',
    content: 'Erkaklar uchun jinsi dvoyka Turkiya stili asosida tikilgan.\nRazmer: 48-56 razmergacha sotuvda bor.\nIkki xil ko\'rkam ranglari mavjud.\nSifatli 100% denim matosi va qulay bichim.\n\n☎️ Buyurtma uchun: +998 87 805 66 66',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'news-quality-principle',
    title: 'Sifat — Bizning Ustuvor Tamoyilimiz!',
    date: '2026-08-12',
    category: 'Sifat nazorati',
    summary: 'Sanam tikuvchilik fabrikasida har bir mahsulot mijoz qo\'liga yetib borishidan oldin sifat nazoratidan puxta o\'tkaziladi.',
    content: '✅ Sifat — bizning ustuvor tamoyilimiz!\nSanam tikuvchilik fabrikasida har bir mahsulot mijoz qo\'liga yetib borishidan oldin sifat nazoratidan puxta o\'tkaziladi.\n✨ Sifat tasodif emas, u mehnat va mas\'uliyat natijasidir.\n\n📩 Buyurtmalar va hamkorlik uchun biz bilan bog\'laning!',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'news-special-uniforms',
    title: 'Sifatli va Qulay Maxsus Ish Kiyimlari',
    date: '2026-08-08',
    category: 'Spetsodejda',
    summary: 'Sanoat korxonalari, tibbiyot, harbiy va qo\'riqlash xizmatlari uchun maxsus ish kiyimlari va uniformalar.',
    content: 'Siz sifatli va qulay maxsus ish kiyimlarini izlayapsizmi? Unda Sanam tikuvchilik fabrikasining savdo do\'koniga tashrif buyuring!\n\nBizda:\n- Korxona va tashkilotlar uchun maxsus ish kiyimlari\n- Tibbiyot xodimlari formasi\n- Harbiy va qo\'riqlash xizmati kiyimlari\n- Erkaklar klassik ko\'ylaklari\n\n📍 Manzil: Qarshi shahri, Sanam tikuvchilik fabrikasi savdo do\'koni.',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'news-1',
    title: 'SANAM Fabrikasiga Yangi Yapon Tikuv Komplekslari Keltirildi',
    date: '2026-07-28',
    category: 'Texnologiya',
    summary: 'Fabrikamiz ishlab chiqarish unumdorligini 40% ga oshiradigan avtomatlashtirilgan yangi dastgohlarni ishga tushirdi.',
    content: 'SANAM OFFICIAL fabrikasi Qashqadaryo viloyatida eng zamonaviy tikuv uskunalarini ornatishda davom etmoqda.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
  },
];

const initialFeedbacks: FeedbackItem[] = [
  { id: 'fb-1', name: 'Parvina', rating: 5, text: 'Quality products! Fabrikada tikilgan mahsulotlar juda sifatli va toza tikilgan. Buyurtmamiz alo darajada tayyorlandi. Katta rahmat!', date: '2026-07-20', approved: true },
  { id: 'fb-2', name: 'Venera', rating: 5, text: 'Quality products! Narxlari juda qulay, tikuv sifati xalqaro andozalarga mos. Xodimlari juda xushmuomala.', date: '2026-07-18', approved: true },
  { id: 'fb-3', name: 'Jasurbek K.', rating: 5, text: 'Qarshi shahridagi eng yaxshi tikuvchilik fabrikasi. Korporativ kiyimlarni qisqa fursatda va alo sifatda tikib berishdi.', date: '2026-07-10', approved: true },
];

function mapProduct(row: any): ProductItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? '',
    desc: row.description ?? row.desc ?? '',
    imageUrl: row.image_url ?? '',
    images: Array.isArray(row.images) ? row.images : (row.image_url ? [row.image_url] : []),
    model: row.model ?? '',
    sizes: row.sizes ?? '',
    material: row.material ?? '',
    price: row.price ?? '',
    badge: row.badge ?? '',
  };
}

function mapCategory(row: any): CategoryItem {
  return {
    id: row.id,
    key: row.key ?? '',
    label: row.label ?? '',
  };
}

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

function mapTeam(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? '',
    imageUrl: row.image_url,
    phone: row.phone,
  };
}

function mapLead(row: any): LeadItem {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    service: row.service ?? '',
    message: row.message ?? '',
    date: row.date ?? '',
    status: row.status ?? 'new',
  };
}

function mapCalc(row: any): CalcInquiry {
  return {
    id: row.id,
    productType: row.product_type ?? '',
    quantity: row.quantity ?? 0,
    estimatedDays: row.estimated_days ?? 0,
    phone: row.phone,
    date: row.date ?? '',
    status: row.status ?? 'new',
  };
}

function mapFeedback(row: any): FeedbackItem {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating ?? 5,
    text: row.text,
    date: row.date ?? '',
    approved: row.approved ?? false,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentLang, setCurrentLangState] = useState<Language>('uz');
  const [visitorsCount, setVisitorsCount] = useState<number>(452);
  const [calcCount, setCalcCount] = useState<number>(89);
  const [leadsCount, setLeadsCount] = useState<number>(64);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeItem[]>(initialServiceTypes);
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

      const storedServices = localStorage.getItem('sanam_service_types');
      if (storedServices) {
        const parsed = JSON.parse(storedServices);
        if (Array.isArray(parsed) && parsed.length > 0) setServiceTypes(parsed);
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

  // 2. Load all data from Supabase once on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        loadProducts(),
        loadCategories(),
        loadServiceTypes(),
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
      
      let localList: ProductItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_products_v3') || localStorage.getItem('sanam_products');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error || !data) {
        if (localList.length > 0) setProducts(localList);
        return;
      }

      const dbMapped = data.map(mapProduct);
      const dbMap = new Map<string, ProductItem>();
      dbMapped.forEach((p) => dbMap.set(p.id, p));

      const candidateMap = new Map<string, ProductItem>();
      [...initialProducts, ...localList].forEach((p) => candidateMap.set(p.id, p));

      const mergedList: ProductItem[] = [];

      candidateMap.forEach((localItem, id) => {
        const dbItem = dbMap.get(id);
        if (dbItem) {
          mergedList.push({
            ...localItem,
            ...dbItem,
            imageUrl: dbItem.imageUrl || localItem.imageUrl,
            images: (dbItem.images && dbItem.images.length > 0) ? dbItem.images : (localItem.images ?? (localItem.imageUrl ? [localItem.imageUrl] : [])),
          });
          dbMap.delete(id);
        } else {
          mergedList.push(localItem);
        }
      });

      dbMap.forEach((dbItem) => mergedList.push(dbItem));

      const resultList = mergedList.length > 0 ? mergedList : initialProducts;
      setProducts(resultList);
      try {
        localStorage.setItem('sanam_products_v3', JSON.stringify(resultList));
      } catch (e) {}
    } catch (e) {
      console.error('loadProducts exception:', e);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      
      let localList: CategoryItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_categories');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error || !data || data.length === 0) {
        if (localList.length > 0) setCategories(localList);
        return;
      }

      const dbMapped = data.map(mapCategory);
      const dbMap = new Map<string, CategoryItem>();
      dbMapped.forEach((c) => dbMap.set(c.id, c));

      const candidateMap = new Map<string, CategoryItem>();
      [...initialCategories, ...localList].forEach((c) => candidateMap.set(c.id, c));

      const mergedList: CategoryItem[] = [];

      candidateMap.forEach((localItem, id) => {
        const dbItem = dbMap.get(id);
        if (dbItem) {
          mergedList.push({ ...localItem, ...dbItem });
          dbMap.delete(id);
        } else {
          mergedList.push(localItem);
        }
      });

      dbMap.forEach((dbItem) => mergedList.push(dbItem));

      const resultList = mergedList.length > 0 ? mergedList : initialCategories;
      setCategories(resultList);
      try {
        localStorage.setItem('sanam_categories', JSON.stringify(resultList));
      } catch (e) {}
    } catch (e) {
      console.error('loadCategories exception:', e);
    }
  };

  const loadServiceTypes = async () => {
    try {
      const { data, error } = await supabase.from('service_types').select('*');
      
      let localList: ServiceTypeItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_service_types');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error || !data || data.length === 0) {
        const fallback = localList.length > 0 ? localList : initialServiceTypes;
        setServiceTypes(fallback);
        return;
      }

      const dbMapped: ServiceTypeItem[] = data.map((row: any) => ({
        id: row.id,
        name: row.name ?? '',
        nameRu: row.name_ru ?? row.name,
        nameEn: row.name_en ?? row.name,
      }));

      const dbMap = new Map<string, ServiceTypeItem>();
      dbMapped.forEach((s) => dbMap.set(s.id, s));

      const candidateMap = new Map<string, ServiceTypeItem>();
      [...initialServiceTypes, ...localList].forEach((s) => candidateMap.set(s.id, s));

      const mergedList: ServiceTypeItem[] = [];

      candidateMap.forEach((localItem, id) => {
        const dbItem = dbMap.get(id);
        if (dbItem) {
          mergedList.push({ ...localItem, ...dbItem });
          dbMap.delete(id);
        } else {
          mergedList.push(localItem);
        }
      });

      dbMap.forEach((dbItem) => mergedList.push(dbItem));

      const resultList = mergedList.length > 0 ? mergedList : initialServiceTypes;
      setServiceTypes(resultList);
      try {
        localStorage.setItem('sanam_service_types', JSON.stringify(resultList));
      } catch (e) {}
    } catch (e) {
      console.error('loadServiceTypes exception:', e);
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

      if (error || !data) {
        if (localList.length > 0) setNewsList(localList);
        return;
      }

      const dbMapped = data.map(mapNews);
      const dbMap = new Map<string, NewsItem>();
      dbMapped.forEach((n) => dbMap.set(n.id, n));

      const candidateMap = new Map<string, NewsItem>();
      [...initialNews, ...localList].forEach((n) => candidateMap.set(n.id, n));

      const mergedList: NewsItem[] = [];

      candidateMap.forEach((localItem, id) => {
        const dbItem = dbMap.get(id);
        if (dbItem) {
          mergedList.push({
            ...localItem,
            ...dbItem,
            imageUrl: dbItem.imageUrl || localItem.imageUrl,
            videoUrl: dbItem.videoUrl || localItem.videoUrl,
          });
          dbMap.delete(id);
        } else {
          mergedList.push(localItem);
        }
      });

      dbMap.forEach((dbItem) => mergedList.push(dbItem));

      const resultList = mergedList.length > 0 ? mergedList : initialNews;
      setNewsList(resultList);
      try {
        localStorage.setItem('sanam_news', JSON.stringify(resultList));
      } catch (e) {}
    } catch (e) {
      console.error('loadNews exception:', e);
    }
  };

  const loadTeam = async () => {
    try {
      const { data, error } = await supabase.from('team_members').select('*');
      
      let localList: TeamMember[] = [];
      try {
        const raw = localStorage.getItem('sanam_team');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error || !data) {
        if (localList.length > 0) setTeamList(localList);
        return;
      }

      const dbMapped = data.map(mapTeam);
      const dbMap = new Map<string, TeamMember>();
      dbMapped.forEach((t) => dbMap.set(t.id, t));

      const candidateMap = new Map<string, TeamMember>();
      [...initialTeam, ...localList].forEach((t) => candidateMap.set(t.id, t));

      const mergedList: TeamMember[] = [];

      candidateMap.forEach((localItem, id) => {
        const dbItem = dbMap.get(id);
        if (dbItem) {
          mergedList.push({
            ...localItem,
            ...dbItem,
            imageUrl: dbItem.imageUrl || localItem.imageUrl,
          });
          dbMap.delete(id);
        } else {
          mergedList.push(localItem);
        }
      });

      dbMap.forEach((dbItem) => mergedList.push(dbItem));

      const resultList = mergedList.length > 0 ? mergedList : initialTeam;
      setTeamList(resultList);
      try {
        localStorage.setItem('sanam_team', JSON.stringify(resultList));
      } catch (e) {}
    } catch (e) {
      console.error('loadTeam exception:', e);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase.from('feedbacks').select('*');
      
      let localList: FeedbackItem[] = [];
      try {
        const raw = localStorage.getItem('sanam_feedbacks');
        if (raw) localList = JSON.parse(raw);
      } catch (e) {}

      if (error || !data) {
        if (localList.length > 0) setFeedbacks(localList);
        return;
      }

      const dbMapped = data.map(mapFeedback);
      const dbIds = new Set(dbMapped.map((f) => f.id));
      const candidateList = localList.length > 0 ? localList : initialFeedbacks;
      const missingInDb = candidateList.filter((f) => !dbIds.has(f.id));

      const finalCombined = [...dbMapped, ...missingInDb];
      const resultList = finalCombined.length > 0 ? finalCombined : initialFeedbacks;
      setFeedbacks(resultList);
      try {
        localStorage.setItem('sanam_feedbacks', JSON.stringify(resultList));
      } catch (e) {}
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

      if (error || !data) {
        if (localList.length > 0) setLeads(localList);
        return;
      }

      const dbMapped = data.map(mapLead);
      const dbIds = new Set(dbMapped.map((l) => l.id));
      const missingInDb = localList.filter((l) => !dbIds.has(l.id));

      const finalCombined = [...dbMapped, ...missingInDb];
      setLeads(finalCombined);
      setLeadsCount(finalCombined.length);
      try {
        localStorage.setItem('sanam_leads', JSON.stringify(finalCombined));
      } catch (e) {}
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

      if (error || !data) {
        if (localList.length > 0) setCalcInquiries(localList);
        return;
      }

      const dbMapped = data.map(mapCalc);
      const dbIds = new Set(dbMapped.map((c) => c.id));
      const missingInDb = localList.filter((c) => !dbIds.has(c.id));

      const finalCombined = [...dbMapped, ...missingInDb];
      setCalcInquiries(finalCombined);
      setCalcCount(finalCombined.length);
      try {
        localStorage.setItem('sanam_calc_inquiries', JSON.stringify(finalCombined));
      } catch (e) {}
    } catch (e) {
      console.error('loadCalcInquiries exception:', e);
    }
  };

  // Explicit full sync method for Admin Panel button
  const syncLocalStorageToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      let totalPushed = 0;

      // 1. Products
      let pList: ProductItem[] = [...initialProducts];
      const rawProducts = localStorage.getItem('sanam_products_v3') || localStorage.getItem('sanam_products');
      if (rawProducts) {
        try {
          const parsed = JSON.parse(rawProducts);
          const map = new Map<string, ProductItem>();
          [...initialProducts, ...parsed].forEach((p) => map.set(p.id, p));
          pList = Array.from(map.values());
        } catch (e) {}
      }
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

      // 2. Categories
      let cList: CategoryItem[] = [...initialCategories];
      const rawCategories = localStorage.getItem('sanam_categories');
      if (rawCategories) {
        try {
          const parsed = JSON.parse(rawCategories);
          const map = new Map<string, CategoryItem>();
          [...initialCategories, ...parsed].forEach((c) => map.set(c.id, c));
          cList = Array.from(map.values());
        } catch (e) {}
      }
      if (cList.length > 0) {
        const rows = cList.map((c) => ({
          id: c.id,
          key: c.key,
          label: c.label,
        }));
        await supabase.from('categories').upsert(rows);
        totalPushed += rows.length;
      }

      // 3. Service Types
      let sList: ServiceTypeItem[] = [...initialServiceTypes];
      const rawServices = localStorage.getItem('sanam_service_types');
      if (rawServices) {
        try {
          const parsed = JSON.parse(rawServices);
          const map = new Map<string, ServiceTypeItem>();
          [...initialServiceTypes, ...parsed].forEach((s) => map.set(s.id, s));
          sList = Array.from(map.values());
        } catch (e) {}
      }
      if (sList.length > 0) {
        const rows = sList.map((s) => ({
          id: s.id,
          name: s.name,
          name_ru: s.nameRu || s.name,
          name_en: s.nameEn || s.name,
        }));
        await supabase.from('service_types').upsert(rows);
        totalPushed += rows.length;
      }

      // 4. News
      let nList: NewsItem[] = [...initialNews];
      const rawNews = localStorage.getItem('sanam_news');
      if (rawNews) {
        try {
          const parsed = JSON.parse(rawNews);
          const map = new Map<string, NewsItem>();
          [...initialNews, ...parsed].forEach((n) => map.set(n.id, n));
          nList = Array.from(map.values());
        } catch (e) {}
      }
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

      // 5. Team
      let tList: TeamMember[] = [...initialTeam];
      const rawTeam = localStorage.getItem('sanam_team');
      if (rawTeam) {
        try {
          const parsed = JSON.parse(rawTeam);
          const map = new Map<string, TeamMember>();
          [...initialTeam, ...parsed].forEach((t) => map.set(t.id, t));
          tList = Array.from(map.values());
        } catch (e) {}
      }
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
    try {
      localStorage.setItem('sanam_categories', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('categories').insert({
        id: newItem.id,
        key: newItem.key,
        label: newItem.label,
      });
    } catch (err) {
      console.warn('Supabase categories insert note:', err);
    }
  };

  const updateCategory = async (id: string, updatedFields: Partial<CategoryItem>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    setCategories(updated);
    try {
      localStorage.setItem('sanam_categories', JSON.stringify(updated));
    } catch (e) {}

    try {
      const dbFields: any = {};
      if (updatedFields.key !== undefined) dbFields.key = updatedFields.key;
      if (updatedFields.label !== undefined) dbFields.label = updatedFields.label;
      await supabase.from('categories').update(dbFields).eq('id', id);
    } catch (err) {
      console.warn('Supabase categories update note:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    try {
      localStorage.setItem('sanam_categories', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase categories delete note:', err);
    }
  };

  // ==================== SERVICE TYPES CRUD ====================
  const addServiceType = async (srv: Omit<ServiceTypeItem, 'id'>) => {
    const newItem: ServiceTypeItem = { ...srv, id: 'srv-' + Date.now() };
    const updated = [...serviceTypes, newItem];
    setServiceTypes(updated);
    try {
      localStorage.setItem('sanam_service_types', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('service_types').insert({
        id: newItem.id,
        name: newItem.name,
        name_ru: newItem.nameRu || newItem.name,
        name_en: newItem.nameEn || newItem.name,
      });
    } catch (err) {
      console.warn('Supabase service_types insert note:', err);
    }
  };

  const updateServiceType = async (id: string, updatedFields: Partial<ServiceTypeItem>) => {
    const updated = serviceTypes.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    setServiceTypes(updated);
    try {
      localStorage.setItem('sanam_service_types', JSON.stringify(updated));
    } catch (e) {}

    try {
      const dbFields: any = {};
      if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
      if (updatedFields.nameRu !== undefined) dbFields.name_ru = updatedFields.nameRu;
      if (updatedFields.nameEn !== undefined) dbFields.name_en = updatedFields.nameEn;
      await supabase.from('service_types').update(dbFields).eq('id', id);
    } catch (err) {
      console.warn('Supabase service_types update note:', err);
    }
  };

  const deleteServiceType = async (id: string) => {
    const updated = serviceTypes.filter((s) => s.id !== id);
    setServiceTypes(updated);
    try {
      localStorage.setItem('sanam_service_types', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('service_types').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase service_types delete note:', err);
    }
  };

  // ==================== PRODUCTS CRUD ====================
  const addProduct = async (product: Omit<ProductItem, 'id'>) => {
    const newItem: ProductItem = { ...product, id: 'prod-' + Date.now() };
    const updated = [newItem, ...products];
    setProducts(updated);
    try {
      localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('products').insert({
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
    } catch (err) {
      console.warn('Supabase products insert note:', err);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<ProductItem>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    try {
      localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
    } catch (e) {}

    try {
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
      await supabase.from('products').update(dbFields).eq('id', id);
    } catch (err) {
      console.warn('Supabase products update note:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try {
      localStorage.setItem('sanam_products_v3', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase products delete note:', err);
    }
  };

  // ==================== NEWS CRUD ====================
  const addNews = async (news: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = { ...news, id: 'news-' + Date.now() };
    const updated = [newItem, ...newsList];
    setNewsList(updated);
    try {
      localStorage.setItem('sanam_news', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('news').insert({
        id: newItem.id,
        title: newItem.title,
        date: newItem.date,
        category: newItem.category,
        summary: newItem.summary,
        content: newItem.content,
        image_url: newItem.imageUrl ?? null,
        video_url: newItem.videoUrl ?? null,
      });
    } catch (err) {
      console.warn('Supabase news insert note:', err);
    }
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsItem>) => {
    const updated = newsList.map((n) => (n.id === id ? { ...n, ...updatedFields } : n));
    setNewsList(updated);
    try {
      localStorage.setItem('sanam_news', JSON.stringify(updated));
    } catch (e) {}

    try {
      const dbFields: any = {};
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.date !== undefined) dbFields.date = updatedFields.date;
      if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
      if (updatedFields.summary !== undefined) dbFields.summary = updatedFields.summary;
      if (updatedFields.content !== undefined) dbFields.content = updatedFields.content;
      if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
      if (updatedFields.videoUrl !== undefined) dbFields.video_url = updatedFields.videoUrl;
      await supabase.from('news').update(dbFields).eq('id', id);
    } catch (err) {
      console.warn('Supabase news update note:', err);
    }
  };

  const deleteNews = async (id: string) => {
    const updated = newsList.filter((n) => n.id !== id);
    setNewsList(updated);
    try {
      localStorage.setItem('sanam_news', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('news').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase news delete note:', err);
    }
  };

  // ==================== TEAM CRUD ====================
  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    const newItem: TeamMember = { ...member, id: 'team-' + Date.now() };
    const updated = [...teamList, newItem];
    setTeamList(updated);
    try {
      localStorage.setItem('sanam_team', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('team_members').insert({
        id: newItem.id,
        name: newItem.name,
        role: newItem.role,
        image_url: newItem.imageUrl ?? null,
        phone: newItem.phone ?? null,
      });
    } catch (err) {
      console.warn('Supabase team insert note:', err);
    }
  };

  const updateTeamMember = async (id: string, updatedFields: Partial<TeamMember>) => {
    const updated = teamList.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTeamList(updated);
    try {
      localStorage.setItem('sanam_team', JSON.stringify(updated));
    } catch (e) {}

    try {
      const dbFields: any = {};
      if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
      if (updatedFields.role !== undefined) dbFields.role = updatedFields.role;
      if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
      if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone;
      await supabase.from('team_members').update(dbFields).eq('id', id);
    } catch (err) {
      console.warn('Supabase team update note:', err);
    }
  };

  const deleteTeamMember = async (id: string) => {
    const updated = teamList.filter((t) => t.id !== id);
    setTeamList(updated);
    try {
      localStorage.setItem('sanam_team', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('team_members').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase team delete note:', err);
    }
  };

  // ==================== LEADS & CALC ====================
  const addLead = async (lead: Omit<LeadItem, 'id' | 'date' | 'status'>) => {
    const newItem: LeadItem = {
      ...lead,
      id: 'lead-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updated = [newItem, ...leads];
    setLeads(updated);
    setLeadsCount(updated.length);
    try {
      localStorage.setItem('sanam_leads', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('leads').insert({
        id: newItem.id,
        name: newItem.name,
        phone: newItem.phone,
        service: newItem.service,
        message: newItem.message,
        date: newItem.date,
        status: newItem.status,
      });
    } catch (err) {
      console.warn('Supabase leads insert note:', err);
    }
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
    setCalcCount(updated.length);
    try {
      localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('calc_inquiries').insert({
        id: newItem.id,
        product_type: newItem.productType,
        quantity: newItem.quantity,
        estimated_days: newItem.estimatedDays,
        phone: newItem.phone,
        date: newItem.date,
        status: newItem.status,
      });
    } catch (err) {
      console.warn('Supabase calc insert note:', err);
    }
  };

  const updateLeadStatus = async (id: string, status: LeadItem['status']) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    setLeads(updated);
    try {
      localStorage.setItem('sanam_leads', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('leads').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('Supabase leads status note:', err);
    }
  };

  const updateCalcStatus = async (id: string, status: CalcInquiry['status']) => {
    const updated = calcInquiries.map((c) => (c.id === id ? { ...c, status } : c));
    setCalcInquiries(updated);
    try {
      localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('calc_inquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('Supabase calc status note:', err);
    }
  };

  const deleteLead = async (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    setLeadsCount(updated.length);
    try {
      localStorage.setItem('sanam_leads', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('leads').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase leads delete note:', err);
    }
  };

  const deleteCalcInquiry = async (id: string) => {
    const updated = calcInquiries.filter((c) => c.id !== id);
    setCalcInquiries(updated);
    setCalcCount(updated.length);
    try {
      localStorage.setItem('sanam_calc_inquiries', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('calc_inquiries').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase calc delete note:', err);
    }
  };

  // ==================== FEEDBACKS CRUD ====================
  const addFeedback = async (feedback: Omit<FeedbackItem, 'id' | 'date' | 'approved'>) => {
    const newItem: FeedbackItem = {
      ...feedback,
      id: 'fb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      approved: false,
    };
    const updated = [newItem, ...feedbacks];
    setFeedbacks(updated);
    try {
      localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('feedbacks').insert({
        id: newItem.id,
        name: newItem.name,
        rating: newItem.rating,
        text: newItem.text,
        date: newItem.date,
        approved: newItem.approved,
      });
    } catch (err) {
      console.warn('Supabase feedbacks insert note:', err);
    }
  };

  const toggleApproveFeedback = async (id: string) => {
    const target = feedbacks.find((f) => f.id === id);
    if (!target) return;
    const newApproved = !target.approved;
    const updated = feedbacks.map((f) => (f.id === id ? { ...f, approved: newApproved } : f));
    setFeedbacks(updated);
    try {
      localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('feedbacks').update({ approved: newApproved }).eq('id', id);
    } catch (err) {
      console.warn('Supabase feedbacks approve note:', err);
    }
  };

  const deleteFeedback = async (id: string) => {
    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    try {
      localStorage.setItem('sanam_feedbacks', JSON.stringify(updated));
    } catch (e) {}

    try {
      await supabase.from('feedbacks').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase feedbacks delete note:', err);
    }
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
        serviceTypes,
        addServiceType,
        updateServiceType,
        deleteServiceType,
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
