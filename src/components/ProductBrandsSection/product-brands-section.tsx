import React from 'react';

import { Section } from '@/components/Section';
import { SubcategoryCatalogCard } from './SubcategoryCatalogCard';
import { ProductBrandLines } from './ProductBrandLines';
import { PRODUCT_BRANDS, type ProductBrand } from '@/lib/product-brands';
import { makeProductCategoryKey } from '@/lib/product-category-visibility';
import { cn } from '@/lib/utils';

interface ProductBrandsSectionProps {
  id?: string;
  brands?: ProductBrand[];
  /** Base path per link al catalogo modale (es. `/prodotti`). */
  catalogBasePath?: string;
  /** Chiavi `brandId:subcategoryId` non ancora pubblicate nel catalogo. */
  disabledCategoryKeys?: readonly string[];
}

export const ProductBrandsSection: React.FC<ProductBrandsSectionProps> = ({
  id = 'linee-prodotti',
  brands = PRODUCT_BRANDS,
  catalogBasePath = '/prodotti',
  disabledCategoryKeys = [],
}) => {
  const disabled = new Set(disabledCategoryKeys);

  return (
    <Section
      id={id}
      className="min-h-0 scroll-mt-24"
      containerClassName="flex flex-col items-center gap-14 md:gap-16"
    >
      <ProductBrandLines catalogBasePath={catalogBasePath} />

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
                <SubcategoryCatalogCard
                  key={sub.id}
                  sub={sub}
                  catalogHref={`${catalogBasePath}?marca=${encodeURIComponent(brand.id)}&linea=${encodeURIComponent(sub.id)}`}
                  variant={brand.id === 'skin-renew' ? 'skin' : 'nails'}
                  disabled={disabled.has(makeProductCategoryKey(brand.id, sub.id))}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};
