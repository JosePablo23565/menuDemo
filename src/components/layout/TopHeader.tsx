import React from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import type { Currency, Language } from '../../types/database';

export const TopHeader: React.FC = () => {
  const {
    currency,
    setCurrency,
    language,
    setLanguage,
    getTotalItemsCount,
    setIsCartOpen,
  } = useMenuStore();

  const totalItems = getTotalItemsCount();

  return (
    <header className="w-full bg-[#FBFBF9] border-b border-gray-100/80 px-4 pt-3 pb-2 sticky top-0 z-40">
      <div className="max-w-md mx-auto">
        {/* Fila Superior: Logo Oficial Casa Tamarindo y Botón Carrito */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            {/* Logotipo redondo nítido con sombra suave */}
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-gray-200/80 shrink-0 bg-[#36432b]">
              <img
                src="/logo.png"
                alt="Casa Tamarindo"
                className="w-full h-full object-cover rendering-crisp"
                loading="eager"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-gray-900 block leading-tight">
                Casa Tamarindo
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                Tel: 6045-4528
              </span>
            </div>
          </div>

          {/* Botón Carrito */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-gray-200/90 text-gray-800 hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
            aria-label="Abrir pedido"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-[#1C3F32] text-white text-[10px] font-bold rounded-full border-2 border-[#FBFBF9] animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Selectores de Idioma y Moneda en píldoras */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1 font-medium">Idioma</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full appearance-none bg-white border border-gray-200/90 rounded-2xl py-2 px-3 text-xs font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-green cursor-pointer pr-7"
              >
                <option value="es">🇨🇷 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1 font-medium">Moneda</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full appearance-none bg-white border border-gray-200/90 rounded-2xl py-2 px-3 text-xs font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-green cursor-pointer pr-7 truncate"
              >
                <option value="CRC">CRC · colón costarricense</option>
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
