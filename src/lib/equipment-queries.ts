import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import type { EquipmentType } from '@/lib/equipment-types';
import { EQUIPMENT_TYPE_LABELS, parseEquipmentType } from '@/lib/equipment-types';
import Equipment from '@/models/Equipment';

export async function getEquipmentByTipoId(tipo: EquipmentType, id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doc = await Equipment.findById(id).lean();
  if (!doc) return null;
  if (parseEquipmentType(doc.type) !== tipo) return null;
  return doc;
}

/** Valori `type` possibili in DB (slug o etichetta italiana). */
export function equipmentTypeMatchValues(tipo: EquipmentType): string[] {
  return [tipo, EQUIPMENT_TYPE_LABELS[tipo]];
}
