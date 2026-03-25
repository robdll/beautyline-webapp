export const SERVICE_CATEGORIES = [
  'Pressoterapia',
  'Pulizia Viso',
  'Oxymesio Therapy',
  'Multi 360',
  'Lipolaser + Presso',
  'Infrasonic',
  'Radiofrequenza',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
