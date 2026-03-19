import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ContactSection } from '@/components/ContactSection';
import { CoursesHighlightSection } from '@/components/CoursesHighlightSection';
import { CourseCarousel, UpcomingCourseItem } from '@/components/CourseCarousel';
import { connectDB } from '@/lib/mongodb';
import CourseModel from '@/models/Course';

export const metadata: Metadata = {
  title: 'Corsi di Estetica',
  description: 'Scopri tutti i nostri corsi di formazione nel settore dell\'estetica professionale. Corsi base, avanzati e specialistici.',
};

export const dynamic = 'force-dynamic';

function formatCourseDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

async function getUpcomingCourses(): Promise<UpcomingCourseItem[]> {
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docs = await CourseModel.find({
      startDate: { $gte: today },
    })
      .sort({ startDate: 1 })
      .lean();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: `${doc.name} (${doc.level})`,
      description: doc.description,
      date: doc.startDate ? formatCourseDate(new Date(doc.startDate)) : 'Data da definire',
      image: doc.media?.[0] || 'https://placehold.co/800x450.png',
      price: `€ ${doc.cost.toFixed(2)}`,
    }));
  } catch {
    return [];
  }
}

export default async function CorsiPage() {
  const upcomingCourses = await getUpcomingCourses();

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

      <CoursesHighlightSection ctaText="Calendario Corsi" ctaHref="#calendario-corsi" />

      <Section id="calendario-corsi" className="bg-muted min-h-0">
        <div className="flex flex-col gap-10">
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Calendario Corsi</h2>
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

      <ContactSection
        className="bg-primary/10"
        title="Hai bisogno di informazioni sui corsi?"
        description="Compila il modulo per ricevere supporto su percorsi, date e iscrizioni. Ti rispondiamo rapidamente."
      />
    </>
  );
}
