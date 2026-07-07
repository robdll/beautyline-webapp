import { describe, expect, it } from 'vitest';
import {
  getPercorsoItems,
  serializePublicPercorso,
  type LeanPercorsoDoc,
} from './public-percorso';
import type { LeanCourseDoc } from './public-course';

function oid(hex: string) {
  return { toString: () => hex } as unknown as LeanCourseDoc['_id'];
}

function course(id: string, overrides: Partial<LeanCourseDoc> = {}): LeanCourseDoc {
  return {
    _id: oid(id),
    slug: `corso-${id}`,
    name: `Corso ${id}`,
    description: 'Descrizione del corso',
    cost: 100,
    type: 'unghie',
    media: [`https://img/${id}.jpg`],
    occurrences: [],
    ...overrides,
  };
}

function pItem(courseId: string, startDate?: string, endDate?: string) {
  return { course: courseId, startDate, endDate };
}

function percorso(items: ReturnType<typeof pItem>[], overrides: Partial<LeanPercorsoDoc> = {}): LeanPercorsoDoc {
  return {
    _id: oid('percorso-1'),
    slug: 'percorso-completo',
    name: 'Percorso Completo',
    description: 'Pacchetto',
    cost: 500,
    media: ['https://img/cover.jpg'],
    items,
    ...overrides,
  };
}

describe('serializePublicPercorso', () => {
  it('orders courses following the percorso items, not the docs order', () => {
    const result = serializePublicPercorso(
      percorso([pItem('b', '2026-01-10', '2026-01-10'), pItem('a', '2026-02-10', '2026-02-10')]),
      [course('a'), course('b')]
    );
    expect(result.courses.map((c) => c.id)).toEqual(['b', 'a']);
  });

  it('ignores items whose course is missing (e.g. deleted courses)', () => {
    const result = serializePublicPercorso(
      percorso([
        pItem('a', '2026-01-10', '2026-01-10'),
        pItem('missing', '2026-01-11', '2026-01-11'),
        pItem('b', '2026-02-10', '2026-02-10'),
      ]),
      [course('a'), course('b')]
    );
    expect(result.courses.map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('formats the chosen date as dateLabel and includes the description and href', () => {
    const result = serializePublicPercorso(
      percorso([pItem('a', '2026-01-10', '2026-01-10')]),
      [course('a', { type: 'occhi' })]
    );
    expect(result.courses[0].dateLabel).toBeTruthy();
    expect(result.courses[0].description).toBe('Descrizione del corso');
    expect(result.courses[0].href).toBe('/corsi/occhi/corso-a');
  });

  it('reflects sold-out of the matching course occurrence', () => {
    const result = serializePublicPercorso(
      percorso([pItem('a', '2026-01-10', '2026-01-10')]),
      [
        course('a', {
          occurrences: [{ startDate: '2026-01-10', endDate: '2026-01-10', soldOut: true }],
        }),
      ]
    );
    expect(result.courses[0].soldOut).toBe(true);
  });

  it('sets dateLabel to null when the item has no dates and the course has no occurrences', () => {
    const result = serializePublicPercorso(percorso([pItem('a')]), [course('a')]);
    expect(result.courses[0].dateLabel).toBeNull();
    expect(result.courses[0].days).toBeNull();
  });

  it('falls back to the course occurrence when the item has no explicit date', () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = serializePublicPercorso(percorso([pItem('a')]), [
      course('a', { occurrences: [{ startDate: future, endDate: future, soldOut: false }] }),
    ]);
    expect(result.courses[0].dateLabel).toBeTruthy();
    expect(result.courses[0].days).toBe(1);
  });

  it('sums the training days across all courses (totalDays)', () => {
    const result = serializePublicPercorso(
      percorso([
        pItem('a', '2026-01-10', '2026-01-12'), // 3 giorni
        pItem('b', '2026-02-01', '2026-02-03'), // 3 giorni
      ]),
      [course('a'), course('b')]
    );
    expect(result.courses.map((c) => c.days)).toEqual([3, 3]);
    expect(result.totalDays).toBe(6);
  });

  it('falls back to legacy courseIds when items are absent', () => {
    const legacy = {
      _id: oid('percorso-2'),
      slug: 'legacy',
      name: 'Legacy',
      description: 'x',
      cost: 10,
      media: [],
      courseIds: ['a', 'b'],
    } as unknown as LeanPercorsoDoc;
    expect(getPercorsoItems(legacy).map((i) => i.courseId)).toEqual(['a', 'b']);
    const result = serializePublicPercorso(legacy, [course('a'), course('b')]);
    expect(result.courses.map((c) => c.id)).toEqual(['a', 'b']);
    expect(result.courses[0].dateLabel).toBeNull();
  });
});
