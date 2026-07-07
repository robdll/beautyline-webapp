import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Section } from '@/components/Section';
import { getPublicPercorsi } from '@/lib/percorso-queries';
import { displayPublicTitle } from '@/lib/display-text';
import { pageCanonical } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Percorsi Master',
  description:
    'Scopri i nostri percorsi formativi: pacchetti completi composti da più corsi per diventare un professionista dell\'estetica.',
  alternates: pageCanonical('/percorsi'),
};

const PERCORSO_IMAGE_FALLBACK = '/images/course-placeholder.svg';

export default async function PercorsiPage() {
  const percorsi = await getPublicPercorsi();

  // Con un solo percorso reindirizziamo alla sua pagina dedicata: evita URL duplicati
  // (/percorsi e /percorsi/<slug> con lo stesso contenuto), meglio per SEO e ads.
  if (percorsi.length === 1) {
    redirect(`/percorsi/${percorsi[0].slug}`);
  }

  return (
    <Section className="min-h-0 bg-white py-12 md:py-16" containerClassName="max-w-6xl gap-8 md:gap-10">
      <div className="text-center flex flex-col items-center gap-4">
        <h1 className="heading-brand text-3xl md:text-4xl font-bold">Percorsi Master</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Pacchetti formativi completi: più corsi in un unico percorso per crescere passo dopo passo.
        </p>
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
                  <h2 className="heading-brand text-xl font-bold">{displayPublicTitle(percorso.name)}</h2>
                  <p className="text-sm text-gray-600">
                    {percorso.courses.length} {percorso.courses.length === 1 ? 'corso' : 'corsi'} · € {percorso.cost.toFixed(2)}
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
}
