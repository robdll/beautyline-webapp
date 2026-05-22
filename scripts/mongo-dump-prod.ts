import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { loadWorkspaceEnv } from './lib/load-env';
import { mongodbUriPathDatabase } from './lib/mongodb-uri-path-db';

/**
 * Writes a gzipped mongodump archive under ./mongo-backups/
 *
 * Env: MONGODB_URI_PROD (preferred) or MONGODB_URI — must not be localhost.
 * For Atlas, use mongodb+srv://… from Connect → Drivers (plain mongodb:// to *.mongodb.net often fails DNS).
 *
 * Requires `mongodump` on PATH (e.g. brew install mongodb-database-tools).
 *
 * Database target:
 *   • Explicit `--full-cluster`.
 *   • Or `--db=NAME` / `-d=NAME`.
 *   • Else the `/DATABASE` segment in the URI, if present.
 *   • If the URI omits `/DATABASE`, mongodumps all databases your Atlas user may read after a warning.
 *
 * Fails fast if the archive is suspiciously small (wrong `--db` often yields ~100‑byte gzips).
 */

loadWorkspaceEnv();

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

/** Supports `--db=name`, `-d=name`, `--db name`, `-d name` after the script path. */
function parseDbFromArgv(scriptArgs: readonly string[]): string | undefined {
  for (let i = 0; i < scriptArgs.length; i += 1) {
    const a = scriptArgs[i];
    if (a === '--' || !a.startsWith('-')) continue;
    const eqDb = /^--db=(.*)$/.exec(a) ?? /^-d=(.*)$/.exec(a);
    if (eqDb?.[1] !== undefined) {
      const v = eqDb[1].trim();
      if (!v) {
        console.error('Empty database name (-d / --db).');
        process.exit(1);
      }
      return v;
    }
    if (a === '--db' || a === '-d') {
      const v = scriptArgs[i + 1]?.trim();
      if (!v || v.startsWith('-')) {
        console.error(`${a} requires a database name.`);
        process.exit(1);
      }
      return v;
    }
  }
  return undefined;
}

const uriRaw =
  stripBomQuotes(process.env.MONGODB_URI_PROD ?? '') ||
  stripBomQuotes(process.env.MONGODB_URI ?? '');
const uri = uriRaw.replace(/\r\n/g, '\n').split('\n')[0]?.trim() ?? '';
if (!uri) {
  console.error(
    'Set MONGODB_URI_PROD (or MONGODB_URI) with your production Atlas URI.'
  );
  process.exit(1);
}

if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
  console.error(
    'Mongo URI must begin with mongodb:// or mongodb+srv:// (check .env quoting / BOM).'
  );
  process.exit(1);
}

/** Atlas SRV hostname + mongodb:// (no srv) ⇒ DNS often fails (“no such host”). */
function assertAtlasUsesSrv(uri: string): void {
  if (/^mongodb\+srv:/i.test(uri)) return;

  const atPos = uri.indexOf('@');
  if (atPos === -1) return;

  const afterAt = uri.slice(atPos + 1);
  const slash = afterAt.indexOf('/');
  const q = afterAt.indexOf('?');
  let end = afterAt.length;
  if (slash !== -1) end = Math.min(end, slash);
  if (q !== -1) end = Math.min(end, q);
  const hostlist = afterAt.slice(0, end).trim();

  if (hostlist.includes(',')) return;

  const first = hostlist.split(',')[0]?.replace(/:\d+$/, '').trim().toLowerCase();
  if (!first || !first.endsWith('.mongodb.net')) return;

  console.error(
    `[mongo-dump-prod] This URI uses mongodb:// with hostname "${first}".\n` +
      'Atlas clusters almost always require mongodb+srv://… (MongoDB Atlas → Cluster → Connect → Drivers).\n' +
      'Plain mongodb:// to *.mongodb.net often fails DNS (“no such host”).'
  );
  process.exit(1);
}

assertAtlasUsesSrv(uri);

if (/mongodb:\/\/(localhost|127\.0\.0\.1)|mongodb\+srv:\/\/[^/@]*@(localhost|127)/i.test(uri)) {
  console.error('Refusing: connection string targets localhost.');
  process.exit(1);
}

const argv = process.argv.slice(2);
const fullCluster = argv.includes('--full-cluster');
const cliDb = parseDbFromArgv(argv);

let db: string | undefined;
if (fullCluster) {
  if (cliDb) {
    console.warn(
      '[mongo-dump-prod] --full-cluster: ignoring --db / -d (dumping all databases your user can read).'
    );
  }
  db = undefined;
} else {
  db = cliDb ?? mongodbUriPathDatabase(uri);
  if (!db) {
    console.warn(
      '[mongo-dump-prod] URI has no /DATABASE path and `--db` was not passed — dumping every database your Atlas user may read (can be large). Add /DATABASE before `?` in the URI or pass `--db=…` or `--full-cluster` explicitly.'
    );
  }
}

const outDir = path.join(process.cwd(), 'mongo-backups');
fs.mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveSlug = fullCluster ? 'cluster' : db ?? 'all-databases';
const archive = path.join(outDir, `prod-${stamp}-${archiveSlug}.gz`);

// Use `--flag=value` so the database name is never parsed as a stray positional URI.
const args: string[] = [`--uri=${uri}`];
if (db) args.push(`--db=${db}`);
args.push('--gzip', `--archive=${archive}`);

const result = spawnSync('mongodump', args, {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  const code = (result.error as NodeJS.ErrnoException).code;
  if (code === 'ENOENT') {
    console.error(
      '`mongodump` not found. Install MongoDB Database Tools (e.g. brew install mongodb-database-tools).'
    );
  } else {
    console.error(result.error);
  }
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const bytes = fs.statSync(archive).size;
const minBytes = Number.parseInt(
  process.env.MONGO_DUMP_MIN_ARCHIVE_BYTES ?? '4096',
  10
);
if (Number.isFinite(minBytes) && minBytes > 0 && bytes < minBytes) {
  console.error(
    `[mongo-dump-prod] Archive is only ${bytes} bytes (min ${minBytes}); likely wrong DB name vs Atlas or empty collections. Adjust URI path / --db or set MONGO_DUMP_MIN_ARCHIVE_BYTES=0 to skip this check.`
  );
  process.exit(1);
}

console.info(`Wrote ${archive} (${bytes} bytes)`);
