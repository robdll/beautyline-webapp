import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col', className)}>
      <div className="relative w-full h-64">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        {product.category && (
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-2">
            {product.category}
          </span>
        )}
        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          {product.price && (
            <p className="text-lg font-bold text-[var(--color-primary)]">
              {product.price}
            </p>
          )}
          <Link href={`/prodotti/${product.id}`}>
            <Button variant="primary" size="sm">
              Acquista
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

