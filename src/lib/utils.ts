import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Currency } from '../types/database';
import { supabase } from './supabase';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: Currency): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  if (currency === 'CRC') {
    const formatted = new Intl.NumberFormat('es-CR', {
      maximumFractionDigits: 0,
    }).format(safeAmount);
    return `CRC ${formatted}`;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
  return `USD ${formatted}`;
}

/**
 * Convierte cualquier archivo de imagen (PNG, JPG, HEIC, etc.) a formato WebP optimizado
 * en el navegador y lo redimensiona para carga ultrarrápida en móviles.
 */
export async function convertToWebP(file: File, maxWidth = 800, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo inicializar canvas para procesar imagen.'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Fallo al comprimir a WebP.'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Error al cargar archivo de imagen.'));
    };
  });
}

/**
 * Sube una imagen optimizada en WebP a Supabase Storage y retorna su URL pública.
 */
export async function uploadDishImage(file: File): Promise<string> {
  // 1. Optimizar y convertir a WebP
  const webpBlob = await convertToWebP(file);

  // 2. Generar nombre de archivo único
  const fileName = `dish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;

  // 3. Subir al bucket 'dishes'
  const { error: uploadError } = await supabase.storage
    .from('dishes')
    .upload(fileName, webpBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 año de caché CDN
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Error al subir imagen a almacenamiento: ${uploadError.message}`);
  }

  // 4. Obtener URL pública directa
  const { data } = supabase.storage.from('dishes').getPublicUrl(fileName);
  return data.publicUrl;
}
