import mongoose from 'mongoose';

export interface PercorsoItemInput {
  courseId: string;
  startDate: Date;
  endDate: Date;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Due date coincidono se hanno lo stesso giorno di calendario (ignora l'ora). */
export function sameCalendarDay(a: Date, b: Date): boolean {
  return dateOnly(a).getTime() === dateOnly(b).getTime();
}

/**
 * Normalizza le voci di un percorso: `[{ courseId, startDate, endDate }]`.
 * Scarta voci con id non-ObjectId o date non valide, deduplica per corso
 * (una sola erogazione per corso) mantenendo l'ordine.
 * Ritorna `null` se il valore non è un array o se una voce ha date incoerenti (fine < inizio).
 */
export function normalizePercorsoItems(value: unknown): PercorsoItemInput[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  const result: PercorsoItemInput[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const rawId = (raw as { courseId?: unknown }).courseId;
    if (typeof rawId !== 'string') continue;
    const courseId = rawId.trim();
    if (!mongoose.Types.ObjectId.isValid(courseId)) continue;
    if (seen.has(courseId)) continue;

    const startDate = parseDate((raw as { startDate?: unknown }).startDate);
    const endDate = parseDate((raw as { endDate?: unknown }).endDate);
    if (!startDate || !endDate) return null;
    if (dateOnly(endDate).getTime() < dateOnly(startDate).getTime()) return null;

    seen.add(courseId);
    result.push({ courseId, startDate, endDate });
  }
  return result;
}
