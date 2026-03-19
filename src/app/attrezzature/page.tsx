import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { connectDB } from '@/lib/mongodb';
import EquipmentModel from '@/models/Equipment';

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

export default async function AttrezzaturePage() {
  const equipment = await getEquipment();

  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Vendita e Noleggio Attrezzature
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Attrezzature professionali all&apos;avanguardia per il tuo centro estetico.
            Disponibili in vendita e noleggio.
          </p>
        </div>
      </Section>

      <Section>
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative w-full h-64">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {item.type}
                  </span>
                  <h3 className="text-xl font-bold text-secondary mb-2 mt-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {!item.rentOnly && item.sellingCost > 0 && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                        Acquisto: € {item.sellingCost.toFixed(2)}
                      </span>
                    )}
                    {item.rentCostPerDay > 0 && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                        Noleggio: € {item.rentCostPerDay.toFixed(2)}/giorno
                      </span>
                    )}
                    {item.rentCostPerMonth > 0 && (
                      <span className="px-3 py-1 bg-purple/10 text-purple rounded-full font-medium">
                        € {item.rentCostPerMonth.toFixed(2)}/mese
                      </span>
                    )}
                    {item.rentOnly && (
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium">
                        Solo noleggio
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Le attrezzature saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>

      <Section className="bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
            Hai Bisogno di Informazioni?
          </h2>
          <p className="text-gray-600 mb-6">
            Contattaci per preventivi personalizzati e maggiori dettagli sulle nostre attrezzature
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
