import mongoose, { Schema, Document, Model } from 'mongoose';
import { slugifyCourseName } from '@/lib/course-slug';
import { softDeletePlugin } from './plugins/softDelete';

export interface IEquipmentPromoPackage extends Document {
  name: string;
  /** Segmento URL sotto /attrezzature/pacchetti/[slug] */
  slug: string;
  description: string;
  /** Descrizione estesa mostrata nella pagina di dettaglio. */
  details: string;
  /** Prezzo mensile di noleggio del pacchetto, in euro. */
  monthlyPrice: number;
  /** Etichetta opzionale evidenziata (es. "Più richiesto"). */
  badge: string;
  media: string[];
  /** Attrezzature incluse nel pacchetto (riferimento a Equipment). */
  equipmentIds: mongoose.Types.ObjectId[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<IEquipmentPromoPackage>;
  restore: () => Promise<IEquipmentPromoPackage>;
}

const EquipmentPromoPackageSchema = new Schema<IEquipmentPromoPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, required: true },
    details: { type: String, default: '' },
    monthlyPrice: { type: Number, required: true, min: 0 },
    badge: { type: String, default: '' },
    media: [{ type: String }],
    equipmentIds: [{ type: Schema.Types.ObjectId, ref: 'Equipment', required: true }],
  },
  { timestamps: true }
);

/** Prima della validazione così `slug` required è sempre valorizzato e unico. */
EquipmentPromoPackageSchema.pre('validate', async function () {
  const doc = this as mongoose.Document & IEquipmentPromoPackage;
  if (!doc.isModified('name') && doc.slug) return;

  const base = slugifyCourseName(doc.name);
  let slug = base;
  let counter = 2;
  const ModelRef = doc.constructor as Model<IEquipmentPromoPackage>;

  for (;;) {
    const existing = await ModelRef.collection.findOne({ slug, _id: { $ne: doc._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter += 1;
  }
  doc.slug = slug;
});

EquipmentPromoPackageSchema.plugin(softDeletePlugin);

const EquipmentPromoPackage: Model<IEquipmentPromoPackage> =
  (mongoose.models.EquipmentPromoPackage as Model<IEquipmentPromoPackage>) ||
  mongoose.model<IEquipmentPromoPackage>('EquipmentPromoPackage', EquipmentPromoPackageSchema);

export default EquipmentPromoPackage;
