import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import type { EquipmentType } from '@/lib/equipment-types';
import { EQUIPMENT_TYPE_LABELS, parseEquipmentType } from '@/lib/equipment-types';
import Equipment from '@/models/Equipment';
import type { EquipmentItem } from '@/types/equipment';

export async function getEquipmentByTipoId(tipo: EquipmentType, id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doc = await Equipment.findById(id).lean();
  if (!doc) return null;
  if (parseEquipmentType(doc.type) !== tipo) return null;
  return doc;
}

/**
 * Carica le attrezzature indicate dagli id, preservando l'ordine passato.
 * Gli id non validi o non trovati vengono ignorati.
 */
export async function getEquipmentByIds(ids: string[]): Promise<EquipmentItem[]> {
  const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validIds.length === 0) return [];
  await connectDB();
  const docs = await Equipment.find({ _id: { $in: validIds } }).lean();
  const byId = new Map(docs.map((doc) => [doc._id.toString(), doc]));
  return ids
    .map((id) => byId.get(id))
    .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc))
    .map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      type: doc.type,
      detailTypeSlug: parseEquipmentType(doc.type),
      image: doc.media?.[0] || 'https://placehold.co/400x300.png',
      rentOnly: doc.rentOnly,
      rentCostPerDay: doc.rentCostPerDay,
      rentCostPerMonth: doc.rentCostPerMonth,
      sellingCost: doc.sellingCost,
    }));
}

/** Valori `type` possibili in DB (slug o etichetta italiana). */
export function equipmentTypeMatchValues(tipo: EquipmentType): string[] {
  return [tipo, EQUIPMENT_TYPE_LABELS[tipo]];
}
