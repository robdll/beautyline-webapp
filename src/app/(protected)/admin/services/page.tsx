'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { isRecognizedServiceType, PROMO_SERVICE_TYPE } from '@/lib/service-categories';

interface Service {
  _id: string;
  type: string;
  name: string;
  description: string;
  cost: number;
  media?: string[];
  isPromo?: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listinoPrezziUrl, setListinoPrezziUrl] = useState<string | null>(null);
  const [uploadingListino, setUploadingListino] = useState(false);
  const [listinoError, setListinoError] = useState<string | null>(null);
  const listinoFileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Errore nel caricamento dei servizi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const loadListino = async () => {
      try {
        const res = await fetch('/api/admin/estetica-public-settings');
        if (!res.ok) return;
        const data = await res.json();
        setListinoPrezziUrl(typeof data.listinoPrezziUrl === 'string' ? data.listinoPrezziUrl : null);
      } catch {
        /* ignore */
      }
    };
    void loadListino();
  }, []);

  const handleListinoFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setListinoError('Puoi caricare solo file PDF.');
      return;
    }

    setUploadingListino(true);
    setListinoError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'beautyline/estetica');
      formData.append('publicId', 'listino-prezzi');
      formData.append('resourceType', 'raw');
      formData.append('format', 'pdf');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.details || uploadData.error || 'Upload non riuscito.');
      }

      const putRes = await fetch('/api/admin/estetica-public-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listinoPrezziUrl: uploadData.url }),
      });
      const putData = await putRes.json();
      if (!putRes.ok) {
        throw new Error(putData.error || 'Salvataggio non riuscito.');
      }
      setListinoPrezziUrl(
        typeof putData.listinoPrezziUrl === 'string' ? putData.listinoPrezziUrl : uploadData.url
      );
    } catch (err) {
      setListinoError(err instanceof Error ? err.message : 'Errore durante il caricamento.');
    } finally {
      setUploadingListino(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo servizio?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'eliminazione.');
      }
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      alert('Errore nell\'eliminazione del servizio.');
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
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">
          Servizi Estetica
        </h1>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <input
              ref={listinoFileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleListinoFile(file);
                e.currentTarget.value = '';
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={uploadingListino}
              onClick={() => listinoFileInputRef.current?.click()}
            >
              {uploadingListino ? 'Caricamento…' : 'Carica listino PDF'}
            </Button>
            <Link href="/admin/services/new">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                Nuovo Servizio
              </Button>
            </Link>
          </div>
          {listinoError ? (
            <p className="text-sm text-red-600 sm:text-right">{listinoError}</p>
          ) : listinoPrezziUrl ? (
            <p className="text-xs text-gray-600 sm:text-right">
              Listino pubblicato: visibile su /servizi-estetica.
            </p>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nome / titolo promo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Categoria</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Costo</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Nessun servizio presente. Crea il primo servizio.
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const categoryOk = isRecognizedServiceType(service.type, service.isPromo);
                  const hidePromoPlaceholderCategory =
                    Boolean(service.isPromo) && service.type === PROMO_SERVICE_TYPE;
                  const promoBadge = (
                    <span className="inline-flex rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                      Promo
                    </span>
                  );
                  return (
                  <tr key={service._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {!categoryOk && service.isPromo ? (
                        promoBadge
                      ) : categoryOk ? (
                        <span className="inline-flex flex-wrap items-center gap-2">
                          {hidePromoPlaceholderCategory ? null : <span>{service.type}</span>}
                          {service.isPromo ? promoBadge : null}
                        </span>
                      ) : (
                        <span className="font-semibold text-red-600">Categoria Non Valida</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {service.isPromo ? '—' : `€${service.cost}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/services/${service._id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service._id)}
                          disabled={deletingId === service._id}
                          className="!border-red-300 !text-red-600 hover:!bg-red-50"
                        >
                          {deletingId === service._id ? '...' : 'Elimina'}
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
