import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Equipment from '@/models/Equipment';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
  }

  try {
    await connectDB();
    const equipment = await Equipment.findById(id).lean();
    if (!equipment) {
      return NextResponse.json({ error: 'Attrezzatura non trovata.' }, { status: 404 });
    }
    return NextResponse.json({
      ...equipment,
      _id: equipment._id.toString(),
    });
  } catch (err) {
    console.error('Equipment GET [id] error:', err);
    return NextResponse.json({ error: 'Errore nel recupero dell\'attrezzatura.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { type, name, description, media, rentOnly, rentCostPerDay, rentCostPerMonth, sellingCost } = body;

    if (!type || !name || !description) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, name, description.' },
        { status: 400 }
      );
    }

    const numRentDay = Number(rentCostPerDay);
    const numRentMonth = Number(rentCostPerMonth);
    const numSelling = Number(sellingCost);

    if (isNaN(numRentDay) || numRentDay < 0) {
      return NextResponse.json({ error: 'Costo noleggio giornaliero non valido.' }, { status: 400 });
    }
    if (isNaN(numRentMonth) || numRentMonth < 0) {
      return NextResponse.json({ error: 'Costo noleggio mensile non valido.' }, { status: 400 });
    }
    if (isNaN(numSelling) || numSelling < 0) {
      return NextResponse.json({ error: 'Prezzo di vendita non valido.' }, { status: 400 });
    }

    await connectDB();
    const equipment = await Equipment.findByIdAndUpdate(
      id,
      {
        type: String(type).trim(),
        name: String(name).trim(),
        description: String(description),
        media: Array.isArray(media) ? media : [],
        rentOnly: Boolean(rentOnly),
        rentCostPerDay: numRentDay,
        rentCostPerMonth: numRentMonth,
        sellingCost: numSelling,
      },
      { new: true }
    ).lean();

    if (!equipment) {
      return NextResponse.json({ error: 'Attrezzatura non trovata.' }, { status: 404 });
    }

    return NextResponse.json({
      ...equipment,
      _id: equipment._id.toString(),
    });
  } catch (err) {
    console.error('Equipment PUT error:', err);
    return NextResponse.json({ error: 'Errore nell\'aggiornamento dell\'attrezzatura.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID non valido.' }, { status: 400 });
  }

  try {
    await connectDB();
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return NextResponse.json({ error: 'Attrezzatura non trovata.' }, { status: 404 });
    }
    await equipment.softDelete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Equipment DELETE error:', err);
    return NextResponse.json({ error: 'Errore nell\'eliminazione dell\'attrezzatura.' }, { status: 500 });
  }
}
