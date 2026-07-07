'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import type { AdminPercorso } from '@/types/percorso';

export default function AdminPercorsiPage() {
  const [percorsi, setPercorsi] = useState<AdminPercorso[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPercorsi = async () => {
    try {
      const res = await fetch('/api/admin/percorsi');
      if (res.ok) {
        setPercorsi(await res.json());
      }
    } catch (err) {
      console.error('Errore nel caricamento dei percorsi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPercorsi();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo percorso?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/percorsi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPercorsi((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'eliminazione.');
      }
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      alert('Errore nell\'eliminazione del percorso.');
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
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">Percorsi</h1>
        <Link href="/admin/percorsi/new">
          <Button variant="primary" size="md">
            Nuovo Percorso
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">N. corsi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Costo</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {percorsi.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nessun percorso presente. Crea il primo percorso.
                  </td>
                </tr>
              ) : (
                percorsi.map((percorso) => (
                  <tr key={percorso._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={percorso.media?.[0] || '/images/course-placeholder.svg'}
                          alt={percorso.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{percorso.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{percorso.items?.length ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">€{percorso.cost}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/percorsi/${percorso._id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(percorso._id)}
                          disabled={deletingId === percorso._id}
                          className="border-red-300! text-red-600! hover:bg-red-50!"
                        >
                          {deletingId === percorso._id ? '...' : 'Elimina'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
