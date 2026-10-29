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
    <div className="overflow-x-auto rounded-3xl border border-gray-200/90 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
        <thead className="bg-[#FAF9F6] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3.5">Platillo</th>
            <th className="px-4 py-3.5">Categoría</th>
            <th className="px-4 py-3.5">Precio (CRC)</th>
            <th className="px-4 py-3.5">Precio (USD)</th>
            <th className="px-4 py-3.5">Estado</th>
            <th className="px-4 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {dishes.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                No hay platillos en la base de datos aún.
              </td>
            </tr>
          ) : (
            dishes.map((dish) => (
              <tr key={dish.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {dish.imageUrl ? (
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="h-10 w-10 rounded-xl object-cover bg-gray-100 shadow-2xs"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                        🍽️
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{dish.name}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                        {dish.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                    {getCategoryName(dish.categoryId)}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-gray-900">
                  {formatPrice(dish.priceCRC, 'CRC')}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-600">
                  {formatPrice(dish.priceUSD, 'USD')}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleAvailability(dish)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      dish.isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                    title="Click para alternar disponibilidad"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        dish.isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    {dish.isAvailable ? 'Disponible' : 'Agotado'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(dish)}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm(`¿Eliminar ${dish.name} de Supabase?`)) onDelete(dish.id);
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
