/** Display + tel / WhatsApp (BeautyLine) */
export const BUSINESS_PHONE_DISPLAY = '+39 338 2535226';
export const BUSINESS_PHONE_TEL_HREF = 'tel:+393382535226';
/** wa.me expects country code + number, no + or spaces */
export const BUSINESS_WHATSAPP_WA_ME = 'https://wa.me/393382535226';

export function whatsappPrenotaUrl(serviceName: string): string {
  const text = `Ciao, vorrei prenotare: ${serviceName}`;
  return `${BUSINESS_WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
}

export function whatsappContattaciPromoUrl(promoName?: string): string {
  const text = promoName?.trim()
    ? `Ciao, vorrei informazioni sulla promozione: ${promoName.trim()}`
    : 'Ciao, vorrei informazioni su una promozione vista sul sito.';
  return `${BUSINESS_WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
}
