'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import type { AdminProduct } from '@/types/product';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/signin');
          return;
        }
        throw new Error('Errore nel caricamento');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'eliminazione');
      }
    } catch (err) {
      console.error(err);
      alert('Errore nell\'eliminazione');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">
          Prodotti
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/categories">
            <Button variant="secondary" size="md">
              Linee catalogo
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button variant="primary" size="md">
              Nuovo Prodotto
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Caricamento...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nessun prodotto. Crea il primo prodotto.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Nome</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Brand</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Costo</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const variantsCount = product.variants?.length ?? 0;
                  const hasVariants = variantsCount > 0;
                  return (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-secondary">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.type}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-primary font-medium">€ {product.cost.toFixed(2)}</span>
                        {hasVariants && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            title={`Prodotto con ${variantsCount} ${variantsCount === 1 ? 'variante' : 'varianti'}. Il costo mostrato è quello della prima.`}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            {variantsCount} {variantsCount === 1 ? 'variante' : 'varianti'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product._id}/edit`}>
                          <button
                            type="button"
                            className="text-primary hover:text-primary/80 transition-colors p-1"
                            aria-label="Modifica"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className={cn(
                            'p-1 transition-colors',
                            deletingId === product._id
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-red-500 hover:text-red-600'
                          )}
                          aria-label="Elimina"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
