import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Currency } from '../types/database';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formateador de moneda exacto al diseño:
 * COP: COP 99.000 (o COP 21.000)
 * USD: USD 6.81
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'COP') {
    const formatted = new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(amount);
    return `COP ${formatted}`;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `USD ${formatted}`;
}
