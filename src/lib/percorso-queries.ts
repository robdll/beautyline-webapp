import { connectDB } from '@/lib/mongodb';
import { type LeanCourseDoc } from '@/lib/public-course';
import {
  getPercorsoItems,
  getPublicPercorsoSlug,
  serializePublicPercorso,
  type LeanPercorsoDoc,
  type PublicPercorsoJson,
} from '@/lib/public-percorso';
import Course from '@/models/Course';
import Percorso from '@/models/Percorso';

async function loadCoursesForPercorso(p: LeanPercorsoDoc): Promise<LeanCourseDoc[]> {
  const ids = getPercorsoItems(p).map((item) => item.courseId);
  if (ids.length === 0) return [];
  // Il softDeletePlugin esclude automaticamente i corsi eliminati.
  const docs = await Course.find({ _id: { $in: ids } }).lean();
  return docs as unknown as LeanCourseDoc[];
}

export async function getPublicPercorsi(): Promise<PublicPercorsoJson[]> {
  await connectDB();
  const percorsi = (await Percorso.find().sort({ createdAt: 1 }).lean()) as unknown as LeanPercorsoDoc[];
  const serialized = await Promise.all(
    percorsi.map(async (p) => serializePublicPercorso(p, await loadCoursesForPercorso(p)))
  );
  return serialized;
}

export async function getPercorsoBySlug(slug: string): Promise<PublicPercorsoJson | null> {
  await connectDB();
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  const direct = (await Percorso.findOne({ slug: normalized }).lean()) as unknown as LeanPercorsoDoc | null;
  const raw =
    direct ??
    ((await Percorso.find().lean()) as unknown as LeanPercorsoDoc[]).find(
      (p) => getPublicPercorsoSlug(p) === normalized
    ) ??
    null;

  if (!raw) return null;
  return serializePublicPercorso(raw, await loadCoursesForPercorso(raw));
}
