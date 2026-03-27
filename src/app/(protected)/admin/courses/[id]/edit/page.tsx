'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CourseTypeSelect } from '@/components/admin/CourseTypeSelect';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { parseCourseType } from '@/lib/course-types';
import { formatDateRange } from '@/lib/course-occurrences';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

interface Course {
  _id: string;
  type: string;
  name: string;
  description: string;
  occurrences?: { startDate: string; endDate: string; soldOut?: boolean }[];
  programSections?: string[];
  orario?: string;
  cost: number;
  media?: string[];
}

export default function AdminCoursesEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    type: '',
    name: '',
    description: '',
    cost: '',
    media: [] as string[],
    occurrences: [{ startDate: '', endDate: '', soldOut: false }],
    programSections: ['', '', ''],
    orario: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${id}`);
        if (res.ok) {
          const course: Course = await res.json();
          setForm({
            type: parseCourseType(course.type) ?? '',
            name: course.name || '',
            description: course.description || '',
            cost: String(course.cost ?? ''),
            media: course.media || [],
            occurrences:
              course.occurrences?.map((occ) => ({
                startDate: occ.startDate ? new Date(occ.startDate).toISOString().slice(0, 10) : '',
                endDate: occ.endDate ? new Date(occ.endDate).toISOString().slice(0, 10) : '',
                soldOut: occ.soldOut === true,
              })) || [{ startDate: '', endDate: '', soldOut: false }],
            programSections:
              Array.isArray(course.programSections) && course.programSections.length > 0
                ? [...course.programSections, '', ''].slice(0, 3)
                : ['', '', ''],
            orario: typeof course.orario === 'string' ? course.orario : '',
          });
        } else {
          const data = await res.json();
          alert(data.error || 'Corso non trovato.');
          router.push('/admin/courses');
        }
      } catch (err) {
        console.error('Errore nel caricamento:', err);
        router.push('/admin/courses');
      } finally {
        setFetching(false);
      }
    };
    fetchCourse();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateOccurrence = (
    index: number,
    field: 'startDate' | 'endDate' | 'soldOut',
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      occurrences: prev.occurrences.map((occ, i) =>
        i === index ? { ...occ, [field]: value } : occ
      ),
    }));
  };

  const addOccurrence = () => {
    setForm((prev) => ({
      ...prev,
      occurrences: [...prev.occurrences, { startDate: '', endDate: '', soldOut: false }],
    }));
  };

  const removeOccurrence = (index: number) => {
    setForm((prev) => ({
      ...prev,
      occurrences:
        prev.occurrences.length === 1
          ? prev.occurrences
          : prev.occurrences.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          name: form.name,
          description: form.description,
          cost: Number(form.cost) || 0,
          media: form.media,
          occurrences: form.occurrences,
          programSections: form.programSections,
          orario: form.orario,
        }),
      });

      if (res.ok) {
        router.push('/admin/courses');
      } else {
        const data = await res.json();
        alert(data.error || 'Errore nell\'aggiornamento del corso.');
      }
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore nell\'aggiornamento del corso.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="heading-brand text-2xl font-bold mb-8 uppercase tracking-wide">
        Modifica Corso
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
          <div>
            <label htmlFor="type" className={labelClass}>
              Tipo
            </label>
            <CourseTypeSelect
              id="type"
              value={form.type}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className={labelClass}>Date corso</label>
            {form.occurrences.map((occ, idx) => (
              <div key={`occ-${idx}`} className="rounded-lg border border-gray-200 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`startDate-${idx}`} className={labelClass}>
                      Inizio #{idx + 1}
                    </label>
                    <input
                      id={`startDate-${idx}`}
                      type="date"
                      value={occ.startDate}
                      onChange={(e) => updateOccurrence(idx, 'startDate', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor={`endDate-${idx}`} className={labelClass}>
                      Fine #{idx + 1}
                    </label>
                    <input
                      id={`endDate-${idx}`}
                      type="date"
                      value={occ.endDate}
                      onChange={(e) => updateOccurrence(idx, 'endDate', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        id={`soldOut-${idx}`}
                        type="checkbox"
                        checked={occ.soldOut}
                        onChange={(e) => updateOccurrence(idx, 'soldOut', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Data sold-out
                    </label>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {occ.startDate && occ.endDate
                      ? `${formatDateRange(occ.startDate, occ.endDate)}${occ.soldOut ? ' (sold-out)' : ''}`
                      : 'Range da definire'}
                  </p>
                  {form.occurrences.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeOccurrence(idx)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Rimuovi
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addOccurrence}
              className="self-start text-sm font-medium text-primary hover:underline"
            >
              + Aggiungi data
            </button>
          </div>

          <div>
            <label htmlFor="orario" className={labelClass}>
              Orario (uguale per tutte le date)
            </label>
            <input
              id="orario"
              name="orario"
              type="text"
              value={form.orario}
              onChange={handleChange}
              className={inputClass}
              placeholder="Es. 9:30 - 17:30"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className={labelClass}>Programma del corso</label>
            {form.programSections.map((section, idx) => (
              <textarea
                key={`program-${idx}`}
                value={section}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    programSections: prev.programSections.map((entry, i) =>
                      i === idx ? e.target.value : entry
                    ),
                  }))
                }
                rows={3}
                className={inputClass}
                placeholder={`Contenuto sezione ${idx + 1}`}
              />
            ))}
          </div>

          <div>
            <label htmlFor="cost" className={labelClass}>
              Costo (€)
            </label>
            <input
              id="cost"
              name="cost"
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Immagini</label>
            <ImageUpload
              images={form.media}
              onChange={(images) => setForm((prev) => ({ ...prev, media: images }))}
              folder="beautyline/courses"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
