/**
 * Costanti dei pacchetti promo attrezzature (noleggio di 3 tecnologie a canone mensile).
 *
 * I pacchetti sono gestiti dall'area admin e salvati su MongoDB
 * (model `EquipmentPromoPackage`, query in `equipment-promo-queries.ts`).
 * Qui restano solo le costanti condivise tra UI pubblica, admin e validazione.
 */

/** Numero di attrezzature previste da ogni pacchetto promo. */
export const PROMO_PACKAGE_SIZE = 3;

/** Cosa è incluso in tutti i pacchetti promo (mostrato nel dettaglio). */
export const PROMO_PACKAGE_BENEFITS: string[] = [
  'Assistenza tecnica',
  'Formazione',
  'Manutenzioni',
];

/** Immagine di ripiego quando il pacchetto non ha ancora una copertina caricata. */
export const PROMO_PACKAGE_IMAGE_FALLBACK = '/images/attrezzature-1.webp';
