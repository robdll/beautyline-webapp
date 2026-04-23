import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetailView } from '@/components/ProductDetailView';
import { Section } from '@/components/Section';
import { connectDB } from '@/lib/mongodb';
import { serializePublicProduct } from '@/lib/public-product';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

function isMongoObjectIdString(s: string): boolean {
  return /^[a-f\d]{24}$/i.test(s);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!isMongoObjectIdString(id)) {
    return { title: 'Prodotto | BeautyLine' };
  }
  try {
    await connectDB();
    const doc = await Product.findById(id).lean();
    if (!doc) return { title: 'Prodotto non trovato | BeautyLine' };
    const p = serializePublicProduct({
      _id: doc._id,
      name: doc.name,
      description: doc.description,
      cost: doc.cost,
      media: doc.media,
      brand: doc.brand,
      type: doc.type,
      availableColors: doc.availableColors,
      variants: doc.variants,
    });
    const description =
      p.description.length > 155 ? `${p.description.slice(0, 152)}…` : p.description;
    return {
      title: `${p.name} | Prodotti BeautyLine`,
      description,
      openGraph: { title: p.name, description },
    };
  } catch {
    return { title: 'Prodotto | BeautyLine' };
  }
}

export default async function ProdottoDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!isMongoObjectIdString(id)) notFound();

  try {
    await connectDB();
    const doc = await Product.findById(id).lean();
    if (!doc) notFound();

    const product = serializePublicProduct({
      _id: doc._id,
      name: doc.name,
      description: doc.description,
      cost: doc.cost,
      media: doc.media,
      brand: doc.brand,
      type: doc.type,
      availableColors: doc.availableColors,
      variants: doc.variants,
    });

    return (
      <Section className="min-h-0 bg-white py-12 md:py-16" containerClassName="max-w-4xl items-stretch">
        <ProductDetailView product={product} />
      </Section>
    );
  } catch {
    notFound();
  }
}
