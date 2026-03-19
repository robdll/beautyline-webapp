import React from 'react';
import { Metadata } from 'next';
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
        title="I Nostri Prodotti"
        description="Qualità professionale per risultati eccellenti."
        ctaText="Contattaci per Info"
        ctaHref="/contatti"
      />

      <Section>
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
