import mongoose, { Schema, Document, Model } from 'mongoose';
import { COURSE_TYPES, type CourseType } from '@/lib/course-types';
import { softDeletePlugin } from './plugins/softDelete';

export interface ICourse extends Document {
  type: CourseType;
  level: string;
  name: string;
  description: string;
  media: string[];
  duration: string;
  cost: number;
  startDate?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<ICourse>;
  restore: () => Promise<ICourse>;
}

const CourseSchema = new Schema<ICourse>(
  {
    type: { type: String, required: true, enum: [...COURSE_TYPES] },
    level: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    duration: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: false, default: null },
  },
  { timestamps: true }
);

CourseSchema.plugin(softDeletePlugin);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
