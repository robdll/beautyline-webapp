import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { PROMO_PACKAGE_SIZE } from '@/lib/equipment-promo';
import Equipment from '@/models/Equipment';

type ResolveResult =
  | { ok: true; ids: string[] }
  | { ok: false; error: string };

/**
 * Valida e normalizza gli id delle attrezzature di un pacchetto promo:
 * esattamente `PROMO_PACKAGE_SIZE` id validi, distinti ed esistenti.
 */
export async function resolveEquipmentPromoItems(value: unknown): Promise<ResolveResult> {
  if (!Array.isArray(value)) {
    return { ok: false, error: 'Seleziona le attrezzature del pacchetto.' };
  }

  const ids: string[] = [];
  const seen = new Set<string>();
  for (const raw of value) {
    const id = typeof raw === 'string' ? raw.trim() : '';
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return { ok: false, error: 'Una delle attrezzature selezionate non è valida.' };
    }
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }

  if (ids.length !== PROMO_PACKAGE_SIZE) {
    return {
      ok: false,
      error: `Seleziona esattamente ${PROMO_PACKAGE_SIZE} attrezzature per il pacchetto.`,
    };
  }

  await connectDB();
  const count = await Equipment.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) {
    return { ok: false, error: 'Alcune attrezzature selezionate non esistono più.' };
  }

  return { ok: true, ids };
}
