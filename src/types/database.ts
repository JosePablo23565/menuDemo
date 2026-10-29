export type Currency = 'COP' | 'USD';
export type Language = 'es' | 'en';

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  priceCOP: number;
  priceUSD: number;
  imageUrl?: string;
  videoUrl?: string;
  categoryId: string;
  isAvailable: boolean;
  tags?: string[];
}

export interface Diner {
  id: string;
  name: string;
  isSelf?: boolean;
  hasPhone?: boolean; // ej: "Abuela (sin celular)"
}

export interface TableCartItem {
  id: string;
  dishId: string;
  name: string;
  priceCOP: number;
  priceUSD: number;
  quantity: number;
  dinerId: string;
}

export interface Promotion {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tags: string[];
  ctaText: string;
  imageUrl?: string;
}

// Tipo flexible para Supabase cuando se conecte
export type Database = any;
