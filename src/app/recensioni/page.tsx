import React from 'react';
import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Testimonial } from '@/types';

export const metadata: Metadata = {
  title: 'Recensioni',
  description: 'Leggi le recensioni e le testimonianze dei nostri studenti e clienti soddisfatti.',
};

// Mock data
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Rossi',
    role: 'Estetista Professionista',
    content: 'Ho completato il corso base e sono rimasta entusiasta della qualità dell\'insegnamento. I docenti sono preparati e il materiale è sempre aggiornato. Consiglio vivamente BeautyLine!',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Proprietaria Centro Estetico',
    content: 'Il master in trattamenti viso mi ha permesso di ampliare l\'offerta del mio centro. Tecniche professionali e supporto continuo anche dopo il corso. Ottima esperienza!',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '3',
    name: 'Anna Verdi',
    role: 'Estetista',
    content: 'Formazione eccellente e ambiente professionale. Consiglio BeautyLine a chiunque voglia intraprendere una carriera nel settore estetico. I corsi sono ben strutturati e pratici.',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '4',
    name: 'Laura Neri',
    role: 'Estetista Freelance',
    content: 'Ho seguito diversi corsi e tutti sono stati di altissima qualità. L\'attenzione ai dettagli e la professionalità dei docenti fanno la differenza. Grazie BeautyLine!',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '5',
    name: 'Sara Gialli',
    role: 'Estetista',
    content: 'Il percorso formativo è completo e ben organizzato. Ho acquisito competenze che mi hanno permesso di lavorare subito dopo il corso. Molto soddisfatta!',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '6',
    name: 'Elena Blu',
    role: 'Proprietaria Centro Estetico',
    content: 'Ho mandato diverse mie dipendenti ai corsi di BeautyLine e tutte sono rimaste entusiaste. La qualità della formazione è eccellente e i risultati si vedono nel lavoro quotidiano.',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
];

export default function RecensioniPage() {
  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Recensioni e Testimonianze
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri cosa dicono i nostri studenti e clienti sulla loro esperienza con BeautyLine Professional
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Section>

      <Section className="bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
            Condividi la Tua Esperienza
          </h2>
          <p className="text-gray-600 mb-6">
            Hai seguito uno dei nostri corsi? Condividi la tua esperienza e aiuta altri a scegliere la formazione giusta.
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

