import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';

interface AcademicPathsSectionProps {
  id?: string;
  /** When set, shows the image; otherwise a neutral placeholder (add file under public/images when ready). */
  imageSrc?: string;
  /** Intrinsic pixel size — with `imageSrc`, enables full-width layout and natural height (no letterboxing). */
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  ctaHref?: string;
}

export const AcademicPathsSection: React.FC<AcademicPathsSectionProps> = ({
  id,
  imageSrc,
  imageWidth,
  imageHeight,
  imageAlt = '',
  ctaHref = '/percorso-master',
}) => {
  const isExternalCta = /^https?:\/\//.test(ctaHref);

  return (
    <Section
      id={id}
      className="min-h-0 bg-white"
      containerClassName="max-w-6xl mx-auto gap-10 lg:gap-12"
    >
      <h2 className="heading-brand text-center text-3xl md:text-4xl font-bold tracking-wide">
        Percorsi Master
      </h2>

      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
        <div className="w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5">
          {imageSrc != null && imageWidth != null && imageHeight != null ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="block h-auto w-full"
              sizes="(min-width: 1024px) min(560px, 50vw), 100vw"
            />
          ) : imageSrc ? (
            <div className="relative aspect-379/666 w-full lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain object-center"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5 text-gray-600 leading-relaxed text-sm md:text-base">
          <p>
            Offriamo un&apos;ampia gamma di percorsi formativi, pensati per rispondere alle esigenze di
            chi desidera costruire una carriera nel mondo dell&apos;estetica. Dai corsi singoli ai
            programmi completi, garantiamo una formazione approfondita in ogni settore, dal NAIL al
            LASH, fino ai trattamenti estetici più avanzati.
          </p>
          <p>
            Per chi punta all&apos;eccellenza, abbiamo introdotto il prestigioso Percorso Master, un
            programma esclusivo che offre una formazione di altissimo livello con master di fama
            internazionale. Questo percorso rappresenta il massimo riconoscimento professionale, ideale
            per chi desidera distinguersi e raggiungere l&apos;eccellenza nel settore beauty.
          </p>
          <p className="font-medium text-gray-700">
            Scopri il percorso più adatto a te e trasforma la tua passione in una carriera di
            successo!
          </p>

          <div className="pt-2">
            <Link
              href={ctaHref}
              target={isExternalCta ? '_blank' : undefined}
              rel={isExternalCta ? 'noopener noreferrer' : undefined}
            >
              <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
                Scopri di più
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};
