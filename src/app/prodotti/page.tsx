import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ProductBrandsSection } from '@/components/ProductBrandsSection';
import { ProductCatalogModal } from '@/components/ProductCatalogModal';

export const metadata: Metadata = {
  title: 'I Nostri Prodotti',
  description: 'Scopri la nostra linea completa di prodotti professionali per estetica e benessere.',
};

export const dynamic = 'force-dynamic';

function CatalogSectionFallback() {
  return (
    <div className="flex min-h-[160px] w-full items-center justify-center rounded-2xl bg-muted/30 py-10 text-gray-500">
      Caricamento catalogo…
    </div>
  );
}

export default function ProdottiPage() {
  return (
    <>
      <Hero
        title={
          <Image
            src="/images/logo-bl.png"
            alt="BeautyLine"
            width={280}
            height={280}
            className="w-48 md:w-64 lg:w-72 h-auto drop-shadow-lg"
            priority
          />
        }
        description={
          <p className="text-2xl font-semibold text-white leading-snug md:text-3xl lg:text-4xl">
            Qualità professionale per risultati eccellenti.
          </p>
        }
        ctaText="Scopri le linee"
        ctaHref="/prodotti#linee-prodotti"
      />

      <ProductBrandsSection />

      <Section
        id="catalogo"
        className="scroll-mt-24 min-h-0"
        containerClassName="flex flex-col items-center gap-8"
      >
        <Suspense fallback={<CatalogSectionFallback />}>
          <ProductCatalogModal />
        </Suspense>
      </Section>
    </>
  );
}
