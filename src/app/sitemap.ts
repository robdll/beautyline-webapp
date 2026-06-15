import type { MetadataRoute } from 'next';

import { parseCourseType } from '@/lib/course-types';
import { parseEquipmentType } from '@/lib/equipment-types';
import { connectDB } from '@/lib/mongodb';
import { getPublicCourseSlug, type LeanCourseDoc } from '@/lib/public-course';
import { SITE_URL } from '@/lib/site';
import Course from '@/models/Course';
import Equipment from '@/models/Equipment';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const STATIC_PATHS = [
  '',
  '/chi-siamo',
  '/corsi',
  '/servizi-estetica',
  '/attrezzature',
  '/prodotti',
  '/contatti',
] as const;

function sitemapEntry(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  const suffix = path === '' ? '' : path;
  return {
    url: `${SITE_URL}${suffix}`,
    lastModified: lastModified ?? new Date(),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PATHS.map((path) => sitemapEntry(path));

  try {
    await connectDB();

    const [courses, products, equipment] = await Promise.all([
      Course.find().select('type slug name updatedAt').lean(),
      Product.find().select('updatedAt').lean(),
      Equipment.find().select('type updatedAt').lean(),
    ]);

    const courseEntries = courses.flatMap((doc) => {
      const tipo = parseCourseType(doc.type);
      if (!tipo) return [];
      const slug = getPublicCourseSlug(doc as LeanCourseDoc);
      const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : undefined;
      return sitemapEntry(`/corsi/${tipo}/${slug}`, updatedAt);
    });

    const productEntries = products.map((doc) =>
      sitemapEntry(`/prodotti/${doc._id.toString()}`, doc.updatedAt ? new Date(doc.updatedAt) : undefined)
    );

    const equipmentEntries = equipment.flatMap((doc) => {
      const tipo = parseEquipmentType(doc.type);
      if (!tipo) return [];
      const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : undefined;
      return sitemapEntry(`/attrezzature/${tipo}/${doc._id.toString()}`, updatedAt);
    });

    return [...staticEntries, ...courseEntries, ...productEntries, ...equipmentEntries];
  } catch {
    return staticEntries;
  }
}
