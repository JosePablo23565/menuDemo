import React, { useState } from 'react';
import type { Dish } from '../../types/database';
import { useMenuStore } from '../../store/useMenuStore';
import { formatPrice } from '../../lib/utils';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  const { currency, addItemToDiner, diners, activeDinerId } = useMenuStore();
  const [selectedDinerId, setSelectedDinerId] = useState<string>(activeDinerId || 'diner-1');

  if (!dish) return null;

  const currentPrice = currency === 'CRC' ? dish.priceCRC : dish.priceUSD;

  const handleAddAndClose = () => {
    addItemToDiner(dish, selectedDinerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor blanco puro sin textura de puntos */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85dvh] overflow-hidden shadow-2xl flex flex-col border border-black/[0.05]">
        {/* Cabecera nativa con pestaña de arrastre y botón cerrar discreto */}
        <div className="pt-3 pb-2 px-4 flex items-center justify-between border-b border-black/[0.04] bg-white shrink-0">
          <div className="w-8" />
          
          {/* Indicador de hoja nativa (drag handle) */}
          <div className="w-10 h-1.5 rounded-full bg-stone-300" />

          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 flex items-center justify-center text-gray-600 transition-colors"
            aria-label="Cerrar detalle"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido scrolleable limpio */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4">
          {/* Si el plato tiene imagen, se muestra con proporciones suaves */}
          {dish.imageUrl ? (
            <div className="relative rounded-3xl overflow-hidden bg-stone-100 aspect-[4/3] shadow-inner border border-black/[0.04]">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          {/* Información editorial del platillo */}
          <div className="space-y-1.5 pt-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {dish.name}
            </h2>
            {dish.description && (
              <p className="text-gray-500 text-sm leading-relaxed font-normal">
                {dish.description}
              </p>
            )}
          </div>

          {/* Selector de comensales: SOLO se muestra si hay 2 o más comensales en la mesa */}
          {diners.length > 1 && (
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                ¿Para quién es este platillo?
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {diners.map((d) => {
                  const isSelected = selectedDinerId === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDinerId(d.id)}
                      className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-[#1C3F32] border-[#1C3F32] text-white shadow-2xs font-semibold'
                          : 'border-gray-200 bg-white hover:bg-stone-50 text-gray-700'
                      }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer fijo con CTA único donde reside el precio de forma natural */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={handleAddAndClose}
            className="w-full bg-[#1C3F32] hover:bg-[#152e25] text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform duration-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar al pedido · {formatPrice(currentPrice, currency)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
