import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  image = 'https://placehold.co/1200x600',
  ctaText = 'Scopri di più',
  ctaHref = '/corsi',
  className,
}) => {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            {subtitle && (
              <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wide">
                {subtitle}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-secondary)] leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
            {ctaText && (
              <div className="pt-4">
                <Link href={ctaHref}>
                  <Button variant="primary" size="lg">
                    {ctaText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

