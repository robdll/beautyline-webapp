import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import { parseCourseType } from '@/lib/course-types';
import {
  parseOccurrences,
  sanitizeProgramSections,
  validateOccurrencesShape,
} from '@/lib/course-occurrences';
import Course from '@/models/Course';

function normalizeOccurrencesForResponse(value: unknown): { startDate: Date; endDate: Date; soldOut: boolean }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((occ) => {
      const startDate = (occ as { startDate?: unknown })?.startDate;
      const endDate = (occ as { endDate?: unknown })?.endDate;
      if (!startDate || !endDate) return null;
      return {
        startDate: new Date(startDate as string | Date),
        endDate: new Date(endDate as string | Date),
        soldOut: (occ as { soldOut?: unknown })?.soldOut === true,
      };
    })
    .filter(
      (occ): occ is { startDate: Date; endDate: Date; soldOut: boolean } =>
        Boolean(occ) &&
        !Number.isNaN(occ.startDate.getTime()) &&
        !Number.isNaN(occ.endDate.getTime())
    );
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
      occurrences: normalizeOccurrencesForResponse(course.occurrences),
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
    const { type, name, description, cost, media, occurrences, programSections, orario } = body;

    if (!type || !name || !description || cost === undefined) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti: type, name, description, cost.' },
        { status: 400 }
      );
    }

    const parsedType = parseCourseType(type);
    if (!parsedType) {
      return NextResponse.json(
        { error: 'Tipo corso non valido. Consentiti: unghie, occhi.' },
        { status: 400 }
      );
    }

    const numCost = Number(cost);
    if (isNaN(numCost) || numCost < 0) {
      return NextResponse.json({ error: 'Il costo deve essere un numero non negativo.' }, { status: 400 });
    }

    const parsedOccurrences = parseOccurrences(occurrences);
    if (!parsedOccurrences) {
      return NextResponse.json({ error: 'Date corso non valide.' }, { status: 400 });
    }
    const occurrenceError = validateOccurrencesShape(parsedOccurrences);
    if (occurrenceError) {
      return NextResponse.json({ error: occurrenceError }, { status: 400 });
    }
    const safeProgramSections = sanitizeProgramSections(programSections);
    const safeOrario = typeof orario === 'string' ? orario.trim() : '';

    await connectDB();
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Corso non trovato.' }, { status: 404 });
    }

    course.type = parsedType;
    course.name = String(name).trim();
    course.description = String(description);
    course.cost = numCost;
    course.media = Array.isArray(media) ? media : [];
    course.occurrences = parsedOccurrences;
    course.programSections = safeProgramSections;
    course.orario = safeOrario;

    await course.save();

    const lean = course.toObject();
    const serialized = {
      ...lean,
      _id: lean._id.toString(),
      occurrences: normalizeOccurrencesForResponse(lean.occurrences),
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
