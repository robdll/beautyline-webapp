'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { PROMO_SERVICE_TYPE, SERVICE_CATEGORIES } from '@/lib/service-categories';
import type { ServiceForm } from '@/types/service';

function toDateInputValue(d: unknown): string {
  if (d == null || d === '') return '';
  const x = new Date(d as string);
  if (Number.isNaN(x.getTime())) return '';
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AdminServicesEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<ServiceForm | null>(null);
  const showLegacyTypeOption =
    Boolean(form?.type) && !SERVICE_CATEGORIES.some((category) => category === form?.type);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/admin/services/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            _id: data._id,
            isPromo: Boolean(data.isPromo),
            promoStartsAt: toDateInputValue(data.promoStartsAt),
            promoEndsAt: toDateInputValue(data.promoEndsAt),
            type: data.type || '',
            name: data.name || '',
            description: data.description || '',
            media: Array.isArray(data.media) ? data.media : [],
            cost: data.cost ?? 0,
            priceFrom: Boolean(data.priceFrom),
          });
        } else {
          const data = await res.json();
          alert(data.error || 'Servizio non trovato.');
          router.push('/admin/services');
        }
      } catch (err) {
        console.error('Errore nel caricamento del servizio:', err);
        router.push('/admin/services');
      } finally {
        setFetching(false);
      }
    };
    fetchService();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

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
    } else if (form.type === PROMO_SERVICE_TYPE) {
      alert('Seleziona una categoria valida per un servizio non promozionale.');
      return;
    } else {
      const numCost = typeof form.cost === 'number' ? form.cost : parseFloat(String(form.cost));
      if (isNaN(numCost) || numCost < 0) {
        alert('Il costo deve essere un numero non negativo.');
        return;
      }
    }

    setLoading(true);
    try {
      const numCost = typeof form.cost === 'number' ? form.cost : parseFloat(String(form.cost));
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPromo: form.isPromo,
          promoStartsAt: form.isPromo ? form.promoStartsAt : undefined,
          promoEndsAt: form.isPromo ? form.promoEndsAt : undefined,
          type: form.type.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          media: form.media,
          cost: form.isPromo ? (isNaN(numCost) ? 0 : numCost) : numCost,
          priceFrom: form.isPromo ? false : form.priceFrom,
        }),
      });
      if (res.ok) {
        router.push('/admin/services');
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'aggiornamento del servizio.');
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento:', err);
      alert('Errore nell\'aggiornamento del servizio.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !form) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/services" className="text-sm text-gray-500 hover:text-primary transition-colors">
          ← Torna ai servizi
        </Link>
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide mt-2">
          Modifica Servizio
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="flex flex-col gap-5">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isPromo}
              onChange={(e) =>
                setForm((f) => (f ? { ...f, isPromo: e.target.checked } : f))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-800">Promo</span>
          </label>
          <p className="-mt-2 text-xs text-gray-500">
            {form.isPromo
              ? 'Titolo, periodo e immagine sono obbligatori. Gli altri dati (categoria, ecc.) restano salvati anche se non mostrati qui: deseleziona Promo per modificarli.'
              : null}
          </p>

          {form.isPromo ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Titolo promozione</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))}
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
                    onChange={(e) => setForm((f) => (f ? { ...f, promoStartsAt: e.target.value } : f))}
                    required={form.isPromo}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fine promozione</label>
                  <input
                    type="date"
                    value={form.promoEndsAt}
                    onChange={(e) => setForm((f) => (f ? { ...f, promoEndsAt: e.target.value } : f))}
                    required={form.isPromo}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immagine promozione</label>
                <ImageUpload
                  images={form.media}
                  onChange={(images) => setForm((f) => (f ? { ...f, media: images } : f))}
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
                  onChange={(e) => setForm((f) => (f ? { ...f, type: e.target.value } : f))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="">Seleziona categoria</option>
                  {showLegacyTypeOption && <option value={form.type}>{form.type}</option>}
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
                  onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immagini</label>
                <ImageUpload
                  images={form.media}
                  onChange={(images) => setForm((f) => (f ? { ...f, media: images } : f))}
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
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, cost: parseFloat(e.target.value) || 0 } : f))
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.priceFrom}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, priceFrom: e.target.checked } : f))
                  }
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
            {loading ? 'Salvataggio...' : 'Salva Modifiche'}
          </Button>
        </div>
      </form>
    </div>
  );
}
