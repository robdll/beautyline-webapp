import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { ContactSection } from '@/components/ContactSection';
import { EquipmentHighlightSection } from '@/components/EquipmentHighlightSection';
import { Section } from '@/components/Section';
import { connectDB } from '@/lib/mongodb';
import { whatsappAttrezzaturaUrl } from '@/lib/contact';
import { displayPublicDescription, displayPublicTitle } from '@/lib/display-text';
import { getEquipmentTypeLabel, parseEquipmentType } from '@/lib/equipment-types';
import EquipmentModel from '@/models/Equipment';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Vendita e Noleggio Attrezzature',
  description: 'Attrezzature professionali per l\'estetica in vendita e noleggio. Soluzioni flessibili per professionisti e centri estetici.',
};

export const dynamic = 'force-dynamic';

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  type: string;
  /** Slug categoria per URL dettaglio; assente se il tipo in DB non è tra le 4 categorie. */
  detailTypeSlug: string | null;
  image: string;
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
}

async function getEquipment(): Promise<EquipmentItem[]> {
  try {
    await connectDB();
    const docs = await EquipmentModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      type: doc.type,
      detailTypeSlug: parseEquipmentType(doc.type),
      image: doc.media?.[0] || 'https://placehold.co/400x300.png',
      rentOnly: doc.rentOnly,
      rentCostPerDay: doc.rentCostPerDay,
      rentCostPerMonth: doc.rentCostPerMonth,
      sellingCost: doc.sellingCost,
    }));
  } catch {
    return [];
  }
}

const contattaciButtonClass = cn(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[40px] border-2 border-primary px-4 py-2.5 text-sm font-medium text-primary',
  'transition-all duration-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
);

export default async function AttrezzaturePage() {
  const equipment = await getEquipment();

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
          <p className="text-2xl font-semibold text-white leading-snug md:text-3xl lg:text-4xl">
            Attrezzature professionali all&apos;avanguardia.
            <br />
            Disponibili in vendita e noleggio.
          </p>
        }
        ctaText="Scopri le Attrezzature"
        ctaHref="/attrezzature#attrezzature-tecnologie"
      />

      <EquipmentHighlightSection />

      <Section id="catalogo" className="scroll-mt-24">
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => {
              const itemTitle = displayPublicTitle(item.name);
              return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex w-full max-h-[360px] items-center justify-center overflow-hidden">
                  <Image
                    src={item.image}
                    alt={itemTitle}
                    width={300}
                    height={400}
                    className="h-auto w-full shrink-0"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="flex grow flex-col p-6">
                  <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {getEquipmentTypeLabel(item.type)}
                  </span>
                  <h3 className="heading-brand mb-2 text-xl font-bold">{itemTitle}</h3>
                  <p className="mb-4 line-clamp-3 grow text-sm text-gray-600">
                    {displayPublicDescription(item.description)}
                  </p>
                  <div className="mt-auto flex flex-row items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                      {item.detailTypeSlug ? (
                        <Link
                          href={`/attrezzature/${encodeURIComponent(item.detailTypeSlug)}/${encodeURIComponent(item.id)}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Dettagli
                        </Link>
                      ) : null}
                      <a
                        href={whatsappAttrezzaturaUrl(itemTitle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={contattaciButtonClass}
                      >
                        Contattaci
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>Le attrezzature saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>

      <ContactSection
        className="bg-muted"
        title="Vuoi informazioni sulle attrezzature?"
        description="Compila il modulo o contattaci utilizzando i recapiti qui sotto per preventivi, noleggio o acquisto delle nostre attrezzature."
      />
    </>
  );
}
