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
    console.error('[migrate-courses-soldout] MONGODB_URI is not defined.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const Course = (await import('../src/models/Course')).default;
  const courses = await Course.find({}).lean();

  let updatedCourses = 0;

  for (const course of courses) {
    const occurrences = Array.isArray((course as { occurrences?: unknown }).occurrences)
      ? ((course as { occurrences?: { startDate?: unknown; endDate?: unknown; soldOut?: unknown }[] }).occurrences ??
        [])
      : [];

    const normalizedOccurrences = occurrences
      .map((occ) => {
        if (!occ?.startDate || !occ?.endDate) return null;
        const startDate = new Date(occ.startDate);
        const endDate = new Date(occ.endDate);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
        return {
          startDate,
          endDate,
          soldOut: occ.soldOut === true,
        };
      })
      .filter(
        (occ): occ is { startDate: Date; endDate: Date; soldOut: boolean } =>
          occ !== null
      );

    const needsUpdate =
      normalizedOccurrences.length !== occurrences.length ||
      occurrences.some((occ) => !occ || typeof occ.soldOut !== 'boolean');

    if (!needsUpdate) continue;

    await Course.updateOne(
      { _id: course._id },
      {
        $set: {
          occurrences: normalizedOccurrences,
        },
      }
    );
    updatedCourses += 1;
  }

  console.info(`[migrate-courses-soldout] Done. Updated courses: ${updatedCourses}.`);
  await mongoose.connection.close();
}

run().catch(async (error) => {
  console.error('[migrate-courses-soldout] Failed:', error);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
