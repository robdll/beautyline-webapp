'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type LibraryImage = { url: string; publicId: string };

export interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  folder: string;
  onPick: (url: string) => void;
}

export function MediaLibraryModal({ open, onClose, folder, onPick }: MediaLibraryModalProps) {
  const [items, setItems] = useState<LibraryImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  const fetchPage = useCallback(
    async (cursor: string | undefined, append: boolean) => {
      const params = new URLSearchParams({ folder });
      if (cursor) params.set('cursor', cursor);
      params.set('limit', '24');
      const res = await fetch(`/api/admin/media/library?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Errore nel caricamento.');
      }
      const images = Array.isArray(data.images) ? data.images : [];
      const nc = typeof data.nextCursor === 'string' ? data.nextCursor : null;
      setItems((prev) => (append ? [...prev, ...images] : images));
      setNextCursor(nc);
    },
    [folder]
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setItems([]);
    setNextCursor(null);
    setFetchError(null);
    (async () => {
      setLoading(true);
      try {
        await fetchPage(undefined, false);
      } catch (e) {
        if (!cancelled) {
          setFetchError(e instanceof Error ? e.message : 'Errore nel caricamento.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, fetchPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setFetchError(null);
    try {
      await fetchPage(nextCursor, true);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Errore nel caricamento.');
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [nextCursor, loading, fetchPage]);

  useEffect(() => {
    if (!open || !nextCursor) return;
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) void loadMore();
      },
      { root, rootMargin: '120px', threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [open, nextCursor, loadMore, items.length]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-library-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 id="media-library-title" className="text-lg font-semibold text-gray-900">
            Selezione immagine
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Chiudi"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {loading && (
            <p className="px-4 py-8 text-center text-sm text-gray-500">Caricamento…</p>
          )}
          {!loading && fetchError && (
            <p className="px-4 py-8 text-center text-sm text-red-600">{fetchError}</p>
          )}
          {!loading && !fetchError && items.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-gray-500">
              Nessuna immagine in questa cartella. Carica prima un file con &quot;Carica immagine&quot;.
            </p>
          )}
          {!loading && items.length > 0 && (
            <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
              {items.map((img) => (
                <button
                  key={`${img.publicId}-${img.url}`}
                  type="button"
                  onClick={() => {
                    onPick(img.url);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-gray-50 outline-none transition-colors hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 25vw, 33vw"
                  />
                </button>
              ))}
            </div>
          )}
          {nextCursor != null && (
            <div ref={sentinelRef} className="flex min-h-8 items-center justify-center py-4">
              {loadingMore ? (
                <span className="text-xs text-gray-500">Caricamento altre immagini…</span>
              ) : (
                <span className="sr-only">Fine elenco — scorri per caricare altre immagini</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
