import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'https://beautylineprofessional.com';

/** Canonical public site origin (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  DEFAULT_SITE_URL
).replace(/\/$/, '');

export function pageCanonical(path: string): Metadata['alternates'] {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const suffix = normalizedPath === '/' ? '' : normalizedPath;
  return {
    canonical: `${SITE_URL}${suffix}`,
  };
}
