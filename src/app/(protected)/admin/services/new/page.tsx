'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminServicesNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: '',
    name: '',
    description: '',
    media: [] as string[],
    cost: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numCost = parseFloat(form.cost);
    if (isNaN(numCost) || numCost < 0) {
      alert('Il costo deve essere un numero non negativo.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
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
        <h1 className="text-2xl font-bold text-secondary font-raleway uppercase tracking-wide mt-2">
          Nuovo Servizio
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            />
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
