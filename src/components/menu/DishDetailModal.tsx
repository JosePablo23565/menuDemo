import React from 'react';
import type { Dish } from '../../types/database';
import { useMenuStore } from '../../store/useMenuStore';
import { formatPrice } from '../../lib/utils';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  const { currency, addItemToDiner, diners, activeDinerId } = useMenuStore();

  if (!dish) return null;

  const currentPrice = currency === 'CRC' ? dish.priceCRC : dish.priceUSD;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col dot-pattern">
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-xs font-semibold text-gray-500">
            Detalle del plato
          </span>

          <div className="w-9" />
        </div>

        <div className="px-5 pt-3 text-[11px] text-gray-400 font-medium">
          Menú / Comidas / <span className="text-gray-700 font-semibold">{dish.name}</span>
        </div>

        <div className="p-5 pb-3">
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-[4/3] shadow-inner">
            {dish.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
                <span className="text-xs font-semibold tracking-wider uppercase">
                  {dish.name}
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white font-bold text-sm px-3.5 py-1.5 rounded-xl border border-white/10">
              {formatPrice(currentPrice, currency)}
            </div>

            <button className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1 transition-colors">
              <span>Ampliar</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2.5 mt-3">
            <div className="w-14 h-14 rounded-xl border-2 border-brand-green overflow-hidden bg-gray-100 flex items-center justify-center">
              <span className="text-[10px] text-gray-500 font-bold">1x</span>
            </div>
            <button className="w-16 h-14 rounded-xl bg-gray-900 text-white flex flex-col items-center justify-center gap-1 text-[10px] font-semibold hover:bg-black transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Video</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-2">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
            COMIDAS
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            {dish.name}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        <div className="px-5 py-3 mt-auto">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
            ¿Para quién es este plato?
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {diners.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => addItemToDiner(dish, d.id)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
              >
                + Para {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
          <button
            onClick={() => {
              addItemToDiner(dish, activeDinerId);
              onClose();
            }}
            className="w-full bg-[#1C3F32] hover:bg-[#152e25] text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-brand-green/20 active:scale-[0.99] transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Agregar al Pedido ({formatPrice(currentPrice, currency)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
