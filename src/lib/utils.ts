import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Currency } from '../types/database';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formateador de moneda exacto:
 * CRC: ₡ 4.500 (o CRC 4.500)
 * USD: USD 6.81
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'CRC') {
    const formatted = new Intl.NumberFormat('es-CR', {
      maximumFractionDigits: 0,
    }).format(amount);
    return `CRC ${formatted}`;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `USD ${formatted}`;
}
