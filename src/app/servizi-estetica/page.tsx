import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { ContactSection } from '@/components/ContactSection';
import { Section } from '@/components/Section';
import { connectDB } from '@/lib/mongodb';
import { whatsappPrenotaUrl } from '@/lib/contact';
import ServiceModel from '@/models/Service';
import { cn } from '@/lib/utils';
import { isPromoVisibleNow, SERVICE_CATEGORIES } from '@/lib/service-categories';

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
  isPromo?: boolean;
  promoStartsAt?: Date | string | null;
  promoEndsAt?: Date | string | null;
}

async function getServices(): Promise<ServiceItem[]> {
  try {
    await connectDB();
    const docs = await ServiceModel.find().sort({ type: 1, name: 1 }).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      type: doc.type,
      image: doc.media?.[0] || 'https://placehold.co/400x300.png',
      cost: doc.cost,
      isPromo: Boolean(doc.isPromo),
      promoStartsAt: doc.promoStartsAt,
      promoEndsAt: doc.promoEndsAt,
    }));
  } catch {
    return [];
  }
}

const prenotaButtonClass = cn(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[40px] border-2 border-primary px-4 py-2.5 text-sm font-medium text-primary',
  'transition-all duration-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
);

export default async function ServiziEsteticaPage() {
  const services = await getServices();
  const promoServices = services.filter(
    (s) =>
      s.isPromo &&
      s.image &&
      !s.image.includes('placehold.co') &&
      isPromoVisibleNow(true, s.promoStartsAt, s.promoEndsAt),
  );
  const treatmentServices = services.filter((s) => !s.isPromo);

  const groupedServices = treatmentServices.reduce<Record<string, ServiceItem[]>>((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {});
  const orderedCategories = [
    ...SERVICE_CATEGORIES.filter((category) => groupedServices[category]?.length),
    ...Object.keys(groupedServices).filter(
      (category) => !SERVICE_CATEGORIES.includes(category as (typeof SERVICE_CATEGORIES)[number]),
    ),
  ];

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
            Trattamenti professionali di estetica.
            <br />
            La scienza della bellezza, il tocco del benessere.
          </p>
        }
        ctaText="Scopri i Trattamenti"
        ctaHref="/servizi-estetica#trattamenti"
      />

      <Section id="promozioni" className="scroll-mt-24 bg-muted/40">
        <div className="space-y-8">
          <h2 className="heading-brand text-center text-2xl font-bold uppercase tracking-wide text-secondary md:text-3xl">
            Promozioni
          </h2>
          {promoServices.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {promoServices.map((promo) => (
                <div
                  key={promo.id}
                  className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm aspect-137/160"
                >
                  <Image
                    src={promo.image}
                    alt={promo.name || 'Promozione'}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mx-auto max-w-lg text-center text-sm text-gray-600">
              Nessuna promozione attiva al momento. Torna a trovarci presto!
            </p>
          )}
        </div>
      </Section>

      <Section id="trattamenti" className="scroll-mt-24">
        {treatmentServices.length > 0 ? (
          <div className="space-y-12">
            {orderedCategories.map((category) => (
              <div key={category} className="space-y-5">
                <h2 className="heading-brand text-2xl font-bold uppercase tracking-wide text-secondary md:text-3xl">
                  {category}
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {groupedServices[category].map((service) => (
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
                        <h3 className="heading-brand mb-2 text-xl font-bold">{service.name}</h3>
                        <p className="mb-4 line-clamp-3 grow text-sm text-gray-600">{service.description}</p>
                        <div className="mt-auto flex flex-row items-center justify-between gap-3 border-t border-gray-100 pt-4">
                          <p className="min-w-0 text-lg font-bold text-primary">€ {service.cost.toFixed(2)}</p>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>I servizi saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>

      <ContactSection
        className="bg-muted"
        title="Vuoi informazioni su un Trattamento?"
        description="Compila il modulo o contattaci utilizzando i recapiti qui sotto per prenotare un appuntamento o per maggiori informazioni sui nostri servizi."
      />
    </>
  );
}
