'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

interface EquipmentItem {
  _id: string;
  type: string;
  name: string;
  description: string;
  media: string[];
  rentOnly: boolean;
  rentCostPerDay: number;
  rentCostPerMonth: number;
  sellingCost: number;
}

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('/api/admin/equipment');
      if (!res.ok) throw new Error('Errore nel caricamento');
      const data = await res.json();
      setEquipment(data);
    } catch (err) {
      console.error(err);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa attrezzatura?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/equipment/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Errore nell\'eliminazione');
      await fetchEquipment();
    } catch (err) {
      console.error(err);
      alert('Errore nell\'eliminazione.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="heading-brand text-2xl font-bold uppercase tracking-wide">
          Attrezzature
        </h1>
        <Link href="/admin/equipment/new">
          <Button variant="primary" size="md">
            Nuova Attrezzatura
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {equipment.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nessuna attrezzatura. Crea la prima attrezzatura.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nome</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Solo noleggio</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Costo/giorno</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Prezzo vendita</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-secondary">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.rentOnly ? 'Sì' : 'No'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatPrice(item.rentCostPerDay)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatPrice(item.sellingCost)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/equipment/${item._id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="border-red-200! text-red-600! hover:bg-red-50!"
                        >
                          {deletingId === item._id ? '...' : 'Elimina'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
