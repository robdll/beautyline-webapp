'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { HomeCourseCard } from '@/lib/constants';
import type { CourseType } from '@/lib/course-types';

const modalIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

function BackArrowIcon({ className }: { className?: string }) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

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

export type CourseCardWithType = HomeCourseCard & { courseType: CourseType };

export interface PublicCourseItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  level: string;
  type: CourseType;
  media: string[];
  startDate: string | null;
}

/** Fallback locale (no CDN esterni obbligatori). */
const COURSE_IMAGE_FALLBACK = '/images/course-placeholder.svg';

function firstValidMediaUrl(media: string[] | undefined): string | null {
  if (!media?.length) return null;
  for (const raw of media) {
    if (typeof raw !== 'string') continue;
    const u = raw.trim();
    if (u.length > 0) return u;
  }
  return null;
}

function resolveCourseImageUrl(c: PublicCourseItem): string {
  return firstValidMediaUrl(c.media) ?? COURSE_IMAGE_FALLBACK;
}

function CourseImageFill({
  course,
  className,
  sizes,
  priority,
}: {
  course: PublicCourseItem;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(() => resolveCourseImageUrl(course));

  const isRemote = src.startsWith('http://') || src.startsWith('https://');

  return (
    <Image
      src={src}
      alt=""
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isRemote}
      onError={() => {
        setSrc((s) => (s === COURSE_IMAGE_FALLBACK ? s : COURSE_IMAGE_FALLBACK));
      }}
    />
  );
}

interface CourseTypeModalHighlightGridProps {
  cards: CourseCardWithType[];
  gridClassName: string;
}

function formatCourseDate(iso: string | null): string {
  if (!iso) return 'Data da definire';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export function CourseTypeModalHighlightGrid({ cards, gridClassName }: CourseTypeModalHighlightGridProps) {
  const [open, setOpen] = useState(false);
  const [activeCardTitle, setActiveCardTitle] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [courses, setCourses] = useState<PublicCourseItem[]>([]);
  const [selected, setSelected] = useState<PublicCourseItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setOpen(false);
    setView('list');
    setSelected(null);
    setCourses([]);
    setError(null);
    setActiveCardTitle(null);
  }, []);

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

  const openForType = async (card: CourseCardWithType) => {
    setActiveCardTitle(card.title);
    setOpen(true);
    setView('list');
    setSelected(null);
    setError(null);
    setLoading(true);
    setCourses([]);
    try {
      const res = await fetch(`/api/courses?type=${encodeURIComponent(card.courseType)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Errore di caricamento.');
        return;
      }
      setCourses(data as PublicCourseItem[]);
    } catch {
      setError('Errore di rete.');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (c: PublicCourseItem) => {
    setSelected(c);
    setView('detail');
  };

  const backToList = () => {
    setSelected(null);
    setView('list');
  };

  return (
    <>
      <div className={gridClassName}>
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => openForType(card)}
            aria-label={`Apri elenco: ${card.title}`}
            className="group relative block min-w-0 w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-left"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={card.imageSrc}
                alt=""
                fill
                sizes="(min-width: 1280px) 216px, (min-width: 1024px) 248px, (min-width: 768px) 360px, 92vw"
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
                  {card.title}
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
          aria-labelledby="course-modal-title"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-4 py-3 md:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-start">
              {view === 'detail' ? (
                <button
                  type="button"
                  onClick={backToList}
                  aria-label="Indietro"
                  className={modalIconBtnClass}
                >
                  <BackArrowIcon className="h-5 w-5" />
                </button>
              ) : (
                <span className="block h-10 w-10 shrink-0" aria-hidden />
              )}
            </div>
            <h2
              id="course-modal-title"
              className="heading-brand min-w-0 flex-1 hyphens-auto wrap-break-word text-center text-lg font-bold tracking-wide md:text-xl"
            >
              {view === 'detail' && selected ? selected.name : activeCardTitle}
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

          <div className="min-h-0 flex-1 overflow-y-auto">
            {view === 'list' && (
              <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
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
                {!loading && !error && courses.length === 0 && (
                  <p className="text-center text-gray-500 py-12">Nessun corso in questo catalogo.</p>
                )}
                {!loading && !error && courses.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full min-w-[320px] text-left text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="w-36 px-3 py-3 font-semibold md:w-44">Immagine</th>
                          <th className="px-3 py-3 font-semibold">Titolo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {courses.map((c) => (
                          <tr
                            key={c.id}
                            className="cursor-pointer transition-colors hover:bg-primary/5"
                            onClick={() => openDetail(c)}
                          >
                            <td className="p-3 align-middle">
                              <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-muted md:h-20 md:w-36">
                                <CourseImageFill
                                  key={c.id}
                                  course={c}
                                  className="object-cover"
                                  sizes="144px"
                                />
                              </div>
                            </td>
                            <td className="p-3 align-middle font-medium text-gray-900">{c.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {view === 'detail' && selected && (
              <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
                {/* flex + gap evita il margin collapse tra immagine e blocco testo */}
                <div className="flex flex-col gap-8 md:gap-10">
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
                    <CourseImageFill
                      key={selected.id}
                      course={selected}
                      className="object-cover"
                      sizes="(min-width: 768px) 672px, 100vw"
                      priority
                    />
                  </div>
                  {/* Tipo / livello (es. Occhi · Intermedio) — nascosto per ora
                <p className="mb-4 text-sm font-medium text-primary">
                  {getCourseTypeLabel(selected.type)} · {selected.level}
                </p>
                */}
                  <dl className="flex flex-col gap-4 text-sm text-gray-600">
                  <div>
                    <dt className="font-medium text-gray-700">Descrizione</dt>
                    <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-700 md:text-base">
                      {selected.description}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Durata</dt>
                    <dd>{selected.duration}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Data corso</dt>
                    <dd>{formatCourseDate(selected.startDate)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Prezzo</dt>
                    <dd>€ {selected.cost.toFixed(2)}</dd>
                  </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
