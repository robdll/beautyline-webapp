import React from 'react';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { TestimonialCard } from '@/components/TestimonialCard';
import { getGooglePlaceReviews } from '@/lib/google-reviews';
import { Testimonial } from '@/types';

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Rossi',
    role: 'Estetista Professionista',
    content:
      "Ho completato il corso base e sono rimasta entusiasta della qualità dell'insegnamento. I docenti sono preparati e il materiale è sempre aggiornato.",
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Proprietaria Centro Estetico',
    content:
      "Il master in trattamenti viso mi ha permesso di ampliare l'offerta del mio centro. Tecniche professionali e supporto continuo anche dopo il corso.",
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
  {
    id: '3',
    name: 'Anna Verdi',
    role: 'Estetista',
    content:
      'Formazione eccellente e ambiente professionale. Consiglio BeautyLine a chiunque voglia intraprendere una carriera nel settore estetico.',
    image: 'https://placehold.co/100x100.png',
    rating: 5,
  },
];

export default async function ChiSiamo() {
  const googleReviewsData = await getGooglePlaceReviews(3);
  const googleReviews = googleReviewsData.reviews;
  const testimonials: Testimonial[] =
    googleReviews.length > 0
      ? googleReviews.map((review, index) => ({
          id: `google-${index + 1}`,
          name: review.authorName || 'Cliente verificato',
          content: review.text || 'Recensione disponibile su Google.',
          image: review.photoUri || 'https://placehold.co/100x100.png',
          rating: Math.max(1, Math.min(5, Math.round(review.rating ?? 5))),
        }))
      : fallbackTestimonials;

  return (
    <>
      <Hero
        title="Chi Siamo"
        description="La nostra passione, la tua professione."
        ctaText="Contattaci"
        ctaHref="/contatti"
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              La Nostra Storia
            </h2>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              La bellezza è un arte che racconta chi sei.
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Siamo Christian e Barbara, e dal 2010 trasformiamo la passione per la bellezza e il benessere in un progetto dedicato a chi ama il mondo dell&apos;estetica. Con il nostro primo negozio, abbiamo creato un luogo dove prendersi cura delle persone è una vera forma d&apos;arte.
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Negli anni, abbiamo ampliato la nostra visione, aprendo un&apos;accademia per formare professionisti nel settore Nails e Beauty. Collaboriamo con i migliori master nazionali e internazionali per offrire corsi di alta qualità, garantendo competenze solide per una carriera di successo.
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Oltre alla formazione, proponiamo trattamenti estetici avanzati e tecnologie innovative per viso e corpo, disponibili anche a noleggio per le professioniste. La nostra accademia è un punto di riferimento per chi vuole trasformare la passione per l&apos;estetica in una professione.
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Con la stessa passione di sempre, continuiamo a innovare e a supportare chi desidera crescere in questo settore unico e affascinante.
            </p>
          </div>
          <div className="w-full">
            <Image
              src="/images/chisiamo.webp"
              alt="Christian e Barbara presso l'accademia BeautyLine"
              width={1280}
              height={900}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-primary/5 py-16 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
            <div className="text-xl text-secondary font-medium">Formazioni</div>
          </div>
          <div className="p-6">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">3000+</div>
            <div className="text-xl text-secondary font-medium">Corsiste</div>
          </div>
          <div className="p-6">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
            <div className="text-xl text-secondary font-medium">Crescita Professionale</div>
          </div>
        </div>
      </Section>

      <Section className="bg-muted">
        <div className="flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              La Nostra Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Il nostro obiettivo è trasformare la tua passione in una carriera di successo. 
              Vogliamo formare estetiste preparate, consapevoli e pronte ad affrontare le sfide del mondo del lavoro.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">Eccellenza</h3>
            <p className="text-gray-600">
              Standard formativi elevati e aggiornamento continuo sulle ultime tendenze.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">Community</h3>
            <p className="text-gray-600">
              Un ambiente inclusivo dove crescere insieme e condividere esperienze.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">Innovazione</h3>
            <p className="text-gray-600">
              Utilizzo delle tecnologie e dei metodi più avanzati nel campo estetico.
            </p>
          </div>
          </div>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section>
        <div className="flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              Dicono di Noi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Le esperienze di chi ha scelto BeautyLine per la propria formazione
            </p>
            {googleReviewsData.averageRating && googleReviewsData.totalReviews ? (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-base text-gray-700">
                <span className="font-semibold text-secondary">
                  Google {googleReviewsData.averageRating.toFixed(1).replace('.', ',')} / 5
                </span>
                <span className="text-gray-400">•</span>
                <span>{googleReviewsData.totalReviews} recensioni</span>
                {googleReviewsData.reviewsUrl ? (
                  <>
                    <span className="text-gray-400">•</span>
                    <a
                      href={googleReviewsData.reviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Vedi tutte su Google
                    </a>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
