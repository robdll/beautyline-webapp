export type PublicColorOption = {
  name: string;
  hex: string;
  /** URL presente in `media` per questa variante; `null` = usa l’immagine predefinita del prodotto. */
  imageUrl: string | null;
};

export type PublicProductJson = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  brand: string;
  type: string;
  availableColors: PublicColorOption[];
};

const PLACEHOLDER = 'https://placehold.co/300x300.png';

type ColorDoc = { name?: string; hex?: string; imageUrl?: string };

export function serializePublicProduct(doc: {
  _id: { toString(): string };
  name: string;
  description: string;
  cost: number;
  media?: string[];
  brand: string;
  type: string;
  availableColors?: ColorDoc[];
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

  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: `€ ${doc.cost.toFixed(2)}`,
    image: defaultImage,
    brand: doc.brand,
    type: doc.type,
    availableColors,
  };
}
