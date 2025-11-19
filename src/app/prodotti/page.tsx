import React from 'react';
import { Metadata } from 'next';
import { Section } from '@/components/Section';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Prodotti Professionali',
  description: 'Scopri la nostra selezione di prodotti professionali per l\'estetica. Attrezzature e cosmetici di alta qualità.',
};

// Mock data
const products: Product[] = [
  {
    id: '1',
    name: 'Kit Trattamenti Viso Completo',
    description: 'Set completo di prodotti professionali per trattamenti viso di alta qualità.',
    price: '€ 299',
    image: 'https://placehold.co/400x400',
    category: 'Trattamenti Viso',
  },
  {
    id: '2',
    name: 'Linea Massaggio Professionale',
    description: 'Oli e creme professionali per massaggi corpo di ogni tipo.',
    price: '€ 189',
    image: 'https://placehold.co/400x400',
    category: 'Massaggio',
  },
  {
    id: '3',
    name: 'Attrezzatura Epilazione',
    description: 'Set completo per epilazione professionale con cerette e accessori.',
    price: '€ 149',
    image: 'https://placehold.co/400x400',
    category: 'Epilazione',
  },
  {
    id: '4',
    name: 'Kit Manicure Professionale',
    description: 'Tutto il necessario per manicure e pedicure professionali.',
    price: '€ 129',
    image: 'https://placehold.co/400x400',
    category: 'Manicure',
  },
  {
    id: '5',
    name: 'Linea Cosmetica Premium',
    description: 'Prodotti cosmetici di alta gamma per trattamenti avanzati.',
    price: '€ 249',
    image: 'https://placehold.co/400x400',
    category: 'Cosmetici',
  },
  {
    id: '6',
    name: 'Accessori Professionali',
    description: 'Set completo di accessori e strumenti per estetista.',
    price: '€ 89',
    image: 'https://placehold.co/400x400',
    category: 'Accessori',
  },
];

export default function ProdottiPage() {
  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            I Nostri Prodotti
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri la nostra selezione di prodotti professionali per l'estetica. Solo il meglio per i professionisti del settore.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section className="bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
            Prodotti di Qualità Professionale
          </h2>
          <p className="text-gray-600 mb-6">
            Tutti i nostri prodotti sono selezionati per garantire la massima qualità e professionalità.
            Per informazioni su prodotti personalizzati o ordini speciali, contattaci.
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

