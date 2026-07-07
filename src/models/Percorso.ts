import mongoose, { Schema, Document, Model } from 'mongoose';
import { slugifyCourseName } from '@/lib/course-slug';
import { softDeletePlugin } from './plugins/softDelete';

export interface IPercorso extends Document {
  name: string;
  /** Segmento URL sotto /percorsi/[slug] */
  slug: string;
  description: string;
  media: string[];
  /** Prezzo pacchetto (a sé, non calcolato dai corsi). */
  cost: number;
  /**
   * Corsi che compongono il percorso, in ordine. Ogni voce referenzia un corso e
   * la specifica erogazione (data) a cui il percorso fa riferimento.
   */
  items: {
    course: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
  }[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<IPercorso>;
  restore: () => Promise<IPercorso>;
}

const PercorsoSchema = new Schema<IPercorso>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    cost: { type: Number, required: true, min: 0 },
    items: [
      {
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

/** Prima della validazione così `slug` required è sempre valorizzato e unico. */
PercorsoSchema.pre('validate', async function () {
  const doc = this as mongoose.Document & IPercorso;
  if (!doc.isModified('name') && doc.slug) return;

  const base = slugifyCourseName(doc.name);
  let slug = base;
  let counter = 2;
  const Model = doc.constructor as Model<IPercorso>;

  for (;;) {
    // Query sulla collection nativa: include anche i documenti soft-deleted, così
    // lo slug non collide con l'indice unico (che li conta comunque).
    const existing = await Model.collection.findOne({ slug, _id: { $ne: doc._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter += 1;
  }
  doc.slug = slug;
});

PercorsoSchema.plugin(softDeletePlugin);

const existingPercorsoModel = mongoose.models.Percorso as Model<IPercorso> | undefined;
const hasItemsInCachedSchema =
  typeof existingPercorsoModel?.schema?.path('items') !== 'undefined';

// In dev/HMR, un model cached con lo schema precedente (campo `courseIds`) scarterebbe
// il nuovo campo `items` in fase di salvataggio: forziamo la ricompilazione.
if (existingPercorsoModel && !hasItemsInCachedSchema) {
  delete mongoose.models.Percorso;
}

const Percorso: Model<IPercorso> =
  (mongoose.models.Percorso as Model<IPercorso>) ||
  mongoose.model<IPercorso>('Percorso', PercorsoSchema);

export default Percorso;
