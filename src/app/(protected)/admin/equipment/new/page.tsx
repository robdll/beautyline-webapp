'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminEquipmentNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: '',
    name: '',
    description: '',
    media: [] as string[],
    rentOnly: false,
    rentCostPerDay: 0,
    rentCostPerMonth: 0,
    sellingCost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Errore nella creazione');
      }
      router.push('/admin/equipment');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nella creazione');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/equipment"
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Torna alle attrezzature
        </Link>
        <h1 className="text-2xl font-bold text-secondary font-raleway uppercase tracking-wide mt-2">
          Nuova Attrezzatura
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid gap-6">
          <div>
            <label className={labelClass}>Tipo *</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Descrizione *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass}
              rows={4}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Immagini</label>
            <ImageUpload
              images={form.media}
              onChange={(images) => setForm((f) => ({ ...f, media: images }))}
              folder="beautyline/equipment"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.rentOnly}
                onChange={(e) => setForm((f) => ({ ...f, rentOnly: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className={labelClass}>Solo noleggio</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Costo noleggio/giorno (€)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.rentCostPerDay || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rentCostPerDay: parseFloat(e.target.value) || 0 }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Costo noleggio/mese (€)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.rentCostPerMonth || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rentCostPerMonth: parseFloat(e.target.value) || 0 }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Prezzo vendita (€)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.sellingCost || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sellingCost: parseFloat(e.target.value) || 0 }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? 'Salvataggio...' : 'Crea attrezzatura'}
          </Button>
          <Link href="/admin/equipment">
            <Button type="button" variant="outline" size="md">
              Annulla
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
