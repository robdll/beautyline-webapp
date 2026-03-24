import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/shared/Button';
import { formatDateRange } from '@/lib/course-occurrences';
import { getCourseTypeLabel } from '@/lib/course-types';
import type { PublicCourseJson } from '@/lib/public-course';

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

function daySpanInclusive(startIso: string, endIso: string): number {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const msInDay = 24 * 60 * 60 * 1000;
  const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.round((normalizedEnd - normalizedStart) / msInDay) + 1;
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
  const isMultiDate =
    sortedOccurrences.length > 0
      ? daySpanInclusive(sortedOccurrences[0].startDate, sortedOccurrences[0].endDate) > 1
      : false;
  const sectionTitles = programLabels(isMultiDate);
  const programSections = [...course.programSections, '', '', ''].slice(0, 3);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 md:gap-7">
      <div className="mb-8">
        <Link
          href={`/corsi?tipo=${encodeURIComponent(course.type)}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Torna al catalogo {getCourseTypeLabel(course.type)}
        </Link>
      </div>

      <div className="flex flex-col gap-8 md:gap-7">
        <header className="flex flex-col gap-2">
          <h1 className="heading-brand text-3xl md:text-4xl font-bold text-balance">{course.name}</h1>
        </header>

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 672px, 100vw"
            priority
            unoptimized={isRemote}
          />
        </div>

        <div className="flex gap-4 justify-around">
          <article className="rounded-xl border border-gray-200 p-4 w-full">
            <div className="mb-3 flex flex-col items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center text-center justify-center rounded-full bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="font-semibold text-gray-800">Prossime Date</h2>
            </div>
            {nextThree.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {nextThree.map((occ, idx) => (
                  <li key={`${occ.startDate}-${idx}`}>{formatDateRange(occ.startDate, occ.endDate)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-500">Date da definire</p>
            )}
          </article>
          <article className="rounded-xl border border-gray-200 p-4 w-full">
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
          <Link href={`/contatti?corso=${encodeURIComponent(course.name)}`}>
            <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
              Richiedi informazioni
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
