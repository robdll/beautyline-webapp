import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { CourseCard } from '@/components/CourseCard';
import { ProductCard } from '@/components/ProductCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Button } from '@/components/shared/Button';
import { Course, Product, Testimonial } from '@/types';

// Mock data
const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Corso Base di Estetica',
    description: 'Corso completo per iniziare la tua carriera nel settore dell\'estetica professionale.',
    duration: '40 ore',
    price: '€ 890',
    image: 'https://placehold.co/400x300.png',
    category: 'Base',
  },
  {
    id: '2',
    title: 'Master in Trattamenti Viso',
    description: 'Specializzazione avanzata nei trattamenti viso, dalle tecniche base ai protocolli più innovativi.',
    duration: '60 ore',
    price: '€ 1.290',
    image: 'https://placehold.co/400x300.png',
    category: 'Avanzato',
  },
  {
    id: '3',
    title: 'Corso Massaggio Corpo',
    description: 'Impara le tecniche di massaggio professionale per il benessere del corpo.',
    duration: '50 ore',
    price: '€ 1.090',
    image: 'https://placehold.co/400x300.png',
    category: 'Specialistico',
  },
];

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Kit Laminazione Ciglia',
    description: 'Kit completo professionale per trattamenti di laminazione ciglia.',
    price: '€ 129,00',
    image: 'https://placehold.co/300x300.png',
    category: 'Lashes',
  },
  {
    id: '2',
    name: 'Siero Viso Anti-Age',
    description: 'Siero concentrato con acido ialuronico e vitamine.',
    price: '€ 49,00',
    image: 'https://placehold.co/300x300.png',
    category: 'Skincare',
  },
  {
    id: '3',
    name: 'Set Pennelli Professionali',
    description: 'Set di 12 pennelli in fibra sintetica di alta qualità.',
    price: '€ 89,00',
    image: 'https://placehold.co/300x300.png',
    category: 'Tools',
  },
  {
    id: '4',
    name: 'Crema Corpo Idratante',
    description: 'Crema ricca e nutriente per tutti i tipi di pelle.',
    price: '€ 35,00',
    image: 'https://placehold.co/300x300.png',
    category: 'Body',
  },
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Rossi',
    role: 'Estetista Professionista',
    content: 'Ho completato il corso base e sono rimasta entusiasta della qualità dell\'insegnamento. I docenti sono preparati e il materiale è sempre aggiornato.',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Proprietaria Centro Estetico',
    content: 'Il master in trattamenti viso mi ha permesso di ampliare l\'offerta del mio centro. Tecniche professionali e supporto continuo anche dopo il corso.',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '3',
    name: 'Anna Verdi',
    role: 'Estetista',
    content: 'Prodotti di altissima qualità. Le mie clienti sono sempre soddisfatte dei risultati dei trattamenti con la linea BeautyLine.',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
];

export default function Home() {
  const homeCourseCards = [
    {
      title: 'Corsi Unghie',
      imageSrc: '/images/card-1.jpg',
      href: '/corsi',
    },
    {
      title: 'Corsi Occhi',
      imageSrc: '/images/card-2.png',
      href: '/corsi',
    },
    {
      title: 'Percorsi Master',
      imageSrc: '/images/card-3.png',
      href: '/corsi',
    },
  ] as const;

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="BeautyLine Professional"
        description="L'eccellenza nell'estetica professionale. Formazione, prodotti e attrezzature per il tuo successo."
        ctaText="Scopri i Prodotti"
        ctaHref="/prodotti"
      />

      {/* Courses Section */}
      <Section>
        <div className="max-w-5xl mx-auto mb-12 md:mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-purple mb-6 uppercase tracking-[0.25em] font-raleway">
            I Nostri Corsi
          </h2>
          <p className="mt-4 mb-4 text-[11px] sm:text-xs md:text-sm text-gray-600 uppercase tracking-[0.22em] leading-relaxed">
            Che tu voglia iniziare da zero o migliorare ciò che già fai, qui trovi percorsi pratici e concreti.
            <br className="hidden md:block" />
            Dalle basi dell&apos;estetica ai master più avanzati, ti seguiamo passo dopo passo, senza giudicare e senza lasciare indietro nessuno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {homeCourseCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              aria-label={card.title}
              className="group relative block overflow-hidden rounded-2xl shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="relative aspect-video">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] brightness-95 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h3 className="text-white text-4xl md:text-5xl font-raleway font-light tracking-wide drop-shadow-md text-center">
                    {card.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Introduction Section */}
      <Section>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 uppercase tracking-wide">
            Benvenuti in BeautyLine
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Siamo il partner ideale per i professionisti dell'estetica. 
            Offriamo una gamma completa di prodotti di alta qualità, corsi di formazione avanzata e attrezzature all'avanguardia. 
            La nostra missione è supportare la tua crescita professionale con soluzioni innovative e un servizio eccellente.
          </p>
          <div className="mt-8">
            <Link href="/chi-siamo">
              <Button variant="outline" size="lg">
                Scopri Chi Siamo
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Featured Products Section */}
      <Section className="bg-muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 uppercase tracking-wide">
            I Nostri Prodotti
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri la nostra linea professionale dedicata alla cura e alla bellezza
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/prodotti">
            <Button variant="primary" size="lg">
              Vedi Tutti i Prodotti
            </Button>
          </Link>
        </div>
      </Section>

      {/* Academy Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-wide">
              BeautyLine Academy
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              La nostra accademia offre percorsi formativi completi per chi vuole intraprendere la carriera di estetista o specializzarsi in tecniche avanzate.
              Dai corsi base ai master specialistici, ti guidiamo verso l'eccellenza professionale.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Docenti qualificati ed esperti del settore
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Attestati riconosciuti
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Pratica su modelle reali
              </li>
            </ul>
            <div className="pt-4">
              <Link href="/corsi">
                <Button variant="primary" size="lg">
                  Scopri i Corsi
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
             {/* Show only top 2 courses on mobile/tablet, maybe 2 in a column on desktop */}
             {featuredCourses.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} className="shadow-sm border border-gray-100" />
             ))}
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section className="bg-secondary text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wide">
            Dicono di Noi
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Le opinioni di chi ha scelto BeautyLine per la propria formazione e il proprio lavoro
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} className="bg-white/5 border border-white/10 text-white" />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/recensioni">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-secondary">
              Leggi Tutte le Recensioni
            </Button>
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
            Hai bisogno di informazioni?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Il nostro team è a tua disposizione per rispondere a tutte le tue domande sui prodotti, i corsi e i servizi offerti.
          </p>
          <Link href="/contatti">
            <Button variant="primary" size="lg">
              Contattaci Ora
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
