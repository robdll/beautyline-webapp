'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Section className="bg-muted min-h-[calc(100vh-4rem)]">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-3 font-raleway uppercase tracking-wide">
          Ordine Confermato
        </h1>
        <p className="text-gray-500 mb-8">
          Grazie per il tuo acquisto! Riceverai una conferma via email a breve.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Torna alla Home
          </Button>
        </Link>
      </div>
    </Section>
  );
}
