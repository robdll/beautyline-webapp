/** First path segment after `mongodb(+srv)://host/` (decoded), if present. */
export function mongodbUriPathDatabase(connectionUri: string): string | undefined {
  const noQuery = connectionUri.split(/[?#]/)[0]?.trim() ?? '';
  const PROTO = /^mongodb(\+srv)?:\/\//i;
  const m = PROTO.exec(noQuery);
  if (!m) return undefined;

  const slash = noQuery.indexOf('/', m[0].length);
  if (slash === -1) return undefined;

  const encoded = noQuery.slice(slash + 1);
  if (!encoded || encoded.includes('/')) return undefined;

  try {
    const decoded = decodeURIComponent(encoded).trim();
    return decoded || undefined;
  } catch {
    const trimmed = encoded.trim();
    return trimmed || undefined;
  }
}
