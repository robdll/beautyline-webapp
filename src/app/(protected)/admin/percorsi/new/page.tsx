'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { PercorsoCoursesSelect } from '@/components/admin/PercorsoCoursesSelect';
import type { AdminPercorsoItem } from '@/types/percorso';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function AdminPercorsiNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    cost: '',
    media: [] as string[],
    items: [] as AdminPercorsoItem[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/percorsi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          cost: Number(form.cost) || 0,
          media: form.media,
          items: form.items,
        }),
      });

      if (res.ok) {
        router.push('/admin/percorsi');
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nella creazione del percorso.');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore nella creazione del percorso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="heading-brand text-2xl font-bold mb-8 uppercase tracking-wide">Nuovo Percorso</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Corsi del percorso</label>
            <p className="text-xs text-gray-500">
              Aggiungi i corsi che compongono il percorso, nell&apos;ordine desiderato, e scegli per
              ognuno la data di riferimento. I corsi devono già esistere: creali prima nella sezione
              Corsi.
            </p>
            <PercorsoCoursesSelect
              value={form.items}
              onChange={(items) => setForm((prev) => ({ ...prev, items }))}
            />
          </div>

          <div>
            <label htmlFor="cost" className={labelClass}>
              Costo pacchetto (€)
            </label>
            <input
              id="cost"
              name="cost"
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Immagini</label>
            <ImageUpload
              images={form.media}
              onChange={(images) => setForm((prev) => ({ ...prev, media: images }))}
              folder="beautyline/percorsi"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? 'Salvataggio...' : 'Crea Percorso'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
