'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { EQUIPMENT_TYPES, EQUIPMENT_TYPE_LABELS } from '@/lib/equipment-types';

export default function AdminEquipmentNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: '',
    name: '',
    description: '',
    media: [] as string[],
    technicalSheet: '',
  });

  const toSlug = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handlePdfUpload = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Puoi caricare solo file PDF.');
      return;
    }

    const slug = toSlug(form.name);
    if (!slug) {
      setPdfError('Inserisci prima il nome dell\'attrezzatura.');
      return;
    }

    setUploadingPdf(true);
    setPdfError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'beautyline/equipment/schede-tecniche');
      formData.append('publicId', slug);
      formData.append('resourceType', 'raw');
      formData.append('format', 'pdf');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.details || data.error || 'Upload non riuscito.');
      }

      setForm((prev) => ({ ...prev, technicalSheet: data.url }));
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Errore durante il caricamento del PDF.');
    } finally {
      setUploadingPdf(false);
    }
  };

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
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide mt-2">
          Nuova Attrezzatura
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid gap-6">
          <div>
            <label className={labelClass}>Categoria *</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
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
          <div className="mb-4">
            <label className={labelClass}>Scheda Tecnica (PDF)</label>
            <input
              id="technical-sheet-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePdfUpload(file);
                e.currentTarget.value = '';
              }}
              disabled={uploadingPdf}
              className="hidden"
            />
            <label
              htmlFor="technical-sheet-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors ${
                uploadingPdf ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Carica Scheda Tecnica
            </label>
            {uploadingPdf && <p className="mt-2 text-sm text-gray-500">Caricamento PDF...</p>}
            {form.technicalSheet && (
              <div className="mt-2 flex items-center gap-3">
                <a
                  href={form.technicalSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Visualizza PDF caricato
                </a>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, technicalSheet: '' }))}
                  className="text-sm text-red-600 hover:underline"
                >
                  Rimuovi
                </button>
              </div>
            )}
            {pdfError && <p className="mt-2 text-sm text-red-600">{pdfError}</p>}
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
