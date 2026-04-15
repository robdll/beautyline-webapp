import { slugifyCourseName } from '@/lib/course-slug';

export const SERVICE_CATEGORIES = [
  'Viso',
  'Corpo',
  'Tecnologie Viso e Corpo',
  'Epilazione laser',
  'Mani e Piedi',
  'Ciglia e Sopracciglia',
] as const;

/** Stored on promo-only rows; not shown as a treatment category on the public page. */
export const PROMO_SERVICE_TYPE = 'Promozioni' as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** URL hash for `/servizi-estetica#…`, matching anchors on the public treatments page. */
export function serviceCategoryAnchorId(category: string): string {
  return slugifyCourseName(category);
}

export function isValidServiceCategory(type: string): type is ServiceCategory {
  return (SERVICE_CATEGORIES as readonly string[]).includes(type);
}

export function isRecognizedServiceType(type: string, isPromo?: boolean): boolean {
  if (isValidServiceCategory(type)) return true;
  if (isPromo && type === PROMO_SERVICE_TYPE) return true;
  return false;
}

/** Whether a promo row should appear in the public Promozioni section (date range, when set). */
export function isPromoVisibleNow(
  isPromo: boolean | undefined,
  promoStartsAt?: Date | string | null,
  promoEndsAt?: Date | string | null,
): boolean {
  if (!isPromo) return false;
  const now = new Date();
  if (promoStartsAt) {
    const start = new Date(promoStartsAt);
    if (!Number.isNaN(start.getTime()) && now < start) return false;
  }
  if (promoEndsAt) {
    const end = new Date(promoEndsAt);
    if (!Number.isNaN(end.getTime())) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      if (now > endOfDay) return false;
    }
  }
  return true;
}
