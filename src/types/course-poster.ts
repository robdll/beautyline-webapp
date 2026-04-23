/**
 * Locandina di un corso mensile.
 * Usata sia per l'API admin (CRUD) che per la UI pubblica.
 */
export interface CoursePoster {
  _id: string;
  image: string;
  /** 1-12 (gennaio = 1) */
  month: number;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Etichetta "Mese Anno" in italiano (es. "Gennaio 2026"). */
export function formatPosterPeriod(month: number, year: number): string {
  const months = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ];
  const safeMonth = Math.min(Math.max(Math.trunc(month), 1), 12);
  return `${months[safeMonth - 1]} ${year}`;
}
