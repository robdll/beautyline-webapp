export type CookieConsentChoice = 'essential' | 'all';

const STORAGE_KEY = 'beautyline-cookie-consent';
const SCHEMA_VERSION = 1;

/** 24 hours in ms — “essential only” consent is re-prompted after this. */
export const ESSENTIAL_CONSENT_TTL_MS = 24 * 60 * 60 * 1000;

type StoredEssential = { v: typeof SCHEMA_VERSION; choice: 'essential'; expiresAt: number };
type StoredAll = { v: typeof SCHEMA_VERSION; choice: 'all' };
type Stored = StoredEssential | StoredAll;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getStoredConsent(): CookieConsentChoice | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data) || data.v !== SCHEMA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (data.choice === 'all') return 'all';

    if (data.choice === 'essential' && typeof data.expiresAt === 'number') {
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return 'essential';
    }

    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveConsent(choice: CookieConsentChoice): void {
  if (typeof window === 'undefined') return;

  const payload: Stored =
    choice === 'all'
      ? { v: SCHEMA_VERSION, choice: 'all' }
      : { v: SCHEMA_VERSION, choice: 'essential', expiresAt: Date.now() + ESSENTIAL_CONSENT_TTL_MS };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function marketingCookiesAllowed(choice: CookieConsentChoice | null): boolean {
  return choice === 'all';
}
