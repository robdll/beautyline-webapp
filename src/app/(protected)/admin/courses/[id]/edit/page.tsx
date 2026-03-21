'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CourseTypeSelect } from '@/components/admin/CourseTypeSelect';
import { Button } from '@/components/shared/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { parseCourseType } from '@/lib/course-types';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

interface Course {
  _id: string;
  type: string;
  level: string;
  name: string;
  description: string;
  duration: string;
  startDate?: string;
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
    level: '',
    name: '',
    description: '',
    duration: '',
    startDate: '',
    cost: '',
    media: [] as string[],
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/admin/courses/${id}`);
        if (res.ok) {
          const course: Course = await res.json();
          setForm({
            type: parseCourseType(course.type) ?? '',
            level: course.level || '',
            name: course.name || '',
            description: course.description || '',
            duration: course.duration || '',
            startDate: course.startDate ? new Date(course.startDate).toISOString().slice(0, 10) : '',
            cost: String(course.cost ?? ''),
            media: course.media || [],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          level: form.level,
          name: form.name,
          description: form.description,
          duration: form.duration,
          startDate: form.startDate,
          cost: Number(form.cost) || 0,
          media: form.media,
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
            <label htmlFor="level" className={labelClass}>
              Livello
            </label>
            <input
              id="level"
              name="level"
              type="text"
              value={form.level}
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

          <div>
            <label htmlFor="duration" className={labelClass}>
              Durata
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              value={form.duration}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="es. 2 giorni"
            />
          </div>

          <div>
            <label htmlFor="startDate" className={labelClass}>
              Data corso
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className={inputClass}
            />
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
