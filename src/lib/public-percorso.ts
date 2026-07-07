import type mongoose from 'mongoose';
import type { CourseType } from '@/lib/course-types';
import { daySpanInclusive, formatDateRange } from '@/lib/course-occurrences';
import { serializePublicCourse, type LeanCourseDoc } from '@/lib/public-course';
import { slugifyCourseName } from '@/lib/course-slug';

/** Card di un corso all'interno di un percorso: già pronta da renderizzare. */
export interface PublicPercorsoCourse {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: CourseType;
  image: string | null;
  /** Percorso relativo, es. `unghie/soak-off`. */
  href: string;
  /** Data dell'erogazione scelta per il percorso (range formattato), o null se non definita. */
  dateLabel: string | null;
  /** Durata in giorni dell'erogazione di riferimento, o null se non determinabile. */
  days: number | null;
  soldOut: boolean;
}

export interface PublicPercorsoJson {
  id: string;
  slug: string;
  name: string;
  description: string;
  cost: number;
  media: string[];
  courses: PublicPercorsoCourse[];
  /** Somma dei giorni di formazione di tutti i corsi del percorso. */
  totalDays: number;
}

export interface LeanPercorsoItem {
  course?: mongoose.Types.ObjectId | string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface LeanPercorsoDoc {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  name: string;
  description: string;
  cost: number;
  media?: unknown;
  items?: LeanPercorsoItem[];
  /** Legacy: percorsi creati prima dell'introduzione delle date per-corso. */
  courseIds?: unknown;
}

export function getPublicPercorsoSlug(p: LeanPercorsoDoc): string {
  const stored = p.slug?.trim();
  return stored || slugifyCourseName(p.name);
}

interface NormalizedItem {
  courseId: string;
  startDate: string | null;
  endDate: string | null;
}

/** Estrae le voci del percorso, con retrocompatibilità per il vecchio campo `courseIds`. */
export function getPercorsoItems(p: LeanPercorsoDoc): NormalizedItem[] {
  if (Array.isArray(p.items) && p.items.length > 0) {
    return p.items
      .map((item) => {
        const courseId = item?.course ? String(item.course) : '';
        if (!courseId) return null;
        const start = item?.startDate ? new Date(item.startDate) : null;
        const end = item?.endDate ? new Date(item.endDate) : null;
        return {
          courseId,
          startDate: start && !Number.isNaN(start.getTime()) ? start.toISOString() : null,
          endDate: end && !Number.isNaN(end.getTime()) ? end.toISOString() : null,
        };
      })
      .filter((v): v is NormalizedItem => v !== null);
  }
  if (Array.isArray(p.courseIds)) {
    return p.courseIds.map((id) => ({ courseId: String(id), startDate: null, endDate: null }));
  }
  return [];
}

function buildCourseCard(raw: LeanCourseDoc, item: NormalizedItem): PublicPercorsoCourse {
  const course = serializePublicCourse(raw);

  // Data esplicita della voce; in mancanza (dati legacy) ripiega sulla prossima
  // erogazione del corso, così la tabella non mostra "Da definire" senza motivo.
  let start = item.startDate;
  let end = item.endDate;
  if (!start || !end) {
    const now = Date.now();
    const fallback =
      course.occurrences.find((o) => new Date(o.endDate).getTime() >= now) ??
      course.occurrences[0] ??
      null;
    if (fallback) {
      start = fallback.startDate;
      end = fallback.endDate;
    }
  }

  const dateLabel = start && end ? formatDateRange(start, end) : null;
  const days = start && end ? daySpanInclusive(new Date(start), new Date(end)) : null;

  // Sold-out dell'erogazione di riferimento, se combacia con un'occorrenza del corso.
  let soldOut = false;
  if (start && end) {
    const match = course.occurrences.find(
      (o) =>
        new Date(o.startDate).toDateString() === new Date(start as string).toDateString() &&
        new Date(o.endDate).toDateString() === new Date(end as string).toDateString()
    );
    soldOut = match?.soldOut ?? false;
  }

  return {
    days,
    id: course.id,
    slug: course.slug,
    name: course.name,
    description: course.description,
    type: course.type,
    image: course.media.find((m) => typeof m === 'string' && m.trim().length > 0) ?? null,
    href: `/corsi/${course.type}/${course.slug}`,
    dateLabel,
    soldOut,
  };
}

/**
 * Serializza un percorso in forma pubblica.
 * `courseDocs` sono i documenti Course referenziati (in qualsiasi ordine): vengono
 * riordinati secondo le voci del percorso e i riferimenti mancanti sono ignorati.
 */
export function serializePublicPercorso(
  p: LeanPercorsoDoc,
  courseDocs: LeanCourseDoc[]
): PublicPercorsoJson {
  const byId = new Map<string, LeanCourseDoc>();
  for (const doc of courseDocs) {
    byId.set(doc._id.toString(), doc);
  }

  const courses: PublicPercorsoCourse[] = [];
  for (const item of getPercorsoItems(p)) {
    const doc = byId.get(item.courseId);
    if (doc) courses.push(buildCourseCard(doc, item));
  }

  const totalDays = courses.reduce((sum, c) => sum + (c.days ?? 0), 0);

  return {
    id: p._id.toString(),
    slug: getPublicPercorsoSlug(p),
    name: p.name,
    description: p.description,
    cost: p.cost,
    media: Array.isArray(p.media) ? (p.media as string[]) : [],
    courses,
    totalDays,
  };
}
