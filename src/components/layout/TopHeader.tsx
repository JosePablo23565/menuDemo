import React from 'react';
import { useMenuStore } from '../../store/useMenuStore';

export const TopHeader: React.FC = () => {
  const {
    currency,
    setCurrency,
    getTotalItemsCount,
    setIsCartOpen,
  } = useMenuStore();

  const totalItems = getTotalItemsCount();

  const toggleCurrency = () => {
    setCurrency(currency === 'CRC' ? 'USD' : 'CRC');
  };

  return (
    <header className="w-full bg-[#FBFBF9]/95 backdrop-blur-md border-b border-black/[0.05] px-4 py-3 sticky top-0 z-40">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Marca armónica: Logo + Nombre en una sola línea limpia */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-2xs border border-black/10 shrink-0 bg-[#36432b]">
            <img
              src="/logo.png"
              alt="Casa Tamarindo"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-gray-900 truncate">
            Casa Tamarindo
          </span>
        </div>

        {/* Acciones a la derecha: Micro-badge Moneda + Botón Carrito */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Micro-badge sobrio de moneda: alterna entre ₡ CRC y $ USD con un toque */}
          <button
            onClick={toggleCurrency}
            className="h-10 px-3 rounded-2xl bg-white border border-black/[0.08] text-xs font-semibold text-[#1C3F32] hover:bg-stone-50 active:scale-95 transition-all shadow-2xs flex items-center justify-center select-none"
            title="Tocar para cambiar entre Colones y Dólares"
            aria-label={`Moneda actual ${currency}. Toca para cambiar.`}
          >
            <span>{currency === 'CRC' ? '₡ CRC' : '$ USD'}</span>
          </button>

          {/* Botón Carrito estilizado */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-black/[0.08] text-gray-800 hover:bg-stone-50 active:scale-95 transition-all shadow-2xs"
            aria-label="Abrir pedido"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 bg-[#1C3F32] text-white text-[10px] font-bold rounded-full border-2 border-[#FBFBF9]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
