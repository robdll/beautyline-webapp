'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getCourseTypeLabel } from '@/lib/course-types';
import { daySpanInclusive, formatDateRange } from '@/lib/course-occurrences';
import type { AdminCourse } from '@/types/course';
import type { AdminPercorsoItem } from '@/types/percorso';

interface PercorsoCoursesSelectProps {
  /** Voci del percorso (corso + data), in ordine. */
  value: AdminPercorsoItem[];
  onChange: (items: AdminPercorsoItem[]) => void;
}

const controlClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm';

const NEW_DATE = '__new__';

function ymd(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function addDays(ymdValue: string, days: number): string {
  // Parse/format in UTC per evitare slittamenti di giorno legati al fuso orario.
  const d = new Date(`${ymdValue}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function PercorsoCoursesSelect({ value, onChange }: PercorsoCoursesSelectProps) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toAdd, setToAdd] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/courses');
        if (res.ok) setCourses((await res.json()) as AdminCourse[]);
      } catch (err) {
        console.error('Errore nel caricamento dei corsi:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byId = useMemo(() => {
    const map = new Map<string, AdminCourse>();
    for (const c of courses) map.set(c._id, c);
    return map;
  }, [courses]);

  const available = useMemo(
    () => courses.filter((c) => !value.some((item) => item.courseId === c._id)),
    [courses, value]
  );

  const occurrencesOf = (courseId: string) => {
    const c = byId.get(courseId);
    if (!c?.occurrences?.length) return [];
    return [...c.occurrences]
      .filter((o) => o.startDate && o.endDate)
      .map((o) => ({ start: ymd(o.startDate), end: ymd(o.endDate) }))
      .filter((o) => o.start && o.end)
      .sort((a, b) => a.start.localeCompare(b.start));
  };

  /** Durata (giorni) delle erogazioni del corso, o null se non ne ha ancora. */
  const spanOf = (courseId: string): number | null => {
    const occ = occurrencesOf(courseId);
    if (occ.length === 0) return null;
    return daySpanInclusive(new Date(`${occ[0].start}T00:00:00`), new Date(`${occ[0].end}T00:00:00`));
  };

  const updateItem = (courseId: string, patch: Partial<AdminPercorsoItem>) => {
    onChange(value.map((item) => (item.courseId === courseId ? { ...item, ...patch } : item)));
  };

  const addCourse = () => {
    if (!toAdd || value.some((i) => i.courseId === toAdd)) return;
    const occ = occurrencesOf(toAdd);
    const first = occ[0];
    onChange([
      ...value,
      { courseId: toAdd, startDate: first?.start ?? '', endDate: first?.end ?? '' },
    ]);
    setToAdd('');
  };

  const removeCourse = (courseId: string) => {
    onChange(value.filter((item) => item.courseId !== courseId));
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const setStart = (courseId: string, start: string) => {
    const span = spanOf(courseId);
    // Se la durata del corso è nota, la data di fine è vincolata.
    const end = span != null && start ? addDays(start, span - 1) : start;
    updateItem(courseId, { startDate: start, endDate: end });
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Caricamento corsi…</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          Nessun corso selezionato. Aggiungi i corsi che compongono il percorso.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {value.map((item, index) => {
            const course = byId.get(item.courseId);
            const missing = !course;
            const occ = occurrencesOf(item.courseId);
            const span = spanOf(item.courseId);
            const currentValue = `${item.startDate}__${item.endDate}`;
            const matchesOccurrence = occ.some((o) => `${o.start}__${o.end}` === currentValue);
            const isNewDate = !matchesOccurrence; // custom o assente
            const selectValue = matchesOccurrence ? currentValue : occ.length ? NEW_DATE : NEW_DATE;

            return (
              <li key={item.courseId} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className={`flex-1 text-sm font-medium ${missing ? 'text-red-600' : 'text-gray-800'}`}>
                    {course ? `${course.name} (${getCourseTypeLabel(course.type)})` : 'Corso non disponibile'}
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
                      onClick={() => removeCourse(item.courseId)}
                      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-600">Data di riferimento</label>
                  {occ.length > 0 && (
                    <select
                      value={selectValue}
                      onChange={(e) => {
                        if (e.target.value === NEW_DATE) {
                          updateItem(item.courseId, { startDate: '', endDate: '' });
                        } else {
                          const [start, end] = e.target.value.split('__');
                          updateItem(item.courseId, { startDate: start, endDate: end });
                        }
                      }}
                      className={controlClass}
                    >
                      {occ.map((o) => (
                        <option key={`${o.start}__${o.end}`} value={`${o.start}__${o.end}`}>
                          {formatDateRange(`${o.start}T00:00:00`, `${o.end}T00:00:00`)}
                        </option>
                      ))}
                      <option value={NEW_DATE}>+ Nuova data (verrà aggiunta al corso)</option>
                    </select>
                  )}

                  {occ.length === 0 && (
                    <p className="text-xs text-amber-600">
                      Questo corso non ha ancora date: aggiungine una qui sotto (verrà aggiunta anche al
                      corso).
                    </p>
                  )}

                  {isNewDate && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-gray-500">Inizio</label>
                        <input
                          type="date"
                          value={item.startDate}
                          onChange={(e) => setStart(item.courseId, e.target.value)}
                          className={controlClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-500">Fine</label>
                        <input
                          type="date"
                          value={item.endDate}
                          onChange={(e) => updateItem(item.courseId, { endDate: e.target.value })}
                          disabled={span != null}
                          className={`${controlClass} disabled:bg-gray-100 disabled:text-gray-500`}
                        />
                        {span != null && (
                          <p className="mt-1 text-[11px] text-gray-400">
                            Durata fissa: {span} {span === 1 ? 'giorno' : 'giorni'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {courses.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nessun corso disponibile. Crea prima i corsi da includere nel percorso.
        </p>
      ) : available.length === 0 ? (
        <p className="text-sm text-gray-500">Tutti i corsi disponibili sono già stati aggiunti.</p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={toAdd}
            onChange={(e) => setToAdd(e.target.value)}
            className={controlClass}
            aria-label="Seleziona un corso da aggiungere"
          >
            <option value="">Seleziona un corso…</option>
            {available.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({getCourseTypeLabel(c.type)})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addCourse}
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
