import mongoose, { Schema, Document, Model } from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete';

export interface IColorOption {
  name: string;
  hex: string;
  /** Must match an entry in `media` when set. */
  imageUrl?: string;
}

export interface IProduct extends Document {
  brand: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  cost: number;
  availableColors: IColorOption[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<IProduct>;
  restore: () => Promise<IProduct>;
}

const ColorOptionSchema = new Schema<IColorOption>(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    imageUrl: { type: String, required: false },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    brand: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    cost: { type: Number, required: true, min: 0 },
    availableColors: [ColorOptionSchema],
  },
  { timestamps: true }
);

ProductSchema.plugin(softDeletePlugin);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
