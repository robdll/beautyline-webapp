import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin';
import CoursePoster from '@/models/CoursePoster';

function serialize(doc: { _id: unknown; image: string; month: number; year: number; createdAt?: Date; updatedAt?: Date }) {
  return {
    _id: String(doc._id),
    image: doc.image,
    month: doc.month,
    year: doc.year,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const posters = await CoursePoster.find().sort({ year: 1, month: 1 }).lean();
    return NextResponse.json(posters.map(serialize));
  } catch (err) {
    console.error('CoursePosters GET error:', err);
    return NextResponse.json({ error: 'Errore nel recupero delle locandine.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { image, month, year } = body ?? {};

    const trimmedImage = typeof image === 'string' ? image.trim() : '';
    const numMonth = Number(month);
    const numYear = Number(year);

    if (!trimmedImage) {
      return NextResponse.json({ error: 'L\'immagine della locandina è obbligatoria.' }, { status: 400 });
    }
    if (!Number.isInteger(numMonth) || numMonth < 1 || numMonth > 12) {
      return NextResponse.json({ error: 'Mese non valido (1-12).' }, { status: 400 });
    }
    if (!Number.isInteger(numYear) || numYear < 1970 || numYear > 9999) {
      return NextResponse.json({ error: 'Anno non valido.' }, { status: 400 });
    }

    await connectDB();
    const created = await CoursePoster.create({
      image: trimmedImage,
      month: numMonth,
      year: numYear,
    });

    return NextResponse.json(serialize(created.toObject()));
  } catch (err) {
    console.error('CoursePosters POST error:', err);
    return NextResponse.json({ error: 'Errore nella creazione della locandina.' }, { status: 500 });
  }
}
