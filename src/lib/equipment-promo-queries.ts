import { connectDB } from '@/lib/mongodb';
import EquipmentPromoPackage from '@/models/EquipmentPromoPackage';
import {
  serializePublicEquipmentPromo,
  type LeanEquipmentPromoDoc,
  type PublicEquipmentPromoJson,
} from '@/lib/public-equipment-promo';

/** Tutti i pacchetti promo pubblici, in ordine di creazione. */
export async function getPublicEquipmentPromoPackages(): Promise<PublicEquipmentPromoJson[]> {
  try {
    await connectDB();
    const docs = await EquipmentPromoPackage.find().sort({ createdAt: 1 }).lean();
    return docs.map((d) => serializePublicEquipmentPromo(d as unknown as LeanEquipmentPromoDoc));
  } catch (err) {
    console.error('Public equipment promo list error:', err);
    return [];
  }
}

/** Singolo pacchetto promo pubblico dato lo slug, oppure `null`. */
export async function getEquipmentPromoBySlug(
  slug: string
): Promise<PublicEquipmentPromoJson | null> {
  try {
    await connectDB();
    const doc = await EquipmentPromoPackage.findOne({ slug: slug.trim().toLowerCase() }).lean();
    if (!doc) return null;
    return serializePublicEquipmentPromo(doc as unknown as LeanEquipmentPromoDoc);
  } catch (err) {
    console.error('Public equipment promo by slug error:', err);
    return null;
  }
}
