import type mongoose from 'mongoose';
import type { EquipmentType } from '@/lib/equipment-types';
import { parseEquipmentType } from '@/lib/equipment-types';

export interface PublicEquipmentJson {
  id: string;
  type: EquipmentType;
  name: string;
  description: string;
  media: string[];
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
}

export interface LeanEquipmentDoc {
  _id: mongoose.Types.ObjectId;
  type: string;
  name: string;
  description: string;
  media?: unknown;
  rentOnly?: boolean;
  rentCostPerDay?: number;
  rentCostPerMonth?: number;
  sellingCost?: number;
}

export function serializePublicEquipment(e: LeanEquipmentDoc): PublicEquipmentJson | null {
  const type = parseEquipmentType(e.type);
  if (!type) return null;
  return {
    id: e._id.toString(),
    type,
    name: e.name,
    description: e.description,
    media: Array.isArray(e.media) ? e.media : [],
    rentOnly: Boolean(e.rentOnly),
    rentCostPerDay: Number(e.rentCostPerDay) || 0,
    rentCostPerMonth: Number(e.rentCostPerMonth) || 0,
    sellingCost: Number(e.sellingCost) || 0,
  };
}
