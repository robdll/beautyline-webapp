import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { parseCourseType } from '@/lib/course-types';
import Course from '@/models/Course';

/**
 * Elenco pubblico corsi per tipo (catalogo).
 * GET /api/courses?type=unghie|occhi
 */
export async function GET(request: NextRequest) {
  const typeParam = request.nextUrl.searchParams.get('type');
  const parsed = parseCourseType(typeParam);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Parametro type richiesto: unghie o occhi.' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const courses = await Course.find({ type: parsed }).sort({ name: 1 }).lean();

    const data = courses.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
      duration: c.duration,
      cost: c.cost,
      level: c.level,
      type: c.type,
      media: Array.isArray(c.media) ? c.media : [],
      startDate: c.startDate ? new Date(c.startDate).toISOString() : null,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error('Public courses GET error:', err);
    return NextResponse.json({ error: 'Errore nel caricamento dei corsi.' }, { status: 500 });
  }
}
