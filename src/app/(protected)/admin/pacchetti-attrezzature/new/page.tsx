'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { EquipmentPromoItemsSelect } from '@/components/admin/EquipmentPromoItemsSelect';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function AdminPacchettoNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    details: '',
    annualPrice: '',
    badge: '',
    media: [] as string[],
    equipmentIds: [] as string[],
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
      const res = await fetch('/api/admin/pacchetti-attrezzature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          details: form.details,
          annualPrice: Number(form.annualPrice) || 0,
          badge: form.badge,
          media: form.media,
          equipmentIds: form.equipmentIds,
        }),
      });

      if (res.ok) {
        router.push('/admin/pacchetti-attrezzature');
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nella creazione del pacchetto.');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore nella creazione del pacchetto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/pacchetti-attrezzature"
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Torna ai pacchetti
        </Link>
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide mt-2">
          Nuovo Pacchetto
        </h1>
      </div>

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
              Descrizione breve
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="details" className={labelClass}>
              Descrizione estesa (pagina di dettaglio)
            </label>
            <textarea
              id="details"
              name="details"
              value={form.details}
              onChange={handleChange}
              rows={4}
              placeholder="Se lasciata vuota, viene usata la descrizione breve."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Attrezzature del pacchetto</label>
            <p className="text-xs text-gray-500">
              Seleziona le attrezzature che compongono il pacchetto, nell&apos;ordine desiderato. Le
              attrezzature devono già esistere: creale prima nella sezione Attrezzature.
            </p>
            <EquipmentPromoItemsSelect
              value={form.equipmentIds}
              onChange={(equipmentIds) => setForm((prev) => ({ ...prev, equipmentIds }))}
            />
          </div>

          <div>
            <label htmlFor="annualPrice" className={labelClass}>
              Prezzo annuo (€)
            </label>
            <input
              id="annualPrice"
              name="annualPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.annualPrice}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="badge" className={labelClass}>
              Etichetta (opzionale)
            </label>
            <input
              id="badge"
              name="badge"
              type="text"
              value={form.badge}
              onChange={handleChange}
              placeholder='Es. "Più richiesto"'
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Immagine di copertina</label>
            <ImageUpload
              images={form.media}
              onChange={(images) => setForm((prev) => ({ ...prev, media: images }))}
              folder="beautyline/pacchetti-attrezzature"
              maxImages={1}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? 'Salvataggio...' : 'Crea Pacchetto'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
