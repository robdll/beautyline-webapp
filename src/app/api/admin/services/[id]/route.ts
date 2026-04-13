import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Service from '@/models/Service';
import { buildServicePayloadFromBody } from '@/lib/service-api';

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
    const payload = buildServicePayloadFromBody(body);
    if ('error' in payload) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    await connectDB();
    const service = await Service.findByIdAndUpdate(id, payload, { new: true }).lean();

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
