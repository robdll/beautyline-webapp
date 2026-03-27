import mongoose, { Schema, Document, Model } from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete';

export interface IEquipment extends Document {
  type: string;
  name: string;
  description: string;
  media: string[];
  technicalSheet?: string;
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<IEquipment>;
  restore: () => Promise<IEquipment>;
}

const EquipmentSchema = new Schema<IEquipment>(
  {
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    technicalSheet: { type: String, default: '' },
    rentOnly: { type: Boolean, default: false },
    rentCostPerDay: { type: Number, default: 0, min: 0 },
    rentCostPerMonth: { type: Number, default: 0, min: 0 },
    sellingCost: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

EquipmentSchema.plugin(softDeletePlugin);

const Equipment: Model<IEquipment> =
  mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);

export default Equipment;
