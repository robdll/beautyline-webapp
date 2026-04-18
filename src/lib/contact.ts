/** Display + tel / WhatsApp (BeautyLine) */
export const BUSINESS_PHONE_DISPLAY = '+39 338 2535226';
export const BUSINESS_PHONE_TEL_HREF = 'tel:+393382535226';

export const ESTETICA_PHONE_DISPLAY = '+39 335 7201796';
export const ESTETICA_PHONE_TEL_HREF = 'tel:+393357201796';
/** wa.me: stesso recapito del telefono principale — attrezzature, contatti generali */
export const BUSINESS_WHATSAPP_WA_ME = 'https://wa.me/393382535226';
/** wa.me — servizi estetica (prenotazioni / promozioni) */
export const ESTETICA_WHATSAPP_WA_ME = 'https://wa.me/393357201796';

export function whatsappAttrezzaturaUrl(equipmentName: string): string {
  const text = `Ciao, vorrei informazioni sull'attrezzatura: ${equipmentName}`;
  return `${BUSINESS_WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
}

export function whatsappCorsoUrl(courseName: string): string {
  const text = `Ciao, vorrei informazioni sul corso: ${courseName}`;
  return `${BUSINESS_WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
}

export function whatsappPrenotaUrl(serviceName: string): string {
  const text = `Ciao, vorrei prenotare: ${serviceName}`;
  return `${ESTETICA_WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
}

export function whatsappContattaciPromoUrl(promoName?: string): string {
  const text = promoName?.trim()
    ? `Ciao, vorrei informazioni sulla promozione: ${promoName.trim()}`
    : 'Ciao, vorrei informazioni su una promozione vista sul sito.';
  return `${ESTETICA_WHATSAPP_WA_ME}?text=${encodeURIComponent(text)}`;
}
