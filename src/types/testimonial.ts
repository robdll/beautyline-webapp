/**
 * Recensione/testimonianza utilizzata da `TestimonialCard` e `ReviewsSection`.
 * Pensata per essere già normalizzata (es. `rating` clampato fra 1 e 5).
 */
export interface Testimonial {
  id: string;
  name: string;
  content: string;
  image?: string;
  rating?: number;
}
