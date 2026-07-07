import { describe, expect, it } from 'vitest';
import { normalizePercorsoItems, sameCalendarDay } from './percorso-input';

const OID_A = '507f1f77bcf86cd799439011';
const OID_B = '507f1f77bcf86cd799439012';

function item(courseId: string, startDate: string, endDate: string) {
  return { courseId, startDate, endDate };
}

describe('normalizePercorsoItems', () => {
  it('returns null when value is not an array', () => {
    expect(normalizePercorsoItems('nope')).toBeNull();
    expect(normalizePercorsoItems(undefined)).toBeNull();
  });

  it('keeps only valid ObjectId entries, preserving order', () => {
    const result = normalizePercorsoItems([
      item(OID_A, '2026-01-10', '2026-01-10'),
      item('bad', '2026-01-11', '2026-01-11'),
      item(OID_B, '2026-02-01', '2026-02-02'),
    ]);
    expect(result?.map((r) => r.courseId)).toEqual([OID_A, OID_B]);
  });

  it('deduplicates by course, keeping the first occurrence', () => {
    const result = normalizePercorsoItems([
      item(OID_A, '2026-01-10', '2026-01-10'),
      item(OID_A, '2026-03-10', '2026-03-10'),
    ]);
    expect(result).toHaveLength(1);
    expect(result?.[0].courseId).toBe(OID_A);
  });

  it('returns null when a date is invalid', () => {
    expect(normalizePercorsoItems([item(OID_A, 'not-a-date', '2026-01-10')])).toBeNull();
  });

  it('returns null when end date precedes start date', () => {
    expect(normalizePercorsoItems([item(OID_A, '2026-02-10', '2026-02-01')])).toBeNull();
  });

  it('parses valid dates into Date objects', () => {
    const result = normalizePercorsoItems([item(OID_A, '2026-01-10', '2026-01-12')]);
    expect(result?.[0].startDate).toBeInstanceOf(Date);
    expect(result?.[0].endDate).toBeInstanceOf(Date);
  });
});

describe('sameCalendarDay', () => {
  it('ignores the time component', () => {
    expect(sameCalendarDay(new Date('2026-01-10T09:00:00'), new Date('2026-01-10T18:30:00'))).toBe(true);
  });

  it('distinguishes different days', () => {
    expect(sameCalendarDay(new Date('2026-01-10'), new Date('2026-01-11'))).toBe(false);
  });
});
