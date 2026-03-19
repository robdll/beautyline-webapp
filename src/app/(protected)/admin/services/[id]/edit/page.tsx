'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Service {
  _id: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  cost: number;
}

export default function AdminServicesEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<Service | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/admin/services/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            _id: data._id,
            type: data.type || '',
            name: data.name || '',
            description: data.description || '',
            media: Array.isArray(data.media) ? data.media : [],
            cost: data.cost ?? 0,
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
    const numCost = typeof form.cost === 'number' ? form.cost : parseFloat(String(form.cost));
    if (isNaN(numCost) || numCost < 0) {
      alert('Il costo deve essere un numero non negativo.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          media: form.media,
          cost: numCost,
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
        <h1 className="text-2xl font-bold text-secondary font-raleway uppercase tracking-wide mt-2">
          Modifica Servizio
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setForm((f) => (f ? { ...f, type: e.target.value } : f))}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            />
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
              onChange={(e) => setForm((f) => (f ? { ...f, cost: parseFloat(e.target.value) || 0 } : f))}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
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
