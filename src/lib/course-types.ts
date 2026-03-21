export const COURSE_TYPES = ['unghie', 'occhi'] as const;
export type CourseType = (typeof COURSE_TYPES)[number];

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  unghie: 'Unghie',
  occhi: 'Occhi',
};

export function parseCourseType(value: unknown): CourseType | null {
  if (typeof value !== 'string') return null;
  const t = value.trim() as CourseType;
  return COURSE_TYPES.includes(t) ? t : null;
}

export function getCourseTypeLabel(type: string): string {
  return type === 'unghie' || type === 'occhi' ? COURSE_TYPE_LABELS[type] : type;
}
