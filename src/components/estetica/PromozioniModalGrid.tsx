'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { whatsappContattaciPromoUrl } from '@/lib/contact';
import { cn } from '@/lib/utils';

export type PromoGridItem = { id: string; image: string; name: string };

const contattaciClass = cn(
  'inline-flex items-center justify-center rounded-[40px] border-2 border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-md',
  'transition-all duration-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
);

export function PromozioniModalGrid({ promos }: { promos: PromoGridItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = openId ? promos.find((p) => p.id === openId) : null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, close]);

  useEffect(() => {
    if (openId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openId]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-4">
        {promos.map((promo) => (
          <button
            key={promo.id}
            type="button"
            onClick={() => setOpenId(promo.id)}
            className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm outline-none transition-shadow aspect-137/160 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:shadow-md"
          >
            <Image
              src={promo.image}
              alt={promo.name || 'Promozione'}
              fill
              className="pointer-events-none cursor-pointer object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(255,255,255,0.72)] p-0 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.name ? `Promozione: ${active.name}` : 'Promozione'}
          onClick={close}
        >
          <div
            className="relative z-101 isolate h-[min(92vh,100dvh)] w-full max-w-[min(100vw,920px)] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-2 top-2 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md ring-1 ring-gray-200/90 backdrop-blur-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white md:right-3 md:top-3"
              aria-label="Chiudi"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative h-full w-full bg-[rgba(250,250,252,0.98)]">
              <Image
                src={active.image}
                alt={active.name || 'Promozione'}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <a
              href={whatsappContattaciPromoUrl(active.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(contattaciClass, 'absolute bottom-3 right-3 z-20 md:bottom-5 md:right-5')}
            >
              Contattaci
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
