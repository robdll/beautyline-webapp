import React from 'react';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';

export default function CheckoutCancelPage() {
  return (
    <Section className="bg-muted min-h-[calc(100vh-4rem)]">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-3 font-raleway uppercase tracking-wide">
          Pagamento Annullato
        </h1>
        <p className="text-gray-500 mb-8">
          Il pagamento è stato annullato. Il tuo carrello è ancora disponibile.
        </p>
        <Link href="/cart">
          <Button variant="primary" size="lg">
            Torna al Carrello
          </Button>
        </Link>
      </div>
    </Section>
  );
}
