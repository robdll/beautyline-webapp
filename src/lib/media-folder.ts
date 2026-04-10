/** Safe folder prefix for Cloudinary list/upload (no traversal). */
export function isValidCloudinaryFolderPrefix(folder: string): boolean {
  const t = folder.trim();
  if (t.length === 0 || t.length > 180) return false;
  if (t.includes('..') || t.startsWith('/') || t.endsWith('/')) return false;
  return /^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(t);
}
