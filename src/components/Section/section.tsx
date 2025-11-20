import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  containerClassName,
}) => {
  return (
    <section className={cn('py-12 md:py-16 lg:py-20', className)}>
      <div className={cn('w-full px-4 sm:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

