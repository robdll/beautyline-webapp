import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import { normalizeAvailableColors, normalizeMediaUrls } from '@/lib/product-colors';
import Product from '@/models/Product';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const products = await Product.find().lean();
    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero dei prodotti.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { brand, type, name, description, media, cost, availableColors } = body;

    if (!brand || !type || !name || !description || cost === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: brand, type, name, description, cost.' },
        { status: 400 }
      );
    }

    const numCost = Number(cost);
    if (isNaN(numCost) || numCost < 0) {
      return NextResponse.json({ error: 'Il costo deve essere un numero non negativo.' }, { status: 400 });
    }

    const mediaUrls = normalizeMediaUrls(media);
    const colors = normalizeAvailableColors(availableColors, mediaUrls);

    await connectDB();
    const product = await Product.create({
      brand: String(brand).trim(),
      type: String(type).trim(),
      name: String(name).trim(),
      description: String(description),
      media: mediaUrls,
      cost: numCost,
      availableColors: colors,
    });

    const serialized = {
      ...product.toObject(),
      _id: product._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Products POST error:', err);
    return NextResponse.json({ error: 'Errore nella creazione del prodotto.' }, { status: 500 });
  }
}
