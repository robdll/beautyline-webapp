import type { CourseType } from '@/lib/course-types';
import Course from '@/models/Course';
import { sanitizeProgramSections } from '@/lib/course-occurrences';

export type CatalogCourseSeed = {
  name: string;
  description: string;
  cost: number;
  type: CourseType;
  occurrences: { startDate: Date; endDate: Date }[];
  programSections: string[];
};

/**
 * Catalogo corsi (unghie e occhi) — date e immagini vanno aggiunte da admin.
 * Inserimento idempotente per nome (vedi insertCatalogCoursesIfMissing).
 */
export const CATALOG_COURSE_SEED_DATA: CatalogCourseSeed[] = [
  {
    name: 'PERCORSO GEL',
    description:
      'Un percorso completo, pensato per chi parte da zero.',
    cost: 699,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'PERFEZIONAMENTO GEL',
    description:
      'Scopri le tecniche più evolute per realizzare muretti perfetti e french ad incastro.',
    cost: 150,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'FRESA & REFILL',
    description: 'Impara a usare la fresa in modo sicuro, preciso e veloce.',
    cost: 150,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'DUAL FORM ADVANCED',
    description:
      'Ottieni risultati impeccabili in metà tempo e realizza le 5 forme più richieste.',
    cost: 180,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'SOAK OFF EVOLUTION',
    description:
      "Con il corso Soak Off Evolution impari a far durare il colore, a rispettare l'unghia naturale e a valorizzare ogni dettaglio.",
    cost: 399,
    type: 'unghie',
    occurrences: [
      { startDate: new Date('2026-04-10'), endDate: new Date('2026-04-12') },
      { startDate: new Date('2026-05-05'), endDate: new Date('2026-05-07') },
    ],
    programSections: ['', '', ''],
  },
  {
    name: 'PEDICURE',
    description: 'Un corso completo dedicato alla cura e al benessere dei piedi.',
    cost: 180,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'RUSSIAN ALMOND FANTASY',
    description:
      'Scopri come realizzare una mandorla russa perfetta, impreziosita da un french scintillante.',
    cost: 180,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'CORSO BASE GEL',
    description:
      'Questo è il corso pensato per chi parte da zero e vuole imparare davvero.',
    cost: 399,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'DUAL FORM 1° LIVELLO',
    description:
      'Scopri le tecniche per creare unghie resistenti e modellate usando Dual Form.',
    cost: 180,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'FAST SALOON NAIL ART',
    description:
      'Tecniche per velocizzare il lavoro da salone e ottimizzare i tempi.',
    cost: 69,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'FOCUS BABY BOOMER',
    description:
      'Impara a realizzare un Babyboomer perfetto con tecniche moderne e versatili.',
    cost: 89,
    type: 'unghie',
    occurrences: [],
    programSections: ['', '', ''],
  },

  // Occhi / lash & brow
  {
    name: 'LAMINAZIONE CIGLIA',
    description:
      'Allunga, incurva e nutre la ciglia naturale. Teoria + pratica guidata e protocolli.',
    cost: 150,
    type: 'occhi',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'LAMINAZIONE CIGLIA E SOPRACCIGLIA COREANA',
    description:
      "Innovazione dall'Asia con cisteammina: risultati naturali, sani e di lunga durata senza colle.",
    cost: 299,
    type: 'occhi',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'EXTENSION CIGLIA ONE TO ONE',
    description: 'Impara da zero la tecnica più richiesta nei centri estetici.',
    cost: 350,
    type: 'occhi',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'EXTENSION 2D - 3D',
    description:
      'Scopri le tecniche avanzate di applicazione delle extension ciglia.',
    cost: 350,
    type: 'occhi',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: 'MASCARA SEMIPERMANENTE',
    description:
      'Effetto mascara 24/7 senza residui. Tecnica, rimozione e ritocchi. Risultato immediato.',
    cost: 50,
    type: 'occhi',
    occurrences: [],
    programSections: ['', '', ''],
  },
  {
    name: "LAMINAZIONE SOPRACCIGLIA E BIO TATTOO CON L'HENNÉ",
    description:
      "Riempie, definisce e ordina l'arcata. Studio della forma e miscelazioni henné.",
    cost: 150,
    type: 'occhi',
    occurrences: [],
    programSections: ['', '', ''],
  },
];

/**
 * Inserisce i corsi del catalogo se non esiste già un corso con lo stesso nome (non soft-deleted).
 */
export async function insertCatalogCoursesIfMissing(): Promise<{
  inserted: number;
  skipped: number;
}> {
  let inserted = 0;
  let skipped = 0;

  for (const def of CATALOG_COURSE_SEED_DATA) {
    const exists = await Course.findOne({ name: def.name });
    if (exists) {
      skipped += 1;
      continue;
    }

    await Course.create({
      type: def.type,
      name: def.name,
      description: def.description,
      cost: def.cost,
      media: [],
      occurrences: def.occurrences,
      programSections: sanitizeProgramSections(def.programSections),
    });
    inserted += 1;
  }

  await normalizeExistingCourses();
  await ensureAllCoursesHaveSlugs();

  return { inserted, skipped };
}

/** Assegna slug ai documenti creati prima dell’introduzione del campo (pre-save). */
export async function ensureAllCoursesHaveSlugs(): Promise<void> {
  const all = await Course.find({});
  for (const doc of all) {
    if (doc.slug && String(doc.slug).length > 0) continue;
    await doc.save();
  }
}

export async function normalizeExistingCourses(): Promise<void> {
  const courses = await Course.find({}).lean();

  for (const course of courses) {
    const legacyStartDate =
      course && typeof (course as { startDate?: unknown }).startDate !== 'undefined'
        ? (course as { startDate?: unknown }).startDate
        : null;

    const legacyOccurrences =
      Array.isArray((course as { occurrences?: unknown }).occurrences)
        ? ((course as { occurrences?: { startDate: Date; endDate: Date }[] }).occurrences ?? [])
        : [];

    const occurrences =
      legacyOccurrences.length > 0
        ? legacyOccurrences
        : legacyStartDate
          ? [{ startDate: new Date(legacyStartDate as string), endDate: new Date(legacyStartDate as string) }]
          : [];

    const programSections = sanitizeProgramSections((course as { programSections?: unknown }).programSections);

    await Course.updateOne(
      { _id: course._id },
      {
        $set: {
          occurrences,
          programSections,
        },
        $unset: {
          level: 1,
          duration: 1,
          startDate: 1,
        },
      }
    );
  }
}
