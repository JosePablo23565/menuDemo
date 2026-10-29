import React from 'react';

interface HomeHeroProps {
  onExplore: () => void;
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onExplore,
  title = 'El gusto de estar aquí.',
  subtitle = 'Cocina para compartir. Un buen plato, una buena conversación.',
  tagline = 'A LA MESA, SIN AFÁN',
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Tarjeta hero con la foto de la fachada de Casa Tamarindo de fondo */}
      <div className="relative rounded-3xl overflow-hidden bg-black text-white p-7 shadow-xl min-h-[420px] flex flex-col justify-between border border-white/10 group">
        {/* Imagen de fondo de la fachada real */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('/hero-casa-tamarindo.jpg')` }}
        />

        {/* Degradado cinematográfico oscuro para garantizar legibilidad perfecta de los textos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />

        {/* Encabezado y textos */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-emerald-300 uppercase">
              {tagline}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-[1.15] text-white tracking-tight mt-1 drop-shadow-sm">
            {title}
          </h1>

          <p className="text-gray-200 text-xs sm:text-sm font-sans mt-3 leading-relaxed max-w-xs drop-shadow-sm">
            {subtitle}
          </p>
        </div>

        {/* Botón Explorar el menú con estilo crema/amarillo */}
        <div className="relative z-10 pt-8">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 bg-[#E9F1AC] hover:bg-[#dfe89f] text-gray-900 font-semibold px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-[0.98] text-sm"
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
