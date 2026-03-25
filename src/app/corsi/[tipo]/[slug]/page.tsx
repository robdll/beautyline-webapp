import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CourseDetailView } from '@/components/CourseDetailView';
import { Section } from '@/components/Section';
import { getCourseByTipoSlug } from '@/lib/course-queries';
import { parseCourseType } from '@/lib/course-types';
import { serializePublicCourse, type LeanCourseDoc } from '@/lib/public-course';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ tipo: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo, slug } = await params;
  const t = parseCourseType(tipo);
  if (!t) {
    return { title: 'Corso | BeautyLine Academy' };
  }
  const raw = await getCourseByTipoSlug(t, slug);
  if (!raw) {
    return { title: 'Corso non trovato | BeautyLine Academy' };
  }
  const course = serializePublicCourse(raw as LeanCourseDoc);
  const description =
    course.description.length > 155 ? `${course.description.slice(0, 152)}…` : course.description;
  return {
    title: `${course.name} | Corsi BeautyLine`,
    description,
    openGraph: {
      title: course.name,
      description,
    },
  };
}

export default async function CorsoDetailPage({ params }: PageProps) {
  const { tipo, slug } = await params;
  const t = parseCourseType(tipo);
  if (!t) notFound();

  const raw = await getCourseByTipoSlug(t, slug);
  if (!raw) notFound();

  const course = serializePublicCourse(raw as LeanCourseDoc);

  return (
    <Section className="min-h-0 bg-white py-12 md:py-16" containerClassName="max-w-6xl">
      <CourseDetailView course={course} />
    </Section>
  );
}
