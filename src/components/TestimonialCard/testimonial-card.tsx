import React from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col h-full', className)}>
      {testimonial.rating && (
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                'w-5 h-5',
                i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      <p className="text-gray-700 mb-6 flex-grow italic leading-relaxed">
        "{testimonial.content}"
      </p>
      <div className="flex items-center space-x-4">
        {testimonial.image && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="font-semibold text-[var(--color-secondary)]">
            {testimonial.name}
          </p>
          {testimonial.role && (
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          )}
        </div>
      </div>
    </div>
  );
};

