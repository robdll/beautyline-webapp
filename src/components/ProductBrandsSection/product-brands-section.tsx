import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { PRODUCT_BRANDS, type ProductBrand, type ProductSubcategory } from '@/lib/product-brands';
import { cn } from '@/lib/utils';

interface ProductBrandsSectionProps {
  id?: string;
  brands?: ProductBrand[];
  ctaText?: string;
  /** URL completo del pulsante catalogo (default: `?catalogo=1` su `catalogBasePath`). */
  ctaHref?: string;
  /** Base path per link al catalogo modale (es. `/prodotti`). */
  catalogBasePath?: string;
}

const BRAND_LINE_CARDS: { brandId: string; title: string; imageSrc: string }[] = [
  { brandId: 'chris-nails', title: 'Chris Nails', imageSrc: '/images/product-brand-1.webp' },
  { brandId: 'skin-renew', title: 'Skin Renew', imageSrc: '/images/product-brand-2.webp' },
];

function SubcategoryCard({
  sub,
  catalogHref,
  variant,
}: {
  sub: ProductSubcategory;
  catalogHref: string;
  variant: 'nails' | 'skin';
}) {
  const gradient =
    variant === 'nails'
      ? 'bg-linear-to-br from-primary/25 to-purple/15'
      : 'bg-linear-to-br from-purple/20 to-primary/20';

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg',
        gradient
      )}
    >
      <Link
        href={catalogHref}
        className="group relative flex min-h-34 flex-1 flex-col items-center justify-around px-4 py-5 md:min-h-38 md:px-5 md:py-6"
        aria-label={`${sub.title} — vai al catalogo`}
      >
        <h4 className="heading-brand text-lg font-bold leading-snug tracking-wide text-balance text-center text-secondary md:text-xl">
          {sub.title}
        </h4>
        <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
          Vedi nel catalogo
        </span>
      </Link>
      {sub.description ? (
        <div className="border-t border-black/5 bg-white/80 px-4 py-3 text-center md:px-5">
          <details className="group/details text-sm text-gray-700">
            <summary className="cursor-pointer list-none font-semibold text-secondary outline-none marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="underline-offset-2 group-open/details:underline">Descrizione</span>
            </summary>
            <p className="mt-2 text-center leading-relaxed text-pretty">{sub.description}</p>
          </details>
        </div>
      ) : null}
    </div>
  );
}

export const ProductBrandsSection: React.FC<ProductBrandsSectionProps> = ({
  id = 'linee-prodotti',
  brands = PRODUCT_BRANDS,
  ctaText = 'Vai al catalogo',
  ctaHref,
  catalogBasePath = '/prodotti',
}) => {
  const catalogOpenHref = ctaHref ?? `${catalogBasePath}?catalogo=1`;

  return (
    <Section
      id={id}
      className="min-h-0 scroll-mt-24"
      containerClassName="flex flex-col items-center gap-14 md:gap-16"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
        <h2 className="heading-brand mb-1 text-3xl font-bold tracking-wide md:text-4xl">
          Le Nostre Linee
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-gray-700 md:text-lg">
          Due marchi pensati per professioniste e centri estetici: la linea unghie{' '}
          <span className="font-semibold text-secondary">Chris Nails</span> e la cosmetica{' '}
          <span className="font-semibold text-secondary">Skin Renew</span>. Scorri per conoscere la storia di
          ogni linea e le famiglie di prodotto; dal catalogo puoi acquistare le referenze disponibili.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {BRAND_LINE_CARDS.map((card) => (
          <Link
            key={card.brandId}
            href={`${catalogBasePath}#${card.brandId}`}
            aria-label={`${card.title} — vai alla sezione`}
            className="group block min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-lg md:p-8">
              <Image
                src={card.imageSrc}
                alt={`Logo ${card.title}`}
                fill
                sizes="(min-width: 768px) 360px, 92vw"
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 md:gap-20">
        {brands.map((brand) => (
          <article
            key={brand.id}
            id={brand.id}
            className="scroll-mt-24 border-t border-black/10 pt-12 text-center first:border-t-0 first:pt-0 md:pt-16 first:md:pt-0 flex flex-col items-center gap-4"
          >
            <header className="mb-6 md:mb-8">
              <h3 className="heading-brand text-2xl font-bold tracking-wide md:text-3xl">{brand.title}</h3>
              {brand.tagline ? (
                <p className="mt-2 text-base font-medium text-primary md:text-lg">{brand.tagline}</p>
              ) : null}
            </header>

            <div className="mx-auto mb-8 max-w-3xl space-y-4 text-base leading-relaxed text-gray-700 md:mb-10 md:text-lg">
              {brand.paragraphs.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>

            <div
              className={cn(
                'mx-auto grid w-full gap-4 md:gap-5',
                brand.subcategories.length <= 2
                  ? 'max-w-2xl grid-cols-1 sm:grid-cols-2'
                  : 'max-w-5xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
              )}
            >
              {brand.subcategories.map((sub) => (
                <SubcategoryCard
                  key={sub.id}
                  sub={sub}
                  catalogHref={`${catalogBasePath}?marca=${encodeURIComponent(brand.id)}&linea=${encodeURIComponent(sub.id)}`}
                  variant={brand.id === 'skin-renew' ? 'skin' : 'nails'}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="flex w-full justify-center pt-2">
        <Link href={catalogOpenHref}>
          <Button variant="primary" size="lg" className="font-bold uppercase tracking-wider">
            {ctaText}
          </Button>
        </Link>
      </div>
    </Section>
  );
};
