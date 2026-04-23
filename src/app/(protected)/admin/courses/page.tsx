'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import { getCourseTypeLabel } from '@/lib/course-types';
import { formatDateRange } from '@/lib/course-occurrences';
import type { AdminCourse, CourseOccurrence } from '@/types/course';

function getAllDates(occurrences: CourseOccurrence[] | undefined): string[] {
  if (!occurrences || occurrences.length === 0) return ['Da Definire'];
  return [...occurrences]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .map((occ) => `${formatDateRange(occ.startDate, occ.endDate)}${occ.soldOut ? ' (sold-out)' : ''}`);
}

function getNextDateTimestamp(occurrences: CourseOccurrence[] | undefined): number {
  if (!occurrences || occurrences.length === 0) return Number.POSITIVE_INFINITY;
  const now = Date.now();
  const sorted = [...occurrences].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const next = sorted.find((occ) => new Date(occ.endDate).getTime() >= now) ?? sorted[0];
  return new Date(next.startDate).getTime();
}

function sortByNextDate(courses: AdminCourse[]): AdminCourse[] {
  return [...courses].sort((a, b) => getNextDateTimestamp(a.occurrences) - getNextDateTimestamp(b.occurrences));
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(sortByNextDate(data));
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Immagine</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nome</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Prossime Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Orario</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Costo</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nessun corso presente. Crea il primo corso.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={course.media?.[0] || '/images/course-placeholder.svg'}
                          alt={course.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getCourseTypeLabel(course.type)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <ul className="space-y-1">
                        {getAllDates(course.occurrences).map((dateLabel, idx) => (
                          <li key={`${course._id}-date-${idx}`}>{dateLabel}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.orario || 'Da definire'}</td>
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
