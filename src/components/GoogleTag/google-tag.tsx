'use client';

import Script from 'next/script';

import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { GOOGLE_ADS_ID, googleAdsConfigured } from '@/lib/google-ads';

export function GoogleTag() {
  const { marketingAllowed } = useCookieConsent();

  if (!googleAdsConfigured() || !marketingAllowed) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
