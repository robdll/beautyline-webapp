'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { cn } from '@/lib/utils';
import { formatPosterPeriod, type CoursePoster } from '@/types/course-poster';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const MONTH_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'Gennaio' },
  { value: 2, label: 'Febbraio' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Aprile' },
  { value: 5, label: 'Maggio' },
  { value: 6, label: 'Giugno' },
  { value: 7, label: 'Luglio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Settembre' },
  { value: 10, label: 'Ottobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Dicembre' },
];

function sortChronologically(posters: CoursePoster[]): CoursePoster[] {
  return [...posters].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}

export default function AdminCoursePostersPage() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [posters, setPosters] = useState<CoursePoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState<{ image: string[]; month: number; year: number }>({
    image: [],
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/course-posters');
      if (res.status === 401 || res.status === 403) {
        router.push('/signin');
        return;
      }
      if (!res.ok) throw new Error('load');
      const data = (await res.json()) as CoursePoster[];
      setPosters(sortChronologically(data));
    } catch (err) {
      console.error('Errore nel caricamento delle locandine:', err);
      setMessage({ kind: 'error', text: 'Impossibile caricare le locandine.' });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({
      image: [],
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const image = form.image[0];
    if (!image) {
      setMessage({ kind: 'error', text: 'Carica un\'immagine per la locandina.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/course-posters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          month: form.month,
          year: form.year,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({
          kind: 'error',
          text: typeof data.error === 'string' ? data.error : 'Errore nella creazione della locandina.',
        });
        return;
      }
      setPosters((prev) => sortChronologically([...prev, data as CoursePoster]));
      resetForm();
      setMessage({ kind: 'success', text: 'Locandina caricata.' });
    } catch (err) {
      console.error('Errore nel salvataggio della locandina:', err);
      setMessage({ kind: 'error', text: 'Errore di rete.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa locandina?')) return;
    setDeletingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/course-posters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosters((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        setMessage({
          kind: 'error',
          text: typeof data.error === 'string' ? data.error : 'Errore nell\'eliminazione.',
        });
      }
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      setMessage({ kind: 'error', text: 'Errore di rete.' });
    } finally {
      setDeletingId(null);
    }
  };

  const yearOptions = useMemo(() => {
    const currentYear = today.getFullYear();
    const years: number[] = [];
    for (let y = currentYear - 1; y <= currentYear + 5; y += 1) {
      years.push(y);
    }
    return years;
  }, [today]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">Locandine corsi</h1>
          <p className="mt-1 text-sm text-gray-600 max-w-xl">
            Carica le locandine dei corsi mensili: saranno mostrate sulla pagina pubblica
            <span className="font-medium"> /corsi</span> in ordine cronologico.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/courses">
            <Button variant="secondary" size="md">
              Torna ai corsi
            </Button>
          </Link>
        </div>
      </div>

      {message ? (
        <p
          className={cn(
            'mb-6 text-sm font-medium',
            message.kind === 'success' ? 'text-green-700' : 'text-red-600',
          )}
          role="status"
        >
          {message.text}
        </p>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 h-fit"
        >
          <h2 className="heading-brand text-lg font-bold text-secondary">Nuova locandina</h2>

          <div>
            <label className={labelClass}>Immagine</label>
            <ImageUpload
              images={form.image}
              onChange={(images) => setForm((prev) => ({ ...prev, image: images.slice(0, 1) }))}
              folder="beautyline/courses/posters"
              maxImages={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="poster-month" className={labelClass}>
                Mese
              </label>
              <select
                id="poster-month"
                value={form.month}
                onChange={(e) => setForm((prev) => ({ ...prev, month: Number(e.target.value) }))}
                className={inputClass}
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="poster-year" className={labelClass}>
                Anno
              </label>
              <select
                id="poster-year"
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
                className={inputClass}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? 'Salvataggio…' : 'Carica locandina'}
            </Button>
          </div>
        </form>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="heading-brand text-lg font-bold text-secondary">Locandine disponibili</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-500">Caricamento…</div>
          ) : posters.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Nessuna locandina presente. Carica la prima utilizzando il modulo a fianco.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {posters.map((poster) => (
                <li
                  key={poster._id}
                  className="flex items-center gap-4 px-4 py-3 sm:px-6"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={poster.image}
                      alt={`Locandina ${formatPosterPeriod(poster.month, poster.year)}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 grow">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPosterPeriod(poster.month, poster.year)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{poster.image}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(poster._id)}
                    disabled={deletingId === poster._id}
                    className={cn(
                      'p-2 transition-colors',
                      deletingId === poster._id
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-red-500 hover:text-red-600',
                    )}
                    aria-label="Elimina locandina"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
