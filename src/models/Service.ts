import mongoose, { Schema, Document, Model } from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete';

export interface IService extends Document {
  type: string;
  name: string;
  description: string;
  media: string[];
  cost: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<IService>;
  restore: () => Promise<IService>;
}

const ServiceSchema = new Schema<IService>(
  {
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    cost: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

ServiceSchema.plugin(softDeletePlugin);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
