import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { HomeCourseCard, HOME_COURSE_CARDS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CoursesHighlightSectionProps {
  id?: string;
  ctaText?: string;
  ctaHref?: string;
  /** Defaults to all home cards; corsi page passes only Unghie + Occhi. */
  cards?: HomeCourseCard[];
}

export const CoursesHighlightSection: React.FC<CoursesHighlightSectionProps> = ({
  id,
  ctaText = 'Scopri di più',
  ctaHref = '/corsi',
  cards = HOME_COURSE_CARDS,
}) => {
  return (
    <Section
      id={id}
      className="flex flex-col items-center justify-center"
      containerClassName="flex flex-col items-center justify-center gap-12"
    >
      <h2 className="heading-brand text-center text-3xl md:text-4xl font-bold mb-6 tracking-wide">
        I Nostri Corsi
      </h2>
      <p className="text-center text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">
        Che tu voglia iniziare da zero o migliorare ciò che già fai, qui trovi percorsi pratici e concreti.
        <br className="hidden md:block" />
        Dalle basi dell&apos;estetica ai master più avanzati, ti seguiamo passo dopo passo, senza giudicare e senza lasciare indietro nessuno.
      </p>

      <div
        className={cn(
          'grid w-full max-w-7xl grid-cols-1 gap-5 md:gap-6',
          cards.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
        )}
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            aria-label={card.title}
            className="group relative block min-w-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative aspect-4/5 w-full md:aspect-3/4">
              <Image
                src={card.imageSrc}
                alt=""
                fill
                sizes={
                  cards.length <= 2
                    ? '(min-width: 768px) 50vw, 100vw'
                    : '(min-width: 768px) 33vw, 100vw'
                }
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                style={
                  card.imageObjectPosition
                    ? { objectPosition: card.imageObjectPosition }
                    : undefined
                }
              />
              {/* Readability: dark gradient behind bottom-aligned title (avoids busy image center) */}
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/10 transition-opacity duration-300 group-hover:from-black/90"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-14 md:p-5 md:pt-16 lg:pt-20">
                <h3 className="font-raleway text-lg font-semibold leading-snug tracking-wide text-balance text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:text-xl lg:text-2xl">
                  {card.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

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
