import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7.7 13.2 4.6 10.1a1 1 0 0 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4 0l8.4-8.4a1 1 0 1 0-1.4-1.4l-7.7 7.7Z"
      fill="currentColor"
    />
  </svg>
);

export const DeviceRentSection: React.FC = () => {
  return (
    <Section
      className="bg-white"
      containerClassName="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl md:text-5xl font-medium text-purple uppercase tracking-[0.25em] font-raleway">
            NOLEGGIO ATTREZZATURE
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-relaxed text-sm md:text-base">
            <p className="font-semibold text-gray-700">
              Offri più servizi, senza investimenti rigidi.
            </p>
            <p>
              Con il noleggio delle nostre apparecchiature – tutte nuove e di alta qualità – puoi
              ampliare l&apos;offerta del tuo centro in modo flessibile e conveniente. Hai a disposizione
              trattamenti come laser, tecnologie corpo e il Multi360, il macchinario che racchiude 4
              funzioni in uno.
            </p>
          </div>

          <ul className="mt-8 space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckIcon className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
              <span>Prova gratuita di 1 ora in sede</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
              <span>Contratti settimanali, semestrali o annuali</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
              <span>Formazione gratuita inclusa</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
              <span>Consulenza su misura per capire cosa ti serve</span>
            </li>
          </ul>

          <div className="mt-8 space-y-3 text-gray-600 leading-relaxed">
            <p>
              Perfetto per estetiste con P.IVA, centri estetici e chi ha già fatto un corso con noi.
            </p>
            <p className="font-semibold text-gray-700">
              Il tuo lavoro cresce, senza complicazioni.
            </p>
          </div>

          <div className="mt-14">
            <Link href="/noleggio">
              <Button
                variant="primary"
                size="lg"
                className="uppercase tracking-wider font-bold"
              >
                Maggiori informazioni sul noleggio
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-[620px] mx-auto lg:mx-0">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-muted shadow-sm border border-black/5">
            <Image
              src="/images/devices.png"
              alt="Attrezzature disponibili per il noleggio"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

