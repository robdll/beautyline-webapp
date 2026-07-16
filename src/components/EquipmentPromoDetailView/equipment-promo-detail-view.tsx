import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { whatsappPacchettoPromoUrl } from '@/lib/contact';
import { displayPublicDescription, displayPublicTitle } from '@/lib/display-text';
import { getEquipmentTypeLabel } from '@/lib/equipment-types';
import { PROMO_PACKAGE_BENEFITS } from '@/lib/equipment-promo';
import type { PublicEquipmentPromoJson } from '@/lib/public-equipment-promo';
import type { EquipmentItem } from '@/types/equipment';

const priceFormatter = new Intl.NumberFormat('it-IT');

function equipmentHref(item: EquipmentItem): string | null {
  if (!item.detailTypeSlug) return null;
  return `/attrezzature/${encodeURIComponent(item.detailTypeSlug)}/${encodeURIComponent(item.id)}`;
}

export interface EquipmentPromoDetailViewProps {
  pkg: PublicEquipmentPromoJson;
  /** Attrezzature reali incluse nel pacchetto, già risolte dagli id. */
  equipment: EquipmentItem[];
  /** Link "torna indietro" mostrato in cima. */
  backHref?: string;
}

export function EquipmentPromoDetailView({
  pkg,
  equipment,
  backHref = '/attrezzature#pacchetti-promo',
}: EquipmentPromoDetailViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:gap-7">
      <Link href={backHref} className="text-sm font-medium text-primary hover:underline">
        ← Torna ai pacchetti
      </Link>

      <div className="flex flex-col gap-8 md:gap-7">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Pacchetto promo attrezzature
          </span>
          <h1 className="heading-brand text-3xl font-bold text-balance md:text-4xl">{pkg.name}</h1>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={pkg.image}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
              unoptimized={pkg.image.startsWith('http://') || pkg.image.startsWith('https://')}
            />
            {pkg.badge ? (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                {pkg.badge}
              </span>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:justify-items-center">
            <article className="w-full rounded-xl border border-gray-200 p-4 lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M12 3v18M17 7a4 4 0 1 0-4 4 4 4 0 1 1-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Canone annuo</h2>
              </div>
              <p className="text-center text-2xl font-bold text-primary">
                € {priceFormatter.format(pkg.annualPrice)}
                <span className="text-sm font-medium text-gray-500"> / anno</span>
              </p>
            </article>

            <article className="w-full rounded-xl border border-gray-200 p-4 lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M4 6h16M4 12h16M4 18h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Attrezzature incluse</h2>
              </div>
              <p className="text-center text-2xl font-bold text-gray-700">{equipment.length}</p>
            </article>

            <article className="w-full rounded-xl border border-gray-200 p-4 lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Cosa include</h2>
              </div>
              <ul className="flex flex-col gap-2">
                {PROMO_PACKAGE_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="h-4 w-4 shrink-0 text-primary"
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
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="heading-brand text-2xl font-bold">Descrizione</h2>
          <p className="leading-relaxed text-gray-700 md:text-base">{pkg.details ?? pkg.description}</p>
        </section>

        {equipment.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="heading-brand text-2xl font-bold">Attrezzature del pacchetto</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="w-12 px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Attrezzatura</th>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {equipment.map((item, idx) => (
                    <tr key={`row-${item.id}`}>
                      <td className="px-4 py-3 align-middle text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 align-middle font-medium text-gray-900">
                        {displayPublicTitle(item.name)}
                      </td>
                      <td className="px-4 py-3 align-middle text-gray-700">
                        {getEquipmentTypeLabel(item.type)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="heading-brand text-2xl font-bold">Le attrezzature incluse</h2>
          {equipment.length === 0 ? (
            <p className="text-sm text-gray-500">
              Le attrezzature del pacchetto saranno disponibili a breve.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item, idx) => {
                const href = equipmentHref(item);
                const cardClass =
                  'group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
                const isRemote =
                  item.image.startsWith('http://') || item.image.startsWith('https://');
                const inner = (
                  <>
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                        unoptimized={isRemote}
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-primary">
                        {idx + 1}. {getEquipmentTypeLabel(item.type)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <h3 className="font-semibold text-gray-900">{displayPublicTitle(item.name)}</h3>
                      <p className="line-clamp-3 text-sm text-gray-600">
                        {displayPublicDescription(item.description)}
                      </p>
                      {href ? (
                        <span className="mt-auto pt-2 text-sm font-medium text-primary group-hover:underline">
                          Vedi dettaglio →
                        </span>
                      ) : null}
                    </div>
                  </>
                );

                return href ? (
                  <a
                    key={item.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={item.id} className={cardClass}>
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="pt-2">
          <a
            href={whatsappPacchettoPromoUrl(pkg.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-[40px] bg-primary px-8 py-4 text-lg font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Richiedi questo pacchetto
          </a>
        </div>
      </div>
    </div>
  );
}
