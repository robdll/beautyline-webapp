'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { EQUIPMENT_TYPES, EQUIPMENT_TYPE_LABELS, parseEquipmentType } from '@/lib/equipment-types';

interface EquipmentData {
  _id: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
}

export default function AdminEquipmentEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<EquipmentData | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`/api/admin/equipment/${id}`);
        if (!res.ok) {
          if (res.status === 404) router.push('/admin/equipment');
          return;
        }
        const data = await res.json();
        const normalizedType = parseEquipmentType(data.type) ?? '';
        setForm({ ...data, type: normalizedType });
      } catch (err) {
        console.error(err);
        router.push('/admin/equipment');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchEquipment();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Errore nell\'aggiornamento');
      }
      router.push('/admin/equipment');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'aggiornamento');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  if (fetching || !form) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/equipment"
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Torna alle attrezzature
        </Link>
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide mt-2">
          Modifica Attrezzatura
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid gap-6">
          <div>
            <label className={labelClass}>Categoria *</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => (f ? { ...f, type: e.target.value } : f))}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Seleziona una categoria
              </option>
              {EQUIPMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EQUIPMENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Descrizione *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
              className={inputClass}
              rows={4}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Immagini</label>
            <ImageUpload
              images={form.media || []}
              onChange={(images) => setForm((f) => (f ? { ...f, media: images } : f))}
              folder="beautyline/equipment"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.rentOnly}
                onChange={(e) => setForm((f) => (f ? { ...f, rentOnly: e.target.checked } : f))}
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
                value={form.rentCostPerDay ?? ''}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, rentCostPerDay: parseFloat(e.target.value) || 0 } : f
                  )
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
                value={form.rentCostPerMonth ?? ''}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, rentCostPerMonth: parseFloat(e.target.value) || 0 } : f
                  )
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
                value={form.sellingCost ?? ''}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, sellingCost: parseFloat(e.target.value) || 0 } : f
                  )
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? 'Salvataggio...' : 'Salva modifiche'}
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
