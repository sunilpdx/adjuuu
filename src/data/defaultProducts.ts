import { ProductDrop } from '../types';

export const DEFAULT_PRODUCTS: ProductDrop[] = [
  {
    id: 'drop-1',
    code: '104829',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    price: '$99',
    originalPrice: '$119',
    offer: '20% OFF',
    image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg',
    url: 'https://amazon.com/dp/B09HM94VDS',
    category: 'Tech & Setup',
    storeName: 'Amazon',
    videoUrl: 'https://instagram.com/reels',
    clicks: 1420,
    createdAt: '2026-10-20'
  },
  {
    id: 'drop-2',
    code: '582910',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: '$348',
    originalPrice: '$399',
    offer: 'BESTSELLER',
    image: 'https://m.media-amazon.com/images/I/61+elL41-OL._AC_SL1500_.jpg',
    url: 'https://amazon.com/dp/B09XS7JWHH',
    category: 'Audio',
    storeName: 'Amazon',
    videoUrl: 'https://youtube.com/shorts',
    clicks: 2894,
    createdAt: '2026-10-22'
  },
  {
    id: 'drop-3',
    code: '940182',
    title: 'Minimalist Wireless Fast Charging Station with MagSafe',
    price: '$39',
    originalPrice: '$55',
    offer: 'LIMITED DEAL',
    image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
    url: 'https://amazon.com/dp/B09V3G85N7',
    category: 'Tech & Setup',
    storeName: 'Amazon',
    videoUrl: 'https://tiktok.com',
    clicks: 812,
    createdAt: '2026-10-24'
  },
  {
    id: 'drop-4',
    code: '319044',
    title: 'NuPhy Air75 V2 Low-Profile Wireless Mechanical Keyboard',
    price: '$119',
    originalPrice: '$139',
    offer: 'STAFF PICK',
    image: 'https://m.media-amazon.com/images/I/61kWB+e9VUL._AC_SL1500_.jpg',
    url: 'https://nuphy.com',
    category: 'Tech & Setup',
    storeName: 'NuPhy',
    videoUrl: 'https://instagram.com/reels',
    clicks: 1650,
    createdAt: '2026-10-25'
  },
  {
    id: 'drop-5',
    code: '772183',
    title: 'BenQ ScreenBar Pro LED Desk Monitor Light Bar with Auto-Dim',
    price: '$139',
    originalPrice: '$159',
    offer: 'TOP RATED',
    image: 'https://m.media-amazon.com/images/I/61c8X+ZqYRL._AC_SL1500_.jpg',
    url: 'https://amazon.com',
    category: 'Tech & Setup',
    storeName: 'Amazon',
    videoUrl: 'https://youtube.com/shorts',
    clicks: 940,
    createdAt: '2026-10-26'
  },
  {
    id: 'drop-6',
    code: '620491',
    title: 'Orbitkey Leather Key Organizer & Minimalist Multi-Tool',
    price: '$44',
    originalPrice: '$52',
    offer: '15% OFF',
    image: 'https://m.media-amazon.com/images/I/71Y+xLdY6DL._AC_SL1500_.jpg',
    url: 'https://orbitkey.com',
    category: 'EDC & Gadgets',
    storeName: 'Orbitkey',
    videoUrl: 'https://tiktok.com',
    clicks: 532,
    createdAt: '2026-10-26'
  }
];

export const CATEGORIES: { label: string; value: import('../types').CategoryFilter }[] = [
  { label: 'All Drops', value: 'All' },
  { label: 'Tech & Desk', value: 'Tech & Setup' },
  { label: 'Audio', value: 'Audio' },
  { label: 'EDC & Everyday', value: 'EDC & Gadgets' },
  { label: 'Lifestyle', value: 'Lifestyle' }
];
