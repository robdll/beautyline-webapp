import type { CourseType } from '@/lib/course-types';
import Course from '@/models/Course';

export type CatalogCourseSeed = {
  name: string;
  description: string;
  cost: number;
  level: string;
  type: CourseType;
};

/**
 * Catalogo corsi unghie — date e immagini vanno aggiunte da admin.
 * Inserimento idempotente per nome (vedi insertCatalogCoursesIfMissing).
 */
export const CATALOG_COURSE_SEED_DATA: CatalogCourseSeed[] = [
  {
    name: 'PERCORSO GEL',
    description:
      'Un percorso completo, pensato per chi parte da zero.',
    cost: 699,
    level: 'Base',
    type: 'unghie',
  },
  {
    name: 'PERFEZIONAMENTO GEL',
    description:
      'Scopri le tecniche più evolute per realizzare muretti perfetti e french ad incastro.',
    cost: 150,
    level: 'Avanzato',
    type: 'unghie',
  },
  {
    name: 'FRESA & REFILL',
    description: 'Impara a usare la fresa in modo sicuro, preciso e veloce.',
    cost: 150,
    level: 'Intermedio',
    type: 'unghie',
  },
  {
    name: 'DUAL FORM ADVANCED',
    description:
      'Ottieni risultati impeccabili in metà tempo e realizza le 5 forme più richieste.',
    cost: 180,
    level: 'Avanzato',
    type: 'unghie',
  },
  {
    name: 'SOAK OFF EVOLUTION',
    description:
      "Con il corso Soak Off Evolution impari a far durare il colore, a rispettare l'unghia naturale e a valorizzare ogni dettaglio.",
    cost: 399,
    level: 'Avanzato',
    type: 'unghie',
  },
  {
    name: 'PEDICURE',
    description: 'Un corso completo dedicato alla cura e al benessere dei piedi.',
    cost: 180,
    level: 'Base',
    type: 'unghie',
  },
  {
    name: 'RUSSIAN ALMOND FANTASY',
    description:
      'Scopri come realizzare una mandorla russa perfetta, impreziosita da un french scintillante.',
    cost: 180,
    level: 'Avanzato',
    type: 'unghie',
  },
  {
    name: 'CORSO BASE GEL',
    description:
      'Questo è il corso pensato per chi parte da zero e vuole imparare davvero.',
    cost: 399,
    level: 'Base',
    type: 'unghie',
  },
  {
    name: 'DUAL FORM 1° LIVELLO',
    description:
      'Scopri le tecniche per creare unghie resistenti e modellate usando Dual Form.',
    cost: 180,
    level: 'Base',
    type: 'unghie',
  },
  {
    name: 'FAST SALOON NAIL ART',
    description:
      'Tecniche per velocizzare il lavoro da salone e ottimizzare i tempi.',
    cost: 69,
    level: 'Intermedio',
    type: 'unghie',
  },
  {
    name: 'FOCUS BABY BOOMER',
    description:
      'Impara a realizzare un Babyboomer perfetto con tecniche moderne e versatili.',
    cost: 89,
    level: 'Intermedio',
    type: 'unghie',
  },
];

const PLACEHOLDER_DURATION = 'Da definire';

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
      level: def.level,
      name: def.name,
      description: def.description,
      duration: PLACEHOLDER_DURATION,
      cost: def.cost,
      media: [],
      startDate: null,
    });
    inserted += 1;
  }

  return { inserted, skipped };
}
