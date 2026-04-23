/** Raw variant payload from admin API / forms. */
export type ProductVariantInput = {
  cost?: unknown;
  unit?: unknown;
  value?: unknown;
};

export type NormalizedProductVariant = {
  cost: number;
  unit: string;
  value: number;
};

/**
 * Normalizes the variants array coming from the client.
 * Discards entries with missing or invalid fields.
 */
export function normalizeProductVariants(variants: unknown): NormalizedProductVariant[] {
  if (!Array.isArray(variants)) return [];

  const out: NormalizedProductVariant[] = [];
  for (const item of variants) {
    if (!item || typeof item !== 'object') continue;
    const v = item as ProductVariantInput;

    const cost = Number(v.cost);
    const value = Number(v.value);
    const unit = typeof v.unit === 'string' ? v.unit.trim() : '';

    if (!isFinite(cost) || cost < 0) continue;
    if (!isFinite(value) || value < 0) continue;
    if (!unit) continue;

    out.push({ cost, unit, value });
  }
  return out;
}
