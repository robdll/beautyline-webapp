import { PROMO_SERVICE_TYPE } from '@/lib/service-categories';

export type ServiceCreateBody = {
  type?: string;
  name?: string;
  description?: string;
  media?: unknown;
  cost?: unknown;
  isPromo?: unknown;
  promoStartsAt?: unknown;
  promoEndsAt?: unknown;
  priceFrom?: unknown;
};

function parsePromoDates(promoStartsAt: unknown, promoEndsAt: unknown) {
  if (promoStartsAt == null || promoStartsAt === '' || promoEndsAt == null || promoEndsAt === '') {
    return { error: 'Le date di inizio e fine promozione sono obbligatorie.' as const };
  }
  const start = new Date(String(promoStartsAt));
  const end = new Date(String(promoEndsAt));
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: 'Date promozione non valide.' as const };
  }
  if (start > end) {
    return { error: 'La data di inizio deve precedere la data di fine.' as const };
  }
  return { start, end };
}

export function buildServicePayloadFromBody(body: ServiceCreateBody): { error: string } | Record<string, unknown> {
  const isPromo = Boolean(body.isPromo);
  const media = Array.isArray(body.media) ? body.media : [];

  if (isPromo) {
    if (!media.length || !String(media[0] || '').trim()) {
      return { error: 'Carica un\'immagine per la promozione.' };
    }
    const dates = parsePromoDates(body.promoStartsAt, body.promoEndsAt);
    if ('error' in dates) return dates;

    const typeTrim = String(body.type ?? '').trim();
    const resolvedType = typeTrim || PROMO_SERVICE_TYPE;
    const nameTrim = String(body.name ?? '').trim();
    if (!nameTrim) {
      return { error: 'Il titolo della promozione è obbligatorio.' };
    }
    const descTrim = String(body.description ?? '').trim() || ' ';
    const rawCost = body.cost;
    const numCost =
      rawCost === undefined || rawCost === '' || rawCost === null ? 0 : Number(rawCost);
    if (Number.isNaN(numCost) || numCost < 0) {
      return { error: 'Il costo deve essere un numero non negativo.' };
    }

    return {
      type: resolvedType,
      name: nameTrim,
      description: descTrim,
      media,
      cost: numCost,
      priceFrom: false,
      isPromo: true,
      promoStartsAt: dates.start,
      promoEndsAt: dates.end,
    };
  }

  const type = String(body.type ?? '').trim();
  const name = String(body.name ?? '').trim();
  const description = String(body.description ?? '').trim();
  if (!type || !name || !description || body.cost === undefined || body.cost === '') {
    return { error: 'Campi obbligatori mancanti: categoria, nome, descrizione, costo.' };
  }
  const numCost = Number(body.cost);
  if (Number.isNaN(numCost) || numCost < 0) {
    return { error: 'Il costo deve essere un numero non negativo.' };
  }

  return {
    type,
    name,
    description,
    media,
    cost: numCost,
    priceFrom: Boolean(body.priceFrom),
    isPromo: false,
    promoStartsAt: null,
    promoEndsAt: null,
  };
}
