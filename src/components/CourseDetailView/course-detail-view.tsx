import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { daySpanInclusive, formatDateRange } from '@/lib/course-occurrences';
import { getCourseTypeLabel } from '@/lib/course-types';
import { whatsappCorsoUrl } from '@/lib/contact';
import type { PublicCourseJson } from '@/lib/public-course';
import { cn } from '@/lib/utils';

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

function programLabels(isMultiDate: boolean): string[] {
  if (isMultiDate) return ['Giorno 1', 'Giorno 2', 'Giorno 3'];
  return ['Teoria', 'Pratica', 'Conclusione'];
}

export interface CourseDetailViewProps {
  course: PublicCourseJson;
}

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const imageSrc = firstValidMediaUrl(course.media) ?? COURSE_IMAGE_FALLBACK;
  const isRemote = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
  const sortedOccurrences = [...course.occurrences].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const nextThree = sortedOccurrences.slice(0, 3);
  const durationDayCount =
    sortedOccurrences.length === 0
      ? null
      : daySpanInclusive(
          new Date(sortedOccurrences[0].startDate),
          new Date(sortedOccurrences[0].endDate)
        );
  const durationsLabel =
    durationDayCount === null
      ? 'Da definire'
      : `${durationDayCount} ${durationDayCount === 1 ? 'giorno' : 'giorni'}`;
  const isMultiDate = durationDayCount !== null && durationDayCount > 1;
  const sectionTitles = programLabels(isMultiDate);
  const programSections = [...course.programSections, '', '', ''].slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-7">
      <Link
        href={`/corsi?tipo=${encodeURIComponent(course.type)}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        ← Torna al catalogo {getCourseTypeLabel(course.type)}
      </Link>

      <div className="flex flex-col gap-8 md:gap-7">
        <header className="flex flex-col gap-2">
          <h1 className="heading-brand text-3xl md:text-4xl font-bold text-balance">{course.name}</h1>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
              unoptimized={isRemote}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:justify-items-center">
            <article className="rounded-xl border border-gray-200 p-4 w-full lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M12 3v18M17 7a4 4 0 1 0-4 4 4 4 0 1 1-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Prezzo</h2>
              </div>
              <p className="text-center text-2xl font-bold text-primary">€ {course.cost.toFixed(2)}</p>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 w-full lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Prossime Date</h2>
              </div>
              {nextThree.length > 0 ? (
                <ul className="space-y-2 text-center text-sm text-gray-700">
                  {nextThree.map((occ, idx) => (
                    <li key={`${occ.startDate}-${idx}`}>
                      {formatDateRange(occ.startDate, occ.endDate)}
                      {occ.soldOut ? ' (sold-out)' : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-gray-500">Da Definire</p>
              )}
            </article>

            <article className="rounded-xl border border-gray-200 p-4 w-full lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Durata</h2>
              </div>
              <p className="text-center text-lg font-semibold text-gray-700">{durationsLabel}</p>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 w-full lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M12 7v5l3 2M6 2v3M18 2v3M4 7h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Orario</h2>
              </div>
              <p className="text-center text-sm font-medium text-gray-700">{course.orario || 'Da definire'}</p>
            </article>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="heading-brand text-2xl font-bold">Descrizione</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700 md:text-base">
            {course.description}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="heading-brand text-2xl font-bold">Programma del corso</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {programSections.map((content, idx) => (
              <article key={`program-${idx}`} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                  {sectionTitles[idx]}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {content || 'Contenuto da definire'}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="pt-2">
          <a
            href={whatsappCorsoUrl(course.name)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              'bg-primary text-white hover:bg-primary/90 rounded-[40px]',
              'px-8 py-4 text-lg uppercase tracking-wider font-bold',
            )}
          >
            Richiedi informazioni
          </a>
        </div>
      </div>
    </div>
  );
}
