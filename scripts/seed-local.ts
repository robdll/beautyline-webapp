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

  process.env.NODE_ENV = 'development';
  process.env.ENABLE_LOCAL_SEED = 'true';

  const { connectDB } = await import('../src/lib/mongodb');

  await connectDB();

  await mongoose.connection.close();
  console.info('[local-seed] Manual local seed completed and DB connection closed.');
}

run().catch(async (error) => {
  console.error('[local-seed] Manual local seed failed:', error);
  try {
    await mongoose.connection.close();
  } catch {
    // Ignore close failures on startup errors.
  }
  process.exit(1);
});
