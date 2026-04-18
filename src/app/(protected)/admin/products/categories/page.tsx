'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import { PRODUCT_BRANDS } from '@/lib/product-brands';
import { makeProductCategoryKey } from '@/lib/product-category-visibility';

export default function AdminProductCategoriesPage() {
  const router = useRouter();
  const [disabledKeys, setDisabledKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/product-category-settings');
      if (res.status === 401 || res.status === 403) {
        router.push('/signin');
        return;
      }
      if (!res.ok) throw new Error('load');
      const data = (await res.json()) as { disabledKeys?: string[] };
      setDisabledKeys(new Set(Array.isArray(data.disabledKeys) ? data.disabledKeys : []));
    } catch {
      setMessage('Impossibile caricare le impostazioni.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleKey = (key: string, off: boolean) => {
    setDisabledKeys((prev) => {
      const next = new Set(prev);
      if (off) next.add(key);
      else next.delete(key);
      return next;
    });
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/product-category-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabledKeys: [...disabledKeys] }),
      });
      if (res.status === 401 || res.status === 403) {
        router.push('/signin');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setMessage(typeof data.error === 'string' ? data.error : 'Salvataggio non riuscito.');
        return;
      }
      setDisabledKeys(new Set(Array.isArray(data.disabledKeys) ? data.disabledKeys : []));
      setMessage('Salvato.');
    } catch {
      setMessage('Errore di rete.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">Linee catalogo</h1>
          <p className="mt-1 text-sm text-gray-600 max-w-xl">
            Disattiva una sottocategoria per nasconderne i prodotti dal catalogo pubblico. Le schede restano visibili
            sulla pagina prodotti, ma non sono cliccabili finché non riattivi la linea.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products">
            <Button variant="secondary" size="md">
              Torna ai prodotti
            </Button>
          </Link>
          <Button variant="primary" size="md" onClick={() => void save()} disabled={saving || loading}>
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </div>
      </div>

      {message ? (
        <p
          className={`mb-6 text-sm font-medium ${message === 'Salvato.' ? 'text-green-700' : 'text-red-600'}`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Caricamento…</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {PRODUCT_BRANDS.map((brand) => (
              <section key={brand.id} className="p-6 md:p-8">
                <h2 className="heading-brand text-lg font-bold text-secondary mb-4">{brand.title}</h2>
                <ul className="space-y-3">
                  {brand.subcategories.map((sub) => {
                    const key = makeProductCategoryKey(brand.id, sub.id);
                    const hidden = disabledKeys.has(key);
                    return (
                      <li
                        key={sub.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3"
                      >
                        <span className="font-medium text-gray-900">{sub.title}</span>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={hidden}
                            onChange={(e) => toggleKey(key, e.target.checked)}
                          />
                          Catalogo disattivato
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
