import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Noleggio Attrezzature',
  description: 'Noleggia attrezzature professionali per l\'estetica. Soluzioni flessibili per professionisti e centri estetici.',
};

const equipment = [
  {
    name: 'Lettino Estetico Professionale',
    description: 'Lettino regolabile con accessori completi per trattamenti viso e corpo',
    image: 'https://placehold.co/400x300.png',
  },
  {
    name: 'Lampada per Manicure',
    description: 'Lampada LED professionale per asciugatura smalti gel e semipermanenti',
    image: 'https://placehold.co/400x300.png',
  },
  {
    name: 'Vaporizzatore Viso',
    description: 'Vaporizzatore professionale per trattamenti viso e pulizia profonda',
    image: 'https://placehold.co/400x300.png',
  },
  {
    name: 'Macchina per Epilazione',
    description: 'Apparecchiatura professionale per epilazione elettrica',
    image: 'https://placehold.co/400x300.png',
  },
];

export default function NoleggioPage() {
  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Noleggio Attrezzature
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Noleggia attrezzature professionali per l&apos;estetica. Soluzioni flessibili per professionisti e centri estetici.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {equipment.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-64">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-secondary mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" size="sm">
                  Richiedi Preventivo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-muted">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 text-center">
            Perché Noleggiare con Noi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Attrezzature Professionali
              </h3>
              <p className="text-gray-600">
                Solo attrezzature di alta qualità, sempre controllate e manutenute
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Flessibilità
              </h3>
              <p className="text-gray-600">
                Noleggi brevi o lunghi, soluzioni su misura per le tue esigenze
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Assistenza
              </h3>
              <p className="text-gray-600">
                Supporto tecnico e assistenza durante tutto il periodo di noleggio
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Consegna e Ritiro
              </h3>
              <p className="text-gray-600">
                Servizio di consegna e ritiro disponibile in tutta Italia
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link href="/contatti">
              <Button variant="primary" size="lg">
                Contattaci per Maggiori Informazioni
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

