import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EquipmentDetailView } from '@/components/EquipmentDetailView';
import { Section } from '@/components/Section';
import { getEquipmentByTipoId } from '@/lib/equipment-queries';
import { parseEquipmentType } from '@/lib/equipment-types';
import { serializePublicEquipment, type LeanEquipmentDoc } from '@/lib/public-equipment';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ tipo: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo, id } = await params;
  const t = parseEquipmentType(tipo);
  if (!t) {
    return { title: 'Attrezzatura | BeautyLine' };
  }
  const raw = await getEquipmentByTipoId(t, id);
  if (!raw) {
    return { title: 'Attrezzatura non trovata | BeautyLine' };
  }
  const item = serializePublicEquipment(raw as LeanEquipmentDoc);
  if (!item) {
    return { title: 'Attrezzatura non trovata | BeautyLine' };
  }
  const description =
    item.description.length > 155 ? `${item.description.slice(0, 152)}…` : item.description;
  return {
    title: `${item.name} | Attrezzature BeautyLine`,
    description,
    openGraph: {
      title: item.name,
      description,
    },
  };
}

export default async function AttrezzaturaDetailPage({ params }: PageProps) {
  const { tipo, id } = await params;
  const t = parseEquipmentType(tipo);
  if (!t) notFound();

  const raw = await getEquipmentByTipoId(t, id);
  if (!raw) notFound();

  const equipment = serializePublicEquipment(raw as LeanEquipmentDoc);
  if (!equipment) notFound();

  return (
    <Section className="min-h-0 bg-white py-12 md:py-16" containerClassName="max-w-4xl">
      <EquipmentDetailView equipment={equipment} />
    </Section>
  );
}
