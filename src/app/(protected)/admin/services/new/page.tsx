'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SERVICE_CATEGORIES } from '@/lib/service-categories';

export default function AdminServicesNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    isPromo: false,
    promoStartsAt: '',
    promoEndsAt: '',
    type: '',
    name: '',
    description: '',
    media: [] as string[],
    cost: '',
    priceFrom: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.isPromo) {
      if (!form.promoStartsAt || !form.promoEndsAt) {
        alert('Inserisci le date di inizio e fine della promozione.');
        return;
      }
      if (!form.media[0]) {
        alert('Carica un’immagine per la promozione.');
        return;
      }
      if (!form.name.trim()) {
        alert('Inserisci il titolo della promozione.');
        return;
      }
    } else {
      const numCost = parseFloat(form.cost);
      if (isNaN(numCost) || numCost < 0) {
        alert('Il costo deve essere un numero non negativo.');
        return;
      }
    }

    setLoading(true);
    try {
      const numCost = parseFloat(form.cost);
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPromo: form.isPromo,
          promoStartsAt: form.isPromo ? form.promoStartsAt : undefined,
          promoEndsAt: form.isPromo ? form.promoEndsAt : undefined,
          type: form.isPromo ? form.type.trim() : form.type.trim(),
          name: form.isPromo ? form.name.trim() : form.name.trim(),
          description: form.isPromo ? form.description.trim() : form.description.trim(),
          media: form.media,
          cost: form.isPromo ? (isNaN(numCost) ? 0 : numCost) : numCost,
          priceFrom: form.isPromo ? false : form.priceFrom,
        }),
      });
      if (res.ok) {
        router.push('/admin/services');
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nella creazione del servizio.');
      }
    } catch (err) {
      console.error('Errore nella creazione:', err);
      alert('Errore nella creazione del servizio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/services" className="text-sm text-gray-500 hover:text-primary transition-colors">
          ← Torna ai servizi
        </Link>
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide mt-2">
          Nuovo Servizio
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="flex flex-col gap-5">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isPromo}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  isPromo: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-800">Promo</span>
          </label>
          <p className="-mt-2 text-xs text-gray-500">
            {form.isPromo
              ? 'Per le promozioni servono titolo, periodo di validità e immagine. Descrizione e costo sono opzionali.'
              : 'Servizio standard: compila tutti i campi sotto.'}
          </p>

          {form.isPromo ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Titolo promozione</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required={form.isPromo}
                  placeholder="Es. Sconto viso primavera"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inizio promozione</label>
                  <input
                    type="date"
                    value={form.promoStartsAt}
                    onChange={(e) => setForm((f) => ({ ...f, promoStartsAt: e.target.value }))}
                    required={form.isPromo}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fine promozione</label>
                  <input
                    type="date"
                    value={form.promoEndsAt}
                    onChange={(e) => setForm((f) => ({ ...f, promoEndsAt: e.target.value }))}
                    required={form.isPromo}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immagine promozione</label>
                <ImageUpload
                  images={form.media}
                  onChange={(images) => setForm((f) => ({ ...f, media: images }))}
                  folder="beautyline/services"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="">Seleziona categoria</option>
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immagini</label>
                <ImageUpload
                  images={form.media}
                  onChange={(images) => setForm((f) => ({ ...f, media: images }))}
                  folder="beautyline/services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.cost}
                  onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.priceFrom}
                  onChange={(e) => setForm((f) => ({ ...f, priceFrom: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-800">Prezzo a partire da</span>
              </label>
              <p className="-mt-3 text-xs text-gray-500">
                Se attivo, sulla scheda pubblica compare «A partire da» sopra l&apos;importo.
              </p>
            </>
          )}
        </div>

        <div className="mt-6">
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? 'Salvataggio...' : 'Crea Servizio'}
          </Button>
        </div>
      </form>
    </div>
  );
}
