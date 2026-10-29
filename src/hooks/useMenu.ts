import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Category, Dish } from '../types/database';

/**
 * Hook para obtener todas las categorías de Supabase.
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Error al cargar categorías de Supabase:', error.message);
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener platos de Supabase, mapeando de snake_case (DB) a camelCase (Frontend).
 */
export function useDishes(options?: { categoryId?: string; onlyAvailable?: boolean }) {
  const { categoryId, onlyAvailable = true } = options || {};

  return useQuery({
    queryKey: ['dishes', { categoryId, onlyAvailable }],
    queryFn: async (): Promise<Dish[]> => {
      let query = supabase.from('dishes').select('*');

      if (onlyAvailable) {
        query = query.eq('is_available', true);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) {
        console.warn('Error al cargar platos de Supabase:', error.message);
        return [];
      }

      // Mapear de las columnas de PostgreSQL al modelo de la app
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        priceCOP: Number(row.price_cop || 0),
        priceUSD: Number(row.price_usd || 0),
        imageUrl: row.image_url || '',
        categoryId: row.category_id,
        isAvailable: row.is_available ?? true,
        tags: row.tags || [],
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para crear o actualizar un plato en Supabase (Panel Admin).
 */
export function useUpsertDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dish: Partial<Dish>) => {
      const dbPayload: any = {
        name: dish.name,
        description: dish.description,
        price_cop: dish.priceCOP,
        price_usd: dish.priceUSD,
        image_url: dish.imageUrl,
        category_id: dish.categoryId,
        is_available: dish.isAvailable,
        tags: dish.tags || [],
      };

      if (dish.id) {
        dbPayload.id = dish.id;
      }

      const { data, error } = await supabase
        .from('dishes')
        .upsert(dbPayload)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
}

/**
 * Hook para eliminar un plato de Supabase (Panel Admin).
 */
export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dishId: string) => {
      const { error } = await supabase.from('dishes').delete().eq('id', dishId);
      if (error) throw new Error(error.message);
      return dishId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
}
