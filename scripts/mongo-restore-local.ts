import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { loadWorkspaceEnv } from './lib/load-env';

/**
 * Restore a gzipped mongodump archive into local Mongo (e.g. Docker on localhost).
 *
 * Env: `MONGODB_URI_LOCAL` or `MONGODB_URI` (restore target) — mongodb:// to this machine,
 * never Atlas (*.mongodb.net / mongodb+srv). Use `LOCAL` only when `MONGODB_URI` points somewhere else (e.g. prod).
 *
 * By default `--drop`s collections before restoring (overwrite). Pass `--no-drop` to merge.
 * Default archive: newest `.gz` under ./mongo-backups (from `mongo:dump:prod`).
 * Override: `--archive=./mongo-backups/prod-xxxx.gz`
 *
 * Requires `mongorestore` on PATH (MongoDB Database Tools).
 * Version guard uses Mongoose + `buildInfo` (no separate `mongosh` install).
 *
 * Local MongoDB should be **near your Atlas generation** — MongoDB 8.x dumps into Docker `mongo:4.4`
 * restore zero documents (`mongorestore` rejects cross-major downgrade). Prefer `mongo:8.0`.
 *
 * Optional guards (see `.env.example`):
 * - `MONGO_RESTORE_MIN_LOCAL_MAJOR` — refuse restore if local server major is below this (default **8**).
 * - `MONGO_RESTORE_SKIP_VERSION_GUARD=1` — skip the buildInfo check (not recommended).
 * - `MONGO_RESTORE_NS_REMAP` — `SOURCE_DB:TARGET_DB` adds `--nsFrom/--nsTo` so an archive’s DB name can differ from the `/…` segment in `MONGODB_URI` (set when needed after inspecting a dump).
 */

function stripBomQuotes(s: string): string {
  let t = s.replace(/^\uFEFF/, '').replace(/\u200B/g, '').trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1);
  }
  return t.trim();
}

function parseArchiveArg(scriptArgs: readonly string[]): string | undefined {
  for (const a of scriptArgs) {
    const eq = /^--archive=(.+)$/.exec(a);
    if (eq?.[1]) return eq[1].trim();
  }
  return undefined;
}

function latestBackupGz(workspaceRoot: string): string | undefined {
  const dir = path.join(workspaceRoot, 'mongo-backups');
  if (!fs.existsSync(dir)) return undefined;

  let bestPath: string | undefined;
  let bestMtime = -1;

  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.gz')) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (!st.isFile()) continue;
    if (st.mtimeMs >= bestMtime) {
      bestMtime = st.mtimeMs;
      bestPath = p;
    }
  }
  return bestPath;
}

function assertRestoreTargetUri(uri: string): void {
  if (/mongodb\+srv:/i.test(uri)) {
    console.error(
      '[mongo-restore-local] Refusing mongodb+srv:// for restore target — use mongodb://… (e.g. Docker on localhost).'
    );
    process.exit(1);
  }
  if (!/^mongodb:\/\//i.test(uri)) {
    console.error(
      '[mongo-restore-local] Restore target must start with mongodb:// including host and optional database path.'
    );
    process.exit(1);
  }
  if (/mongodb\.net/i.test(uri)) {
    console.error(
      '[mongo-restore-local] Refusing *.mongodb.net — this script restores *local* mongo only.'
    );
    process.exit(1);
  }
}

function firstEnvMongoLine(raw: string | undefined): string {
  const one = stripBomQuotes(raw ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')[0]
    ?.trim();
  return one ?? '';
}

/**
 * mongorestore applies default DB from `/dbname` like a `--db` hint on archives; stripping it
 * avoids deprecated `--db`/namespace filtering quirks and restores all namespaces in the archive.
 */
function mongoRestoreUriSansDefaultDb(uri: string): string {
  const qIdx = uri.indexOf('?');
  const query = qIdx === -1 ? '' : uri.slice(qIdx);
  const beforeQuery = qIdx === -1 ? uri : uri.slice(0, qIdx);
  const PROTO = 'mongodb://';
  if (!beforeQuery.startsWith(PROTO)) return uri;

  const pathStart = beforeQuery.indexOf('/', PROTO.length);
  if (pathStart === -1) return uri;

  const hostAuthPort = beforeQuery.slice(0, pathStart);
  return query ? `${hostAuthPort}/${query}` : `${hostAuthPort}/`;
}

async function localMongoVersionString(connectionUri: string): Promise<string | undefined> {
  const conn = mongoose.createConnection(connectionUri, {
    serverSelectionTimeoutMS: 8_000,
  });
  try {
    await conn.asPromise();
    const raw = await conn.db!.admin().command({ buildInfo: 1 });
    return typeof raw.version === 'string' ? raw.version : undefined;
  } catch (e) {
    console.warn(
      '[mongo-restore-local] Could not read local MongoDB version:',
      (e as Error).message
    );
    return undefined;
  } finally {
    await conn.close().catch(() => undefined);
  }
}

/**
 * Prefer local MongoDB whose major matches typical Atlas tiers (often 8.x for new clusters today).
 * Uses driver `buildInfo` (no `mongosh` required).
 */
async function assertLocalMongoVersionForAtlasDump(
  connectionUri: string
): Promise<void> {
  if (process.env.MONGO_RESTORE_SKIP_VERSION_GUARD === '1') return;

  const minMajorRaw = process.env.MONGO_RESTORE_MIN_LOCAL_MAJOR ?? '8';
  const minMajor = Number.parseInt(minMajorRaw, 10);
  if (!Number.isFinite(minMajor) || minMajor < 1) {
    console.error('[mongo-restore-local] Invalid MONGO_RESTORE_MIN_LOCAL_MAJOR.');
    process.exit(1);
  }

  const version = await localMongoVersionString(connectionUri);
  if (!version) {
    console.warn(
      '[mongo-restore-local] Skipping version guard (could not read server). If restore restores 0 documents, use Docker `mongo:8.0`.'
    );
    return;
  }

  const major = Number.parseInt(/^(\d+)/.exec(version)?.[1] ?? '', 10);
  if (!Number.isFinite(major) || major >= minMajor) return;

  console.error(
    `[mongo-restore-local] Local MongoDB is ${version} (${major}.x), but restores from typical Atlas dumps ` +
      `need at least MongoDB ${minMajor}.x (mongorestore will often restore zero documents).\n` +
      'Fix: recreate local Docker as `mongo:8.0`. Or set `MONGO_RESTORE_SKIP_VERSION_GUARD=1` only if you mean it.'
  );
  process.exit(1);
}

function assertMongorestoreRestoredDocuments(
  stdout: string,
  stderr: string,
  status: number | null
): void {
  if (status !== 0) return;
  if (process.env.MONGO_RESTORE_ALLOW_ZERO_DOCS === '1') return;

  const combined = `${stdout}\n${stderr}`;
  const restored = /(\d+)\s+document\(s\)\s+restored\s+successfully/i.exec(
    combined
  );
  if (!restored || restored[1] !== '0') return;

  console.error(
    '[mongo-restore-local] mongorestore reported 0 documents restored. ' +
      'Your dump is almost certainly from a newer MongoDB (e.g. Atlas 8.x) than this local server — use Docker `mongo:8.0`, ' +
      'or set `MONGO_RESTORE_ALLOW_ZERO_DOCS=1` only for intentionally empty archives.'
  );
  process.exit(1);
}

async function main(): Promise<void> {
  loadWorkspaceEnv();

  const scriptArgs = process.argv.slice(2);
  const cliArchive = parseArchiveArg(scriptArgs);
  const archive = cliArchive
    ? path.resolve(cliArchive)
    : latestBackupGz(process.cwd());

  if (!archive || !fs.existsSync(archive)) {
    console.error(
      '[mongo-restore-local] Backup archive missing. Run `npm run mongo:dump:prod`, or pass --archive=path/to/file.gz.'
    );
    process.exit(1);
  }

  const localUri =
    firstEnvMongoLine(process.env.MONGODB_URI_LOCAL) ||
    firstEnvMongoLine(process.env.MONGODB_URI);
  if (!localUri) {
    console.error(
      '[mongo-restore-local] Set MONGODB_URI to your local MongoDB URL, or use MONGODB_URI_LOCAL when MONGODB_URI points elsewhere.'
    );
    process.exit(1);
  }

  assertRestoreTargetUri(localUri);

  await assertLocalMongoVersionForAtlasDump(localUri);

  const restoreUri = mongoRestoreUriSansDefaultDb(localUri);

  const noDrop = scriptArgs.includes('--no-drop');

  console.info(
    '[mongo-restore-local] Restore target:',
    localUri.replace(/:[^:@/]+(?=@)/, ':****')
  );
  console.info(
    '[mongo-restore-local] Mongorestore URI:',
    restoreUri.replace(/:[^:@/]+(?=@)/, ':****')
  );
  console.info('[mongo-restore-local] Archive:', archive);
  console.info(
    noDrop
      ? '[mongo-restore-local] Mode: merge (no --drop)'
      : '[mongo-restore-local] Mode: replace (--drop collections)'
  );

  const nsRemapRaw = process.env.MONGO_RESTORE_NS_REMAP?.trim();
  const nsRemapMatch = nsRemapRaw
    ? /^([a-zA-Z0-9_.-]+):([a-zA-Z0-9_.-]+)$/.exec(nsRemapRaw)
    : null;

  if (nsRemapRaw && !nsRemapMatch) {
    console.error(
      '[mongo-restore-local] MONGO_RESTORE_NS_REMAP must be SOURCE_DB:TARGET_DB (one colon, names use letters, digits, ._- only).'
    );
    process.exit(1);
  }

  const args: string[] = [
    `--uri=${restoreUri}`,
    '--gzip',
    `--archive=${archive}`,
  ];

  if (nsRemapMatch) {
    console.info(
      `[mongo-restore-local] Namespace remap ${nsRemapMatch[1]}.* → ${nsRemapMatch[2]}.*`
    );
    args.push(
      '--nsFrom',
      `${nsRemapMatch[1]}.*`,
      '--nsTo',
      `${nsRemapMatch[2]}.*`
    );
  }

  if (!noDrop) args.push('--drop');

  const result = spawnSync('mongorestore', args, {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
    env: process.env,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error) {
    const code = (result.error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      console.error(
        '`mongorestore` not found. Install MongoDB Database Tools (e.g. brew install mongodb-database-tools).'
      );
    } else {
      console.error(result.error);
    }
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  assertMongorestoreRestoredDocuments(
    result.stdout ?? '',
    result.stderr ?? '',
    result.status
  );

  console.info('[mongo-restore-local] Done.');
}

void main().catch((err) => {
  console.error('[mongo-restore-local] Failed:', err);
  process.exit(1);
});
