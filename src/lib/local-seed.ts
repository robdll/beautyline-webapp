import { hashPassword } from '@/lib/auth';
import Course from '@/models/Course';
import Equipment from '@/models/Equipment';
import Product from '@/models/Product';
import Service from '@/models/Service';
import User from '@/models/User';
import { normalizeExistingCourses } from '@/lib/course-catalog-seed';

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
  const services = [
    {
      type: 'Pressoterapia',
      name: 'Pressoterapia silver',
      description: 'Seduta drenante delicata, ideale per gambe leggere e microcircolazione attiva.',
      media: [],
      cost: 39,
    },
    {
      type: 'Pressoterapia',
      name: 'Pressoterapia gold',
      description: 'Protocollo intensivo con pressoterapia mirata per gonfiore localizzato e tonicita.',
      media: [],
      cost: 49,
    },
    {
      type: 'Pressoterapia',
      name: 'Pacchetto 5 sedute',
      description: 'Percorso da 5 trattamenti pressoterapia con 1 seduta omaggio inclusa.',
      media: [],
      cost: 195,
    },
    {
      type: 'Pressoterapia',
      name: 'Pacchetto 10 sedute',
      description: 'Programma completo da 10 sedute pressoterapia con 2 sedute omaggio.',
      media: [],
      cost: 390,
    },
    {
      type: 'Pulizia Viso',
      name: 'Pulizia viso classica',
      description: 'Detersione profonda e riequilibrio cutaneo per una pelle luminosa e uniforme.',
      media: [],
      cost: 40,
    },
    {
      type: 'Oxymesio Therapy',
      name: 'Pulizia viso + ossigeno',
      description: 'Pulizia viso con ossigenazione cosmetica per idratazione e incarnato piu fresco.',
      media: [],
      cost: 45,
    },
    {
      type: 'Oxymesio Therapy',
      name: 'Trattamento viso completo',
      description: 'Trattamento completo con azione rivitalizzante, nutriente e distensiva.',
      media: [],
      cost: 60,
    },
    {
      type: 'Multi 360',
      name: 'Trattamento viso',
      description: 'Tecnologia Multi 360 per migliorare grana, tono e luminosita del viso.',
      media: [],
      cost: 49,
    },
    {
      type: 'Multi 360',
      name: 'Addome',
      description: 'Trattamento specifico addome per compattare i tessuti e migliorare l elasticita.',
      media: [],
      cost: 49,
    },
    {
      type: 'Multi 360',
      name: 'Braccia',
      description: 'Protocollo rassodante braccia con stimolazione dolce e risultato progressivo.',
      media: [],
      cost: 49,
    },
    {
      type: 'Multi 360',
      name: 'Gambe e glutei',
      description: 'Azione combinata su gambe e glutei per una silhouette piu tonica e armoniosa.',
      media: [],
      cost: 69,
    },
    {
      type: 'Multi 360',
      name: 'Gambe glutei e addome',
      description: 'Trattamento completo body contour su tre aree strategiche in un unica seduta.',
      media: [],
      cost: 99,
    },
    {
      type: 'Lipolaser + Presso',
      name: 'Seduta',
      description: 'Combinazione lipolaser e pressoterapia per modellamento e drenaggio profondo.',
      media: [],
      cost: 60,
    },
    {
      type: 'Infrasonic',
      name: 'Drenaggio',
      description: 'Trattamento infrasonic drenante per alleggerire i tessuti e ridurre la ritenzione.',
      media: [],
      cost: 49,
    },
    {
      type: 'Infrasonic',
      name: 'Trattamento cellulite / tonificazione',
      description: 'Protocollo infrasonic per lavorare su adiposita localizzate, cellulite e tonicita.',
      media: [],
      cost: 60,
    },
    {
      type: 'Radiofrequenza',
      name: 'Radio silver',
      description: 'Percorso viso con detersione, radiofrequenza e crema finale ad azione liftante.',
      media: [],
      cost: 50,
    },
    {
      type: 'Radiofrequenza',
      name: 'Radio gold',
      description: 'Trattamento viso premium con detersione, radio, maschera, crema e massaggio.',
      media: [],
      cost: 65,
    },
    {
      type: 'Radiofrequenza',
      name: 'Corpo zona singola',
      description: 'Radiofrequenza corpo su una zona mirata per compattare e tonificare i tessuti.',
      media: [],
      cost: 55,
    },
    {
      type: 'Radiofrequenza',
      name: 'Corpo 2 zone',
      description: 'Seduta radiofrequenza su due zone corpo per un risultato piu completo.',
      media: [],
      cost: 90,
    },
    {
      type: 'Radiofrequenza',
      name: 'Pacchetto 5 sedute',
      description: 'Pacchetto corpo da 5 sedute radiofrequenza con sconto 10% sul totale.',
      media: [],
      cost: 247.5,
    },
    {
      type: 'Radiofrequenza',
      name: 'Pacchetto 10 sedute',
      description: 'Pacchetto corpo da 10 sedute radiofrequenza con sconto 15% dedicato.',
      media: [],
      cost: 467.5,
    },
  ];

  await Service.bulkWrite(
    services.map((service) => ({
      updateOne: {
        filter: { type: service.type, name: service.name },
        update: { $set: service },
        upsert: true,
      },
    }))
  );
}

async function seedCourses() {
  const existingCount = await Course.countDocuments();
  if (existingCount > 0) return;

  await Course.insertMany([
    {
      type: 'occhi',
      name: 'Master Laminazione Ciglia',
      description: 'Percorso pratico e teorico per specializzarsi nella laminazione professionale.',
      media: [],
      occurrences: [
        {
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
        },
      ],
      programSections: ['Analisi viso e ciglia', 'Tecnica professionale', 'Sessione pratica guidata'],
      cost: 490,
    },
    {
      type: 'unghie',
      name: 'Corso Ricostruzione Unghie',
      description: 'Fondamenti tecnici, igiene, preparazione unghia e modellatura gel.',
      media: [],
      occurrences: [
        {
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 32),
        },
      ],
      programSections: ['Teoria e protocolli', 'Pratica in aula', 'Conclusione e verifica'],
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
  await normalizeExistingCourses();
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
