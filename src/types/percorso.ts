/**
 * Una voce del percorso lato admin: corso + erogazione (data) scelta.
 * Le date sono `yyyy-mm-dd` (compatibili con gli input date del form).
 */
export interface AdminPercorsoItem {
  courseId: string;
  startDate: string;
  endDate: string;
}

/**
 * Forma del percorso utilizzata dalle pagine di admin (lista e form di edit).
 * Riflette il documento Mongo: `_id` string, costo come number, media come array di URL,
 * `items` come elenco ordinato di corsi con la data di riferimento nel percorso.
 */
export interface AdminPercorso {
  _id: string;
  name: string;
  description: string;
  cost: number;
  media?: string[];
  items: AdminPercorsoItem[];
}
