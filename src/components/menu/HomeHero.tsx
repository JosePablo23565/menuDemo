import React from 'react';
import { RESTAURANT_DATA } from '../../lib/data';

interface HomeHeroProps {
  onExplore: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onExplore }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Tarjeta oscura elegante idéntica a la Imagen 1 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#2C2E2D] to-[#171818] text-white p-7 shadow-xl min-h-[380px] flex flex-col justify-between border border-white/5">
        {/* Grano / Textura sutil y fondo de restaurante */}
        <div className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay" />

        {/* Encabezado */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold tracking-widest text-gray-300 uppercase">
              {RESTAURANT_DATA.tagline}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-[1.15] text-white tracking-tight mt-1">
            {RESTAURANT_DATA.title}
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm font-sans mt-4 leading-relaxed max-w-xs">
            {RESTAURANT_DATA.subtitle}
          </p>
        </div>

        {/* Botón Explorar el menú en color crema/amarillento suave */}
        <div className="relative z-10 pt-6">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 bg-[#E9F1AC] hover:bg-[#dfe89f] text-gray-900 font-semibold px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98] text-sm"
          >
            <span>Explorar el menú</span>
            <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
