import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ParallaxDivider } from '@/components/ParallaxDivider';
import { DeviceRentSection } from '@/components/DeviceRentSection';
import { CourseCard } from '@/components/CourseCard';
import { ProductCard } from '@/components/ProductCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { ServiceOverviewCard } from '@/components/ServiceOverviewCard';
import { ContactSection } from '@/components/ContactSection';
import { Button } from '@/components/shared/Button';
import { Course, Product, Testimonial } from '@/types';
import { HOME_COURSE_CARDS } from '@/lib/constants';

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

const FormazioneIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
);

const EsteticaIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);

const AttrezzatureIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
  </svg>
);

const ProdottiIcon = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

export default function Home() {
  return (
    <>
      <Hero
        title="BeautyLine Professional"
        description="L&apos;eccellenza nell&apos;estetica professionale. Formazione, prodotti e attrezzature per il tuo successo."
        ctaText="Scopri di più"
        ctaHref="/#servizi"
      />

      {/* Introduction Section */}
      <Section className="pt-16 md:pt-20">
        <div className="text-center max-w-4xl mx-auto flex flex-col gap-7">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-wide">
            Benvenuti in BeautyLine
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Siamo il partner ideale per i professionisti dell&apos;estetica.
            Offriamo una gamma completa di prodotti di alta qualità, corsi di formazione avanzata e attrezzature all&apos;avanguardia.
            La nostra missione è supportare la tua crescita professionale con soluzioni innovative e un servizio eccellente.
          </p>
          <div className="pt-1">
            <Link href="/chi-siamo">
              <Button variant="outline" size="lg">
                Scopri Chi Siamo
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Services Overview */}
      <Section id="servizi" className="bg-white">
        <div className="mb-16 flex w-full flex-col gap-[30px]">
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-secondary uppercase tracking-wide">
              I Nostri Servizi
            </h2>
            <p className="max-w-3xl text-center text-lg leading-relaxed text-gray-600">
              Scopri tutto ciò che BeautyLine può offrirti per la tua crescita professionale
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceOverviewCard
              title="Formazione"
              description="Corsi professionali e master per diventare esperti del settore estetico."
              icon={<FormazioneIcon />}
              targetId="formazione"
            />
            <ServiceOverviewCard
              title="Servizi Estetica"
              description="Trattamenti professionali di estetica per la cura del corpo e del viso."
              icon={<EsteticaIcon />}
              targetId="servizi-estetica"
            />
            <ServiceOverviewCard
              title="Attrezzature"
              description="Vendita e noleggio di attrezzature professionali all'avanguardia."
              icon={<AttrezzatureIcon />}
              targetId="attrezzature"
            />
            <ServiceOverviewCard
              title="Prodotti"
              description="Linea completa di prodotti professionali per estetica e benessere."
              icon={<ProdottiIcon />}
              targetId="prodotti"
            />
          </div>
        </div>
      </Section>

      {/* Formazione Section */}
      <Section id="formazione" className="flex flex-col items-center justify-center" containerClassName="flex flex-col items-center justify-center gap-12">
        <h2 className="text-center text-3xl md:text-5xl font-medium text-purple mb-6 uppercase tracking-[0.25em] font-raleway">
          I Nostri Corsi
        </h2>
        <p className="text-center text-[11px] sm:text-xs md:text-sm text-gray-600 uppercase tracking-[0.22em] leading-relaxed">
          Che tu voglia iniziare da zero o migliorare ciò che già fai, qui trovi percorsi pratici e concreti.
          <br className="hidden md:block" />
          Dalle basi dell&apos;estetica ai master più avanzati, ti seguiamo passo dopo passo, senza giudicare e senza lasciare indietro nessuno.
        </p>

        <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-5 justify-center">
          {HOME_COURSE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              aria-label={card.title}
              className="group relative block w-full md:w-[320px] lg:w-[380px] overflow-hidden rounded-2xl shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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

        <div className="w-full flex justify-center">
          <Link href="/corsi">
            <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
              Scopri di più
            </Button>
          </Link>
        </div>
      </Section>

      <ParallaxDivider imageSrc="/images/parallax-bg.jpg" strength={0.95} />

      {/* Servizi Estetica Section */}
      <Section id="servizi-estetica" className="bg-muted">
        <div className="text-center max-w-4xl mx-auto flex flex-col gap-7">
          <h2 className="text-3xl md:text-5xl font-medium text-purple uppercase tracking-[0.25em] font-raleway">
            Servizi Estetica
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            I nostri trattamenti professionali di estetica sono pensati per offrire il massimo
            della qualità e del benessere. Dall&apos;epilazione alla pedicure, ogni servizio è
            eseguito con prodotti di alta gamma e tecniche all&apos;avanguardia.
          </p>
          <ul className="flex flex-wrap justify-center gap-3 py-1">
            {['Epilazione', 'Pedicure', 'Trattamenti Viso', 'Trattamenti Corpo', 'Manicure'].map((s) => (
              <li key={s} className="px-4 py-2 bg-purple/10 text-purple rounded-full text-sm font-medium">
                {s}
              </li>
            ))}
          </ul>
          <Link href="/servizi-estetica">
            <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
              Scopri di più
            </Button>
          </Link>
        </div>
      </Section>

      {/* Attrezzature Section */}
      <div id="attrezzature">
        <DeviceRentSection />
      </div>

      {/* Featured Products Section */}
      <Section id="prodotti" className="bg-muted">
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
            <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
              Scopri di più
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
              Dai corsi base ai master specialistici, ti guidiamo verso l&apos;eccellenza professionale.
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
             {featuredCourses.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} className="shadow-sm border border-gray-100" />
             ))}
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section className="bg-secondary text-white">
        <div className="text-center mb-14 flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wide">
            Dicono di Noi
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto text-center leading-relaxed">
            Le opinioni di chi ha scelto BeautyLine per la propria formazione e il proprio lavoro
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-9">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant="dark"
              className="bg-white/10 border border-white/15 text-white"
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/recensioni">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-secondary">
              Leggi Tutte le Recensioni
            </Button>
          </Link>
        </div>
      </Section>

      <ContactSection
        className="bg-primary/10"
        title="Hai bisogno di informazioni?"
        description="Il nostro team è a tua disposizione per rispondere a tutte le tue domande sui prodotti, i corsi e i servizi offerti."
      />
    </>
  );
}
