import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Dish, KitchenOrder, OrderStatus } from '../types/database';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Error al cargar categorías:', error.message);
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

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
        console.warn('Error al cargar platos:', error.message);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        priceCRC: Number(row.price_crc ?? row.price_cop ?? 0),
        priceUSD: Number(row.price_usd ?? 0),
        imageUrl: row.image_url || '',
        categoryId: row.category_id,
        isAvailable: row.is_available ?? true,
        tags: row.tags || [],
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpsertDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dish: Partial<Dish>) => {
      const dbPayload: any = {
        name: dish.name,
        description: dish.description,
        price_cop: dish.priceCRC,
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

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: {
      tableNumber: string;
      items: { quantity: number; name: string }[];
      totalCRC: number;
      totalUSD: number;
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          table_number: newOrder.tableNumber,
          items: newOrder.items,
          total_crc: newOrder.totalCRC,
          total_usd: newOrder.totalUSD,
          status: 'nuevo',
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useKitchenOrders() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('kds-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<KitchenOrder[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error al cargar pedidos:', error.message);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        tableNumber: row.table_number,
        status: row.status as OrderStatus,
        items: row.items || [],
        totalCRC: Number(row.total_crc || 0),
        totalUSD: Number(row.total_usd || 0),
        createdAt: row.created_at,
      }));
    },
    staleTime: 1000 * 10,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw new Error(error.message);
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Hook para rastrear el pedido activo del comensal en vivo
 */
export function useActiveClientOrder(orderId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`client-order-${orderId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['active-order', orderId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  return useQuery({
    queryKey: ['active-order', orderId],
    queryFn: async (): Promise<KitchenOrder | null> => {
      if (!orderId) return null;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        tableNumber: data.table_number,
        status: data.status as OrderStatus,
        items: data.items || [],
        totalCRC: Number(data.total_crc || 0),
        totalUSD: Number(data.total_usd || 0),
        createdAt: data.created_at,
      };
    },
    enabled: Boolean(orderId),
    refetchInterval: 5000,
  });
}
