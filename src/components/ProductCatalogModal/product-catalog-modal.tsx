'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PRODUCT_BRANDS } from '@/lib/product-brands';
import {
  findBrandBySlug,
  findLineaBySlug,
  lineeForBrandSlug,
  readLineaSlug,
  readMarcaSlug,
  shouldOpenProductCatalog,
} from '@/lib/product-catalog';
import type { PublicProductJson } from '@/lib/public-product';

const modalIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

const selectClass =
  'w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 md:max-w-none';

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ProductThumb({ product }: { product: PublicProductJson }) {
  const [src, setSrc] = useState(product.image);
  const isRemote = src.startsWith('http://') || src.startsWith('https://');

  return (
    <Image
      src={src}
      alt=""
      fill
      className="object-cover"
      sizes="144px"
      unoptimized={isRemote}
      onError={() => setSrc('https://placehold.co/300x300.png')}
    />
  );
}

function buildCatalogSearchParams(opts: {
  catalogo: boolean;
  marca: string | null;
  linea: string | null;
}): string {
  const qs = new URLSearchParams();
  if (opts.catalogo) qs.set('catalogo', '1');
  if (opts.marca) qs.set('marca', opts.marca);
  if (opts.linea) qs.set('linea', opts.linea);
  const s = qs.toString();
  return s ? `?${s}` : '';
}

function modalTitle(marcaSlug: string | null, lineaSlug: string | null): string {
  if (marcaSlug && lineaSlug) {
    const b = findBrandBySlug(marcaSlug);
    const sub = b?.subcategories.find((s) => s.id === lineaSlug);
    if (b && sub) return `${b.title} — ${sub.title}`;
  }
  if (marcaSlug) {
    const b = findBrandBySlug(marcaSlug);
    if (b) return b.title;
  }
  if (lineaSlug) {
    const info = findLineaBySlug(lineaSlug);
    if (info) return `${info.brandTitle} — ${info.dbType}`;
  }
  return 'Catalogo prodotti';
}

function ProductCatalogModalInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const open = shouldOpenProductCatalog(searchParams);
  const marcaFromUrl = readMarcaSlug(searchParams);
  const lineaFromUrl = readLineaSlug(searchParams);

  const resolvedMarca = useMemo(() => {
    if (marcaFromUrl) return marcaFromUrl;
    if (lineaFromUrl) return findLineaBySlug(lineaFromUrl)?.brandSlug ?? null;
    return null;
  }, [marcaFromUrl, lineaFromUrl]);

  const [products, setProducts] = useState<PublicProductJson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setProducts([]);
    setError(null);
    setLoading(false);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  useEffect(() => {
    if (!open) {
      setProducts([]);
      setError(null);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (marcaFromUrl && lineaFromUrl) {
          qs.set('marca', marcaFromUrl);
          qs.set('linea', lineaFromUrl);
        } else if (marcaFromUrl) {
          qs.set('marca', marcaFromUrl);
        } else if (lineaFromUrl) {
          qs.set('linea', lineaFromUrl);
        }
        const q = qs.toString();
        const res = await fetch(`/api/products${q ? `?${q}` : ''}`, { signal: ac.signal });
        const data = await res.json();
        if (ac.signal.aborted) return;
        if (!res.ok) {
          setError(typeof data.error === 'string' ? data.error : 'Errore di caricamento.');
          setProducts([]);
        } else {
          setProducts(data as PublicProductJson[]);
        }
      } catch {
        if (ac.signal.aborted) return;
        setError('Errore di rete.');
        setProducts([]);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [open, marcaFromUrl, lineaFromUrl]);

  const pushCatalogUrl = (next: { catalogo: boolean; marca: string | null; linea: string | null }) => {
    const qs = buildCatalogSearchParams(next);
    router.replace(`${pathname}${qs}`, { scroll: false });
  };

  const onMarcaChange = (value: string) => {
    if (!value) {
      pushCatalogUrl({ catalogo: true, marca: null, linea: null });
      return;
    }
    pushCatalogUrl({
      catalogo: true,
      marca: value,
      linea: null,
    });
  };

  const onLineaChange = (value: string) => {
    if (!resolvedMarca) return;
    pushCatalogUrl({
      catalogo: true,
      marca: resolvedMarca,
      linea: value || null,
    });
  };

  const openProductPage = (p: PublicProductJson) => {
    router.push(`/prodotti/${p.id}`);
  };

  const lineeOptions = resolvedMarca ? lineeForBrandSlug(resolvedMarca) : [];

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="heading-brand text-3xl font-bold tracking-wide md:text-4xl">Catalogo prodotti</h2>
          <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Sfoglia tutto il catalogo o filtra per linea e sottocategoria. Clicca una riga per aprire la scheda
            prodotto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => pushCatalogUrl({ catalogo: true, marca: null, linea: null })}
          className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Apri catalogo
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-catalog-modal-title"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-4 py-3 md:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-start">
              <span className="block h-10 w-10 shrink-0" aria-hidden />
            </div>
            <h2
              id="product-catalog-modal-title"
              className="heading-brand min-w-0 flex-1 hyphens-auto wrap-break-word text-center text-lg font-bold tracking-wide md:text-xl"
            >
              {modalTitle(marcaFromUrl ?? resolvedMarca, lineaFromUrl)}
            </h2>
            <div className="flex h-10 w-10 shrink-0 items-center justify-end">
              <button type="button" onClick={closeModal} aria-label="Chiudi" className={modalIconBtnClass}>
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-4 md:px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
              <div className="min-w-0 flex-1">
                <label htmlFor="catalog-filter-marca" className="mb-1 block text-xs font-semibold text-gray-600">
                  Linea / marchio
                </label>
                <select
                  id="catalog-filter-marca"
                  className={selectClass}
                  value={resolvedMarca ?? ''}
                  onChange={(e) => onMarcaChange(e.target.value)}
                >
                  <option value="">Tutte le linee</option>
                  {PRODUCT_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="catalog-filter-linea" className="mb-1 block text-xs font-semibold text-gray-600">
                  Sottocategoria
                </label>
                <select
                  id="catalog-filter-linea"
                  className={selectClass}
                  disabled={!resolvedMarca}
                  value={lineaFromUrl ?? ''}
                  onChange={(e) => onLineaChange(e.target.value)}
                >
                  <option value="">Tutte le sottocategorie</option>
                  {lineeOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto">
            <div className="w-full max-w-4xl px-4 py-6 md:px-6">
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              {error && !loading && (
                <p className="py-8 text-center text-red-600" role="alert">
                  {error}
                </p>
              )}
              {!loading && !error && products.length === 0 && (
                <p className="py-12 text-center text-gray-500">Nessun prodotto in questo catalogo.</p>
              )}
              {!loading && !error && products.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full min-w-[320px] text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="w-36 px-3 py-3 font-semibold md:w-44">Immagine</th>
                        <th className="px-3 py-3 font-semibold">Nome</th>
                        <th className="hidden px-3 py-3 font-semibold sm:table-cell">Linea</th>
                        <th className="hidden px-3 py-3 font-semibold md:table-cell">Sottocategoria</th>
                        <th className="px-3 py-3 text-right font-semibold">Prezzo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {products.map((p) => (
                        <tr
                          key={p.id}
                          className="cursor-pointer transition-colors hover:bg-primary/5"
                          onClick={() => openProductPage(p)}
                        >
                          <td className="p-3 align-middle">
                            <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-muted md:h-20 md:w-36">
                              <ProductThumb product={p} />
                            </div>
                          </td>
                          <td className="p-3 align-middle font-medium text-gray-900">{p.name}</td>
                          <td className="hidden p-3 align-middle text-gray-600 sm:table-cell">{p.brand}</td>
                          <td className="hidden p-3 align-middle text-gray-600 md:table-cell">{p.type}</td>
                          <td className="p-3 align-middle text-right font-semibold text-primary">{p.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductCatalogFallback() {
  return (
    <div className="flex min-h-[120px] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-muted/25 py-8" aria-busy>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function ProductCatalogModal() {
  return (
    <Suspense fallback={<ProductCatalogFallback />}>
      <ProductCatalogModalInner />
    </Suspense>
  );
}
