import React from 'react';

interface MenuHeroProps {
  restaurantName?: string;
  tableNumber?: string | null;
}

export const MenuHero: React.FC<MenuHeroProps> = ({
  restaurantName = 'Bistró & Sabor',
  tableNumber,
}) => {
  return (
    <header className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white px-4 py-8 sm:py-12 rounded-b-3xl shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
            Menú Digital QR
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {restaurantName}
          </h1>
          <p className="text-amber-100/80 text-sm sm:text-base mt-1 max-w-lg">
            Explora nuestra carta, personaliza tu orden y recibe tus platillos directo en la mesa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-xs">
            <p className="text-gray-300">Ubicación</p>
            <p className="text-sm font-bold text-white">
              {tableNumber ? `Mesa #${tableNumber}` : 'Mesa General (Para Llevar / Barra)'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
