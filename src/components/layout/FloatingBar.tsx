import React from 'react';

interface FloatingBarProps {
  isLargeView?: boolean;
  onToggleLargeView?: () => void;
  whatsappNumber?: string;
}

export const FloatingBar: React.FC<FloatingBarProps> = ({
  whatsappNumber = '50660454528', // Número oficial Casa Tamarindo
}) => {
  const handleWhatsApp = () => {
    const text = encodeURIComponent('¡Hola Casa Tamarindo! Quisiera consultar sobre el menú.');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <aside className="fixed bottom-5 right-5 z-40 pointer-events-auto" aria-label="Contacto directo">
      {/* Botón Circular Verde de WhatsApp Casa Tamarindo en esquina sin tapar platillos */}
      <button
        onClick={handleWhatsApp}
        className="w-12 h-12 rounded-full bg-[#1C3F32] hover:bg-[#152e25] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95 border border-white/20"
        aria-label="Contactar por WhatsApp a Casa Tamarindo"
        title="WhatsApp Casa Tamarindo"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </aside>
  );
};
