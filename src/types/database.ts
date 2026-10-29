export type Currency = 'CRC' | 'USD';
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
  priceCRC: number;
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
  hasPhone?: boolean;
}

export interface TableCartItem {
  id: string;
  dishId: string;
  name: string;
  priceCRC: number;
  priceUSD: number;
  quantity: number;
  dinerId: string;
}

export type OrderStatus = 'nuevo' | 'en_curso' | 'listo' | 'entregado';

export interface KitchenOrderItem {
  quantity: number;
  name: string;
}

export interface KitchenOrder {
  id: string;
  tableNumber: string;
  status: OrderStatus;
  items: KitchenOrderItem[];
  totalCRC: number;
  totalUSD: number;
  createdAt: string;
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

export type Database = any;
