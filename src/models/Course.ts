import mongoose, { Schema, Document, Model } from 'mongoose';
import { COURSE_TYPES, type CourseType } from '@/lib/course-types';
import { slugifyCourseName } from '@/lib/course-slug';
import { softDeletePlugin } from './plugins/softDelete';

export interface ICourse extends Document {
  type: CourseType;
  level: string;
  name: string;
  /** Segmento URL sotto /corsi/[tipo]/[slug] */
  slug: string;
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
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    duration: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: false, default: null },
  },
  { timestamps: true }
);

CourseSchema.index({ type: 1, slug: 1 }, { unique: true });

/** Prima della validazione così `slug` required è sempre valorizzato. */
CourseSchema.pre('validate', async function () {
  const doc = this as mongoose.Document & ICourse;
  if (!doc.isModified('name') && doc.slug) return;

  const base = slugifyCourseName(doc.name);
  let slug = base;
  let counter = 2;
  const Model = doc.constructor as Model<ICourse>;

  for (;;) {
    const existing = await Model.findOne({
      type: doc.type,
      slug,
      _id: { $ne: doc._id },
    }).lean();
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter += 1;
  }
  doc.slug = slug;
});

CourseSchema.plugin(softDeletePlugin);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
