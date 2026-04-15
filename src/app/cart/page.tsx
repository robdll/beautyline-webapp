'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { displayPublicTitle } from '@/lib/display-text';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Section className="bg-muted min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="heading-brand text-3xl font-bold mb-8 uppercase tracking-wide">
          Carrello
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-6">Il tuo carrello è vuoto.</p>
            <Link href="/prodotti">
              <Button variant="primary" size="md">
                Scopri i Prodotti
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => {
                const displayName =
                  item.type === 'course' ? displayPublicTitle(item.name) : item.name;
                return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                  {item.image && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={item.image} alt={displayName} fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="heading-brand font-medium text-sm truncate">{displayName}</h3>
                    <p className="text-xs text-gray-400 capitalize">{item.type === 'course' ? 'Corso' : 'Prodotto'}</p>
                    <p className="text-primary font-bold mt-1">€ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.type === 'product' && (
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 text-gray-500 hover:text-secondary disabled:opacity-30 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-secondary transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Rimuovi"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
              })}
            </div>

            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="heading-brand font-bold mb-4">Riepilogo</h2>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Articoli ({totalItems})</span>
                    <span>€ {totalPrice.toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-secondary text-lg pt-2">
                    <span>Totale</span>
                    <span>€ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                {user ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-6 uppercase tracking-wider font-bold"
                    onClick={handleCheckout}
                  >
                    Procedi al Checkout
                  </Button>
                ) : (
                  <div className="mt-6 flex flex-col gap-3">
                    <p className="text-xs text-gray-400 text-center">
                      Accedi per completare l&apos;acquisto
                    </p>
                    <Link href="/signin?callbackUrl=/cart">
                      <Button variant="primary" size="lg" className="w-full uppercase tracking-wider font-bold">
                        Accedi
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
