'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export default function RecuperoPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Si è verificato un errore. Riprova più tardi.');
        return;
      }

      setSuccess(
        data.message ||
          'Se l\'account esiste, riceverai un\'email con le istruzioni per reimpostare la password.'
      );
    } catch {
      setError('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="heading-brand text-3xl font-bold text-center mb-2 uppercase tracking-wide">
          Recupero Password
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Inserisci la tua email e ti invieremo un link per reimpostare la password
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              placeholder="la-tua@email.com"
            />
          </div>

          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || Boolean(success)}
            >
              {isLoading ? 'Invio in corso...' : 'Invia link di recupero'}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ricordi la password?{' '}
          <Link href="/signin" className="text-primary hover:underline font-medium">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
