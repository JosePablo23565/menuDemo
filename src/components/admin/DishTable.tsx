import React from 'react';
import type { Dish, Category } from '../../types/database';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';

interface DishTableProps {
  dishes: Dish[];
  categories: Category[];
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (dish: Dish) => void;
}

export const DishTable: React.FC<DishTableProps> = ({
  dishes,
  categories,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || 'Sin categoría';
  };

  return (
    <div className="overflow-x-auto rounded-3xl border border-black/[0.06] bg-white shadow-xs">
      <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
        <thead className="bg-[#FAF9F6] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <tr>
            <th className="px-5 py-3.5">Platillo</th>
            <th className="px-4 py-3.5">Categoría</th>
            <th className="px-4 py-3.5 text-right font-mono">Precio (CRC)</th>
            <th className="px-4 py-3.5 text-right font-mono">Precio (USD)</th>
            <th className="px-4 py-3.5 text-center">Disponibilidad</th>
            <th className="px-5 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {dishes.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                No hay platillos registrados aún en la carta.
              </td>
            </tr>
          ) : (
            dishes.map((dish) => (
              <tr key={dish.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {dish.imageUrl ? (
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="h-11 w-11 rounded-2xl object-cover bg-stone-100 shadow-2xs border border-black/[0.04]"
                      />
                    ) : (
                      /* Icono SVG sobrio sin emojis */
                      <div className="h-11 w-11 rounded-2xl bg-stone-100 border border-black/[0.04] flex items-center justify-center text-stone-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-xs sm:text-sm">{dish.name}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs font-normal">
                        {dish.description || 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-600">
                  <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-[11px] font-medium border border-black/[0.04]">
                    {getCategoryName(dish.categoryId)}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-bold font-mono text-gray-900 text-right tabular-nums">
                  {formatPrice(dish.priceCRC, 'CRC')}
                </td>
                <td className="px-4 py-3.5 font-semibold font-mono text-stone-600 text-right tabular-nums">
                  {formatPrice(dish.priceUSD, 'USD')}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button
                    onClick={() => onToggleAvailability(dish)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ${
                      dish.isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}
                    title="Click para alternar disponibilidad"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        dish.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                      }`}
                    />
                    {dish.isAvailable ? 'Disponible' : 'Agotado'}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right space-x-1.5">
                  <Button variant="outline" size="sm" onClick={() => onEdit(dish)}>
                    Editar
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${dish.name} de la carta?`)) {
                        onDelete(dish.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center align-middle"
                    title="Eliminar plato"
                    aria-label={`Eliminar ${dish.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
