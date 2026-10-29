import React from 'react';
import type { Category } from '../../types/database';
import { cn } from '../../lib/utils';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 shrink-0',
            selectedCategoryId === null
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Todos los platos
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 shrink-0',
                isSelected
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
