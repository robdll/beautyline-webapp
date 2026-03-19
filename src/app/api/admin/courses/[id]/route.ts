import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Course from '@/models/Course';

function parseStartDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

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
    const course = await Course.findById(id).lean();
    if (!course) {
      return NextResponse.json({ error: 'Corso non trovato.' }, { status: 404 });
    }

    const serialized = {
      ...course,
      _id: course._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Course GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero del corso.' }, { status: 500 });
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
    const { type, level, name, description, duration, cost, media, startDate } = body;

    if (!type || !level || !name || !description || !duration || cost === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, level, name, description, duration, cost.' },
        { status: 400 }
      );
    }

    const numCost = Number(cost);
    if (isNaN(numCost) || numCost < 0) {
      return NextResponse.json({ error: 'Il costo deve essere un numero non negativo.' }, { status: 400 });
    }

    const parsedStartDate = parseStartDate(startDate);
    if (typeof startDate === 'string' && startDate.trim() && !parsedStartDate) {
      return NextResponse.json({ error: 'Data corso non valida.' }, { status: 400 });
    }

    await connectDB();
    const course = await Course.findByIdAndUpdate(
      id,
      {
        type: String(type).trim(),
        level: String(level).trim(),
        name: String(name).trim(),
        description: String(description),
        duration: String(duration).trim(),
        cost: numCost,
        media: Array.isArray(media) ? media : [],
        startDate: parsedStartDate,
      },
      { new: true }
    ).lean();

    if (!course) {
      return NextResponse.json({ error: 'Corso non trovato.' }, { status: 404 });
    }

    const serialized = {
      ...course,
      _id: course._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Course PUT error:', err);
    return NextResponse.json({ error: 'Errore nell\'aggiornamento del corso.' }, { status: 500 });
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
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Corso non trovato.' }, { status: 404 });
    }

    await course.softDelete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Course DELETE error:', err);
    return NextResponse.json({ error: 'Errore nell\'eliminazione del corso.' }, { status: 500 });
  }
}
