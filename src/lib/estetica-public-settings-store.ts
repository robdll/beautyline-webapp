import { connectDB } from '@/lib/mongodb';
import EsteticaPublicSettings, {
  ESTETICA_PUBLIC_SETTINGS_SINGLETON_KEY,
} from '@/models/EsteticaPublicSettings';

export function normalizeListinoPrezziUrlInput(input: unknown): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input !== 'string') return null;
  const t = input.trim();
  if (!t) return null;
  if (!t.startsWith('https://')) return null;
  return t;
}

export async function getListinoPrezziUrl(): Promise<string | null> {
  await connectDB();
  const doc = await EsteticaPublicSettings.findOne({
    singletonKey: ESTETICA_PUBLIC_SETTINGS_SINGLETON_KEY,
  })
    .select('listinoPrezziUrl')
    .lean();
  return normalizeListinoPrezziUrlInput(doc?.listinoPrezziUrl);
}

export async function setListinoPrezziUrl(url: unknown): Promise<string | null> {
  const listinoPrezziUrl = normalizeListinoPrezziUrlInput(url);
  await connectDB();
  await EsteticaPublicSettings.findOneAndUpdate(
    { singletonKey: ESTETICA_PUBLIC_SETTINGS_SINGLETON_KEY },
    listinoPrezziUrl ? { $set: { listinoPrezziUrl } } : { $unset: { listinoPrezziUrl: '' } },
    { upsert: true, new: true }
  );
  return listinoPrezziUrl;
}
