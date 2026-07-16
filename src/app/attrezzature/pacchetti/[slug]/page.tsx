import React from 'react';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

import { EquipmentPromoDetailView } from '@/components/EquipmentPromoDetailView';
import { Section } from '@/components/Section';
import { getEquipmentByIds } from '@/lib/equipment-queries';
import { getEquipmentPromoBySlug } from '@/lib/equipment-promo-queries';
import { pageCanonical } from '@/lib/site';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getEquipmentPromoBySlug(slug);
  if (!pkg) {
    return { title: 'Pacchetto non trovato | BeautyLine' };
  }
  return {
    title: `${pkg.name} | Pacchetti Attrezzature BeautyLine`,
    description: pkg.description,
    alternates: pageCanonical(`/attrezzature/pacchetti/${pkg.slug}`),
    openGraph: {
      title: pkg.name,
      description: pkg.description,
    },
  };
}

export default async function EquipmentPromoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getEquipmentPromoBySlug(slug);
  if (!pkg) permanentRedirect('/attrezzature#pacchetti-promo');

  const equipment = await getEquipmentByIds(pkg.equipmentIds);

  return (
    <Section className="min-h-0 bg-white py-12 md:py-16" containerClassName="max-w-6xl">
      <EquipmentPromoDetailView
        pkg={pkg}
        equipment={equipment}
        backHref="/attrezzature#pacchetti-promo"
      />
    </Section>
  );
}
