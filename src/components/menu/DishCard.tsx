import React from 'react';
import type { Dish } from '../../types/database';
import { useMenuStore } from '../../store/useMenuStore';
import { formatPrice } from '../../lib/utils';

interface DishCardProps {
  dish: Dish;
  isLargeView?: boolean;
  onSelect: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, isLargeView = false, onSelect }) => {
  const { currency, addItemToDiner } = useMenuStore();
  const currentPrice = currency === 'CRC' ? dish.priceCRC : dish.priceUSD;

  return (
    <div
      onClick={() => onSelect(dish)}
      className="bg-white rounded-3xl border border-gray-100/90 shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md transition-all active:scale-[0.99] group"
    >
      <div>
        <div
          className={`w-full bg-[#F3F4F1] relative overflow-hidden flex items-center justify-center ${
            isLargeView ? 'aspect-[4/3]' : 'aspect-square'
          }`}
        >
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-400 mb-1 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Plato de la casa
              </span>
            </div>
          )}

          {dish.tags?.includes('2x1') && (
            <span className="absolute top-2.5 left-2.5 bg-brand-yellow-badge text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              2×1
            </span>
          )}
        </div>

        <div className="p-3.5">
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm capitalize leading-snug line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-gray-400 text-[11px] mt-1 leading-normal line-clamp-2">
            {dish.description}
          </p>
        </div>
      </div>

      <div className="p-3.5 pt-0 flex items-center justify-between gap-1 mt-auto">
        <span className="inline-block bg-[#FEE575] text-gray-900 font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
          {formatPrice(currentPrice, currency)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addItemToDiner(dish);
          }}
          className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-all active:scale-90 shadow-2xs"
          title="Agregar al pedido"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
