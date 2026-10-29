import React from 'react';

interface HomeHeroProps {
  onExplore: () => void;
  title?: string;
  subtitle?: string;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onExplore,
  title = 'El gusto de estar aquí.',
  subtitle = 'Cocina para compartir. Un buen plato, una buena conversación.',
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Tarjeta hero estática sin efectos de hover/zoom */}
      <div className="relative rounded-3xl overflow-hidden bg-black text-white p-7 shadow-xl min-h-[400px] flex flex-col justify-between border border-white/10">
        {/* Imagen estática de la fachada */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/hero-casa-tamarindo.jpg')` }}
        />

        {/* Degradado cinematográfico oscuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/35 pointer-events-none" />

        {/* Textos limpios sin 'A LA MESA, SIN AFÁN' ni punto verde */}
        <div className="relative z-10 pt-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-[1.15] text-white tracking-tight drop-shadow-sm">
            {title}
          </h1>

          <p className="text-gray-200 text-xs sm:text-sm font-sans mt-3 leading-relaxed max-w-xs drop-shadow-sm">
            {subtitle}
          </p>
        </div>

        {/* Botón Explorar el menú en verde bosque Casa Tamarindo */}
        <div className="relative z-10 pt-8">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 bg-[#1C3F32] hover:bg-[#142e25] text-white border border-white/20 font-semibold px-6 py-3.5 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-sm"
          >
            <span>Explorar el menú</span>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
