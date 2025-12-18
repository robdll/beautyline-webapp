import React from 'react';
import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { CourseCard } from '@/components/CourseCard';
import { Course } from '@/types';

export const metadata: Metadata = {
  title: 'Corsi di Estetica',
  description: 'Scopri tutti i nostri corsi di formazione nel settore dell\'estetica professionale. Corsi base, avanzati e specialistici.',
};

// Mock data
const courses: Course[] = [
  {
    id: '1',
    title: 'Corso Base di Estetica',
    description: 'Corso completo per iniziare la tua carriera nel settore dell\'estetica professionale. Impara le tecniche fondamentali e le basi teoriche.',
    duration: '40 ore',
    price: '€ 890',
    image: 'https://placehold.co/400x300.png',
    category: 'Base',
  },
  {
    id: '2',
    title: 'Master in Trattamenti Viso',
    description: 'Specializzazione avanzata nei trattamenti viso, dalle tecniche base ai protocolli più innovativi del settore.',
    duration: '60 ore',
    price: '€ 1.290',
    image: 'https://placehold.co/400x300.png',
    category: 'Avanzato',
  },
  {
    id: '3',
    title: 'Corso Massaggio Corpo',
    description: 'Impara le tecniche di massaggio professionale per il benessere del corpo, con focus su drenaggio e rilassamento.',
    duration: '50 ore',
    price: '€ 1.090',
    image: 'https://placehold.co/400x300.png',
    category: 'Specialistico',
  },
  {
    id: '4',
    title: 'Corso Manicure e Pedicure',
    description: 'Tecniche professionali per la cura delle unghie, dalla ricostruzione alle decorazioni più moderne.',
    duration: '30 ore',
    price: '€ 690',
    image: 'https://placehold.co/400x300.png',
    category: 'Specialistico',
  },
  {
    id: '5',
    title: 'Corso Epilazione',
    description: 'Impara tutte le tecniche di epilazione: ceretta, elettrica e laser. Protocolli completi per ogni tipo di trattamento.',
    duration: '45 ore',
    price: '€ 990',
    image: 'https://placehold.co/400x300.png',
    category: 'Avanzato',
  },
  {
    id: '6',
    title: 'Corso Trucco Professionale',
    description: 'Tecniche di make-up professionale per ogni occasione, dal trucco giornaliero al trucco da sposa.',
    duration: '35 ore',
    price: '€ 890',
    image: 'https://placehold.co/400x300.png',
    category: 'Specialistico',
  },
];

export default function CorsiPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
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
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#B88A5C] transition-colors font-medium"
          >
            Contattaci
          </a>
        </div>
      </Section>
    </>
  );
}

