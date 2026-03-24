import path from 'node:path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

function loadEnvFile(filePath: string) {
  dotenv.config({ path: filePath, override: false });
}

async function run() {
  const workspaceRoot = process.cwd();
  loadEnvFile(path.join(workspaceRoot, '.env'));
  loadEnvFile(path.join(workspaceRoot, '.env.local'));

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[migrate-courses-multidate] MONGODB_URI is not defined.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const Course = (await import('../src/models/Course')).default;
  const { insertCatalogCoursesIfMissing, normalizeExistingCourses } = await import(
    '../src/lib/course-catalog-seed'
  );

  await normalizeExistingCourses();
  await insertCatalogCoursesIfMissing();

  const courses = await Course.find({ deletedAt: null }).sort({ createdAt: 1 }).lean();
  const grouped = new Map<string, typeof courses>();

  for (const course of courses) {
    const key = `${String(course.type).toLowerCase()}::${String(course.name).trim().toLowerCase()}`;
    const list = grouped.get(key) ?? [];
    list.push(course);
    grouped.set(key, list);
  }

  let mergedDuplicates = 0;

  for (const [, group] of grouped) {
    if (group.length <= 1) continue;
    const [primary, ...duplicates] = group;

    const mergedOccurrences = new Map<string, { startDate: Date; endDate: Date }>();
    const addOccurrence = (occ: { startDate?: Date | string; endDate?: Date | string }) => {
      if (!occ?.startDate || !occ?.endDate) return;
      const startDate = new Date(occ.startDate);
      const endDate = new Date(occ.endDate);
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return;
      const key = `${startDate.toISOString()}::${endDate.toISOString()}`;
      mergedOccurrences.set(key, { startDate, endDate });
    };

    for (const occ of primary.occurrences ?? []) {
      addOccurrence(occ);
    }
    for (const duplicate of duplicates) {
      for (const occ of duplicate.occurrences ?? []) {
        addOccurrence(occ);
      }
      const legacyStartDate = (duplicate as { startDate?: Date | string }).startDate;
      if (legacyStartDate) {
        addOccurrence({ startDate: legacyStartDate, endDate: legacyStartDate });
      }
    }

    const mergedProgramSections = Array.isArray(primary.programSections)
      ? primary.programSections.slice(0, 3)
      : ['', '', ''];
    while (mergedProgramSections.length < 3) mergedProgramSections.push('');

    await Course.updateOne(
      { _id: primary._id },
      {
        $set: {
          occurrences: [...mergedOccurrences.values()].sort(
            (a, b) => a.startDate.getTime() - b.startDate.getTime()
          ),
          programSections: mergedProgramSections,
        },
      }
    );

    for (const duplicate of duplicates) {
      await Course.updateOne(
        { _id: duplicate._id },
        {
          $set: { deletedAt: new Date() },
        }
      );
      mergedDuplicates += 1;
    }
  }

  await Course.updateMany(
    { deletedAt: null },
    {
      $unset: {
        level: 1,
        duration: 1,
        startDate: 1,
      },
    }
  );

  console.info(`[migrate-courses-multidate] Done. Merged duplicate docs: ${mergedDuplicates}.`);
  await mongoose.connection.close();
}

run().catch(async (error) => {
  console.error('[migrate-courses-multidate] Failed:', error);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
