import { connectDB } from '@/lib/mongodb';
import type { CourseType } from '@/lib/course-types';
import Course from '@/models/Course';

export async function getCourseByTipoSlug(tipo: CourseType, slug: string) {
  await connectDB();
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  return Course.findOne({ type: tipo, slug: normalized }).lean();
}
