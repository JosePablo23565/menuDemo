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
      className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.06)] hover:border-black/[0.09] transition-[transform,box-shadow,border-color] duration-150 ease-out active:scale-[0.98] cursor-pointer group flex flex-col justify-between overflow-hidden select-none"
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
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/80 border border-black/[0.06] flex items-center justify-center text-gray-400 shadow-2xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}

          {dish.tags?.includes('2x1') && (
            <span className="absolute top-2.5 left-2.5 bg-[#1C3F32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              2×1
            </span>
          )}
        </div>

        <div className="p-3.5">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm capitalize leading-snug line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-gray-400 text-[11px] mt-1 leading-normal line-clamp-2 font-normal">
            {dish.description}
          </p>
        </div>
      </div>

      <div className="p-3.5 pt-0 flex items-center justify-between gap-1 mt-auto">
        <span className="font-semibold text-xs sm:text-sm text-[#1C3F32] tracking-tight">
          {formatPrice(currentPrice, currency)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addItemToDiner(dish);
          }}
          className="w-7 h-7 rounded-full bg-[#1C3F32] hover:bg-[#152e25] active:scale-90 text-white flex items-center justify-center transition-transform duration-100 shadow-2xs"
          title="Agregar al pedido"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};
