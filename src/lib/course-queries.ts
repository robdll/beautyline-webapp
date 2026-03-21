import { connectDB } from '@/lib/mongodb';
import type { CourseType } from '@/lib/course-types';
import { getPublicCourseSlug, type LeanCourseDoc } from '@/lib/public-course';
import Course from '@/models/Course';

export async function getCourseByTipoSlug(tipo: CourseType, slug: string) {
  await connectDB();
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  const direct = await Course.findOne({ type: tipo, slug: normalized }).lean();
  if (direct) return direct;

  const list = await Course.find({ type: tipo }).lean();
  for (const doc of list) {
    if (getPublicCourseSlug(doc as LeanCourseDoc) === normalized) return doc;
  }
  return null;
}
