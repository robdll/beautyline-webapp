import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Product from '@/models/Product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: 'Prodotto non trovato.' }, { status: 404 });
    }

    const serialized = {
      ...product,
      _id: product._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Product GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero del prodotto.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
    }

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

    const colors = Array.isArray(availableColors)
      ? availableColors
          .filter((c: { name?: string; hex?: string }) => c?.name != null && c?.hex != null)
          .map((c: { name: string; hex: string }) => ({ name: String(c.name).trim(), hex: String(c.hex).trim() }))
      : [];

    await connectDB();
    const product = await Product.findByIdAndUpdate(
      id,
      {
        brand: String(brand).trim(),
        type: String(type).trim(),
        name: String(name).trim(),
        description: String(description),
        media: Array.isArray(media) ? media : [],
        cost: numCost,
        availableColors: colors,
      },
      { new: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: 'Prodotto non trovato.' }, { status: 404 });
    }

    const serialized = {
      ...product,
      _id: product._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Product PUT error:', err);
    return NextResponse.json({ error: "Errore nell'aggiornamento del prodotto." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Prodotto non trovato.' }, { status: 404 });
    }

    await product.softDelete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Product DELETE error:', err);
    return NextResponse.json({ error: "Errore nell'eliminazione del prodotto." }, { status: 500 });
  }
}
