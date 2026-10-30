import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Currency, Language, Diner, TableCartItem, Dish, KitchenOrder } from '../types/database';

interface MenuState {
  currency: Currency;
  language: Language;
  tableNumber: string | null;

  exchangeRate: number;
  setExchangeRate: (rate: number) => void;

  diners: Diner[];
  activeDinerId: string;

  cart: TableCartItem[];
  isCartOpen: boolean;
  selectedDish: Dish | null;
  isPromoOpen: boolean;

  // Seguimiento persistente de orden activa en cocina
  activeOrderId: string | null;
  activeOrder: KitchenOrder | null;
  isOrderModalOpen: boolean;

  setActiveOrderId: (id: string | null) => void;
  setActiveOrder: (order: KitchenOrder | null) => void;
  setIsOrderModalOpen: (open: boolean) => void;

  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
  setTableNumber: (table: string | null) => void;
  syncTableFromUrl: () => void;
  setIsCartOpen: (open: boolean) => void;
  setSelectedDish: (dish: Dish | null) => void;
  setIsPromoOpen: (open: boolean) => void;

  addDiner: (name: string, hasPhone?: boolean) => void;
  addItemToDiner: (dish: Dish, dinerId?: string) => void;
  removeItemQuantity: (itemId: string) => void;
  addItemQuantity: (itemId: string) => void;
  clearCart: () => void;

  getTableTotal: (currency: Currency) => number;
  getDinerTotal: (dinerId: string, currency: Currency) => number;
  getTotalItemsCount: () => number;
}

const DEFAULT_DINERS: Diner[] = [
  { id: 'diner-1', name: 'Comensal 1 (tú)', isSelf: true, hasPhone: true },
];

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      currency: 'CRC',
      language: 'es',
      tableNumber: null,
      exchangeRate: 515,

      activeOrderId: null,
      activeOrder: null,
      isOrderModalOpen: false,

      setActiveOrderId: (activeOrderId) => set({ activeOrderId }),
      setActiveOrder: (activeOrder) => set({ activeOrder }),
      setIsOrderModalOpen: (isOrderModalOpen) => set({ isOrderModalOpen }),

      setExchangeRate: (exchangeRate) => set({ exchangeRate }),

      diners: DEFAULT_DINERS,
      activeDinerId: 'diner-1',
      cart: [],
      isCartOpen: false,
      selectedDish: null,
      isPromoOpen: false,

      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setTableNumber: (tableNumber) => set({ tableNumber }),

      syncTableFromUrl: () => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const mesa = params.get('mesa') || params.get('table');
        if (mesa && get().tableNumber !== mesa.trim()) {
          set({ tableNumber: mesa.trim() });
        }
      },

      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
      setSelectedDish: (selectedDish) => set({ selectedDish }),
      setIsPromoOpen: (isPromoOpen) => set({ isPromoOpen }),

      addDiner: (name, hasPhone = true) => {
        const newDiner: Diner = {
          id: `diner-${Date.now()}`,
          name,
          hasPhone,
        };
        set((state) => ({ diners: [...state.diners, newDiner] }));
      },

      addItemToDiner: (dish, dinerId) => {
        const targetDinerId = dinerId || get().activeDinerId;
        const rate = get().exchangeRate || 515;
        const autoUSD = Number((dish.priceCRC / rate).toFixed(2));

        set((state) => {
          const existing = state.cart.find(
            (item) => item.dishId === dish.id && item.dinerId === targetDinerId
          );

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          const newItem: TableCartItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            dishId: dish.id,
            name: dish.name.toUpperCase(),
            priceCRC: dish.priceCRC,
            priceUSD: autoUSD,
            quantity: 1,
            dinerId: targetDinerId,
          };

          return { cart: [...state.cart, newItem] };
        });
      },

      removeItemQuantity: (itemId) => {
        set((state) => {
          const item = state.cart.find((i) => i.id === itemId);
          if (!item) return state;

          if (item.quantity <= 1) {
            return { cart: state.cart.filter((i) => i.id !== itemId) };
          }

          return {
            cart: state.cart.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        });
      },

      addItemQuantity: (itemId) => {
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getTableTotal: (curr) => {
        const { cart, exchangeRate } = get();
        const rate = exchangeRate || 515;
        const totalCRC = cart.reduce((acc, item) => acc + item.priceCRC * item.quantity, 0);

        if (curr === 'CRC') return totalCRC;
        return Number((totalCRC / rate).toFixed(2));
      },

      getDinerTotal: (dinerId, curr) => {
        const { cart, exchangeRate } = get();
        const rate = exchangeRate || 515;
        const dinerItems = cart.filter((item) => item.dinerId === dinerId);
        const totalCRC = dinerItems.reduce((acc, item) => acc + item.priceCRC * item.quantity, 0);

        if (curr === 'CRC') return totalCRC;
        return Number((totalCRC / rate).toFixed(2));
      },

      getTotalItemsCount: () => {
        const { cart } = get();
        return cart.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'la-terraza-session',
      storage: createJSONStorage(() => localStorage), // Persistido en localStorage contra recargas
      partialize: (state) => ({
        currency: state.currency,
        language: state.language,
        tableNumber: state.tableNumber,
        cart: state.cart,
        exchangeRate: state.exchangeRate,
        activeOrderId: state.activeOrderId,
      }),
    }
  )
);
