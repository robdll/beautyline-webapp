import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { HOME_COURSE_CARDS } from '@/lib/constants';

interface CoursesHighlightSectionProps {
  id?: string;
  ctaText?: string;
  ctaHref?: string;
}

export const CoursesHighlightSection: React.FC<CoursesHighlightSectionProps> = ({
  id,
  ctaText = 'Scopri di più',
  ctaHref = '/corsi',
}) => {
  return (
    <Section
      id={id}
      className="flex flex-col items-center justify-center"
      containerClassName="flex flex-col items-center justify-center gap-12"
    >
      <h2 className="text-center text-3xl md:text-5xl font-medium text-purple mb-6 uppercase tracking-[0.25em] font-raleway">
        I Nostri Corsi
      </h2>
      <p className="text-center text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">
        Che tu voglia iniziare da zero o migliorare ciò che già fai, qui trovi percorsi pratici e concreti.
        <br className="hidden md:block" />
        Dalle basi dell&apos;estetica ai master più avanzati, ti seguiamo passo dopo passo, senza giudicare e senza lasciare indietro nessuno.
      </p>

      <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-5 justify-center">
        {HOME_COURSE_CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            aria-label={card.title}
            className="group relative block w-full md:w-[320px] lg:w-[380px] overflow-hidden rounded-2xl shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative aspect-video">
              <Image
                src={card.imageSrc}
                alt={card.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] brightness-95 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <h3 className="text-white text-4xl md:text-5xl font-raleway font-light tracking-wide drop-shadow-md text-center">
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
