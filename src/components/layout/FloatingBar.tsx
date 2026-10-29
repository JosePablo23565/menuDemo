import React from 'react';

interface FloatingBarProps {
  isLargeView: boolean;
  onToggleLargeView: () => void;
  whatsappNumber?: string;
}

export const FloatingBar: React.FC<FloatingBarProps> = ({
  isLargeView,
  onToggleLargeView,
  whatsappNumber = '50660454528', // Número oficial Casa Tamarindo
}) => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent('¡Hola Casa Tamarindo! Quisiera consultar sobre el menú.');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 pointer-events-none">
      <div className="max-w-md mx-auto px-4 flex items-center justify-between pointer-events-auto">
        {/* Botón Píldora Negra: "👁 Ver grande" o "Ver cuadrícula" */}
        <button
          onClick={onToggleLargeView}
          className="bg-black text-white px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{isLargeView ? 'Ver cuadrícula' : 'Ver grande'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Botón Circular Verde de WhatsApp Casa Tamarindo */}
          <button
            onClick={handleWhatsApp}
            className="w-11 h-11 rounded-full bg-[#1C3F32] hover:bg-[#152e25] text-white flex items-center justify-center shadow-xl transition-all active:scale-95"
            aria-label="Contactar por WhatsApp a Casa Tamarindo"
            title="WhatsApp Casa Tamarindo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
