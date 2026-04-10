'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/shared/Button';
import type { PublicProductJson } from '@/lib/public-product';

export interface ProductDetailViewProps {
  product: PublicProductJson;
}

function isRemoteUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const defaultImage = product.image;
  const colors = product.availableColors;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const displaySrc = useMemo(() => {
    if (activeIndex == null || !colors[activeIndex]) return defaultImage;
    const c = colors[activeIndex];
    return c.imageUrl ?? defaultImage;
  }, [activeIndex, colors, defaultImage]);

  const isRemote = isRemoteUrl(displaySrc);

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
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-muted mx-auto">
            <Image
              key={displaySrc}
              src={displaySrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 448px, 100vw"
              priority
              unoptimized={isRemote}
            />
          </div>

          {colors.length > 0 && (
            <div className="mx-auto flex w-full max-w-md flex-col gap-3">
              <p className="block text-center text-xs font-medium uppercase tracking-wide text-gray-500 md:text-left">
                Colori disponibili
              </p>
              <ul
                className="flex flex-wrap items-center justify-center gap-3 md:justify-start"
                role="list"
              >
                {colors.map((color, index) => {
                  const selected = activeIndex === index;
                  return (
                    <li key={`${color.name}-${color.hex}-${index}`}>
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          selected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-pressed={selected}
                        aria-label={`Colore ${color.name}`}
                        title={color.name}
                      >
                        <span className="sr-only">{color.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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
