'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

interface Course {
  _id: string;
  type: string;
  level: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  media?: string[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Errore nel caricamento dei corsi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo corso?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'eliminazione.');
      }
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      alert('Errore nell\'eliminazione del corso.');
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
          Corsi
        </h1>
        <Link href="/admin/courses/new">
          <Button variant="primary" size="md">
            Nuovo Corso
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nome</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Livello</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Costo</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nessun corso presente. Crea il primo corso.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.level}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">€{course.cost}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/courses/${course._id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course._id)}
                          disabled={deletingId === course._id}
                          className="border-red-300! text-red-600! hover:bg-red-50!"
                        >
                          {deletingId === course._id ? '...' : 'Elimina'}
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
