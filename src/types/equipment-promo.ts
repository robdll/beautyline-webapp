/**
 * Forma del pacchetto promo attrezzature usata nell'area admin (CRUD).
 * Riflette la risposta serializzata delle API `/api/admin/pacchetti-attrezzature`.
 */
export interface AdminEquipmentPromoPackage {
  _id: string;
  name: string;
  description: string;
  details: string;
  annualPrice: number;
  badge: string;
  media: string[];
  /** ID (Mongo) delle attrezzature incluse, nell'ordine. */
  equipmentIds: string[];
}
