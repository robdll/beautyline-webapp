import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { connectDB } from '@/lib/mongodb';
import { whatsappPrenotaUrl } from '@/lib/contact';
import ServiceModel from '@/models/Service';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Servizi Estetica',
  description: 'Scopri i nostri servizi di estetica professionale. Trattamenti di qualità per la cura del corpo e del viso.',
};

export const dynamic = 'force-dynamic';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  type: string;
  image: string;
  cost: number;
}

async function getServices(): Promise<ServiceItem[]> {
  try {
    await connectDB();
    const docs = await ServiceModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      type: doc.type,
      image: doc.media?.[0] || 'https://placehold.co/400x300.png',
      cost: doc.cost,
    }));
  } catch {
    return [];
  }
}

const prenotaButtonClass = cn(
  'inline-flex w-full items-center justify-center rounded-[40px] border-2 border-primary px-4 py-2.5 text-sm font-medium text-primary',
  'transition-all duration-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
);

export default async function ServiziEsteticaPage() {
  const services = await getServices();

  return (
    <>
      <Hero
        title={
          <Image
            src="/images/logo-bl.png"
            alt="BeautyLine"
            width={280}
            height={280}
            className="w-48 md:w-64 lg:w-72 h-auto drop-shadow-lg"
            priority
          />
        }
        description={
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug">
            Trattamenti professionali di estetica. La scienza della bellezza, il tocco del benessere.
          </p>
        }
        ctaText="Scopri i Trattamenti"
        ctaHref="/servizi-estetica#trattamenti"
      />

      <Section id="trattamenti" className="scroll-mt-24">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="flex grow flex-col p-6">
                  <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {service.type}
                  </span>
                  <h3 className="heading-brand mb-2 text-xl font-bold">{service.name}</h3>
                  <p className="mb-4 line-clamp-3 grow text-sm text-gray-600">{service.description}</p>
                  <div className="mt-auto space-y-3 border-t border-gray-100 pt-4">
                    <p className="text-lg font-bold text-primary">€ {service.cost.toFixed(2)}</p>
                    <a
                      href={whatsappPrenotaUrl(service.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={prenotaButtonClass}
                    >
                      Prenota ora
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>I servizi saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>

      <Section className="bg-muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="heading-brand mb-4 text-2xl font-bold md:text-3xl">
            Vuoi Prenotare un Trattamento?
          </h2>
          <p className="mb-6 text-gray-600">
            Contattaci per prenotare un appuntamento o per maggiori informazioni sui nostri servizi
          </p>
          <Link href="/contatti">
            <Button variant="primary" size="lg">
              Contattaci
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
