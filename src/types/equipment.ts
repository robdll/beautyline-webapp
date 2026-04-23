/**
 * Forma dell'attrezzatura per la pagina pubblica `/attrezzature`.
 * Include lo slug della categoria già risolto per costruire i link di dettaglio.
 */
export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  type: string;
  /** Slug categoria per URL dettaglio; assente se il tipo in DB non è tra le 4 categorie. */
  detailTypeSlug: string | null;
  image: string;
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
}

/**
 * Forma dell'attrezzatura per la lista in admin.
 * Riflette il documento Mongo (Mongo `_id`, media come array di URL).
 */
export interface AdminEquipmentItem {
  _id: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
}

/**
 * Stato del form admin in modifica attrezzatura.
 * Inclusa scheda tecnica PDF opzionale.
 */
export interface EquipmentData {
  _id: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  technicalSheet?: string;
}
