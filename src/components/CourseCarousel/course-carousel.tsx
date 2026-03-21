'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/shared/Button';
import type { CourseType } from '@/lib/course-types';

export interface UpcomingCourseItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  price: string;
  courseType: CourseType;
  slug: string;
}

interface CourseCarouselProps {
  courses: UpcomingCourseItem[];
}

export function CourseCarousel({ courses }: CourseCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 'prev' | 'next') => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.firstElementChild as HTMLElement | null;
    const cardWidth = card?.offsetWidth ?? 320;
    const gap = 24;
    const delta = (cardWidth + gap) * (direction === 'next' ? 1 : -1);

    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByCards('prev')}
          className="h-10 w-10 rounded-full border border-gray-300 text-secondary hover:border-primary hover:text-primary transition-colors"
          aria-label="Corsi precedenti"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollByCards('next')}
          className="h-10 w-10 rounded-full border border-gray-300 text-secondary hover:border-primary hover:text-primary transition-colors"
          aria-label="Prossimi corsi"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {courses.map((course) => (
          <article
            key={course.id}
            className="snap-start shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[32%] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-video">
              <Image
                src={course.image}
                alt={course.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col gap-4 grow">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {course.date}
                </span>
                <span className="text-primary font-bold">{course.price}</span>
              </div>
              <h3 className="heading-brand text-xl font-bold">{course.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{course.description}</p>
              <div className="pt-2 mt-auto flex flex-wrap gap-2">
                {course.slug ? (
                  <Link href={`/corsi/${course.courseType}/${course.slug}`}>
                    <Button variant="primary" size="sm">
                      Dettagli
                    </Button>
                  </Link>
                ) : null}
                <a href={`/contatti?corso=${encodeURIComponent(course.title)}`}>
                  <Button variant="outline" size="sm">
                    Richiedi info
                  </Button>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
