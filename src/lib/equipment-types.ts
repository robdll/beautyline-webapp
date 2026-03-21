export const EQUIPMENT_TYPES = ['viso', 'corpo', 'epilazione', 'multifunzione'] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  viso: 'Trattamenti Viso',
  corpo: 'Trattamenti Corpo',
  epilazione: 'Epilazione',
  multifunzione: 'Multifunzione',
};

/** Legacy or alternate stored values → canonical slug */
const TYPE_ALIASES: Record<string, EquipmentType> = {
  viso: 'viso',
  corpo: 'corpo',
  epilazione: 'epilazione',
  multifunzione: 'multifunzione',
  'trattamenti viso': 'viso',
  'trattamenti corpo': 'corpo',
};

export function parseEquipmentType(value: unknown): EquipmentType | null {
  if (typeof value !== 'string') return null;
  const key = value.trim().toLowerCase();
  if (EQUIPMENT_TYPES.includes(key as EquipmentType)) return key as EquipmentType;
  return TYPE_ALIASES[key] ?? null;
}

export function getEquipmentTypeLabel(type: string): string {
  const parsed = parseEquipmentType(type);
  return parsed ? EQUIPMENT_TYPE_LABELS[parsed] : type;
}

export function isEquipmentType(value: unknown): value is EquipmentType {
  return parseEquipmentType(value) !== null;
}
