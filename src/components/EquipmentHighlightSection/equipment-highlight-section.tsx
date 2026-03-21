import React from 'react';
import Link from 'next/link';

import { EquipmentTypeModalHighlightGrid } from '@/components/EquipmentTypeModal';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { ATTREZZATURE_HIGHLIGHT_CARDS, type EquipmentHighlightCard } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EquipmentHighlightSectionProps {
  id?: string;
  title?: string;
  ctaText?: string;
  ctaHref?: string;
  cards?: EquipmentHighlightCard[];
  /** Paragrafi della descrizione (testo semplice). */
  descriptionParagraphs?: string[];
}

const defaultDescription = [
  'Vuoi offrire trattamenti all’avanguardia nel tuo centro estetico senza sostenere costi iniziali elevati? Con Beauty Line puoi noleggiare tecnologie estetiche professionali con formule flessibili, sicure e vantaggiose.',
  'Offriamo soluzioni su misura per estetiste, spa, saloni di bellezza e imprenditori del settore wellness in tutta la Lombardia.',
];

export const EquipmentHighlightSection: React.FC<EquipmentHighlightSectionProps> = ({
  id = 'attrezzature-tecnologie',
  title = 'Attrezzature e Tecnologie',
  ctaText = 'Vai al catalogo',
  ctaHref = '/attrezzature#catalogo',
  cards = ATTREZZATURE_HIGHLIGHT_CARDS,
  descriptionParagraphs = defaultDescription,
}) => {
  const gridClassName = cn(
    'mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4'
  );

  return (
    <Section
      id={id}
      className="flex flex-col items-center justify-center scroll-mt-24"
      containerClassName="flex flex-col items-center justify-center gap-8"
    >
      <h2 className="heading-brand text-center text-3xl md:text-4xl font-bold mb-3 tracking-wide">
        {title}
      </h2>
      <div className="text-center text-base md:text-lg text-gray-700 leading-relaxed max-w-4xl flex flex-col gap-4">
        {descriptionParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <EquipmentTypeModalHighlightGrid cards={cards} gridClassName={gridClassName} />

      <div className="w-full flex justify-center">
        <Link href={ctaHref}>
          <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
            {ctaText}
          </Button>
        </Link>
      </div>
    </Section>
  );
};
