'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { CookieConsentChoice } from '@/lib/cookie-consent';
import { getStoredConsent, marketingCookiesAllowed, saveConsent } from '@/lib/cookie-consent';
import { CookieConsentBanner } from '@/components/CookieConsent';

type CookieConsentContextValue = {
  consent: CookieConsentChoice | null;
  marketingAllowed: boolean;
  openPreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<CookieConsentChoice | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
    setReady(true);
  }, []);

  const openPreferences = useCallback(() => setPrefsOpen(true), []);

  const setChoice = useCallback((choice: CookieConsentChoice) => {
    saveConsent(choice);
    setConsent(choice);
    setPrefsOpen(false);
  }, []);

  const marketingAllowed = marketingCookiesAllowed(consent);

  const value = useMemo(
    () => ({
      consent,
      marketingAllowed,
      openPreferences,
    }),
    [consent, marketingAllowed, openPreferences],
  );

  const showBanner = ready && (consent === null || prefsOpen);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {showBanner ? (
        <CookieConsentBanner onEssential={() => setChoice('essential')} onAll={() => setChoice('all')} />
      ) : null}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}
