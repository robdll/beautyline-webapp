import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import { parseEquipmentType } from '@/lib/equipment-types';
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
    const { type, name, description, media } = body;

    if (!type || !name || !description) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, name, description.' },
        { status: 400 }
      );
    }

    const parsedType = parseEquipmentType(type);
    if (!parsedType) {
      return NextResponse.json(
        { error: 'Tipo non valido. Scegli una delle categorie: viso, corpo, epilazione, multifunzione.' },
        { status: 400 }
      );
    }

    await connectDB();
    const equipment = await Equipment.findByIdAndUpdate(
      id,
      {
        type: parsedType,
        name: String(name).trim(),
        description: String(description),
        media: Array.isArray(media) ? media : [],
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
