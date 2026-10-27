export interface ProductDrop {
  id: string;
  code: string; // 6-digit code e.g. "104829"
  title: string;
  price: string;
  originalPrice?: string;
  offer: string; // e.g. "20% OFF", "BESTSELLER", "LIMITED DEAL"
  image: string;
  url: string;
  category: string;
  storeName?: string;
  videoUrl?: string; // Optional link to Instagram Reel / TikTok / Short
  clicks: number;
  createdAt: string;
}

export type ActiveTab = 'visitor' | 'admin';

export type CategoryFilter = 'All' | 'Tech & Setup' | 'Audio' | 'EDC & Gadgets' | 'Lifestyle';
