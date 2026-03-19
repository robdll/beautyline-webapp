'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/Button';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified') === 'true';

  if (verified) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-3 font-raleway uppercase tracking-wide">
            Email Verificata
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Il tuo account è stato verificato con successo. Ora puoi accedere.
          </p>
          <Link href="/signin">
            <Button variant="primary" size="lg" className="w-full">
              Accedi
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-secondary mb-3 font-raleway uppercase tracking-wide">
          Controlla la tua Email
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Ti abbiamo inviato un&apos;email con un link di verifica.
          Clicca sul link per attivare il tuo account.
        </p>
        <p className="text-gray-400 text-xs">
          Non hai ricevuto l&apos;email? Controlla la cartella spam o{' '}
          <Link href="/signup" className="text-primary hover:underline">
            riprova la registrazione
          </Link>.
        </p>
      </div>
    </div>
  );
}
