import React, { useState, useEffect } from 'react';
import type { Dish, Category } from '../../types/database';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DishEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: Partial<Dish>) => Promise<void>;
  dish?: Dish | null;
  categories: Category[];
  isLoading?: boolean;
}

export const DishEditModal: React.FC<DishEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dish,
  categories,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceCRC: 0,
    priceUSD: 0,
    imageUrl: '',
    categoryId: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        priceCRC: dish.priceCRC || 0,
        priceUSD: dish.priceUSD || 0,
        imageUrl: dish.imageUrl || '',
        categoryId: dish.categoryId || (categories[0]?.id ?? ''),
        isAvailable: dish.isAvailable ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priceCRC: 0,
        priceUSD: 0,
        imageUrl: '',
        categoryId: categories[0]?.id ?? '',
        isAvailable: true,
      });
    }
  }, [dish, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...(dish?.id ? { id: dish.id } : {}),
      name: formData.name,
      description: formData.description,
      priceCRC: Number(formData.priceCRC),
      priceUSD: Number(formData.priceUSD),
      imageUrl: formData.imageUrl,
      categoryId: formData.categoryId,
      isAvailable: formData.isAvailable,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dish ? 'Editar Platillo' : 'Nuevo Platillo'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs focus:border-brand-green focus:outline-none"
            placeholder="Ej: Casado Tradicional"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs focus:border-brand-green focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Precio (CRC ₡)</label>
            <input
              type="number"
              required
              value={formData.priceCRC}
              onChange={(e) => setFormData({ ...formData, priceCRC: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Precio (USD $)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.priceUSD}
              onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Categoría</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">URL de la Imagen</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="rounded border-gray-300 text-brand-green h-4 w-4"
          />
          <label htmlFor="isAvailable" className="text-xs text-gray-700 font-medium">
            Platillo disponible para los comensales
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            className="bg-[#1C3F32] hover:bg-[#142e25] text-white"
          >
            Guardar en Supabase
          </Button>
        </div>
      </form>
    </Modal>
  );
};
