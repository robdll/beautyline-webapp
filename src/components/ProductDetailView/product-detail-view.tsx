import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/shared/Button';
import type { PublicProductJson } from '@/lib/public-product';

export interface ProductDetailViewProps {
  product: PublicProductJson;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const imageSrc = product.image;
  const isRemote = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8">
        <Link
          href="/prodotti?catalogo=1"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Torna al catalogo prodotti
        </Link>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-muted mx-auto">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 448px, 100vw"
            priority
            unoptimized={isRemote}
          />
        </div>

        <header className="flex flex-col gap-2 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {product.brand}
            {product.type ? ` · ${product.type}` : ''}
          </p>
          <h1 className="heading-brand text-3xl font-bold text-balance md:text-4xl">{product.name}</h1>
        </header>

        <dl className="flex flex-col gap-4 text-sm text-gray-600">
          <div>
            <dt className="font-medium text-gray-700">Descrizione</dt>
            <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-700 md:text-base">
              {product.description}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Prezzo</dt>
            <dd className="text-lg font-bold text-primary">{product.price}</dd>
          </div>
        </dl>

        <div className="pt-2">
          <Link href={`/contatti?prodotto=${encodeURIComponent(product.name)}`}>
            <Button variant="primary" size="lg" className="font-bold uppercase tracking-wider">
              Richiedi informazioni
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
