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
    id: 'news-1',
    title: 'SANAM Fabrikasiga Yangi Yapon Tikuv Komplekslari Keltirildi',
    date: '2026-07-28',
    category: 'Texnologiya',
    summary: 'Fabrikamiz ishlab chiqarish unumdorligini 40% ga oshiradigan avtomatlashtirilgan yangi dastgohlarni ishga tushirdi.',
    content: 'SANAM OFFICIAL fabrikasi Qashqadaryo viloyatida eng zamonaviy tikuv uskunalarini ornatishda davom etmoqda.',
  },
  {
    id: 'news-2',
    title: 'Korporativ Uniforma Tikish Boyicha Katta Shartnoma Imzolandi',
    date: '2026-07-15',
    category: 'Hamkorlik',
    summary: 'Qarshi shahridagi yirik sanoat korxonasi uchun 2000 dan ortiq maxsus ishchi kiyimlari tayyorlanmoqda.',
    content: 'SANAM Garment Factory hududiy korxonalar uchun sifatli va chidamli ishchi uniformalarini ishlab chiqarishda yetakchilikni saqlab qolmoqda.',
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
    desc: row.description ?? '',
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

  // Load theme/lang from localStorage (these stay local)
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('sanam_theme');
      if (storedTheme === 'dark') setIsDarkMode(true);
      const storedLang = localStorage.getItem('sanam_lang') as Language;
      if (storedLang && ['uz', 'ru', 'en'].includes(storedLang)) setCurrentLangState(storedLang);
    } catch (e) {}
  }, []);

  // Load all data from Supabase on mount
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
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) { console.error('products load error:', error); return; }
    if (data && data.length > 0) setProducts(data.map(mapProduct));
  };

  const loadCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (error) { console.error('categories load error:', error); return; }
    if (data && data.length > 0) setCategories(data.map(mapCategory));
  };

  const loadNews = async () => {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (error) { console.error('news load error:', error); return; }
    if (data && data.length > 0) setNewsList(data.map(mapNews));
  };

  const loadTeam = async () => {
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
    if (error) { console.error('team load error:', error); return; }
    if (data && data.length > 0) setTeamList(data.map(mapTeam));
  };

  const loadFeedbacks = async () => {
    const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
    if (error) { console.error('feedbacks load error:', error); return; }
    if (data && data.length > 0) setFeedbacks(data.map(mapFeedback));
  };

  const loadLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) { console.error('leads load error:', error); return; }
    if (data) {
      const mapped = data.map(mapLead);
      setLeads(mapped);
      setLeadsCount(mapped.length);
    }
  };

  const loadCalcInquiries = async () => {
    const { data, error } = await supabase.from('calc_inquiries').select('*').order('created_at', { ascending: false });
    if (error) { console.error('calc_inquiries load error:', error); return; }
    if (data) {
      const mapped = data.map(mapCalc);
      setCalcInquiries(mapped);
      setCalcCount(mapped.length);
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
    const { error } = await supabase.from('categories').insert({
      id: newItem.id,
      key: newItem.key,
      label: newItem.label,
    });
    if (error) { console.error('addCategory error:', error); return; }
    setCategories((prev) => [...prev, newItem]);
  };

  const updateCategory = async (id: string, updatedFields: Partial<CategoryItem>) => {
    const dbFields: any = {};
    if (updatedFields.key !== undefined) dbFields.key = updatedFields.key;
    if (updatedFields.label !== undefined) dbFields.label = updatedFields.label;
    const { error } = await supabase.from('categories').update(dbFields).eq('id', id);
    if (error) { console.error('updateCategory error:', error); return; }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { console.error('deleteCategory error:', error); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ==================== PRODUCTS CRUD ====================
  const addProduct = async (product: Omit<ProductItem, 'id'>) => {
    const newItem: ProductItem = { ...product, id: 'prod-' + Date.now() };
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
    if (error) { console.error('addProduct error:', error); return; }
    setProducts((prev) => [newItem, ...prev]);
  };

  const updateProduct = async (id: string, updatedFields: Partial<ProductItem>) => {
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
    if (error) { console.error('updateProduct error:', error); return; }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { console.error('deleteProduct error:', error); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ==================== NEWS CRUD ====================
  const addNews = async (news: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = { ...news, id: 'news-' + Date.now() };
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
    if (error) { console.error('addNews error:', error); return; }
    setNewsList((prev) => [newItem, ...prev]);
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsItem>) => {
    const dbFields: any = {};
    if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
    if (updatedFields.date !== undefined) dbFields.date = updatedFields.date;
    if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
    if (updatedFields.summary !== undefined) dbFields.summary = updatedFields.summary;
    if (updatedFields.content !== undefined) dbFields.content = updatedFields.content;
    if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
    if (updatedFields.videoUrl !== undefined) dbFields.video_url = updatedFields.videoUrl;
    const { error } = await supabase.from('news').update(dbFields).eq('id', id);
    if (error) { console.error('updateNews error:', error); return; }
    setNewsList((prev) => prev.map((n) => (n.id === id ? { ...n, ...updatedFields } : n)));
  };

  const deleteNews = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) { console.error('deleteNews error:', error); return; }
    setNewsList((prev) => prev.filter((n) => n.id !== id));
  };

  // ==================== TEAM CRUD ====================
  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    const newItem: TeamMember = { ...member, id: 'team-' + Date.now() };
    const { error } = await supabase.from('team_members').insert({
      id: newItem.id,
      name: newItem.name,
      role: newItem.role,
      image_url: newItem.imageUrl ?? null,
      phone: newItem.phone ?? null,
    });
    if (error) { console.error('addTeamMember error:', error); return; }
    setTeamList((prev) => [...prev, newItem]);
  };

  const updateTeamMember = async (id: string, updatedFields: Partial<TeamMember>) => {
    const dbFields: any = {};
    if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
    if (updatedFields.role !== undefined) dbFields.role = updatedFields.role;
    if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
    if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone;
    const { error } = await supabase.from('team_members').update(dbFields).eq('id', id);
    if (error) { console.error('updateTeamMember error:', error); return; }
    setTeamList((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)));
  };

  const deleteTeamMember = async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) { console.error('deleteTeamMember error:', error); return; }
    setTeamList((prev) => prev.filter((t) => t.id !== id));
  };

  // ==================== LEADS ====================
  const addLead = async (lead: Omit<LeadItem, 'id' | 'date' | 'status'>) => {
    const newItem: LeadItem = {
      ...lead,
      id: 'lead-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const { error } = await supabase.from('leads').insert({
      id: newItem.id,
      name: newItem.name,
      phone: newItem.phone,
      service: newItem.service,
      message: newItem.message,
      date: newItem.date,
      status: newItem.status,
    });
    if (error) { console.error('addLead error:', error); return; }
    setLeads((prev) => [newItem, ...prev]);
    incrementLeads();
  };

  const addCalcInquiry = async (inquiry: Omit<CalcInquiry, 'id' | 'date' | 'status'>) => {
    const newItem: CalcInquiry = {
      ...inquiry,
      id: 'calc-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const { error } = await supabase.from('calc_inquiries').insert({
      id: newItem.id,
      product_type: newItem.productType,
      quantity: newItem.quantity,
      estimated_days: newItem.estimatedDays,
      phone: newItem.phone,
      date: newItem.date,
      status: newItem.status,
    });
    if (error) { console.error('addCalcInquiry error:', error); return; }
    setCalcInquiries((prev) => [newItem, ...prev]);
    incrementCalc();
  };

  const updateLeadStatus = async (id: string, status: LeadItem['status']) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) { console.error('updateLeadStatus error:', error); return; }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const updateCalcStatus = async (id: string, status: CalcInquiry['status']) => {
    const { error } = await supabase.from('calc_inquiries').update({ status }).eq('id', id);
    if (error) { console.error('updateCalcStatus error:', error); return; }
    setCalcInquiries((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) { console.error('deleteLead error:', error); return; }
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      setLeadsCount(updated.length);
      return updated;
    });
  };

  const deleteCalcInquiry = async (id: string) => {
    const { error } = await supabase.from('calc_inquiries').delete().eq('id', id);
    if (error) { console.error('deleteCalcInquiry error:', error); return; }
    setCalcInquiries((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setCalcCount(updated.length);
      return updated;
    });
  };

  // ==================== FEEDBACKS ====================
  const addFeedback = async (feedback: Omit<FeedbackItem, 'id' | 'date' | 'approved'>) => {
    const newItem: FeedbackItem = {
      ...feedback,
      id: 'fb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      approved: false,
    };
    const { error } = await supabase.from('feedbacks').insert({
      id: newItem.id,
      name: newItem.name,
      rating: newItem.rating,
      text: newItem.text,
      date: newItem.date,
      approved: newItem.approved,
    });
    if (error) { console.error('addFeedback error:', error); return; }
    setFeedbacks((prev) => [newItem, ...prev]);
  };

  const toggleApproveFeedback = async (id: string) => {
    const fb = feedbacks.find((f) => f.id === id);
    if (!fb) return;
    const newApproved = !fb.approved;
    const { error } = await supabase.from('feedbacks').update({ approved: newApproved }).eq('id', id);
    if (error) { console.error('toggleApproveFeedback error:', error); return; }
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, approved: newApproved } : f)));
  };

  const deleteFeedback = async (id: string) => {
    const { error } = await supabase.from('feedbacks').delete().eq('id', id);
    if (error) { console.error('deleteFeedback error:', error); return; }
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
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
