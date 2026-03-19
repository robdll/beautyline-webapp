'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  onEssential: () => void;
  onAll: () => void;
};

export function CookieConsentBanner({ onEssential, onAll }: Props) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-primary/40 bg-secondary text-white shadow-[0_-8px_32px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8 lg:py-6">
        <div className="max-w-2xl space-y-2 text-sm text-gray-300">
          <h2 id="cookie-consent-title" className="heading-brand text-base font-bold uppercase tracking-wider text-white">
            Utilizziamo i cookie
          </h2>
          <p id="cookie-consent-desc" className="leading-relaxed">
            Utilizziamo cookie necessari al funzionamento del sito. Con il tuo consenso, in futuro potremo attivare anche
            strumenti di analisi (es. Google Analytics) e pubblicità (es. Google Ads). Consulta l&apos;
            <Link href="/informativa-cookie" className="text-primary underline-offset-2 hover:underline">
              informativa cookie
            </Link>{' '}
            e l&apos;
            <Link href="/informativa-privacy" className="text-primary underline-offset-2 hover:underline">
              informativa sulla privacy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={onEssential}
            className="rounded-full border border-white/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-primary hover:bg-white/5"
          >
            Essenziali
          </button>
          <button
            type="button"
            onClick={onAll}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-secondary transition-opacity hover:opacity-95"
          >
            Tutti
          </button>
        </div>
      </div>
    </div>
  );
}
