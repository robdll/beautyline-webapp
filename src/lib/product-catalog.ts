import { PRODUCT_BRANDS } from '@/lib/product-brands';

/** Query string keys condivisi con `/api/products`. */
export const PRODUCT_CATALOG_URL_PARAMS = {
  catalogo: ['catalogo', 'shop'] as const,
  marca: ['marca', 'brand'] as const,
  linea: ['linea', 'sottocategoria', 'tipo'] as const,
};

export function readCatalogoParam(sp: URLSearchParams): boolean {
  for (const key of PRODUCT_CATALOG_URL_PARAMS.catalogo) {
    const v = sp.get(key)?.trim().toLowerCase();
    if (v === '1' || v === 'true' || v === 'si' || v === 'yes') return true;
  }
  return false;
}

export function readMarcaSlug(sp: URLSearchParams): string | null {
  for (const key of PRODUCT_CATALOG_URL_PARAMS.marca) {
    const v = sp.get(key)?.trim().toLowerCase();
    if (v) return v;
  }
  return null;
}

export function readLineaSlug(sp: URLSearchParams): string | null {
  for (const key of PRODUCT_CATALOG_URL_PARAMS.linea) {
    const v = sp.get(key)?.trim().toLowerCase();
    if (v) return v;
  }
  return null;
}

export function findBrandBySlug(slug: string) {
  return PRODUCT_BRANDS.find((b) => b.id === slug) ?? null;
}

export function findLineaBySlug(lineaSlug: string): {
  brandSlug: string;
  brandTitle: string;
  lineaSlug: string;
  /** Valore da confrontare con il campo `type` in MongoDB (titolo sottocategoria). */
  dbType: string;
} | null {
  for (const b of PRODUCT_BRANDS) {
    const sub = b.subcategories.find((s) => s.id === lineaSlug);
    if (sub) {
      return {
        brandSlug: b.id,
        brandTitle: b.title,
        lineaSlug: sub.id,
        dbType: sub.title,
      };
    }
  }
  return null;
}

export function lineeForBrandSlug(brandSlug: string) {
  const b = findBrandBySlug(brandSlug);
  return b?.subcategories ?? [];
}

export function shouldOpenProductCatalog(sp: URLSearchParams): boolean {
  return readCatalogoParam(sp) || readMarcaSlug(sp) !== null || readLineaSlug(sp) !== null;
}
