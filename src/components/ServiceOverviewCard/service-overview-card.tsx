'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ServiceOverviewCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  targetId: string;
  className?: string;
}

export const ServiceOverviewCard: React.FC<ServiceOverviewCardProps> = ({
  title,
  description,
  icon,
  targetId,
  className,
}) => {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group flex flex-col items-center gap-5 text-center px-6 py-8 rounded-2xl bg-white border border-gray-100 shadow-sm',
        'hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        className
      )}
    >
      <div className="w-16 h-16 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="heading-brand text-lg font-bold uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </button>
  );
};
