import Script from 'next/script';

import { GOOGLE_ADS_ID, googleAdsConfigured } from '@/lib/google-ads';

import { GoogleConsentUpdater } from './google-consent-updater';

export function GoogleTag() {
  if (!googleAdsConfigured()) {
    return null;
  }

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      <GoogleConsentUpdater />
    </>
  );
}
