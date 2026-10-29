import React from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import type { Currency, Language } from '../../types/database';

export const TopHeader: React.FC = () => {
  const { currency, setCurrency, language, setLanguage } = useMenuStore();

  return (
    <header className="w-full bg-[#FBFBF9] border-b border-gray-100/80 px-4 pt-3 pb-2 sticky top-0 z-40">
      <div className="max-w-md mx-auto">
        {/* Logo / Nombre del restaurante */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            {/* Ícono de arco / terraza estilizado */}
            <div className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v4m0 0a6 6 0 016 6v7H6v-7a6 6 0 016-6z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-gray-900 block leading-tight">
                La Terraza
              </span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
            Demo
          </div>
        </div>

        {/* Selectores de Idioma y Moneda en píldoras (exacto a las capturas) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Selector de Idioma */}
          <div>
            <label className="block text-[11px] text-gray-400 mb-1 font-medium">Idioma</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full appearance-none bg-white border border-gray-200/90 rounded-2xl py-2 px-3 text-xs font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-green cursor-pointer pr-7"
              >
                <option value="es">🇨🇴 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Selector de Moneda */}
          <div>
            <label className="block text-[11px] text-gray-400 mb-1 font-medium">Moneda</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full appearance-none bg-white border border-gray-200/90 rounded-2xl py-2 px-3 text-xs font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-green cursor-pointer pr-7 truncate"
              >
                <option value="COP">COP · peso colombiano</option>
                <option value="USD">USD · dólar estadounidense</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
