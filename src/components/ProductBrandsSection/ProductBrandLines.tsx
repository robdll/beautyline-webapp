import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const BRAND_LINE_CARDS: { brandId: string; title: string; imageSrc: string }[] = [
  { brandId: 'chris-nails', title: 'Chris Nails', imageSrc: '/images/product-brand-1.webp' },
  { brandId: 'skin-renew', title: 'Skin Renew', imageSrc: '/images/product-brand-2.webp' },
];

export interface ProductBrandLinesProps {
  /** Titolo del blocco. */
  title?: string;
  /** Base path per i link verso le sezioni di brand (es. `/prodotti`). */
  catalogBasePath?: string;
  /** Slot opzionale renderizzato sotto la griglia (es. CTA). */
  footer?: React.ReactNode;
  className?: string;
}

export const ProductBrandLines: React.FC<ProductBrandLinesProps> = ({
  title = 'Le Nostre Linee',
  catalogBasePath = '/prodotti',
  footer,
  className,
}) => {
  return (
    <div className={cn('flex w-full flex-col items-center gap-14 md:gap-16', className)}>
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
        <h2 className="heading-brand mb-1 text-3xl font-bold tracking-wide md:text-4xl">{title}</h2>
        <p className="max-w-3xl text-base leading-relaxed text-gray-700 md:text-lg">
          Due marchi pensati per professioniste e centri estetici: la linea unghie{' '}
          <span className="font-semibold text-secondary">Chris Nails</span> e la cosmetica{' '}
          <span className="font-semibold text-secondary">Skin Renew</span>. Scorri per conoscere la storia di
          ogni linea e le famiglie di prodotto; dal catalogo puoi acquistare le referenze disponibili.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-[652px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {BRAND_LINE_CARDS.map((card) => (
          <Link
            key={card.brandId}
            href={`${catalogBasePath}#${card.brandId}`}
            aria-label={`${card.title} — vai alla sezione`}
            className="group block min-w-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-lg md:p-8">
              <Image
                src={card.imageSrc}
                alt={`Logo ${card.title}`}
                fill
                sizes="(min-width: 768px) 306px, 78vw"
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ))}
      </div>

      {footer ? <div className="w-full">{footer}</div> : null}
    </div>
  );
};
