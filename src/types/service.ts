/**
 * Forma del servizio per la pagina pubblica `/servizi-estetica`.
 * Include flag/promozioni già risolte per la UI.
 */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  type: string;
  image: string;
  cost: number;
  priceFrom?: boolean;
  isPromo?: boolean;
  promoStartsAt?: Date | string | null;
  promoEndsAt?: Date | string | null;
}

/**
 * Forma del servizio per la lista in admin.
 * Riflette il documento Mongo.
 */
export interface AdminService {
  _id: string;
  type: string;
  name: string;
  description: string;
  cost: number;
  media?: string[];
  isPromo?: boolean;
}

/**
 * Stato del form admin in modifica servizio.
 * Le date promo sono stringhe in formato `YYYY-MM-DD` per gli input HTML.
 */
export interface ServiceForm {
  _id: string;
  isPromo: boolean;
  promoStartsAt: string;
  promoEndsAt: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  cost: number | string;
  priceFrom: boolean;
}
