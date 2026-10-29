import React, { useState, useEffect, useRef } from 'react';
import type { Dish, Category } from '../../types/database';
import { useMenuStore } from '../../store/useMenuStore';
import { formatPrice, uploadDishImage } from '../../lib/utils';
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
  const { exchangeRate } = useMenuStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceCRC: 0,
    imageUrl: '',
    categoryId: '',
    isAvailable: true,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        priceCRC: dish.priceCRC || 0,
        imageUrl: dish.imageUrl || '',
        categoryId: dish.categoryId || (categories[0]?.id ?? ''),
        isAvailable: dish.isAvailable ?? true,
      });
      setImagePreview(dish.imageUrl || '');
    } else {
      setFormData({
        name: '',
        description: '',
        priceCRC: 0,
        imageUrl: '',
        categoryId: categories[0]?.id ?? '',
        isAvailable: true,
      });
      setImagePreview('');
    }
  }, [dish, categories, isOpen]);

  const calculatedUSD = Number((formData.priceCRC / (exchangeRate || 515)).toFixed(2));

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      // Previsualización instantánea local
      setImagePreview(URL.createObjectURL(file));

      // Conversión automática a WebP y subida al bucket 'dishes'
      const publicUrl = await uploadDishImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      setImagePreview(publicUrl);
    } catch (err: any) {
      alert(`Error al procesar la imagen: ${err?.message || 'Error desconocido'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...(dish?.id ? { id: dish.id } : {}),
      name: formData.name,
      description: formData.description,
      priceCRC: Number(formData.priceCRC),
      priceUSD: calculatedUSD,
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
            placeholder="Ej: Casado con Carne en Salsa"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs focus:border-brand-green focus:outline-none"
            placeholder="Detalles, acompañamientos o ingredientes..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Precio en Colones (₡)
            </label>
            <input
              type="number"
              required
              step="50"
              min="0"
              value={formData.priceCRC || ''}
              onChange={(e) => setFormData({ ...formData, priceCRC: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-900"
              placeholder="Ej: 4500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Precio en Dólares (Auto)
            </label>
            <div className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>{formatPrice(calculatedUSD, 'USD')}</span>
              <span className="text-[10px] text-gray-400 font-normal">Tasa: ₡{exchangeRate}</span>
            </div>
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

        {/* Zona de Subida de Fotos con Conversión a WebP Automática */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Foto del Platillo (Optimización WebP automática)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-3">
            {imagePreview ? (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 group">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-semibold">
                    WebP...
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="flex-1">
              <button
                type="button"
                disabled={isUploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploadingImage ? 'Optimizando imagen...' : imagePreview ? 'Cambiar foto' : 'Subir foto'}
              </button>
              <p className="text-[10px] text-gray-400 mt-1">
                Acepta cualquier foto de móvil (JPG, PNG, HEIC) y la convierte a WebP ultraligero.
              </p>
            </div>
          </div>
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
            Platillo disponible en el menú
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
            isLoading={isLoading || isUploadingImage}
            className="bg-[#1C3F32] hover:bg-[#142e25] text-white"
          >
            Guardar platillo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
