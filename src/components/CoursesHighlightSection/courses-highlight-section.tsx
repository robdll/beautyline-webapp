import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { CourseTypeModalHighlightGrid } from '@/components/CourseTypeModal';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { HomeCourseCard, HOME_COURSE_CARDS } from '@/lib/constants';
import { displayPublicTitle } from '@/lib/display-text';
import { cn } from '@/lib/utils';

interface CoursesHighlightSectionProps {
  id?: string;
  ctaText?: string;
  ctaHref?: string;
  /** Defaults to all home cards; corsi page passes only Unghie + Occhi. */
  cards?: HomeCourseCard[];
  /** Su /corsi: apre modal a schermo intero con elenco corsi per tipo. */
  mode?: 'links' | 'typeModal';
}

export const CoursesHighlightSection: React.FC<CoursesHighlightSectionProps> = ({
  id,
  ctaText = 'Scopri di più',
  ctaHref = '/corsi',
  cards = HOME_COURSE_CARDS,
  mode = 'links',
}) => {
  const gridClassName = cn(
    'mx-auto grid w-full grid-cols-1 gap-4 md:gap-5',
    cards.length <= 2
      ? 'max-w-3xl md:grid-cols-2 lg:max-w-[40rem] lg:gap-5 xl:max-w-2xl'
      : 'max-w-6xl md:grid-cols-3 md:gap-5 lg:max-w-7xl lg:gap-6'
  );

  return (
    <Section
      id={id}
      className="flex flex-col items-center justify-center"
      containerClassName="flex flex-col items-center justify-center gap-8"
    >
      <h2 className="heading-brand text-center text-3xl md:text-4xl font-bold mb-3 tracking-wide">
        I Nostri Corsi
      </h2>
      <p className="text-center text-base md:text-lg text-gray-700 leading-relaxed max-w-4xl">
        Che tu voglia iniziare da zero o migliorare ciò che già fai, qui trovi percorsi pratici e concreti.
        <br className="hidden md:block" />
        Dalle basi dell&apos;estetica ai master più avanzati, ti seguiamo passo dopo passo, senza giudicare e senza lasciare indietro nessuno.
      </p>

      {mode === 'typeModal' ? (
        <CourseTypeModalHighlightGrid
          cards={cards}
          gridClassName={gridClassName}
        />
      ) : (
        <div className={gridClassName}>
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              aria-label={displayPublicTitle(card.title)}
              className="group relative block min-w-0 cursor-pointer overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={card.imageSrc}
                  alt=""
                  fill
                  sizes={
                    cards.length <= 2
                      ? '(min-width: 1280px) 328px, (min-width: 1024px) 314px, (min-width: 768px) 360px, 92vw'
                      : '(min-width: 1280px) 28vw, (min-width: 1024px) 30vw, (min-width: 768px) 32vw, 92vw'
                  }
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  style={
                    card.imageObjectPosition
                      ? { objectPosition: card.imageObjectPosition }
                      : undefined
                  }
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-300 group-hover:from-black/95"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-12 md:p-5 md:pt-14">
                  <h3 className="font-raleway text-lg font-bold leading-snug tracking-wide text-balance text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] md:text-xl lg:text-2xl">
                    {displayPublicTitle(card.title)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

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
