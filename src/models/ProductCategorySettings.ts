import mongoose, { Schema, Document, Model } from 'mongoose';

const SINGLETON_KEY = 'product-category-visibility';

export interface IProductCategorySettings extends Document {
  singletonKey: string;
  /** Chiavi `brandId:subcategoryId` disattivate nel catalogo pubblico. */
  disabledKeys: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySettingsSchema = new Schema<IProductCategorySettings>(
  {
    singletonKey: { type: String, required: true, unique: true, default: SINGLETON_KEY },
    disabledKeys: [{ type: String }],
  },
  { timestamps: true }
);

const ProductCategorySettings: Model<IProductCategorySettings> =
  mongoose.models.ProductCategorySettings ||
  mongoose.model<IProductCategorySettings>('ProductCategorySettings', ProductCategorySettingsSchema);

export { SINGLETON_KEY as PRODUCT_CATEGORY_SETTINGS_SINGLETON_KEY };
export default ProductCategorySettings;
