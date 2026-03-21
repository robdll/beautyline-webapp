export type PublicProductJson = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  brand: string;
  type: string;
};

const PLACEHOLDER = 'https://placehold.co/300x300.png';

export function serializePublicProduct(doc: {
  _id: { toString(): string };
  name: string;
  description: string;
  cost: number;
  media?: string[];
  brand: string;
  type: string;
}): PublicProductJson {
  const media = doc.media?.find((u) => typeof u === 'string' && u.trim().length > 0);
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: `€ ${doc.cost.toFixed(2)}`,
    image: media?.trim() || PLACEHOLDER,
    brand: doc.brand,
    type: doc.type,
  };
}
