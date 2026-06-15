'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/Button';

function ReimpostaPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      setTokenValid(false);
      return;
    }

    const resetToken = token;
    let cancelled = false;

    async function validateToken() {
      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(resetToken)}`
        );
        const data = await res.json();
        if (!cancelled) {
          setTokenValid(Boolean(data.valid));
        }
      } catch {
        if (!cancelled) {
          setTokenValid(false);
        }
      } finally {
        if (!cancelled) {
          setIsValidating(false);
        }
      }
    }

    validateToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Le password non corrispondono.');
      return;
    }

    if (password.length < 8) {
      setError('La password deve avere almeno 8 caratteri.');
      return;
    }

    if (!token) {
      setError('Link di recupero non valido o scaduto.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Si è verificato un errore. Riprova più tardi.');
        setIsLoading(false);
        return;
      }

      router.push('/signin?reset=success');
    } catch {
      setError('Si è verificato un errore. Riprova più tardi.');
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">
            Verifica link...
          </h1>
          <p className="text-gray-500 text-sm">
            Stiamo verificando il link di recupero password.
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">
            Link non valido
          </h1>
          <p className="text-gray-500 text-sm">
            Il link di recupero password non è valido o è scaduto.
          </p>
          <div className="w-full pt-1">
            <Link href="/recupero-password">
              <Button variant="primary" size="lg" className="w-full">
                Richiedi un nuovo link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="heading-brand text-3xl font-bold text-center mb-2 uppercase tracking-wide">
          Nuova Password
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Scegli una nuova password per il tuo account
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nuova password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              placeholder="Minimo 8 caratteri"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Conferma password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              placeholder="Ripeti la password"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Aggiornamento in corso...' : 'Reimposta password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReimpostaPasswordFallback() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mx-auto mb-4 h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto mb-8 h-4 w-64 max-w-full animate-pulse rounded bg-gray-100" />
        <div className="space-y-6">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-primary/20" />
        </div>
      </div>
    </div>
  );
}

export default function ReimpostaPasswordPage() {
  return (
    <Suspense fallback={<ReimpostaPasswordFallback />}>
      <ReimpostaPasswordForm />
    </Suspense>
  );
}
