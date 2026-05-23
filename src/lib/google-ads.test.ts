import { describe, expect, it } from 'vitest';

import { getGoogleConsentParams } from './google-ads';

describe('getGoogleConsentParams', () => {
  it('denies all Consent Mode v2 signals when marketing is not allowed', () => {
    expect(getGoogleConsentParams(false)).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('grants all Consent Mode v2 signals when marketing is allowed', () => {
    expect(getGoogleConsentParams(true)).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });
});
