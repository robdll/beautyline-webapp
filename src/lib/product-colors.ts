/** Raw color payload from admin API / forms. */
export type ProductColorInput = { name?: unknown; hex?: unknown; imageUrl?: unknown };

export type NormalizedProductColor = { name: string; hex: string; imageUrl?: string };

export function normalizeMediaUrls(media: unknown): string[] {
  if (!Array.isArray(media)) return [];
  return media
    .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    .map((u) => u.trim());
}

/**
 * Keeps only color image URLs that exist in the product `media` list.
 */
export function normalizeAvailableColors(
  availableColors: unknown,
  mediaUrls: string[]
): NormalizedProductColor[] {
  const mediaSet = new Set(mediaUrls);
  if (!Array.isArray(availableColors)) return [];

  const out: NormalizedProductColor[] = [];
  for (const item of availableColors) {
    if (!item || typeof item !== 'object') continue;
    const c = item as ProductColorInput;
    if (c.name == null || c.hex == null) continue;
    const name = String(c.name).trim();
    const hex = String(c.hex).trim();
    if (!name || !hex) continue;

    let imageUrl: string | undefined;
    if (typeof c.imageUrl === 'string' && c.imageUrl.trim()) {
      const trimmed = c.imageUrl.trim();
      if (mediaSet.has(trimmed)) imageUrl = trimmed;
    }
    out.push(imageUrl ? { name, hex, imageUrl } : { name, hex });
  }
  return out;
}
