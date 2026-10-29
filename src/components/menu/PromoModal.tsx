import React from 'react';
import type { Promotion } from '../../types/database';

interface PromoModalProps {
  isOpen: boolean;
  promo?: Promotion | null;
  onClose: () => void;
  onExploreCocktails: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  promo,
  onClose,
  onExploreCocktails,
}) => {
  if (!isOpen || !promo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor Verde Bosque idéntico a Imagen 4 */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#1C3F32] p-5 text-white shadow-2xl transition-all border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Cerrar promoción"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="pr-10 mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 block mb-1">
            PROMOCIÓN DE HOY
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
            {promo.title}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-4 text-gray-900 shadow-sm">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-emerald-900/10 mb-3 flex items-center justify-center border border-gray-100">
            {promo.imageUrl ? (
              <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <span className="text-3xl block mb-1">🍹🍸</span>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Barra de la casa
                </span>
              </div>
            )}
            <span className="absolute top-2.5 left-2.5 bg-[#E9F1AC] text-gray-900 font-extrabold text-xs px-2 py-0.5 rounded-full shadow-xs">
              {promo.badge}
            </span>
          </div>

          <h4 className="font-bold text-sm text-gray-900">{promo.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{promo.subtitle}</p>

          {promo.tags && promo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {promo.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold tracking-wider text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              onExploreCocktails();
            }}
            className="w-full mt-4 bg-[#1C3F32] hover:bg-[#142e25] text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{promo.ctaText || 'Ver opciones'}</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-200/90 hover:text-white font-medium py-1 transition-colors"
          >
            Cerrar y explorar el menú
          </button>
        </div>
      </div>
    </div>
  );
};
