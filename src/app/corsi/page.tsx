import React from 'react';
import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { CourseCard } from '@/components/CourseCard';
import { Course } from '@/types';
import { connectDB } from '@/lib/mongodb';
import CourseModel from '@/models/Course';

export const metadata: Metadata = {
  title: 'Corsi di Estetica',
  description: 'Scopri tutti i nostri corsi di formazione nel settore dell\'estetica professionale. Corsi base, avanzati e specialistici.',
};

export const dynamic = 'force-dynamic';

async function getCourses(): Promise<Course[]> {
  try {
    await connectDB();
    const docs = await CourseModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.name,
      description: doc.description,
      duration: doc.duration,
      price: `€ ${doc.cost.toFixed(2)}`,
      image: doc.media?.[0] || 'https://placehold.co/400x300.png',
      category: `${doc.type} - ${doc.level}`,
    }));
  } catch {
    return [];
  }
}

export default async function CorsiPage() {
  const courses = await getCourses();

  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            I Nostri Corsi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scegli il percorso formativo più adatto alle tue esigenze. Corsi base, avanzati e specialistici per ogni livello.
          </p>
        </div>
      </Section>

      <Section>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>I corsi saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>

      <Section className="bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
            Non Trovi il Corso che Cerchi?
          </h2>
          <p className="text-gray-600 mb-6">
            Contattaci per informazioni su corsi personalizzati o percorsi formativi su misura
          </p>
          <a
            href="/contatti"
            className="inline-block px-6 py-3 bg-primary text-white rounded-[40px] hover:bg-primary/90 transition-colors font-medium"
          >
            Contattaci
          </a>
        </div>
      </Section>
    </>
  );
}
