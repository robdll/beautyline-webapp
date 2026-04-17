'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import type { ProductSubcategory } from '@/lib/product-brands';
import { cn } from '@/lib/utils';

const NOTICE = 'Catalogo disponibile a breve';

export function SubcategoryCatalogCard({
  sub,
  catalogHref,
  variant,
  disabled,
}: {
  sub: ProductSubcategory;
  catalogHref: string;
  variant: 'nails' | 'skin';
  disabled: boolean;
}) {
  const [showNotice, setShowNotice] = useState(false);

  const gradient =
    variant === 'nails'
      ? 'bg-linear-to-br from-primary/25 to-purple/15'
      : 'bg-linear-to-br from-purple/20 to-primary/20';

  return (
    <>
      <div
        className={cn(
          'flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300',
          gradient,
          !disabled && 'hover:shadow-lg',
          disabled && 'opacity-[0.72]'
        )}
      >
        {disabled ? (
          <button
            type="button"
            onClick={() => setShowNotice(true)}
            className="group relative flex min-h-34 flex-1 flex-col items-center justify-around px-4 py-5 text-left md:min-h-38 md:px-5 md:py-6 cursor-not-allowed"
            aria-label={`${sub.title} — catalogo non ancora disponibile`}
          >
            <h4 className="heading-brand text-lg font-bold leading-snug tracking-wide text-balance text-center text-secondary md:text-xl">
              {sub.title}
            </h4>
            <span className="text-sm font-semibold text-gray-500">Catalogo in arrivo</span>
          </button>
        ) : (
          <Link
            href={catalogHref}
            className="group relative flex min-h-34 flex-1 flex-col items-center justify-around px-4 py-5 md:min-h-38 md:px-5 md:py-6"
            aria-label={`${sub.title} — vai al catalogo`}
          >
            <h4 className="heading-brand text-lg font-bold leading-snug tracking-wide text-balance text-center text-secondary md:text-xl">
              {sub.title}
            </h4>
            <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
              Vedi nel catalogo
            </span>
          </Link>
        )}
        {sub.description ? (
          <div className="border-t border-black/5 bg-white/80 px-4 py-3 text-center md:px-5">
            <details className="group/details text-sm text-gray-700">
              <summary className="cursor-pointer list-none font-semibold text-secondary outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="underline-offset-2 group-open/details:underline">Descrizione</span>
              </summary>
              <p className="mt-2 text-center leading-relaxed text-pretty">{sub.description}</p>
            </details>
          </div>
        ) : null}
      </div>

      {showNotice ? (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subcategory-notice-title"
          onClick={() => setShowNotice(false)}
        >
          <div
            className="max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="subcategory-notice-title" className="heading-brand text-center text-lg font-bold text-secondary">
              {NOTICE}
            </h2>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-primary/90"
              onClick={() => setShowNotice(false)}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
