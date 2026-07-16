import type mongoose from 'mongoose';
import { slugifyCourseName } from '@/lib/course-slug';
import { PROMO_PACKAGE_IMAGE_FALLBACK } from '@/lib/equipment-promo';

/** Forma pubblica di un pacchetto promo attrezzature, pronta per la UI. */
export interface PublicEquipmentPromoJson {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Descrizione estesa (ripiega su `description` se non valorizzata). */
  details: string;
  monthlyPrice: number;
  badge: string | null;
  /** Immagine di copertina (prima media valida o ripiego). */
  image: string;
  /** ID delle attrezzature incluse, nell'ordine. */
  equipmentIds: string[];
}

export interface LeanEquipmentPromoDoc {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  name: string;
  description: string;
  details?: unknown;
  monthlyPrice: number;
  badge?: unknown;
  media?: unknown;
  equipmentIds?: unknown;
}

function firstValidMediaUrl(media: unknown): string | null {
  if (!Array.isArray(media)) return null;
  for (const raw of media) {
    if (typeof raw !== 'string') continue;
    const u = raw.trim();
    if (u.length > 0) return u;
  }
  return null;
}

export function serializePublicEquipmentPromo(p: LeanEquipmentPromoDoc): PublicEquipmentPromoJson {
  const details = typeof p.details === 'string' && p.details.trim() ? p.details : p.description;
  const badge = typeof p.badge === 'string' && p.badge.trim() ? p.badge.trim() : null;
  const equipmentIds = Array.isArray(p.equipmentIds) ? p.equipmentIds.map((id) => String(id)) : [];

  return {
    id: p._id.toString(),
    slug: p.slug?.trim() || slugifyCourseName(p.name),
    name: p.name,
    description: p.description,
    details,
    monthlyPrice: Number(p.monthlyPrice) || 0,
    badge,
    image: firstValidMediaUrl(p.media) ?? PROMO_PACKAGE_IMAGE_FALLBACK,
    equipmentIds,
  };
}
