import { hashPassword } from '@/lib/auth';
import Course from '@/models/Course';
import Equipment from '@/models/Equipment';
import Product from '@/models/Product';
import Service from '@/models/Service';
import User from '@/models/User';

declare global {
  var _localSeedPromise: Promise<void> | undefined;
  var _localSeedDone: boolean | undefined;
}

function isLocalSeedEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.ENABLE_LOCAL_SEED === 'true';
}

async function seedUsers() {
  const adminEmail = (process.env.LOCAL_SEED_ADMIN_EMAIL || 'admin@beautyline.local').toLowerCase();
  const adminPassword = process.env.LOCAL_SEED_ADMIN_PASSWORD || 'Password123!';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) return;

  const passwordHash = await hashPassword(adminPassword);

  await User.create({
    email: adminEmail,
    passwordHash,
    firstName: 'BeautyLine',
    lastName: 'Admin',
    role: 'admin',
    emailVerified: true,
  });
}

async function seedServices() {
  const existingCount = await Service.countDocuments();
  if (existingCount > 0) return;

  await Service.insertMany([
    {
      type: 'Viso',
      name: 'Pulizia Viso Profonda',
      description: 'Trattamento completo per detersione, esfoliazione e riequilibrio della pelle.',
      media: [],
      cost: 59,
    },
    {
      type: 'Corpo',
      name: 'Massaggio Linfodrenante',
      description: 'Massaggio specifico per stimolare la circolazione e ridurre il senso di gonfiore.',
      media: [],
      cost: 75,
    },
    {
      type: 'Mani',
      name: 'Manicure Semipermanente',
      description: 'Preparazione, applicazione colore e finish lucido a lunga durata.',
      media: [],
      cost: 35,
    },
  ]);
}

async function seedCourses() {
  const existingCount = await Course.countDocuments();
  if (existingCount > 0) return;

  await Course.insertMany([
    {
      type: 'Master',
      level: 'Avanzato',
      name: 'Master Laminazione Ciglia',
      description: 'Percorso pratico e teorico per specializzarsi nella laminazione professionale.',
      media: [],
      duration: '2 giorni',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      cost: 490,
    },
    {
      type: 'Corso Base',
      level: 'Principiante',
      name: 'Corso Ricostruzione Unghie',
      description: 'Fondamenti tecnici, igiene, preparazione unghia e modellatura gel.',
      media: [],
      duration: '3 giorni',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      cost: 650,
    },
  ]);
}

async function seedProducts() {
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) return;

  await Product.insertMany([
    {
      brand: 'BeautyLine Pro',
      type: 'Skincare',
      name: 'Siero Acido Ialuronico',
      description: 'Siero idratante con texture leggera per uso quotidiano.',
      media: [],
      cost: 29,
      availableColors: [],
    },
    {
      brand: 'BeautyLine Nails',
      type: 'Nail',
      name: 'Gel Color Rosso Intenso',
      description: 'Gel professionale ad alta coprenza e lunga tenuta.',
      media: [],
      cost: 14,
      availableColors: [{ name: 'Rosso Intenso', hex: '#B00020' }],
    },
  ]);
}

async function seedEquipment() {
  const existingCount = await Equipment.countDocuments();
  if (existingCount > 0) return;

  await Equipment.insertMany([
    {
      type: 'Laser',
      name: 'Laser Diodo BL-808',
      description: 'Macchinario professionale per trattamenti di epilazione.',
      media: [],
      rentOnly: false,
      rentCostPerDay: 120,
      rentCostPerMonth: 1500,
      sellingCost: 9900,
    },
    {
      type: 'Viso',
      name: 'HydraFacial BL-One',
      description: 'Sistema multifunzione per detersione e trattamento viso avanzato.',
      media: [],
      rentOnly: true,
      rentCostPerDay: 95,
      rentCostPerMonth: 1200,
      sellingCost: 0,
    },
  ]);
}

async function seedLocalData() {
  await seedUsers();
  await seedServices();
  await seedCourses();
  await seedProducts();
  await seedEquipment();

  console.info('[local-seed] Local seed completed.');
}

export async function runLocalSeedIfNeeded(): Promise<void> {
  if (!isLocalSeedEnabled() || global._localSeedDone) {
    return;
  }

  if (!global._localSeedPromise) {
    global._localSeedPromise = seedLocalData();
  }

  try {
    await global._localSeedPromise;
    global._localSeedDone = true;
  } catch (error) {
    global._localSeedPromise = undefined;
    console.error('[local-seed] Failed to seed local data:', error);
    throw error;
  }
}
