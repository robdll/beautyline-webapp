import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/api/',
        '/cart',
        '/checkout/',
        '/signin',
        '/signup',
        '/verify',
        '/recupero-password',
        '/reimposta-password',
        '/percorso-master',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ''),
  };
}
