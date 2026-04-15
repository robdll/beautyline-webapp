const LOCALE = 'it-IT';

/** Uppercase title for public catalog pages (courses, services, equipment). */
export function displayPublicTitle(text: string): string {
  return text.trim().toLocaleUpperCase(LOCALE);
}

/**
 * Single-block description: first character uppercase, all others lowercase.
 * Trims surrounding whitespace; preserves inner spacing and newlines.
 */
export function displayPublicDescription(text: string): string {
  const s = text.trim();
  if (!s) return s;
  return s.charAt(0).toLocaleUpperCase(LOCALE) + s.slice(1).toLocaleLowerCase(LOCALE);
}
