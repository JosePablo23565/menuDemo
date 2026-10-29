import React from 'react';
import { cn } from '../../lib/utils';

export interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  label = 'Cargando...',
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3 text-gray-500', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-amber-600 border-t-transparent',
          sizeClasses[size]
        )}
      />
      {label && <p className="text-sm font-medium animate-pulse">{label}</p>}
    </div>
  );
};
