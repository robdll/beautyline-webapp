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
    console.error('[seed-courses-catalog] MONGODB_URI is not defined.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const { insertCatalogCoursesIfMissing } = await import('../src/lib/course-catalog-seed');
  const { inserted, skipped } = await insertCatalogCoursesIfMissing();

  console.info(
    `[seed-courses-catalog] Done. Inserted: ${inserted}, skipped (already present): ${skipped}.`
  );

  await mongoose.connection.close();
}

run().catch(async (error) => {
  console.error('[seed-courses-catalog] Failed:', error);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
