import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Service from '@/models/Service';

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
    const service = await Service.findById(id).lean();
    if (!service) {
      return NextResponse.json({ error: 'Servizio non trovato.' }, { status: 404 });
    }

    const serialized = {
      ...service,
      _id: service._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Service GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero del servizio.' }, { status: 500 });
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
    const { type, name, description, media, cost } = body;

    if (!type || !name || !description || cost === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, name, description, cost.' },
        { status: 400 }
      );
    }

    const numCost = Number(cost);
    if (isNaN(numCost) || numCost < 0) {
      return NextResponse.json({ error: 'Il costo deve essere un numero non negativo.' }, { status: 400 });
    }

    await connectDB();
    const service = await Service.findByIdAndUpdate(
      id,
      {
        type: String(type).trim(),
        name: String(name).trim(),
        description: String(description),
        media: Array.isArray(media) ? media : [],
        cost: numCost,
      },
      { new: true }
    ).lean();

    if (!service) {
      return NextResponse.json({ error: 'Servizio non trovato.' }, { status: 404 });
    }

    const serialized = {
      ...service,
      _id: service._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Service PUT error:', err);
    return NextResponse.json({ error: 'Errore nell\'aggiornamento del servizio.' }, { status: 500 });
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
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: 'Servizio non trovato.' }, { status: 404 });
    }

    await service.softDelete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Service DELETE error:', err);
    return NextResponse.json({ error: 'Errore nell\'eliminazione del servizio.' }, { status: 500 });
  }
}
