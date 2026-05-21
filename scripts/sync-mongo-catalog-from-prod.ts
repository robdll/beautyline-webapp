import mongoose from 'mongoose';
import { loadWorkspaceEnv } from './lib/load-env';
import { explainMongoSrvDnsFailure } from './lib/mongo-connect-hints';

/**
 * Copies public catalog collections from production into a local MongoDB.
 *
 * Env:
 *   MONGODB_URI_PROD — source (falls back to MONGODB_URI)
 *   MONGODB_URI_LOCAL — destination (required)
 *
 * Does not copy `users` (passwords / PII).
 *
 * Usage: MONGODB_URI_LOCAL=mongodb://localhost:27017/beautyline npm run seed:sync:from-prod
 * Optional: --dry-run
 */

const CATALOG_COLLECTIONS = [
  'courses',
  'services',
  'products',
  'equipments',
  'courseposters',
  'esteticapublicsettings',
  'productcategorysettings',
] as const;

async function syncCollection(
  source: mongoose.Connection,
  target: mongoose.Connection,
  name: string,
  dryRun: boolean
): Promise<void> {
  const srcCol = source.db!.collection(name);
  const existsOnSource =
    (await source.db!.listCollections({ name }).toArray()).length > 0;
  if (!existsOnSource) {
    console.info(`[sync-mongo-catalog-from-prod] Skip ${name}: not present on source`);
    return;
  }

  const count = await srcCol.countDocuments();
  if (count === 0) {
    console.info(`[sync-mongo-catalog-from-prod] Skip ${name}: source empty`);
    return;
  }

  const docs = await srcCol.find({}).toArray();

  if (dryRun) {
    console.info(`[sync-mongo-catalog-from-prod] Dry-run ${name}: would copy ${docs.length} documents`);
    return;
  }

  const tgtCol = target.db!.collection(name);
  await tgtCol.deleteMany({});
  if (docs.length > 0) {
    await tgtCol.insertMany(docs as Record<string, unknown>[], { ordered: false });
  }
  console.info(`[sync-mongo-catalog-from-prod] ${name}: replaced ${docs.length} documents`);
}

async function run(): Promise<void> {
  loadWorkspaceEnv();

  const dryRun = process.argv.includes('--dry-run');

  const sourceUri = process.env.MONGODB_URI_PROD || process.env.MONGODB_URI;
  const targetUri = process.env.MONGODB_URI_LOCAL;

  if (!sourceUri) {
    console.error('[sync-mongo-catalog-from-prod] Set MONGODB_URI_PROD or MONGODB_URI (source).');
    process.exit(1);
  }
  if (!targetUri) {
    console.error('[sync-mongo-catalog-from-prod] Set MONGODB_URI_LOCAL (destination).');
    process.exit(1);
  }
  if (sourceUri === targetUri) {
    console.error('[sync-mongo-catalog-from-prod] Source and target URIs must differ.');
    process.exit(1);
  }

  const source = mongoose.createConnection(sourceUri);
  const target = mongoose.createConnection(targetUri);

  try {
    await source.asPromise();
    await target.asPromise();
    console.info('[sync-mongo-catalog-from-prod] Connected to source and target.');

    for (const name of CATALOG_COLLECTIONS) {
      await syncCollection(source, target, name, dryRun);
    }

    console.info('[sync-mongo-catalog-from-prod] Done.');
  } finally {
    await source.close();
    await target.close();
  }
}

run().catch((error) => {
  console.error('[sync-mongo-catalog-from-prod] Failed:', error);
  explainMongoSrvDnsFailure('sync-mongo-catalog-from-prod', error);
  process.exit(1);
});
