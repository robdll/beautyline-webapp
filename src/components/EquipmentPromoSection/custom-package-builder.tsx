'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/shared/Button';
import { whatsappPacchettoPersonalizzatoUrl } from '@/lib/contact';
import { displayPublicTitle } from '@/lib/display-text';
import { getEquipmentTypeLabel } from '@/lib/equipment-types';
import { PROMO_PACKAGE_SIZE } from '@/lib/equipment-promo';
import { cn } from '@/lib/utils';
import type { EquipmentItem } from '@/types/equipment';

interface CustomPackageBuilderProps {
  equipment: EquipmentItem[];
}

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

export const CustomPackageBuilder: React.FC<CustomPackageBuilderProps> = ({ equipment }) => {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const isFull = selectedIds.length >= PROMO_PACKAGE_SIZE;

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= PROMO_PACKAGE_SIZE) return prev;
        return [...prev, id];
      });
    },
    []
  );

  const selectedNames = useMemo(
    () =>
      selectedIds
        .map((id) => equipment.find((e) => e.id === id)?.name)
        .filter((n): n is string => Boolean(n))
        .map((n) => displayPublicTitle(n)),
    [selectedIds, equipment]
  );

  const contactUrl = whatsappPacchettoPersonalizzatoUrl(selectedNames);
  const canSubmit = selectedIds.length === PROMO_PACKAGE_SIZE;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group flex h-full min-h-[280px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center transition-colors hover:border-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <svg
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </span>
        <h3 className="heading-brand text-xl font-bold">Crea il tuo pacchetto</h3>
        <p className="text-sm text-gray-600">
          Scegli tu 3 attrezzature e ti prepariamo un preventivo su misura.
        </p>
        <span className="mt-1 text-sm font-medium text-primary group-hover:underline">
          Personalizza →
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-package-title"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-4 py-3 md:px-6">
            <span className="block h-10 w-10 shrink-0" aria-hidden />
            <h2
              id="custom-package-title"
              className="heading-brand min-w-0 flex-1 text-center text-lg font-bold tracking-wide md:text-xl"
            >
              Crea il tuo pacchetto
            </h2>
            <div className="flex h-10 w-10 shrink-0 items-center justify-end">
              <button
                type="button"
                onClick={close}
                aria-label="Chiudi"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto">
            <div className="w-full max-w-3xl px-4 py-6 md:px-6">
              <p className="mb-6 text-center text-sm text-gray-600 md:text-base">
                Seleziona <strong>{PROMO_PACKAGE_SIZE} attrezzature</strong> tra quelle disponibili.
                Non riceverai un prezzo immediato: verrai messo in contatto con noi per un preventivo
                su misura.
              </p>

              {equipment.length === 0 ? (
                <p className="py-12 text-center text-gray-500">
                  Nessuna attrezzatura disponibile al momento. Torna a trovarci presto!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
                  {equipment.map((item) => {
                    const checked = selectedIds.includes(item.id);
                    const disabled = !checked && isFull;
                    const isRemote =
                      item.image.startsWith('http://') || item.image.startsWith('https://');
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={checked}
                        disabled={disabled}
                        onClick={() => toggle(item.id)}
                        className={cn(
                          'group flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                          checked
                            ? 'border-primary ring-2 ring-primary'
                            : 'border-gray-200 hover:border-primary/40 hover:shadow-md',
                          disabled && 'cursor-not-allowed opacity-40 hover:border-gray-200 hover:shadow-none'
                        )}
                      >
                        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 33vw, 50vw"
                            unoptimized={isRemote}
                          />
                          <span
                            className={cn(
                              'absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                              checked
                                ? 'border-primary bg-primary text-white'
                                : 'border-white/80 bg-black/20 text-transparent'
                            )}
                            aria-hidden
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-0.5 p-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                            {getEquipmentTypeLabel(item.type)}
                          </span>
                          <span className="text-sm font-medium leading-snug text-gray-900">
                            {displayPublicTitle(item.name)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <footer className="flex shrink-0 flex-col items-center gap-3 border-t border-gray-200 px-4 py-4 md:flex-row md:justify-between md:px-6">
            <p className="text-sm text-gray-600" aria-live="polite">
              Selezionate <strong>{selectedIds.length}</strong> / {PROMO_PACKAGE_SIZE}
            </p>
            {canSubmit ? (
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <Button variant="primary" size="md" className="w-full uppercase tracking-wider">
                  Entra in contatto
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full uppercase tracking-wider md:w-auto"
                disabled
              >
                Entra in contatto
              </Button>
            )}
          </footer>
        </div>
      )}
    </>
  );
};
