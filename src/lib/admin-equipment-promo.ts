/** Serializza un pacchetto promo (doc/lean) nella forma usata dalle API admin. */
export function serializePromoPackage(doc: {
  _id: unknown;
  name: string;
  description: string;
  details?: unknown;
  annualPrice: number;
  badge?: unknown;
  media?: unknown;
  equipmentIds?: unknown;
}) {
  return {
    ...doc,
    _id: String(doc._id),
    details: typeof doc.details === 'string' ? doc.details : '',
    badge: typeof doc.badge === 'string' ? doc.badge : '',
    media: Array.isArray(doc.media) ? doc.media : [],
    equipmentIds: Array.isArray(doc.equipmentIds) ? doc.equipmentIds.map((id) => String(id)) : [],
  };
}
