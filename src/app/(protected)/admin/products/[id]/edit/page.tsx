'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { PRODUCT_BRANDS } from '@/lib/product-brands';

interface ColorOption {
  name: string;
  hex: string;
}

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function AdminProductsEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [cost, setCost] = useState('');
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);
  const selectedBrand = PRODUCT_BRANDS.find((b) => b.title === brand);
  const typeOptions = selectedBrand?.subcategories ?? [];
  const showLegacyBrandOption = Boolean(brand) && !PRODUCT_BRANDS.some((item) => item.title === brand);
  const showLegacyTypeOption = Boolean(type) && !typeOptions.some((item) => item.title === type);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/signin');
            return;
          }
          if (res.status === 404) {
            router.push('/admin/products');
            return;
          }
          throw new Error('Errore nel caricamento');
        }
        const data = await res.json();
        setBrand(data.brand || '');
        setType(data.type || '');
        setName(data.name || '');
        setDescription(data.description || '');
        setMedia(Array.isArray(data.media) ? data.media : []);
        setCost(data.cost != null ? String(data.cost) : '');
        setAvailableColors(
          Array.isArray(data.availableColors)
            ? data.availableColors.map((c: ColorOption) => ({
                name: c.name || '',
                hex: c.hex || '#000000',
              }))
            : []
        );
      } catch (err) {
        console.error(err);
        setError('Errore nel caricamento del prodotto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const addColor = () => {
    setAvailableColors((prev) => [...prev, { name: '', hex: '#000000' }]);
  };

  const removeColor = (index: number) => {
    setAvailableColors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    setAvailableColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const numCost = parseFloat(cost);
    if (isNaN(numCost) || numCost < 0) {
      setError('Il costo deve essere un numero non negativo.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brand.trim(),
          type: type.trim(),
          name: name.trim(),
          description: description.trim(),
          media,
          cost: numCost,
          availableColors: availableColors.filter((c) => c.name.trim() && c.hex.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Errore nell\'aggiornamento');
        setSubmitting(false);
        return;
      }
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      setError('Errore nell\'aggiornamento');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">Caricamento...</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          ← Torna ai prodotti
        </Link>
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide mt-2">
          Modifica Prodotto
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="brand" className={labelClass}>
              Categoria principale
            </label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setType('');
              }}
              className={inputClass}
              required
            >
              <option value="">Seleziona categoria principale</option>
              {showLegacyBrandOption && <option value={brand}>{brand}</option>}
              {PRODUCT_BRANDS.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Sottocategoria
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass}
              required
              disabled={!brand}
            >
              <option value="">
                {brand ? 'Seleziona sottocategoria' : 'Seleziona prima la categoria principale'}
              </option>
              {showLegacyTypeOption && <option value={type}>{type}</option>}
              {typeOptions.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Descrizione
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              rows={4}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Immagini</label>
            <ImageUpload
              images={media}
              onChange={setMedia}
              folder="beautyline/products"
            />
          </div>

          <div>
            <label htmlFor="cost" className={labelClass}>
              Costo (€)
            </label>
            <input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Colori disponibili</label>
              <button
                type="button"
                onClick={addColor}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                + Aggiungi colore
              </button>
            </div>
            {availableColors.length > 0 && (
              <div className="flex flex-col gap-3">
                {availableColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(index, 'hex', e.target.value)}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      placeholder="Nome colore"
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-500 hover:text-red-600 p-1"
                      aria-label="Rimuovi colore"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" variant="primary" size="md" disabled={submitting}>
            {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
          </Button>
        </div>
      </form>
    </div>
  );
}
