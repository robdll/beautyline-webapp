'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { getEquipmentTypeLabel } from '@/lib/equipment-types';
import { PROMO_PACKAGE_SIZE } from '@/lib/equipment-promo';
import type { AdminEquipmentItem } from '@/types/equipment';

interface EquipmentPromoItemsSelectProps {
  /** ID delle attrezzature incluse, in ordine. */
  value: string[];
  onChange: (ids: string[]) => void;
}

const controlClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';

const IMAGE_FALLBACK = 'https://placehold.co/96x72.png';

export function EquipmentPromoItemsSelect({ value, onChange }: EquipmentPromoItemsSelectProps) {
  const [equipment, setEquipment] = useState<AdminEquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toAdd, setToAdd] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/equipment');
        if (res.ok) setEquipment((await res.json()) as AdminEquipmentItem[]);
      } catch (err) {
        console.error('Errore nel caricamento delle attrezzature:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byId = useMemo(() => {
    const map = new Map<string, AdminEquipmentItem>();
    for (const e of equipment) map.set(e._id, e);
    return map;
  }, [equipment]);

  const available = useMemo(
    () => equipment.filter((e) => !value.includes(e._id)),
    [equipment, value]
  );

  const isFull = value.length >= PROMO_PACKAGE_SIZE;

  const addEquipment = () => {
    if (!toAdd || value.includes(toAdd) || isFull) return;
    onChange([...value, toAdd]);
    setToAdd('');
  };

  const removeEquipment = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Caricamento attrezzature…</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-gray-500">
        Selezionate {value.length} / {PROMO_PACKAGE_SIZE}
      </p>

      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          Nessuna attrezzatura selezionata. Aggiungi le {PROMO_PACKAGE_SIZE} attrezzature del
          pacchetto.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {value.map((id, index) => {
            const item = byId.get(id);
            const missing = !item;
            const image = item?.media?.[0] || IMAGE_FALLBACK;
            const isRemote = image.startsWith('http://') || image.startsWith('https://');
            return (
              <li key={id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={isRemote}
                  />
                </div>
                <span
                  className={`flex-1 text-sm font-medium ${missing ? 'text-red-600' : 'text-gray-800'}`}
                >
                  {item ? `${item.name} (${getEquipmentTypeLabel(item.type)})` : 'Attrezzatura non disponibile'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Sposta su"
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    aria-label="Sposta giù"
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEquipment(id)}
                    className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Rimuovi
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {equipment.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nessuna attrezzatura disponibile. Crea prima le attrezzature nella sezione Attrezzature.
        </p>
      ) : isFull ? (
        <p className="text-sm text-gray-500">
          Hai selezionato {PROMO_PACKAGE_SIZE} attrezzature. Rimuovine una per cambiarla.
        </p>
      ) : available.length === 0 ? (
        <p className="text-sm text-gray-500">Tutte le attrezzature disponibili sono già state aggiunte.</p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={toAdd}
            onChange={(e) => setToAdd(e.target.value)}
            className={controlClass}
            aria-label="Seleziona un'attrezzatura da aggiungere"
          >
            <option value="">Seleziona un&apos;attrezzatura…</option>
            {available.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name} ({getEquipmentTypeLabel(e.type)})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addEquipment}
            disabled={!toAdd}
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            + Aggiungi
          </button>
        </div>
      )}
    </div>
  );
}
