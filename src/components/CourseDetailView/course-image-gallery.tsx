'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const COURSE_IMAGE_FALLBACK = '/images/course-placeholder.svg';

function isRemoteUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

function validMediaUrls(media: string[] | undefined): string[] {
  if (!media?.length) return [];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const raw of media) {
    if (typeof raw !== 'string') continue;
    const u = raw.trim();
    if (u.length === 0 || seen.has(u)) continue;
    seen.add(u);
    urls.push(u);
  }
  return urls;
}

export interface CourseImageGalleryProps {
  media: string[] | undefined;
  alt?: string;
  className?: string;
}

export function CourseImageGallery({ media, alt = '', className }: CourseImageGalleryProps) {
  const images = useMemo(() => validMediaUrls(media), [media]);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = activeIndex < images.length ? activeIndex : 0;
  const mainSrc = images[safeIndex] ?? COURSE_IMAGE_FALLBACK;
  const hasMultiple = images.length > 1;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          key={mainSrc}
          src={mainSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 66vw, 100vw"
          priority
          unoptimized={isRemoteUrl(mainSrc)}
        />
      </div>

      {hasMultiple && (
        <ul className="flex flex-wrap gap-2" role="list">
          {images.map((src, index) => {
            const selected = index === safeIndex;
            return (
              <li key={`${src}-${index}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={selected}
                  aria-label={`Immagine ${index + 1}`}
                  className={cn(
                    'relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:h-20 sm:w-20',
                    selected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-primary/60',
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={isRemoteUrl(src)}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
