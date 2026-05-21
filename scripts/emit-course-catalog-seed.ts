import mongoose from 'mongoose';
import { loadWorkspaceEnv } from './lib/load-env';
import { explainMongoSrvDnsFailure } from './lib/mongo-connect-hints';

/**
 * Prints a TypeScript fragment you can paste into `CATALOG_COURSE_SEED_DATA` in
 * `src/lib/course-catalog-seed.ts` after pulling real rows from prod (or any DB).
 *
 * Env:
 *   MONGODB_URI_PROD — optional; falls back to MONGODB_URI
 *
 * Reads `courses` directly (raw collection) so soft-delete middleware does not hide documents.
 * Only includes courses with type: unghie | occhi and deletedAt null.
 *
 * Usage: npm run seed:emit:catalog-ts
 */

type LeanCourse = {
  name: string;
  description: string;
  cost: number;
  type: string;
  media?: string[];
  occurrences?: { startDate?: Date; endDate?: Date; soldOut?: boolean }[];
  programSections?: string[];
  deletedAt?: Date | null;
};

function escapeTsString(s: string): string {
  return JSON.stringify(s);
}

function fmtDate(d: Date): string {
  return `new Date(${JSON.stringify(d.toISOString())})`;
}

function emitCourse(course: LeanCourse): string {
  const occs = Array.isArray(course.occurrences) ? course.occurrences : [];
  const occLines = occs
    .map((o) => {
      const sd = o.startDate ? new Date(o.startDate) : null;
      const ed = o.endDate ? new Date(o.endDate) : null;
      if (!sd || !ed || Number.isNaN(sd.getTime()) || Number.isNaN(ed.getTime())) {
        return null;
      }
      const sold =
        o.soldOut === true ? 'soldOut: true' : o.soldOut === false ? 'soldOut: false' : '';
      const soldPart = sold ? `, ${sold}` : '';
      return `      { startDate: ${fmtDate(sd)}, endDate: ${fmtDate(ed)}${soldPart} },`;
    })
    .filter(Boolean) as string[];
  const occurrencesStr =
    occLines.length === 0 ? '[]' : `[\n${occLines.join('\n')}\n    ]`;

  const sections = Array.isArray(course.programSections) ? course.programSections : [];
  const programSectionsStr = `[${sections.map((x) => escapeTsString(String(x))).join(', ')}]`;

  return `  {
    name: ${escapeTsString(course.name)},
    description: ${escapeTsString(course.description)},
    cost: ${course.cost},
    type: ${escapeTsString(course.type)},
    occurrences: ${occurrencesStr},
    programSections: ${programSectionsStr},
  }`;
}

async function run(): Promise<void> {
  loadWorkspaceEnv();

  const uri = process.env.MONGODB_URI_PROD || process.env.MONGODB_URI;
  if (!uri) {
    console.error('[emit-course-catalog-seed] Set MONGODB_URI_PROD or MONGODB_URI.');
    process.exit(1);
  }

  const conn = await mongoose.createConnection(uri).asPromise();
  try {
    const col = conn.db!.collection('courses');
    const exists = (await conn.db!.listCollections({ name: 'courses' }).toArray()).length > 0;
    if (!exists) {
      console.error('[emit-course-catalog-seed] Collection "courses" not found.');
      process.exit(1);
    }

    const rows = (await col
      .find({
        type: { $in: ['unghie', 'occhi'] },
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      })
      .sort({ type: 1, name: 1 })
      .toArray()) as unknown as LeanCourse[];

    if (rows.length === 0) {
      console.error('[emit-course-catalog-seed] No matching courses.');
      process.exit(1);
    }

    const body = rows.map((c) => emitCourse(c)).join(',\n');

    console.info('// Paste into CATALOG_COURSE_SEED_DATA in src/lib/course-catalog-seed.ts\n');
    console.info(body);
  } finally {
    await conn.close();
  }
}

run().catch((error) => {
  console.error('[emit-course-catalog-seed] Failed:', error);
  explainMongoSrvDnsFailure('emit-course-catalog-seed', error);
  process.exit(1);
});
