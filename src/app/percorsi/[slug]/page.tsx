import React from 'react';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

import { PercorsoDetailView } from '@/components/PercorsoDetailView';
import { Section } from '@/components/Section';
import { getPercorsoBySlug } from '@/lib/percorso-queries';
import { displayPublicDescription, displayPublicTitle } from '@/lib/display-text';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const percorso = await getPercorsoBySlug(slug);
  if (!percorso) {
    return { title: 'Percorso non trovato | BeautyLine Academy' };
  }
  const title = displayPublicTitle(percorso.name);
  const descFormatted = displayPublicDescription(percorso.description);
  const description =
    descFormatted.length > 155 ? `${descFormatted.slice(0, 152)}…` : descFormatted;
  return {
    title: `${title} | Percorsi BeautyLine`,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function PercorsoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const percorso = await getPercorsoBySlug(slug);
  if (!percorso) permanentRedirect('/corsi');

  return (
    <Section className="min-h-0 bg-white py-12 md:py-16" containerClassName="max-w-6xl">
      <PercorsoDetailView percorso={percorso} backHref="/corsi#percorsi-accademici" />
    </Section>
  );
}
