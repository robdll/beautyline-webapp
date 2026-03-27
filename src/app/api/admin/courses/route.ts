import { NextRequest, NextResponse } from 'next/server';
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
        occ !== null &&
        !Number.isNaN(occ.startDate.getTime()) &&
        !Number.isNaN(occ.endDate.getTime())
    );
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const courses = await Course.find().lean();
    const serialized = courses.map((c) => ({
      ...c,
      _id: c._id.toString(),
      occurrences: normalizeOccurrencesForResponse(c.occurrences),
    }));
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Courses GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero dei corsi.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
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
    const course = await Course.create({
      type: parsedType,
      name: String(name).trim(),
      description: String(description),
      cost: numCost,
      media: Array.isArray(media) ? media : [],
      occurrences: parsedOccurrences,
      programSections: safeProgramSections,
      orario: safeOrario,
    });

    const serialized = {
      ...course.toObject(),
      _id: course._id.toString(),
      occurrences: normalizeOccurrencesForResponse(course.occurrences),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Courses POST error:', err);
    return NextResponse.json({ error: 'Errore nella creazione del corso.' }, { status: 500 });
  }
}
