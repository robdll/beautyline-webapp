import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { CourseCard } from '@/components/CourseCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Button } from '@/components/shared/Button';
import { Course, Testimonial } from '@/types';

// Mock data - in a real app, this would come from an API or CMS
const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Corso Base di Estetica',
    description: 'Corso completo per iniziare la tua carriera nel settore dell\'estetica professionale. Impara le tecniche fondamentali e le basi teoriche.',
    duration: '40 ore',
    price: '€ 890',
    image: 'https://placehold.co/400x300',
    category: 'Base',
  },
  {
    id: '2',
    title: 'Master in Trattamenti Viso',
    description: 'Specializzazione avanzata nei trattamenti viso, dalle tecniche base ai protocolli più innovativi del settore.',
    duration: '60 ore',
    price: '€ 1.290',
    image: 'https://placehold.co/400x300',
    category: 'Avanzato',
  },
  {
    id: '3',
    title: 'Corso Massaggio Corpo',
    description: 'Impara le tecniche di massaggio professionale per il benessere del corpo, con focus su drenaggio e rilassamento.',
    duration: '50 ore',
    price: '€ 1.090',
    image: 'https://placehold.co/400x300',
    category: 'Specialistico',
  },
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Rossi',
    role: 'Estetista Professionista',
    content: 'Ho completato il corso base e sono rimasta entusiasta della qualità dell\'insegnamento. I docenti sono preparati e il materiale è sempre aggiornato.',
    image: 'https://placehold.co/100x100',
    rating: 5,
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Proprietaria Centro Estetico',
    content: 'Il master in trattamenti viso mi ha permesso di ampliare l\'offerta del mio centro. Tecniche professionali e supporto continuo anche dopo il corso.',
    image: 'https://placehold.co/100x100',
    rating: 5,
  },
  {
    id: '3',
    name: 'Anna Verdi',
    role: 'Estetista',
    content: 'Formazione eccellente e ambiente professionale. Consiglio BeautyLine a chiunque voglia intraprendere una carriera nel settore estetico.',
    image: 'https://placehold.co/100x100',
    rating: 5,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Formazione Professionale nel Settore Estetico"
        subtitle="BeautyLine Professional"
        description="Scopri i nostri corsi di alta formazione per diventare un esperto nel settore dell'estetica. Percorsi professionali certificati con docenti qualificati."
        image="https://placehold.co/1200x600"
        ctaText="Scopri i Corsi"
        ctaHref="/corsi"
      />

      {/* Features Section */}
      <Section className="bg-[var(--color-muted)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4">
            Perché Scegliere BeautyLine
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Offriamo formazione di qualità con un approccio pratico e professionale
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-2">
              Docenti Qualificati
            </h3>
            <p className="text-gray-600">
              Insegnanti esperti del settore con anni di esperienza professionale
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-2">
              Certificazioni Riconosciute
            </h3>
            <p className="text-gray-600">
              Attestati professionali validi nel settore estetico
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-2">
              Approccio Pratico
            </h3>
            <p className="text-gray-600">
              Molta pratica su modelli reali e attrezzature professionali
            </p>
          </div>
        </div>
      </Section>

      {/* Featured Courses Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4">
            Corsi in Evidenza
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri i nostri corsi più richiesti e inizia la tua formazione professionale
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/corsi">
            <Button variant="outline" size="lg">
              Vedi Tutti i Corsi
            </Button>
          </Link>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-[var(--color-muted)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4">
            Cosa Dicono i Nostri Studenti
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Le esperienze di chi ha scelto BeautyLine per la propria formazione
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-[var(--color-secondary)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto a Iniziare la Tua Carriera?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contattaci per maggiori informazioni sui nostri corsi e percorsi formativi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contatti">
              <Button variant="primary" size="lg">
                Contattaci
              </Button>
            </Link>
            <Link href="/corsi">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[var(--color-secondary)]">
                Scopri i Corsi
              </Button>
            </Link>
          </div>
    </div>
      </Section>
    </>
  );
}
