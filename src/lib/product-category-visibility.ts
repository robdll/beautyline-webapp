import { PRODUCT_BRANDS } from '@/lib/product-brands';

/** Chiave univoca: `{brandId}:{subcategoryId}` (slug). */
export function makeProductCategoryKey(brandId: string, subcategoryId: string): string {
  return `${brandId}:${subcategoryId}`;
}

export function listValidProductCategoryKeys(): string[] {
  return PRODUCT_BRANDS.flatMap((b) => b.subcategories.map((s) => makeProductCategoryKey(b.id, s.id)));
}

const validKeySet = new Set(listValidProductCategoryKeys());

export function isValidProductCategoryKey(key: string): boolean {
  return validKeySet.has(key);
}

/** Normalizza e filtra solo chiavi note al catalogo. */
export function sanitizeDisabledCategoryKeys(keys: unknown): string[] {
  if (!Array.isArray(keys)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const k of keys) {
    if (typeof k !== 'string') continue;
    const t = k.trim();
    if (!t || !isValidProductCategoryKey(t) || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

export function isCategoryKeyDisabled(
  brandSlug: string | null | undefined,
  lineaSlug: string | null | undefined,
  disabled: ReadonlySet<string>
): boolean {
  if (!brandSlug || !lineaSlug) return false;
  return disabled.has(makeProductCategoryKey(brandSlug, lineaSlug));
}

/** Mappa prodotto DB (titoli) → chiave slug; `null` se non riconosciuto. */
export function categoryKeyForProductTitles(brandTitle: string, typeTitle: string): string | null {
  const bt = brandTitle.trim().toLowerCase();
  const tt = typeTitle.trim().toLowerCase();
  for (const b of PRODUCT_BRANDS) {
    if (b.title.toLowerCase() !== bt) continue;
    const sub = b.subcategories.find((s) => s.title.toLowerCase() === tt);
    if (sub) return makeProductCategoryKey(b.id, sub.id);
  }
  return null;
}

export function isProductHiddenByCategoryRules(
  brandTitle: string,
  typeTitle: string,
  disabled: ReadonlySet<string>
): boolean {
  const key = categoryKeyForProductTitles(brandTitle, typeTitle);
  if (!key) return false;
  return disabled.has(key);
}
