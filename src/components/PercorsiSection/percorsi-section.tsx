import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/Section';
import { displayPublicTitle } from '@/lib/display-text';
import type { PublicPercorsoJson } from '@/lib/public-percorso';

const PERCORSO_IMAGE_FALLBACK = '/images/course-placeholder.svg';

export interface PercorsiSectionProps {
  id?: string;
  percorsi: PublicPercorsoJson[];
}

export const PercorsiSection: React.FC<PercorsiSectionProps> = ({
  id = 'percorsi-accademici',
  percorsi,
}) => {
  return (
    <Section
      id={id}
      className="min-h-0 scroll-mt-24 bg-muted"
      containerClassName="max-w-6xl gap-8 md:gap-10"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="heading-brand text-3xl font-bold md:text-4xl">Percorsi accademici</h2>
        <div className="mx-auto flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-gray-600 md:text-lg">
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
        </div>
      </div>

      {percorsi.length === 0 ? (
        <p className="mx-auto max-w-lg text-center text-sm text-gray-600">
          Nessun percorso disponibile al momento. Torna a trovarci presto!
        </p>
      ) : (
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {percorsi.map((percorso) => {
            const image = percorso.media.find((m) => m?.trim()) || PERCORSO_IMAGE_FALLBACK;
            const isRemote = image.startsWith('http://') || image.startsWith('https://');
            return (
              <Link
                key={percorso.id}
                href={`/percorsi/${percorso.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    unoptimized={isRemote}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="heading-brand text-xl font-bold">{displayPublicTitle(percorso.name)}</h3>
                  <p className="text-sm text-gray-600">
                    {percorso.courses.length} {percorso.courses.length === 1 ? 'corso' : 'corsi'} · €{' '}
                    {percorso.cost.toFixed(2)}
                  </p>
                  <span className="mt-auto pt-2 text-sm font-medium text-primary group-hover:underline">
                    Scopri il percorso →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
};
