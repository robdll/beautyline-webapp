import type mongoose from 'mongoose';
import type { CourseType } from '@/lib/course-types';
import { slugifyCourseName } from '@/lib/course-slug';

export interface PublicCourseJson {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  level: string;
  type: CourseType;
  media: string[];
  startDate: string | null;
}

export interface LeanCourseDoc {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  level: string;
  type: string;
  media?: unknown;
  startDate?: Date | null;
}

/** Slug usato in URL e API: coincide con il catalogo anche se `slug` in DB è assente (dati legacy). */
export function getPublicCourseSlug(c: LeanCourseDoc): string {
  const stored = c.slug?.trim();
  return stored || slugifyCourseName(c.name);
}

export function serializePublicCourse(c: LeanCourseDoc): PublicCourseJson {
  const slug = getPublicCourseSlug(c);
  return {
    id: c._id.toString(),
    slug,
    name: c.name,
    description: c.description,
    duration: c.duration,
    cost: c.cost,
    level: c.level,
    type: c.type as CourseType,
    media: Array.isArray(c.media) ? c.media : [],
    startDate: c.startDate ? new Date(c.startDate).toISOString() : null,
  };
}
