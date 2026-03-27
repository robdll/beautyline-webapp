import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/shared/Button';
import { getEquipmentTypeLabel } from '@/lib/equipment-types';
import type { PublicEquipmentJson } from '@/lib/public-equipment';

const EQUIPMENT_IMAGE_FALLBACK = 'https://placehold.co/800x450.png';

function firstValidMediaUrl(media: string[] | undefined): string | null {
  if (!media?.length) return null;
  for (const raw of media) {
    if (typeof raw !== 'string') continue;
    const u = raw.trim();
    if (u.length > 0) return u;
  }
  return null;
}

export interface EquipmentDetailViewProps {
  equipment: PublicEquipmentJson;
}

export function EquipmentDetailView({ equipment }: EquipmentDetailViewProps) {
  const imageSrc = firstValidMediaUrl(equipment.media) ?? EQUIPMENT_IMAGE_FALLBACK;
  const isRemote = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:py-14 md:px-6">
      <div className="mb-8">
        <Link
          href={`/attrezzature?tipo=${encodeURIComponent(equipment.type)}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Torna al catalogo {getEquipmentTypeLabel(equipment.type)}
        </Link>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-contain"
            sizes="(min-width: 768px) 672px, 100vw"
            priority
            unoptimized={isRemote}
          />
        </div>

        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {getEquipmentTypeLabel(equipment.type)}
          </p>
          <h1 className="heading-brand text-3xl md:text-4xl font-bold text-balance">{equipment.name}</h1>
        </header>

        <dl className="flex flex-col gap-4 text-sm text-gray-600">
          <div>
            <dt className="text-[20px] font-semibold text-gray-700">Descrizione</dt>
            <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-700 md:text-base">
              {equipment.description}
            </dd>
          </div>
          {equipment.technicalSheet && (
            <div>
              <dt className="font-medium text-gray-700">Scheda Tecnica</dt>
              <dd className="mt-1">
                <a
                  href={equipment.technicalSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Scarica la scheda tecnica
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="pt-2">
          <Link href={`/contatti?attrezzatura=${encodeURIComponent(equipment.name)}`}>
            <Button variant="primary" size="lg" className="uppercase tracking-wider font-bold">
              Richiedi informazioni
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
