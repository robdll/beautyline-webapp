import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getCourseTypeLabel } from '@/lib/course-types';
import { whatsappCorsoUrl } from '@/lib/contact';
import { displayPublicDescription, displayPublicTitle } from '@/lib/display-text';
import type { PublicPercorsoJson } from '@/lib/public-percorso';
import { CourseRequestInfoLink } from '@/components/CourseDetailView/course-request-info-link';

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

export interface PercorsoDetailViewProps {
  percorso: PublicPercorsoJson;
  /** Link "torna indietro" mostrato in cima (default: /corsi). */
  backHref?: string;
}

export function PercorsoDetailView({ percorso, backHref = '/corsi' }: PercorsoDetailViewProps) {
  const imageSrc = firstValidMediaUrl(percorso.media) ?? COURSE_IMAGE_FALLBACK;
  const isRemote = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-7">
      <Link href={backHref} className="text-sm font-medium text-primary hover:underline">
        ← Torna ai corsi
      </Link>

      <div className="flex flex-col gap-8 md:gap-7">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">Percorso</span>
          <h1 className="heading-brand text-3xl md:text-4xl font-bold text-balance">
            {displayPublicTitle(percorso.name)}
          </h1>
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
                <h2 className="font-semibold text-gray-800">Prezzo pacchetto</h2>
              </div>
              <p className="text-center text-2xl font-bold text-primary">€ {percorso.cost.toFixed(2)}</p>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 w-full lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Corsi inclusi</h2>
              </div>
              <p className="text-center text-2xl font-bold text-gray-700">{percorso.courses.length}</p>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 w-full lg:max-w-[280px]">
              <div className="mb-3 flex flex-col items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="font-semibold text-gray-800">Giorni di formazione</h2>
              </div>
              <p className="text-center text-2xl font-bold text-gray-700">{percorso.totalDays}</p>
            </article>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="heading-brand text-2xl font-bold">Descrizione</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700 md:text-base">
            {displayPublicDescription(percorso.description)}
          </p>
        </section>

        {percorso.courses.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="heading-brand text-2xl font-bold">Le date del percorso</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="w-12 px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Corso</th>
                    <th className="px-4 py-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {percorso.courses.map((course, idx) => (
                    <tr key={`date-${course.id}`}>
                      <td className="px-4 py-3 align-middle text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 align-middle font-medium text-gray-900">
                        {displayPublicTitle(course.name)}
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          {getCourseTypeLabel(course.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-gray-700">
                        {course.dateLabel || 'Da definire'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="heading-brand text-2xl font-bold">Corsi del percorso</h2>
          {percorso.courses.length === 0 ? (
            <p className="text-sm text-gray-500">I corsi del percorso saranno disponibili a breve.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {percorso.courses.map((course, idx) => {
                const courseImage = course.image?.trim() || COURSE_IMAGE_FALLBACK;
                const courseIsRemote =
                  courseImage.startsWith('http://') || courseImage.startsWith('https://');
                return (
                  <a
                    key={course.id}
                    href={course.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                      <Image
                        src={courseImage}
                        alt=""
                        fill
                        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                        unoptimized={courseIsRemote}
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-primary">
                        {idx + 1}. {getCourseTypeLabel(course.type)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <h3 className="font-semibold text-gray-900">{displayPublicTitle(course.name)}</h3>
                      <p className="text-sm font-medium text-primary">
                        {course.dateLabel
                          ? `${course.dateLabel}${course.soldOut ? ' (sold-out)' : ''}`
                          : 'Date da definire'}
                      </p>
                      <p className="line-clamp-3 text-sm text-gray-600">
                        {displayPublicDescription(course.description)}
                      </p>
                      <span className="mt-auto pt-2 text-sm font-medium text-primary group-hover:underline">
                        Vedi dettaglio →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        <div className="pt-2">
          <CourseRequestInfoLink href={whatsappCorsoUrl(displayPublicTitle(percorso.name))}>
            Richiedi informazioni
          </CourseRequestInfoLink>
        </div>
      </div>
    </div>
  );
}
