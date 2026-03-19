'use client';

import React from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export function CookiePreferencesTrigger({
  className = 'text-gray-500 hover:text-primary transition-colors underline-offset-2 hover:underline',
}: {
  className?: string;
}) {
  const { openPreferences } = useCookieConsent();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      Preferenze cookie
    </button>
  );
}
