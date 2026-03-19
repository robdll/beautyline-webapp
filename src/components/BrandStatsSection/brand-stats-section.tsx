import React from 'react';

import { Section } from '@/components/Section';
import { cn } from '@/lib/utils';

export interface BrandStatItem {
  value: string;
  label: string;
}

export const DEFAULT_BRAND_STATS: BrandStatItem[] = [
  { value: '1000+', label: 'Formazioni' },
  { value: '3000+', label: 'Corsiste' },
  { value: '100%', label: 'Crescita Professionale' },
];

interface BrandStatsSectionProps {
  id?: string;
  stats?: BrandStatItem[];
  className?: string;
}

export const BrandStatsSection: React.FC<BrandStatsSectionProps> = ({
  id,
  stats = DEFAULT_BRAND_STATS,
  className,
}) => {
  return (
    <Section id={id} className={cn('bg-primary/5 py-16 min-h-0', className)}>
      <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6">
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
            <div className="text-xl font-medium text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
};
