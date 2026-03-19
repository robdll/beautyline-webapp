import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { connectDB } from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export const metadata: Metadata = {
  title: 'I Nostri Prodotti',
  description: 'Scopri la nostra linea completa di prodotti professionali per estetica e benessere.',
};

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    await connectDB();
    const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: `€ ${doc.cost.toFixed(2)}`,
      image: doc.media?.[0] || 'https://placehold.co/300x300.png',
      category: doc.brand,
    }));
  } catch {
    return [];
  }
}

export default async function ProdottiPage() {
  const products = await getProducts();

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
            Qualità professionale per risultati eccellenti.
          </p>
        }
        ctaText="Scopri i prodotti"
        ctaHref="/prodotti#catalogo"
      />

      <Section id="catalogo" className="scroll-mt-24">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>I prodotti saranno disponibili a breve. Torna presto!</p>
          </div>
        )}
      </Section>
    </>
  );
}
