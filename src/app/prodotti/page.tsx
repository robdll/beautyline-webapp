import React from 'react';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

// Mock data
const products: Product[] = [
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
  {
    id: '5',
    name: 'Olio Cuticole',
    description: 'Olio nutriente per cuticole e unghie sane e forti.',
    price: '€ 12,00',
    image: 'https://placehold.co/300x300.png',
    category: 'Nails',
  },
  {
    id: '6',
    name: 'Maschera Viso Purificante',
    description: 'Maschera all\'argilla per pelli impure e miste.',
    price: '€ 29,00',
    image: 'https://placehold.co/300x300.png',
    category: 'Skincare',
  },
];

export default function Prodotti() {
  return (
    <>
      <Hero
        title="I Nostri Prodotti"
        description="Qualità professionale per risultati eccellenti."
        ctaText="Contattaci per Info"
        ctaHref="/contatti"
      />

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>
    </>
  );
}
