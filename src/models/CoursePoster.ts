import mongoose, { Schema, Document, Model } from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete';

export interface ICoursePoster extends Document {
  image: string;
  /** 1-12 (gennaio = 1) */
  month: number;
  year: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<ICoursePoster>;
  restore: () => Promise<ICoursePoster>;
}

const CoursePosterSchema = new Schema<ICoursePoster>(
  {
    image: { type: String, required: true, trim: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 1970 },
  },
  { timestamps: true }
);

CoursePosterSchema.index({ year: 1, month: 1 });

CoursePosterSchema.plugin(softDeletePlugin);

const CoursePoster: Model<ICoursePoster> =
  (mongoose.models.CoursePoster as Model<ICoursePoster>) ||
  mongoose.model<ICoursePoster>('CoursePoster', CoursePosterSchema);

export default CoursePoster;
