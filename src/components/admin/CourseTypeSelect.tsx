import React from 'react';
import { COURSE_TYPE_LABELS, COURSE_TYPES } from '@/lib/course-types';

interface CourseTypeSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
}

export function CourseTypeSelect({
  id = 'type',
  name = 'type',
  value,
  onChange,
  required,
  className,
}: CourseTypeSelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={className}
    >
      <option value="">Seleziona tipo</option>
      {COURSE_TYPES.map((t) => (
        <option key={t} value={t}>
          {COURSE_TYPE_LABELS[t]}
        </option>
      ))}
    </select>
  );
}
