import { connectDB } from '@/lib/mongodb';
import { sanitizeDisabledCategoryKeys } from '@/lib/product-category-visibility';
import ProductCategorySettings, {
  PRODUCT_CATEGORY_SETTINGS_SINGLETON_KEY,
} from '@/models/ProductCategorySettings';

export async function getProductCategoryDisabledKeys(): Promise<string[]> {
  await connectDB();
  const doc = await ProductCategorySettings.findOne({
    singletonKey: PRODUCT_CATEGORY_SETTINGS_SINGLETON_KEY,
  })
    .select('disabledKeys')
    .lean();
  return sanitizeDisabledCategoryKeys(doc?.disabledKeys);
}

export async function setProductCategoryDisabledKeys(keys: unknown): Promise<string[]> {
  const disabledKeys = sanitizeDisabledCategoryKeys(keys);
  await connectDB();
  await ProductCategorySettings.findOneAndUpdate(
    { singletonKey: PRODUCT_CATEGORY_SETTINGS_SINGLETON_KEY },
    { $set: { disabledKeys } },
    { upsert: true, new: true }
  );
  return disabledKeys;
}
