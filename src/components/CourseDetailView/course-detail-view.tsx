import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/shared/Button';
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

function formatCourseDate(iso: string | null): string {
  if (!iso) return 'Data da definire';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export interface CourseDetailViewProps {
  course: PublicCourseJson;
}

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const imageSrc = firstValidMediaUrl(course.media) ?? COURSE_IMAGE_FALLBACK;
  const isRemote = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10 md:py-14 md:px-6">
      <div className="mb-8">
        <Link
          href={`/corsi?tipo=${encodeURIComponent(course.type)}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Torna al catalogo {getCourseTypeLabel(course.type)}
        </Link>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
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

        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{course.level}</p>
          <h1 className="heading-brand text-3xl md:text-4xl font-bold text-balance">{course.name}</h1>
        </header>

        <dl className="flex flex-col gap-4 text-sm text-gray-600">
          <div>
            <dt className="font-medium text-gray-700">Descrizione</dt>
            <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-700 md:text-base">
              {course.description}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Durata</dt>
            <dd>{course.duration}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Data corso</dt>
            <dd>{formatCourseDate(course.startDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Prezzo</dt>
            <dd className="text-lg font-bold text-primary">€ {course.cost.toFixed(2)}</dd>
          </div>
        </dl>

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
