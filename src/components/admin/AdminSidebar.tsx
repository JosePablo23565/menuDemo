import React from 'react';

export type AdminSection =
  | 'cocina'
  | 'carta'
  | 'qr'
  | 'resumen'
  | 'pedidos'
  | 'promociones'
  | 'sugerencias'
  | 'apariencia';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onGoToRestaurant: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  onGoToRestaurant,
  onLogout,
}) => {
  const primaryMenuItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    {
      id: 'cocina',
      label: 'Cocina',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'carta',
      label: 'Mi carta',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'qr',
      label: 'Códigos QR',
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/[0.06] flex flex-col justify-between shrink-0 h-screen sticky top-0 p-5 shadow-xs">
      <div>
        {/* Identidad en la cabecera del panel */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-2xs border border-black/10 shrink-0 bg-[#36432b]">
            <img
              src="/logo.png"
              alt="Casa Tamarindo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-gray-900 block leading-tight">
              Casa Tamarindo
            </span>
            <span className="text-[10px] text-gray-400 font-medium block">
              Gestión gastronómica
            </span>
          </div>
        </div>

        {/* Sección de Operaciones activas */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-3 pb-1">
            Operaciones
          </p>
          <nav className="space-y-1">
            {primaryMenuItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1C3F32] text-white shadow-xs'
                      : 'text-gray-600 hover:bg-stone-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer del Sidebar simplificado */}
      <div className="pt-4 border-t border-gray-100 space-y-1">
        <button
          onClick={onGoToRestaurant}
          className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-stone-50 hover:text-gray-900 transition-colors flex items-center justify-between"
        >
          <span>Ver menú</span>
          <span className="text-gray-400">↗</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
