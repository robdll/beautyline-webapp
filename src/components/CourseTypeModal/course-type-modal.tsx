'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { HomeCourseCard } from '@/lib/constants';
import { getCourseTypeLabel, parseCourseType, type CourseType } from '@/lib/course-types';
import { formatDateRange } from '@/lib/course-occurrences';
import { displayPublicTitle } from '@/lib/display-text';
import type { PublicCourseJson } from '@/lib/public-course';

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

export type CourseHighlightCard = HomeCourseCard & { courseType?: CourseType };
export type CourseCardWithType = CourseHighlightCard & { courseType: CourseType };
function hasCourseType(card: CourseHighlightCard): card is CourseCardWithType {
  return typeof card.courseType === 'string';
}

export type PublicCourseItem = PublicCourseJson;

/**
 * Condividi catalogo: `/corsi?tipo=unghie|occhi` (o `type=`).
 * Singolo corso: pagina `/corsi/[tipo]/[slug]` oppure query `?tipo=…&corso=<slug>` (reindirizza alla pagina).
 * `corso` accetta anche slug con `course=`; `id=` solo per ObjectId legacy.
 */
export const COURSE_CATALOG_URL_PARAMS = {
  tipo: ['tipo', 'type'] as const,
  corso: ['corso', 'course', 'id'] as const,
};

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

function getCourseAvailableDates(c: PublicCourseItem): string[] {
  if (c.occurrences.length === 0) return ['Da Definire'];
  return [...c.occurrences]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .map((occ) => `${formatDateRange(occ.startDate, occ.endDate)}${occ.soldOut ? ' (sold-out)' : ''}`);
}

function CourseImageFill({
  course,
  className,
  sizes,
}: {
  course: PublicCourseItem;
  className?: string;
  sizes: string;
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
      unoptimized={isRemote}
      onError={() => {
        setSrc((s) => (s === COURSE_IMAGE_FALLBACK ? s : COURSE_IMAGE_FALLBACK));
      }}
    />
  );
}

interface CourseTypeModalHighlightGridProps {
  cards: CourseHighlightCard[];
  gridClassName: string;
}

function readCorsoSlug(sp: URLSearchParams): string {
  for (const key of COURSE_CATALOG_URL_PARAMS.corso) {
    const v = sp.get(key)?.trim();
    if (v) return v;
  }
  return '';
}

function CourseTypeModalGridFallback({ gridClassName }: { gridClassName: string }) {
  return (
    <div
      className={`${gridClassName} min-h-[min(50vw,280px)] rounded-2xl bg-muted/25`}
      aria-busy
    />
  );
}

function CourseTypeModalHighlightGridInner({ cards, gridClassName }: CourseTypeModalHighlightGridProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [activeCardTitle, setActiveCardTitle] = useState<string | null>(null);
  const [courses, setCourses] = useState<PublicCourseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setOpen(false);
    setCourses([]);
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
    const tipoParam = parseCourseType(
      searchParams.get(COURSE_CATALOG_URL_PARAMS.tipo[0]) ??
        searchParams.get(COURSE_CATALOG_URL_PARAMS.tipo[1])
    );
    const corsoParam = readCorsoSlug(searchParams);

    if (!tipoParam && !corsoParam) {
      setOpen(false);
      setCourses([]);
      setError(null);
      setActiveCardTitle(null);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      if (corsoParam) {
        const qs = new URLSearchParams();
        qs.set('corso', corsoParam);
        if (tipoParam) qs.set('tipo', tipoParam);
        try {
          const res = await fetch(`/api/courses?${qs.toString()}`, { signal: ac.signal });
          const data = await res.json();
          if (ac.signal.aborted) return;
          if (res.ok) {
            const course = data as PublicCourseItem;
            router.replace(`/corsi/${course.type}/${course.slug}`);
            return;
          }
          const msg = typeof data.error === 'string' ? data.error : 'Corso non trovato.';
          setOpen(true);
          setError(msg);
          if (tipoParam) {
            setActiveCardTitle(
              cards.find((c) => c.courseType === tipoParam)?.title ?? getCourseTypeLabel(tipoParam)
            );
            setLoading(true);
            try {
              const resList = await fetch(`/api/courses?type=${encodeURIComponent(tipoParam)}`, {
                signal: ac.signal,
              });
              const listData = await resList.json();
              if (ac.signal.aborted) return;
              if (resList.ok && Array.isArray(listData)) {
                setCourses(listData as PublicCourseItem[]);
              } else {
                setCourses([]);
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
            setCourses([]);
            setLoading(false);
          }
        } catch {
          if (ac.signal.aborted) return;
          setOpen(true);
          setError('Errore di rete.');
          setCourses([]);
          setLoading(false);
        }
        return;
      }

      if (tipoParam) {
        setOpen(true);
        setLoading(true);
        setError(null);
        setCourses([]);
        setActiveCardTitle(
          cards.find((c) => c.courseType === tipoParam)?.title ?? getCourseTypeLabel(tipoParam)
        );
        try {
          const res = await fetch(`/api/courses?type=${encodeURIComponent(tipoParam)}`, {
            signal: ac.signal,
          });
          const data = await res.json();
          if (ac.signal.aborted) return;
          if (!res.ok) {
            setError(typeof data.error === 'string' ? data.error : 'Errore di caricamento.');
            setCourses([]);
          } else {
            setCourses(data as PublicCourseItem[]);
          }
        } catch {
          if (ac.signal.aborted) return;
          setError('Errore di rete.');
          setCourses([]);
        } finally {
          if (!ac.signal.aborted) setLoading(false);
        }
      }
    })();

    return () => ac.abort();
  }, [searchParams, pathname, router, cards]);

  const openForType = (card: CourseCardWithType) => {
    router.replace(
      `${pathname}?${new URLSearchParams({ tipo: card.courseType }).toString()}`,
      { scroll: false }
    );
  };

  const openCoursePage = (c: PublicCourseItem) => {
    router.push(`/corsi/${c.type}/${c.slug}`);
  };

  return (
    <>
      <div className={gridClassName}>
        {cards.map((card) => (
          hasCourseType(card) ? (
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
                  sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 30vw, (min-width: 768px) 32vw, 92vw"
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
          ) : (
            <a
              key={card.title}
              href={card.href}
              target={card.openInNewTab ? '_blank' : undefined}
              rel={card.openInNewTab ? 'noopener noreferrer' : undefined}
              aria-label={displayPublicTitle(card.title)}
              className="group relative block min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-left"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={card.imageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 30vw, (min-width: 768px) 32vw, 92vw"
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
            </a>
          )
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
              <span className="block h-10 w-10 shrink-0" aria-hidden />
            </div>
            <h2
              id="course-modal-title"
              className="heading-brand min-w-0 flex-1 hyphens-auto wrap-break-word text-center text-lg font-bold tracking-wide md:text-xl"
            >
              {displayPublicTitle(activeCardTitle ?? 'Catalogo corsi')}
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
              {!loading && !error && courses.length === 0 && (
                <p className="text-center text-gray-500 py-12">Nessun corso in questo catalogo.</p>
              )}
              {!loading && !error && courses.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full min-w-[320px] text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="w-24 px-3 py-3 font-semibold">Immagine</th>
                        <th className="px-3 py-3 font-semibold">Titolo</th>
                        <th className="px-3 py-3 font-semibold">Prossime Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {courses.map((c) => (
                        <tr
                          key={c.id}
                          className="cursor-pointer transition-colors hover:bg-primary/5"
                          onClick={() => openCoursePage(c)}
                        >
                          <td className="p-3 align-middle">
                            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted md:h-20 md:w-20">
                              <CourseImageFill
                                key={c.id}
                                course={c}
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          </td>
                          <td className="p-3 align-middle font-medium text-gray-900">
                            {displayPublicTitle(c.name)}
                          </td>
                          <td className="p-3 align-middle text-gray-600">
                            <ul className="space-y-1">
                              {getCourseAvailableDates(c).map((dateLabel, idx) => (
                                <li key={`${c.id}-date-${idx}`}>{dateLabel}</li>
                              ))}
                            </ul>
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

export function CourseTypeModalHighlightGrid(props: CourseTypeModalHighlightGridProps) {
  return (
    <Suspense fallback={<CourseTypeModalGridFallback gridClassName={props.gridClassName} />}>
      <CourseTypeModalHighlightGridInner {...props} />
    </Suspense>
  );
}
