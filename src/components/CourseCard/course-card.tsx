import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col', className)}>
      <div className="relative w-full h-48">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        {course.category && (
          <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
            {course.category}
          </span>
        )}
        <h3 className="text-xl font-bold text-secondary mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="space-y-1">
            {course.duration && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Durata:</span> {course.duration}
              </p>
            )}
            {course.price && (
              <p className="text-lg font-bold text-primary">
                {course.price}
              </p>
            )}
          </div>
          <Link href={`/corsi/${course.id}`}>
            <Button variant="outline" size="sm">
              Dettagli
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

