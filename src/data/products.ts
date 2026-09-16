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
  images?: string[];
  badge?: string;
}

export const initialCategories: CategoryItem[] = [
  { id: 'cat-1', key: 'fashion', label: "Erkaklar va ayollar kiyimlari" },
  { id: 'cat-2', key: 'uniforms', label: "Ishchi va korporativ uniformalar" },
  { id: 'cat-3', key: 'school-uniforms', label: "Maktab va bolalar kiyimlari" },
  { id: 'cat-4', key: 'med-uniforms', label: "Tibbiyot va xizmat ko'rsatish formalari" },
  { id: 'cat-5', key: 'bedding', label: "To'qimachilik va yotoq anjomlari" },
  { id: 'cat-6', key: 'workshop', label: "Fabrika sexi & Texnologiya" },
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
    desc: 'Korxonalar va rasmiy tadbirlar uchun klassik uslubdagi premium erkaklar kostyum-shim toplami.',
    badge: 'Top Sotuv',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-2',
    name: 'Ishchi Maxsus Formasi (Spetsodejda)',
    model: 'SN-WORK-102',
    sizes: '44 - 60',
    material: 'Zichligi 240g/m² Ripstop paxta',
    price: '180 000 UZS',
    category: 'uniforms',
    desc: 'Sanoat sexi va qurilish obektlari uchun mustahkam, yirtilishga chidamli va chontakli ishchi formasi.',
    badge: 'Mustahkam',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-3',
    name: 'Klassik Paxtali Erkaklar Koylagi',
    model: 'SN-SHIRT-05',
    sizes: 'S, M, L, XL, XXL',
    material: '100% Tabiiy Ozbek Paxtasi',
    price: '95 000 UZS',
    category: 'fashion',
    desc: 'Nafas oluvchi toza paxtadan tikilgan, ajin bosmaydigan qulay kundalik koylak.',
    badge: '100% Paxta',
    imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-4',
    name: 'Ayollar Korporativ Forma Toplami',
    model: 'SN-FEMALE-22',
    sizes: 'S - 3XL',
    material: 'Elastik Paxta & Poliester',
    price: 'Kelishilgan narxda',
    category: 'uniforms',
    desc: 'Kompaniya xodimalari uchun zamonaviy bichimdagi kostyum-yubka va nimchalar.',
    badge: 'Korporativ',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-5',
    name: 'Maktab Oquvchilari Rasmiy Formasi',
    model: 'SN-SCH-2026',
    sizes: '30 - 46',
    material: 'Kombatsiyalangan paxta va kostyumniy mato',
    price: 'Kelishilgan narxda',
    category: 'school-uniforms',
    desc: 'Maktab oquvchilari uchun davlat standarti boyicha tikilgan chidamli va korkam forma toplami.',
    badge: 'Maktab',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-6',
    name: 'Mehmonxona & Shifoxona Choyshab Toplami',
    model: 'SN-BED-300',
    sizes: 'Bir kishilik / Ikki kishilik',
    material: '100% Paxta Saten / Biaz',
    price: 'Kelishilgan narxda',
    category: 'bedding',
    desc: 'Mehmonxonalar va sanatoriylar uchun uzoq yillik yuvishga chidamli toza paxta choyshablari.',
    badge: 'Toqimachilik',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-7',
    name: 'Tibbiyot Xodimlari Maxsus Xalati',
    model: 'SN-MED-01',
    sizes: 'S, M, L, XL, XXL',
    material: 'Arxomed Paxta/Poliester (65/35)',
    price: '110 000 UZS',
    category: 'med-uniforms',
    desc: 'Shifokorlar va hamshiralar uchun antiseptik ishlov berilgan, qulay va yengil tibbiyot xalati.',
    badge: 'Tibbiyot',
    imageUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-8',
    name: 'Sanoat Sexi Ishchi Kombinezoni',
    model: 'SN-OVR-90',
    sizes: '46 - 62',
    material: 'Zichligi 260g/m² Ogir Paxta Ripstop',
    price: '220 000 UZS',
    category: 'uniforms',
    desc: 'Mexanik va sanoat texniklari uchun koplab narsalar sigadigan chontakli kombinezon.',
    badge: 'Maxsus',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-9',
    name: 'Qishki Issiq Spetsodejda Kurtka',
    model: 'SN-WNT-05',
    sizes: '48 - 62',
    material: 'Vodonepronitsayemiy Taslan & Sintepon',
    price: '320 000 UZS',
    category: 'uniforms',
    desc: 'Sovuq havodagi obektlar va ochiq maydonlar uchun shamol va suv otkazmaydigan issiq kurtka.',
    badge: 'Qishki',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prod-10',
    name: 'Oshpaz va Restoran Xodimlari Formasi',
    model: 'SN-CHEF-01',
    sizes: 'S - 3XL',
    material: 'Yog va Suv Qaytaruvchi Mato',
    price: '160 000 UZS',
    category: 'med-uniforms',
    desc: 'Restoran va oshxonalar uchun dog yuqmaydigan pishiq oshpaz kiyimi va fartuk toplami.',
    badge: 'Oshpaz',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop',
    ],
  },
];
