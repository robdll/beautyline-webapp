/**
 * URL-safe slug from a course title (Italian-friendly: strips accents).
 */
export function slugifyCourseName(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'corso';
}
