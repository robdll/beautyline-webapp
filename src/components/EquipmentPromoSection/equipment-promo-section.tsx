import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/Section';
import { displayPublicTitle } from '@/lib/display-text';
import { PROMO_PACKAGE_SIZE } from '@/lib/equipment-promo';
import type { PublicEquipmentPromoJson } from '@/lib/public-equipment-promo';
import type { EquipmentItem } from '@/types/equipment';

import { CustomPackageBuilder } from './custom-package-builder';

export interface EquipmentPromoSectionProps {
  id?: string;
  packages: PublicEquipmentPromoJson[];
  /** Attrezzature disponibili, usate dal configuratore del pacchetto personalizzato. */
  equipment: EquipmentItem[];
}

const priceFormatter = new Intl.NumberFormat('it-IT');

export const EquipmentPromoSection: React.FC<EquipmentPromoSectionProps> = ({
  id = 'pacchetti-promo',
  packages,
  equipment,
}) => {
  const equipmentNameById = new Map(
    equipment.map((item) => [item.id, displayPublicTitle(item.name)])
  );

  return (
    <Section
      id={id}
      className="min-h-0 scroll-mt-24 bg-muted"
      containerClassName="max-w-6xl gap-8 md:gap-10"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="heading-brand text-3xl font-bold md:text-4xl">Pacchetti Promo Attrezzature</h2>
        <div className="mx-auto flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-gray-600 md:text-lg">
          <p>
            Noleggia un pacchetto di {PROMO_PACKAGE_SIZE} attrezzature professionali a un canone
            mensile vantaggioso. Una formula pensata per far crescere il tuo centro estetico senza
            costi iniziali elevati.
          </p>
          {packages.length > 0 ? (
            <p>
              Scegli uno dei pacchetti pronti oppure crea il tuo su misura selezionando le
              attrezzature che preferisci.
            </p>
          ) : (
            <p>Crea il tuo pacchetto su misura selezionando le attrezzature che preferisci.</p>
          )}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const isRemote = pkg.image.startsWith('http://') || pkg.image.startsWith('https://');
          return (
          <Link
            key={pkg.id}
            href={`/attrezzature/pacchetti/${pkg.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
              <Image
                src={pkg.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                unoptimized={isRemote}
              />
              {pkg.badge ? (
                <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                  {pkg.badge}
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="heading-brand text-xl font-bold">{pkg.name}</h3>
              <p className="text-sm text-gray-600">{pkg.description}</p>
              <ul className="flex flex-col gap-1.5">
                {pkg.equipmentIds.map((eqId) => (
                  <li key={eqId} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{equipmentNameById.get(eqId) ?? 'Attrezzatura'}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-1">
                <span className="text-2xl font-bold text-primary">
                  € {priceFormatter.format(pkg.monthlyPrice)}
                </span>
                <span className="text-sm text-gray-500"> / mese</span>
              </p>
              <span className="mt-auto pt-2 text-sm font-medium text-primary group-hover:underline">
                Scopri il pacchetto →
              </span>
            </div>
          </Link>
          );
        })}

        <CustomPackageBuilder equipment={equipment} />
      </div>
    </Section>
  );
};
