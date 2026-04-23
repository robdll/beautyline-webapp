import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ContactSection } from '@/components/ContactSection';
import { AcademicPathsSection } from '@/components/AcademicPathsSection/academic-paths-section';
import { CoursesHighlightSection } from '@/components/CoursesHighlightSection';
import { CORSI_UNGHIE_OCCHI_CARDS } from '@/lib/constants';
import { CourseCarousel, UpcomingCourseItem } from '@/components/CourseCarousel';
import { CoursePostersModalGrid, type CoursePosterItem } from '@/components/CoursePostersModalGrid';
import type { CourseType } from '@/lib/course-types';
import { connectDB } from '@/lib/mongodb';
import CourseModel from '@/models/Course';
import CoursePosterModel from '@/models/CoursePoster';
import { formatDateRange } from '@/lib/course-occurrences';
import { formatPosterPeriod } from '@/types/course-poster';

export const metadata: Metadata = {
  title: 'Corsi di Estetica',
  description: 'Scopri tutti i nostri corsi di formazione nel settore dell\'estetica professionale. Corsi base, avanzati e specialistici.',
};

export const dynamic = 'force-dynamic';

async function getUpcomingCourses(): Promise<UpcomingCourseItem[]> {
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docs = await CourseModel.find().lean();

    type Row = { sort: number; item: UpcomingCourseItem };
    const rows: Row[] = [];

    for (const doc of docs) {
      const id = doc._id.toString();
      const slug =
        typeof (doc as { slug?: string }).slug === 'string' ? (doc as { slug: string }).slug : '';
      const occurrences = Array.isArray(doc.occurrences)
        ? [...doc.occurrences].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
        : [];

      if (occurrences.length === 0) {
        continue;
      }

      const upcomingOccurrences = occurrences.filter((occ) => {
        const end = new Date(occ.endDate);
        end.setHours(0, 0, 0, 0);
        return end.getTime() >= today.getTime();
      });

      for (const occ of upcomingOccurrences) {
        const startIso = String(occ.startDate);
        const endIso = String(occ.endDate);
        rows.push({
          sort: new Date(occ.startDate).getTime(),
          item: {
            id,
            occurrenceKey: `${id}-${startIso}-${endIso}`,
            title: doc.name,
            description: doc.description,
            date: formatDateRange(startIso, endIso),
            image: doc.media?.[0] || 'https://placehold.co/800x450.png',
            price: `€ ${doc.cost.toFixed(2)}`,
            courseType: doc.type as CourseType,
            slug,
            soldOut: occ.soldOut === true,
          },
        });
      }
    }

    rows.sort((a, b) => a.sort - b.sort);
    return rows.map((r) => r.item);
  } catch {
    return [];
  }
}

async function getCoursePosters(): Promise<CoursePosterItem[]> {
  try {
    await connectDB();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const docs = await CoursePosterModel.find().sort({ year: 1, month: 1 }).lean();

    return docs
      .filter((doc) => {
        if (typeof doc.year !== 'number' || typeof doc.month !== 'number') return false;
        if (doc.year > currentYear) return true;
        if (doc.year < currentYear) return false;
        return doc.month >= currentMonth;
      })
      .map((doc) => ({
        id: String(doc._id),
        image: doc.image,
        displayTitle: formatPosterPeriod(doc.month, doc.year),
      }));
  } catch {
    return [];
  }
}

export default async function CorsiPage() {
  const [upcomingCourses, coursePosters] = await Promise.all([
    getUpcomingCourses(),
    getCoursePosters(),
  ]);

  return (
    <>
      <Hero
        title={
          <Image
            src="/images/logo-bl.png"
            alt="BeautyLine Academy"
            width={280}
            height={280}
            className="w-48 md:w-64 lg:w-72 h-auto drop-shadow-lg"
            priority
          />
        }
        description={
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug">
            Dal primo corso, al primo cliente.
            <br />
            Con te, passo dopo passo.
          </p>
        }
        ctaText=""
      />

      <CoursesHighlightSection
        mode="typeModal"
        cards={CORSI_UNGHIE_OCCHI_CARDS}
        ctaText="Calendario Corsi"
        ctaHref="#calendario-corsi"
      />

      <AcademicPathsSection
        id="percorsi-accademici"
        imageSrc="/images/percorsi.webp"
        imageWidth={1516}
        imageHeight={2664}
        imageAlt="Percorsi accademici e formazione Beautyline Academy"
        ctaHref="https://percorsomaster.it"
      />

      <Section id="prossimi-corsi" className="bg-muted min-h-0 scroll-mt-24">
        <div className="flex flex-col gap-10">
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="heading-brand text-3xl md:text-4xl font-bold">I Prossimi Corsi</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Scopri i prossimi corsi disponibili, ordinati dalla data più vicina.
            </p>
          </div>

          {upcomingCourses.length > 0 ? (
            <CourseCarousel courses={upcomingCourses} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nessun corso futuro disponibile al momento. Torna presto!</p>
            </div>
          )}
        </div>
      </Section>

      <Section id="calendario-corsi" className="min-h-0 scroll-mt-24" containerClassName="gap-8 md:gap-10">
        <div className="text-center flex flex-col items-center gap-4">
          <h2 className="heading-brand text-3xl md:text-4xl font-bold">Calendario Corsi</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sfoglia le locandine dei corsi mese per mese.
          </p>
        </div>

        {coursePosters.length > 0 ? (
          <CoursePostersModalGrid posters={coursePosters} />
        ) : (
          <p className="mx-auto max-w-lg text-center text-sm text-gray-600">
            Nessuna locandina disponibile al momento. Torna a trovarci presto!
          </p>
        )}
      </Section>

      <ContactSection
        className="bg-primary/10"
        title="Hai bisogno di informazioni sui corsi?"
        description="Compila il modulo per ricevere supporto su percorsi, date e iscrizioni. Ti rispondiamo rapidamente."
      />
    </>
  );
}
