import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  containerClassName,
  id,
}) => {
  return (
    <section id={id} className={cn('min-h-screen py-12 md:py-16 lg:py-20 flex items-center justify-center', className)}>
      <div
        className={cn(
          // Center the section content area by default
          'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          // Make it easy to stack + center typical section content
          'flex flex-col items-center',
          // Prevent children (like grids) from shrinking in a flex container
          '*:w-full',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
};

