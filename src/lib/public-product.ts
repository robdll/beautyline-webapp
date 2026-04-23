export type PublicColorOption = {
  name: string;
  hex: string;
  /** URL presente in `media` per questa variante; `null` = usa l’immagine predefinita del prodotto. */
  imageUrl: string | null;
};

export type PublicVariant = {
  cost: number;
  unit: string;
  value: number;
  /** Etichetta pronta da mostrare, es. "50 ml". */
  label: string;
  /** Prezzo formattato, es. "€ 12.50". */
  price: string;
};

export type PublicProductJson = {
  id: string;
  name: string;
  description: string;
  /** Prezzo della prima variante quando presenti, altrimenti del prodotto. */
  price: string;
  image: string;
  brand: string;
  type: string;
  availableColors: PublicColorOption[];
  variants: PublicVariant[];
};

const PLACEHOLDER = 'https://placehold.co/300x300.png';

type ColorDoc = { name?: string; hex?: string; imageUrl?: string };
type VariantDoc = { cost?: number; unit?: string; value?: number };

function formatVariantValue(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function formatPrice(amount: number): string {
  return `€ ${amount.toFixed(2)}`;
}

export function serializePublicProduct(doc: {
  _id: { toString(): string };
  name: string;
  description: string;
  cost: number;
  media?: string[];
  brand: string;
  type: string;
  availableColors?: ColorDoc[];
  variants?: VariantDoc[];
}): PublicProductJson {
  const mediaUrls = (doc.media ?? [])
    .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    .map((u) => u.trim());
  const mediaSet = new Set(mediaUrls);
  const first = mediaUrls[0];
  const defaultImage = first || PLACEHOLDER;

  const availableColors: PublicColorOption[] = Array.isArray(doc.availableColors)
    ? doc.availableColors
        .map((c) => {
          if (!c || typeof c.name !== 'string' || typeof c.hex !== 'string') return null;
          const name = c.name.trim();
          const hex = c.hex.trim();
          if (!name || !hex) return null;
          let imageUrl: string | null = null;
          if (typeof c.imageUrl === 'string') {
            const u = c.imageUrl.trim();
            if (u && mediaSet.has(u)) imageUrl = u;
          }
          return { name, hex, imageUrl };
        })
        .filter((x): x is PublicColorOption => x != null)
    : [];

  const variants: PublicVariant[] = Array.isArray(doc.variants)
    ? doc.variants
        .map((v) => {
          if (!v || typeof v !== 'object') return null;
          const cost = typeof v.cost === 'number' ? v.cost : Number(v.cost);
          const value = typeof v.value === 'number' ? v.value : Number(v.value);
          const unit = typeof v.unit === 'string' ? v.unit.trim() : '';
          if (!isFinite(cost) || cost < 0) return null;
          if (!isFinite(value) || value < 0) return null;
          if (!unit) return null;
          return {
            cost,
            unit,
            value,
            label: `${formatVariantValue(value)} ${unit}`,
            price: formatPrice(cost),
          };
        })
        .filter((v): v is PublicVariant => v != null)
    : [];

  const displayPrice = variants.length > 0 ? variants[0].price : formatPrice(doc.cost);

  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: displayPrice,
    image: defaultImage,
    brand: doc.brand,
    type: doc.type,
    availableColors,
    variants,
  };
}
