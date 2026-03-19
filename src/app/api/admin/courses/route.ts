import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import Course from '@/models/Course';

function parseStartDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
    const course = await Course.create({
      type: String(type).trim(),
      level: String(level).trim(),
      name: String(name).trim(),
      description: String(description),
      duration: String(duration).trim(),
      cost: numCost,
      media: Array.isArray(media) ? media : [],
      startDate: parsedStartDate,
    });

    const serialized = {
      ...course.toObject(),
      _id: course._id.toString(),
    };
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Courses POST error:', err);
    return NextResponse.json({ error: 'Errore nella creazione del corso.' }, { status: 500 });
  }
}
