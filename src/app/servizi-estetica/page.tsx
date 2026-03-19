import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { connectDB } from '@/lib/mongodb';
import ServiceModel from '@/models/Service';

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

export default async function ServiziEsteticaPage() {
  const services = await getServices();

  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="heading-brand text-4xl md:text-5xl font-bold mb-4">
            Servizi Estetica
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trattamenti professionali di estetica per la cura del corpo e del viso, eseguiti con
            prodotti di alta gamma e tecniche all&apos;avanguardia.
          </p>
        </div>
      </Section>

      <Section>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative w-full h-48">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    {service.type}
                  </span>
                  <h3 className="heading-brand text-xl font-bold mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <p className="text-lg font-bold text-primary">
                      € {service.cost.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>I servizi saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>

      <Section className="bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-brand text-2xl md:text-3xl font-bold mb-4">
            Vuoi Prenotare un Trattamento?
          </h2>
          <p className="text-gray-600 mb-6">
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
