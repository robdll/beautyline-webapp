import mongoose, { Schema, Document, Model } from 'mongoose';

const SINGLETON_KEY = 'estetica-public-settings';

export interface IEsteticaPublicSettings extends Document {
  singletonKey: string;
  /** Cloudinary (or other HTTPS) URL for the public price list PDF. */
  listinoPrezziUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EsteticaPublicSettingsSchema = new Schema<IEsteticaPublicSettings>(
  {
    singletonKey: { type: String, required: true, unique: true, default: SINGLETON_KEY },
    listinoPrezziUrl: { type: String },
  },
  { timestamps: true }
);

const EsteticaPublicSettings: Model<IEsteticaPublicSettings> =
  mongoose.models.EsteticaPublicSettings ||
  mongoose.model<IEsteticaPublicSettings>('EsteticaPublicSettings', EsteticaPublicSettingsSchema);

export { SINGLETON_KEY as ESTETICA_PUBLIC_SETTINGS_SINGLETON_KEY };
export default EsteticaPublicSettings;
