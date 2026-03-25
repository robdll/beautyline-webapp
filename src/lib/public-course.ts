import type mongoose from 'mongoose';
import type { CourseType } from '@/lib/course-types';
import { slugifyCourseName } from '@/lib/course-slug';

export interface PublicCourseJson {
  id: string;
  slug: string;
  name: string;
  description: string;
  cost: number;
  type: CourseType;
  media: string[];
  occurrences: { startDate: string; endDate: string }[];
  nextDate: string | null;
  programSections: string[];
  orario: string;
}

export interface LeanCourseDoc {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  media?: unknown;
  occurrences?: { startDate?: Date | string; endDate?: Date | string }[];
  programSections?: unknown;
  orario?: unknown;
}

/** Slug usato in URL e API: coincide con il catalogo anche se `slug` in DB è assente (dati legacy). */
export function getPublicCourseSlug(c: LeanCourseDoc): string {
  const stored = c.slug?.trim();
  return stored || slugifyCourseName(c.name);
}

export function serializePublicCourse(c: LeanCourseDoc): PublicCourseJson {
  const slug = getPublicCourseSlug(c);
  const occurrences = Array.isArray(c.occurrences)
    ? c.occurrences
        .map((o) => {
          const start = o?.startDate ? new Date(o.startDate) : null;
          const end = o?.endDate ? new Date(o.endDate) : null;
          if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return null;
          }
          return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          };
        })
        .filter((o): o is { startDate: string; endDate: string } => Boolean(o))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    : [];

  const now = Date.now();
  const nextOccurrence = occurrences.find((o) => new Date(o.endDate).getTime() >= now) ?? occurrences[0] ?? null;

  return {
    id: c._id.toString(),
    slug,
    name: c.name,
    description: c.description,
    cost: c.cost,
    type: c.type as CourseType,
    media: Array.isArray(c.media) ? c.media : [],
    occurrences,
    nextDate: nextOccurrence?.startDate ?? null,
    programSections: Array.isArray(c.programSections)
      ? c.programSections.filter((s): s is string => typeof s === 'string').slice(0, 3)
      : [],
    orario: typeof c.orario === 'string' ? c.orario : '',
  };
}
