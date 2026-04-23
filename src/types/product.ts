/**
 * Variante di prodotto (es. 50ml, 100ml) come arriva dall'API.
 */
export interface ProductVariant {
  cost: number;
  unit: string;
  value: number;
}

/**
 * Variante usata nei form admin (i campi numerici sono stringhe per gli input HTML).
 */
export interface VariantOption {
  cost: string;
  unit: string;
  value: string;
}

/**
 * Payload "loose" delle varianti durante il fetch dei dati di un prodotto in edit:
 * i numeri possono arrivare come stringa per via di serializzazioni storiche.
 */
export interface VariantPayload {
  cost?: number | string;
  unit?: string;
  value?: number | string;
}

/**
 * Opzione "colore disponibile" usata nei form admin del prodotto.
 */
export interface ColorOption {
  name: string;
  hex: string;
  imageUrl: string;
}

/**
 * Forma del prodotto per le UI pubbliche (card di catalogo).
 * Prezzo già formattato come stringa, immagine principale precalcolata.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
}

/**
 * Forma del prodotto per le pagine di admin (lista).
 * Riflette il documento Mongo (Mongo `_id`, costi come number).
 */
export interface AdminProduct {
  _id: string;
  name: string;
  brand: string;
  type: string;
  cost: number;
  variants?: ProductVariant[];
}
