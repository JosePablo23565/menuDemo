import { useEffect, useState } from 'react';
import { useMenuStore } from './store/useMenuStore';
import { useAuth } from './hooks/useAuth';
import { useCategories, useDishes, useUpsertDish, useDeleteDish } from './hooks/useMenu';
import { TopHeader } from './components/layout/TopHeader';
import { HomeHero } from './components/menu/HomeHero';
import { DishCard } from './components/menu/DishCard';
import { DishDetailModal } from './components/menu/DishDetailModal';
import { CartDrawer } from './components/menu/CartDrawer';
import { FloatingBar } from './components/layout/FloatingBar';
import { AdminLogin } from './components/admin/AdminLogin';
import { DishTable } from './components/admin/DishTable';
import { DishEditModal } from './components/admin/DishEditModal';
import { Button } from './components/ui/Button';
import type { Dish } from './types/database';

export default function App() {
  const {
    syncTableFromUrl,
    selectedDish,
    setSelectedDish,
  } = useMenuStore();

  const { isAuthenticated, signIn, signOut } = useAuth();

  // Detección de ruta secreta: solo si la URL es /admin o /admin/
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname.startsWith('/admin');
  });

  // Queries directas desde Supabase
  const { data: dbCategories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: dbDishes = [], isLoading: isLoadingDishes } = useDishes({ onlyAvailable: false });
  const upsertDishMutation = useUpsertDish();
  const deleteDishMutation = useDeleteDish();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLargeView, setIsLargeView] = useState(false);

  // Estados de modal admin
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  useEffect(() => {
    syncTableFromUrl();

    // Escuchar cambios de historial en el navegador
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncTableFromUrl]);

  // Seleccionar la primera categoría que llegue de la base de datos
  useEffect(() => {
    if (dbCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(dbCategories[0].id);
    }
  }, [dbCategories, selectedCategory]);

  // Filtrado de comensales (solo platos disponibles)
  const availableDishes = dbDishes.filter((d) => d.isAvailable);
  const currentCategoryDishes = selectedCategory
    ? availableDishes.filter((d) => d.categoryId === selectedCategory)
    : availableDishes;

  const scrollToMenu = () => {
    const element = document.getElementById('menu-catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleAvailability = (dish: Dish) => {
    upsertDishMutation.mutate({
      ...dish,
      isAvailable: !dish.isAvailable,
    });
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setIsAdminRoute(path.startsWith('/admin'));
  };

  // ========================================================
  // RUTA PRIVADA: /admin (TOTALMENTE OCULTA PARA COMENSALES)
  // ========================================================
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
        <main className="max-w-4xl mx-auto py-8">
          {!isAuthenticated ? (
            <div>
              <div className="mb-4 text-center">
                <button
                  onClick={() => navigateTo('/')}
                  className="text-xs text-gray-500 hover:text-gray-800 underline"
                >
                  ← Volver al Menú de Clientes
                </button>
              </div>
              <AdminLogin
                onLogin={async (email, pass) => {
                  await signIn(email, pass);
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                    Administración de Menú
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Conectado en vivo a Supabase ({dbDishes.length} platillos en BD)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateTo('/')}
                  >
                    Ver Menú Cliente
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#1C3F32] hover:bg-[#142e25] text-white"
                    onClick={() => {
                      setEditingDish(null);
                      setIsEditModalOpen(true);
                    }}
                  >
                    + Nuevo Platillo
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Cerrar Sesión
                  </Button>
                </div>
              </div>

              {/* Tabla de Platos sincronizada con Supabase */}
              <DishTable
                dishes={dbDishes}
                categories={dbCategories}
                onEdit={(dish) => {
                  setEditingDish(dish);
                  setIsEditModalOpen(true);
                }}
                onDelete={(id) => deleteDishMutation.mutate(id)}
                onToggleAvailability={handleToggleAvailability}
              />

              {/* Modal de Creación / Edición */}
              <DishEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                categories={dbCategories}
                dish={editingDish}
                isLoading={upsertDishMutation.isPending}
                onSave={async (dishData) => {
                  await upsertDishMutation.mutateAsync(dishData);
                  setIsEditModalOpen(false);
                }}
              />
            </div>
          )}
        </main>
      </div>
    );
  }

  // ========================================================
  // RUTA PÚBLICA (/): VISTA ÚNICA Y EXCLUSIVA PARA COMENSAL
  // ========================================================
  return (
    <div className="min-h-screen dot-pattern text-gray-900 pb-28">
      <TopHeader />

      <main className="max-w-md mx-auto">
        <HomeHero onExplore={scrollToMenu} />

        <section id="menu-catalog" className="px-4 pt-4">
          {/* Barra de Categorías obtenidas de Supabase */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {isLoadingCategories ? (
                <span className="text-xs text-gray-400 py-1">Cargando categorías...</span>
              ) : dbCategories.length === 0 ? (
                <span className="text-xs text-gray-400 py-1">No hay categorías registradas</span>
              ) : (
                dbCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`font-serif text-lg sm:text-xl font-bold transition-all px-1 capitalize whitespace-nowrap ${
                        isSelected
                          ? 'text-gray-900 border-b-2 border-gray-900'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </div>

            {/* Switch Cuadrícula / Lista */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => setIsLargeView(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  !isLargeView ? 'bg-black text-white' : 'text-gray-400'
                }`}
                title="Cuadrícula"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setIsLargeView(true)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLargeView ? 'bg-black text-white' : 'text-gray-400'
                }`}
                title="Vista Grande"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Catálogo de Platillos desde Supabase */}
          {isLoadingDishes ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Cargando menú en vivo desde Supabase...
            </div>
          ) : currentCategoryDishes.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 bg-white rounded-3xl border border-gray-100 p-6">
              No hay platos disponibles en esta categoría.
            </div>
          ) : (
            <div
              className={`grid gap-3.5 ${
                isLargeView ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {currentCategoryDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  isLargeView={isLargeView}
                  onSelect={(d: Dish) => setSelectedDish(d)}
                />
              ))}
            </div>
          )}
        </section>

        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />

        <CartDrawer />

        <FloatingBar
          isLargeView={isLargeView}
          onToggleLargeView={() => setIsLargeView(!isLargeView)}
        />
      </main>
    </div>
  );
}
