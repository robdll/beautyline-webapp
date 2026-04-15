'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { EquipmentHighlightCard } from '@/lib/constants';
import { displayPublicTitle } from '@/lib/display-text';
import { getEquipmentTypeLabel, parseEquipmentType, type EquipmentType } from '@/lib/equipment-types';
import type { PublicEquipmentJson } from '@/lib/public-equipment';

const modalIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/**
 * `/attrezzature?tipo=viso|corpo|…` — catalogo per categoria.
 * `/attrezzature?tipo=…&attrezzatura=<id>` — apre dettaglio (redirect a `/attrezzature/[tipo]/[id]`).
 */
export const EQUIPMENT_CATALOG_URL_PARAMS = {
  tipo: ['tipo', 'type'] as const,
  attrezzatura: ['attrezzatura', 'item', 'id'] as const,
};

const EQUIPMENT_IMAGE_FALLBACK = 'https://placehold.co/400x300.png';

function firstValidMediaUrl(media: string[] | undefined): string | null {
  if (!media?.length) return null;
  for (const raw of media) {
    if (typeof raw !== 'string') continue;
    const u = raw.trim();
    if (u.length > 0) return u;
  }
  return null;
}

function resolveEquipmentImageUrl(e: PublicEquipmentJson): string {
  return firstValidMediaUrl(e.media) ?? EQUIPMENT_IMAGE_FALLBACK;
}

function EquipmentImageFill({
  item,
  className,
  sizes,
}: {
  item: PublicEquipmentJson;
  className?: string;
  sizes: string;
}) {
  const [src, setSrc] = useState(() => resolveEquipmentImageUrl(item));

  const isRemote = src.startsWith('http://') || src.startsWith('https://');

  return (
    <Image
      src={src}
      alt=""
      fill
      className={className}
      sizes={sizes}
      unoptimized={isRemote}
      onError={() => {
        setSrc((s) => (s === EQUIPMENT_IMAGE_FALLBACK ? s : EQUIPMENT_IMAGE_FALLBACK));
      }}
    />
  );
}

interface EquipmentTypeModalHighlightGridProps {
  cards: EquipmentHighlightCard[];
  gridClassName: string;
}

function readAttrezzaturaId(sp: URLSearchParams): string {
  for (const key of EQUIPMENT_CATALOG_URL_PARAMS.attrezzatura) {
    const v = sp.get(key)?.trim();
    if (v) return v;
  }
  return '';
}

function EquipmentTypeModalGridFallback({ gridClassName }: { gridClassName: string }) {
  return (
    <div
      className={`${gridClassName} min-h-[min(50vw,280px)] rounded-2xl bg-muted/25`}
      aria-busy
    />
  );
}

function EquipmentTypeModalHighlightGridInner({
  cards,
  gridClassName,
}: EquipmentTypeModalHighlightGridProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [activeCardTitle, setActiveCardTitle] = useState<string | null>(null);
  const [items, setItems] = useState<PublicEquipmentJson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setOpen(false);
    setItems([]);
    setError(null);
    setActiveCardTitle(null);
    setLoading(false);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  useEffect(() => {
    const tipoParam = parseEquipmentType(
      searchParams.get(EQUIPMENT_CATALOG_URL_PARAMS.tipo[0]) ??
        searchParams.get(EQUIPMENT_CATALOG_URL_PARAMS.tipo[1])
    );
    const itemParam = readAttrezzaturaId(searchParams);

    if (!tipoParam && !itemParam) {
      setOpen(false);
      setItems([]);
      setError(null);
      setActiveCardTitle(null);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      if (itemParam) {
        const qs = new URLSearchParams();
        qs.set('attrezzatura', itemParam);
        if (tipoParam) qs.set('tipo', tipoParam);
        try {
          const res = await fetch(`/api/equipment?${qs.toString()}`, { signal: ac.signal });
          const data = await res.json();
          if (ac.signal.aborted) return;
          if (res.ok) {
            const item = data as PublicEquipmentJson;
            router.replace(`/attrezzature/${item.type}/${item.id}`);
            return;
          }
          const msg = typeof data.error === 'string' ? data.error : 'Attrezzatura non trovata.';
          setOpen(true);
          setError(msg);
          if (tipoParam) {
            setActiveCardTitle(
              cards.find((c) => c.equipmentType === tipoParam)?.title ??
                getEquipmentTypeLabel(tipoParam)
            );
            setLoading(true);
            try {
              const resList = await fetch(`/api/equipment?type=${encodeURIComponent(tipoParam)}`, {
                signal: ac.signal,
              });
              const listData = await resList.json();
              if (ac.signal.aborted) return;
              if (resList.ok && Array.isArray(listData)) {
                setItems(listData as PublicEquipmentJson[]);
              } else {
                setItems([]);
              }
            } finally {
              if (!ac.signal.aborted) setLoading(false);
            }
            router.replace(
              `${pathname}?${new URLSearchParams({ tipo: tipoParam }).toString()}`,
              { scroll: false }
            );
          } else {
            setActiveCardTitle(null);
            setItems([]);
            setLoading(false);
          }
        } catch {
          if (ac.signal.aborted) return;
          setOpen(true);
          setError('Errore di rete.');
          setItems([]);
          setLoading(false);
        }
        return;
      }

      if (tipoParam) {
        setOpen(true);
        setLoading(true);
        setError(null);
        setItems([]);
        setActiveCardTitle(
          cards.find((c) => c.equipmentType === tipoParam)?.title ?? getEquipmentTypeLabel(tipoParam)
        );
        try {
          const res = await fetch(`/api/equipment?type=${encodeURIComponent(tipoParam)}`, {
            signal: ac.signal,
          });
          const data = await res.json();
          if (ac.signal.aborted) return;
          if (!res.ok) {
            setError(typeof data.error === 'string' ? data.error : 'Errore di caricamento.');
            setItems([]);
          } else {
            setItems(data as PublicEquipmentJson[]);
          }
        } catch {
          if (ac.signal.aborted) return;
          setError('Errore di rete.');
          setItems([]);
        } finally {
          if (!ac.signal.aborted) setLoading(false);
        }
      }
    })();

    return () => ac.abort();
  }, [searchParams, pathname, router, cards]);

  const openForType = (card: EquipmentHighlightCard) => {
    router.replace(
      `${pathname}?${new URLSearchParams({ tipo: card.equipmentType }).toString()}`,
      { scroll: false }
    );
  };

  const openDetailPage = (e: PublicEquipmentJson) => {
    router.push(`/attrezzature/${e.type}/${e.id}`);
  };

  return (
    <>
      <div className={gridClassName}>
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => openForType(card)}
            aria-label={`Apri elenco: ${displayPublicTitle(card.title)}`}
            className="group relative block min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-left"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={card.imageSrc}
                alt=""
                fill
                sizes="(min-width: 1280px) 280px, (min-width: 1024px) 240px, (min-width: 768px) 50vw, 92vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                style={
                  card.imageObjectPosition ? { objectPosition: card.imageObjectPosition } : undefined
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
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="equipment-modal-title"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-4 py-3 md:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-start">
              <span className="block h-10 w-10 shrink-0" aria-hidden />
            </div>
            <h2
              id="equipment-modal-title"
              className="heading-brand min-w-0 flex-1 hyphens-auto wrap-break-word text-center text-lg font-bold tracking-wide md:text-xl"
            >
              {displayPublicTitle(activeCardTitle ?? 'Attrezzature')}
            </h2>
            <div className="flex h-10 w-10 shrink-0 items-center justify-end">
              <button
                type="button"
                onClick={closeModal}
                aria-label="Chiudi"
                className={modalIconBtnClass}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto">
            <div className="w-full max-w-4xl px-4 py-6 md:px-6">
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              {error && !loading && (
                <p className="text-center text-red-600 py-8" role="alert">
                  {error}
                </p>
              )}
              {!loading && !error && items.length === 0 && (
                <p className="text-center text-gray-500 py-12">Nessuna attrezzatura in questa categoria.</p>
              )}
              {!loading && !error && items.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full min-w-[320px] text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="w-36 px-3 py-3 font-semibold md:w-44">Immagine</th>
                        <th className="px-3 py-3 font-semibold">Nome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {items.map((row) => (
                        <tr
                          key={row.id}
                          className="cursor-pointer transition-colors hover:bg-primary/5"
                          onClick={() => openDetailPage(row)}
                        >
                          <td className="p-3 align-middle">
                            <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-muted md:h-20 md:w-36">
                              <EquipmentImageFill
                                key={row.id}
                                item={row}
                                className="object-cover"
                                sizes="144px"
                              />
                            </div>
                          </td>
                          <td className="p-3 align-middle font-medium text-gray-900">
                            {displayPublicTitle(row.name)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function EquipmentTypeModalHighlightGrid(props: EquipmentTypeModalHighlightGridProps) {
  return (
    <Suspense fallback={<EquipmentTypeModalGridFallback gridClassName={props.gridClassName} />}>
      <EquipmentTypeModalHighlightGridInner {...props} />
    </Suspense>
  );
}
