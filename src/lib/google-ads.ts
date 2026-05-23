/** Google Ads tag id (e.g. AW-18143736615). */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ?? '';

/**
 * Full `send_to` from Google Ads conversion snippet (e.g. AW-18143736615/AbCdEfGh).
 * Set when configuring the "Richiedi informazioni" conversion action.
 */
export const GOOGLE_ADS_COURSE_INFO_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_COURSE_INFO_CONVERSION_SEND_TO?.trim() ?? '';

export function googleAdsConfigured(): boolean {
  return GOOGLE_ADS_ID.length > 0;
}

export function googleAdsCourseInfoConversionConfigured(): boolean {
  return GOOGLE_ADS_COURSE_INFO_CONVERSION_SEND_TO.length > 0;
}

export type GoogleConsentStatus = 'granted' | 'denied';

export type GoogleConsentParams = {
  ad_storage: GoogleConsentStatus;
  ad_user_data: GoogleConsentStatus;
  ad_personalization: GoogleConsentStatus;
  analytics_storage: GoogleConsentStatus;
};

/** Consent Mode v2 parameters for gtag consent default/update. */
export function getGoogleConsentParams(marketingAllowed: boolean): GoogleConsentParams {
  const status: GoogleConsentStatus = marketingAllowed ? 'granted' : 'denied';
  return {
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
    analytics_storage: status,
  };
}

type Gtag = (...args: unknown[]) => void;

function getGtag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  const gtag = (window as Window & { gtag?: Gtag }).gtag;
  return typeof gtag === 'function' ? gtag : null;
}

/** Syncs Google Consent Mode v2 with the user's cookie choice. */
export function updateGoogleConsent(marketingAllowed: boolean): void {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('consent', 'update', getGoogleConsentParams(marketingAllowed));
}

/** Fires the Google Ads conversion for a course "Richiedi informazioni" click. */
export function trackCourseInfoRequestConversion(): void {
  const sendTo = GOOGLE_ADS_COURSE_INFO_CONVERSION_SEND_TO;
  if (!sendTo) return;

  const gtag = getGtag();
  if (!gtag) return;

  gtag('event', 'conversion', { send_to: sendTo });
}
