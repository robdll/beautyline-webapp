import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { parseCourseType } from '@/lib/course-types';
import {
  getPublicCourseSlug,
  serializePublicCourse,
  type LeanCourseDoc,
} from '@/lib/public-course';
import Course from '@/models/Course';

function isMongoObjectIdString(s: string): boolean {
  return /^[a-f\d]{24}$/i.test(s);
}

/**
 * Catalogo pubblico corsi.
 * GET /api/courses?type=… | ?tipo=… — elenco per tipo (unghie | occhi)
 * GET /api/courses?corso=<slug> [&tipo=…] — singolo corso (slug dal nome; ?id= ancora supportato per ObjectId legacy)
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const corsoParam =
    sp.get('corso')?.trim() || sp.get('course')?.trim() || sp.get('id')?.trim() || '';
  const tipoHint = parseCourseType(sp.get('type') ?? sp.get('tipo'));

  if (corsoParam) {
    try {
      await connectDB();

      if (isMongoObjectIdString(corsoParam)) {
        const c = await Course.findById(corsoParam).lean();
        if (!c) {
          return NextResponse.json({ error: 'Corso non trovato.' }, { status: 404 });
        }
        return NextResponse.json(serializePublicCourse(c as LeanCourseDoc));
      }

      const slug = corsoParam.toLowerCase();
      let c = null;
      if (tipoHint) {
        c = await Course.findOne({ type: tipoHint, slug }).lean();
        if (!c) {
          const list = await Course.find({ type: tipoHint }).lean();
          c =
            list.find((doc) => getPublicCourseSlug(doc as LeanCourseDoc) === slug) ?? null;
        }
      }
      if (!c) {
        c = await Course.findOne({ slug }).lean();
      }
      if (!c) {
        const all = await Course.find({}).lean();
        c = all.find((doc) => getPublicCourseSlug(doc as LeanCourseDoc) === slug) ?? null;
      }
      if (!c) {
        return NextResponse.json({ error: 'Corso non trovato.' }, { status: 404 });
      }
      return NextResponse.json(serializePublicCourse(c as LeanCourseDoc));
    } catch (err) {
      console.error('Public courses GET by slug/id error:', err);
      return NextResponse.json({ error: 'Errore nel caricamento del corso.' }, { status: 500 });
    }
  }

  const typeParam = sp.get('type') ?? sp.get('tipo');
  const parsed = parseCourseType(typeParam);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Parametro type o tipo richiesto: unghie o occhi, oppure corso (slug o id).' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const courses = await Course.find({ type: parsed }).sort({ name: 1 }).lean();

    const data = courses.map((c) => serializePublicCourse(c as LeanCourseDoc));

    return NextResponse.json(data);
  } catch (err) {
    console.error('Public courses GET error:', err);
    return NextResponse.json({ error: 'Errore nel caricamento dei corsi.' }, { status: 500 });
  }
}
