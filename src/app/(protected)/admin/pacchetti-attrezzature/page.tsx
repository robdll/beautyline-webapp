'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import { PROMO_PACKAGE_IMAGE_FALLBACK } from '@/lib/equipment-promo';
import type { AdminEquipmentPromoPackage } from '@/types/equipment-promo';

export default function AdminPacchettiAttrezzaturePage() {
  const [packages, setPackages] = useState<AdminEquipmentPromoPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/pacchetti-attrezzature');
      if (res.ok) {
        setPackages(await res.json());
      }
    } catch (err) {
      console.error('Errore nel caricamento dei pacchetti:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo pacchetto?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/pacchetti-attrezzature/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'eliminazione.');
      }
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      alert('Errore nell\'eliminazione del pacchetto.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">
          Pacchetti Attrezzature
        </h1>
        <Link href="/admin/pacchetti-attrezzature/new">
          <Button variant="primary" size="md">
            Nuovo Pacchetto
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Immagine</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nome</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">N. attrezzature</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Prezzo annuo</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nessun pacchetto presente. Crea il primo pacchetto.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => {
                  const image = pkg.media?.[0] || PROMO_PACKAGE_IMAGE_FALLBACK;
                  const isRemote = image.startsWith('http://') || image.startsWith('https://');
                  return (
                    <tr key={pkg._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={image}
                            alt={pkg.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized={isRemote}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{pkg.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{pkg.equipmentIds?.length ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">€{pkg.annualPrice} / anno</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/pacchetti-attrezzature/${pkg._id}/edit`}>
                            <Button variant="outline" size="sm">
                              Modifica
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pkg._id)}
                            disabled={deletingId === pkg._id}
                            className="border-red-300! text-red-600! hover:bg-red-50!"
                          >
                            {deletingId === pkg._id ? '...' : 'Elimina'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
