import type mongoose from 'mongoose';
import { daySpanInclusive } from '@/lib/course-occurrences';
import { normalizePercorsoItems, sameCalendarDay } from '@/lib/percorso-input';
import Course from '@/models/Course';

export interface ResolvedPercorsoItem {
  course: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}

export type ResolvePercorsoItemsResult =
  | { ok: true; items: ResolvedPercorsoItem[] }
  | { ok: false; error: string };

/**
 * Valida le voci di un percorso e le collega alle erogazioni dei corsi.
 * Se una data non è ancora presente tra le erogazioni del corso, viene aggiunta
 * al corso (rispettando il vincolo di durata uniforme delle erogazioni).
 * Non rimuove mai erogazioni esistenti dai corsi.
 */
export async function resolvePercorsoItems(value: unknown): Promise<ResolvePercorsoItemsResult> {
  const items = normalizePercorsoItems(value);
  if (items === null) {
    return { ok: false, error: 'Voci del percorso non valide: controlla corsi e date selezionati.' };
  }
  if (items.length === 0) {
    return { ok: false, error: 'Seleziona almeno un corso (con la relativa data) per il percorso.' };
  }

  const resolved: ResolvedPercorsoItem[] = [];

  for (const item of items) {
    const course = await Course.findById(item.courseId);
    if (!course) {
      return {
        ok: false,
        error: 'Uno o più corsi selezionati non esistono più. Aggiorna la selezione.',
      };
    }

    const exists = course.occurrences.some(
      (o) =>
        sameCalendarDay(new Date(o.startDate), item.startDate) &&
        sameCalendarDay(new Date(o.endDate), item.endDate)
    );

    if (!exists) {
      if (course.occurrences.length > 0) {
        const existingSpan = daySpanInclusive(
          new Date(course.occurrences[0].startDate),
          new Date(course.occurrences[0].endDate)
        );
        const newSpan = daySpanInclusive(item.startDate, item.endDate);
        if (newSpan !== existingSpan) {
          return {
            ok: false,
            error: `Il corso "${course.name}" prevede erogazioni di ${existingSpan} ${
              existingSpan === 1 ? 'giorno' : 'giorni'
            }: la data selezionata deve avere la stessa durata.`,
          };
        }
      }
      course.occurrences.push({ startDate: item.startDate, endDate: item.endDate, soldOut: false });
      await course.save();
    }

    resolved.push({
      course: course._id as mongoose.Types.ObjectId,
      startDate: item.startDate,
      endDate: item.endDate,
    });
  }

  return { ok: true, items: resolved };
}
