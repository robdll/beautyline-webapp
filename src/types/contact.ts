/**
 * Stato del form di contatto (vedi `ContactForm`).
 * `privacyAccepted` deve essere `true` lato client prima dell'invio (GDPR).
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAccepted: boolean;
}
