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

export const initialCategories: CategoryItem[] = [
  { id: 'cat-1', key: 'fashion', label: "Erkaklar va ayollar kiyimlari" },
  { id: 'cat-2', key: 'uniforms', label: "Ishchi va korporativ uniforma" },
  { id: 'cat-3', key: 'workshop', label: "Fabrika sexi & Texnologiya" },
  { id: 'cat-4', key: 'bedding', label: "To'qimachilik va mato" },
];

export const initialProducts: ProductItem[] = [
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
