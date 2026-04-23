'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types/testimonial';
import { cn } from '@/lib/utils';

const TRUNCATE_LENGTH = 200;

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  variant?: 'light' | 'dark';
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className,
  variant = 'light',
}) => {
  const isDark = variant === 'dark';
  const isLong = testimonial.content.length > TRUNCATE_LENGTH;
  const [expanded, setExpanded] = useState(false);

  const displayedContent =
    isLong && !expanded
      ? `${testimonial.content.slice(0, TRUNCATE_LENGTH)}…`
      : testimonial.content;

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col h-full', className)}>
      {testimonial.rating && (
        <div className="flex mb-6">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                'w-5 h-5',
                i < testimonial.rating! ? 'text-yellow-400' : isDark ? 'text-gray-500' : 'text-gray-300'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      <div className={cn('mb-6 grow italic leading-relaxed', isDark ? 'text-gray-100' : 'text-gray-700')}>
        <p>&ldquo;{displayedContent}&rdquo;</p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-primary hover:text-primary/80 not-italic transition-colors"
          >
            {expanded ? 'Mostra meno' : 'Mostra tutto'}
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        {testimonial.image && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className={cn('font-semibold', isDark ? 'text-white' : 'text-secondary')}>
            {testimonial.name}
          </p>
        </div>
      </div>
    </div>
  );
};
