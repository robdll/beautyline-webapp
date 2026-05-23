'use client';

import { useEffect } from 'react';

import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { getStoredConsent, marketingCookiesAllowed } from '@/lib/cookie-consent';
import { googleAdsConfigured, updateGoogleConsent } from '@/lib/google-ads';

export function GoogleConsentUpdater() {
  const { marketingAllowed, consent } = useCookieConsent();

  useEffect(() => {
    if (!googleAdsConfigured()) return;

    const choice = consent ?? getStoredConsent();
    if (choice === null) return;

    updateGoogleConsent(marketingCookiesAllowed(choice));
  }, [marketingAllowed, consent]);

  return null;
}
