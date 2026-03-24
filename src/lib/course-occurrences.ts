type RawOccurrence = {
  startDate?: unknown;
  endDate?: unknown;
};

export type CourseOccurrence = {
  startDate: Date;
  endDate: Date;
};

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daySpanInclusive(start: Date, end: Date): number {
  const msInDay = 24 * 60 * 60 * 1000;
  return Math.round((normalizeDateOnly(end).getTime() - normalizeDateOnly(start).getTime()) / msInDay) + 1;
}

export function parseOccurrences(value: unknown): CourseOccurrence[] | null {
  if (!Array.isArray(value) || value.length === 0) return [];
  const parsed: CourseOccurrence[] = [];
  for (const raw of value as RawOccurrence[]) {
    const start = parseDate(raw?.startDate);
    const end = parseDate(raw?.endDate);
    if (!start || !end) return null;
    if (normalizeDateOnly(end).getTime() < normalizeDateOnly(start).getTime()) return null;
    parsed.push({ startDate: start, endDate: end });
  }
  return parsed.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function validateOccurrencesShape(occurrences: CourseOccurrence[]): string | null {
  if (occurrences.length === 0) return null;

  const firstSpan = daySpanInclusive(occurrences[0].startDate, occurrences[0].endDate);
  for (const occ of occurrences) {
    if (daySpanInclusive(occ.startDate, occ.endDate) !== firstSpan) {
      return 'Le occorrenze devono avere tutte la stessa durata in giorni.';
    }
  }
  return null;
}

export function sanitizeProgramSections(value: unknown): string[] {
  if (!Array.isArray(value)) return ['', '', ''];
  const items = value
    .filter((entry): entry is string => typeof entry === 'string')
    .slice(0, 3)
    .map((entry) => entry.trim());
  while (items.length < 3) {
    items.push('');
  }
  return items;
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(start);
  }

  const startFmt = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
  }).format(start);
  const endFmt = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(end);
  return `${startFmt} - ${endFmt}`;
}
