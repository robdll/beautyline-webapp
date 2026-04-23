/**
 * Una singola occorrenza/edizione del corso (data inizio, data fine, sold-out).
 * Le date sono ISO string sia lato API che nel form admin.
 */
export interface CourseOccurrence {
  startDate: string;
  endDate: string;
  soldOut?: boolean;
}

/**
 * Forma del corso utilizzata dalle UI pubbliche (card, sezioni in homepage, ecc.).
 * Pensata per essere già pronta da renderizzare: prezzo formattato, immagine principale, ecc.
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category?: string;
  nextDate?: string;
  /** Path relativo sotto /corsi, es. `unghie/percorso-gel` */
  catalogPath?: string;
}

/**
 * Forma del corso utilizzata dalle pagine di admin (lista e form di edit).
 * Riflette il documento Mongo: `_id` numerico, costo come number, media come array di URL.
 */
export interface AdminCourse {
  _id: string;
  type: string;
  name: string;
  description: string;
  cost: number;
  occurrences?: CourseOccurrence[];
  programSections?: string[];
  orario?: string;
  media?: string[];
}
