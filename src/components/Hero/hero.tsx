import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  videoSrc?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  image,
  videoSrc = '/video/hero.mp4',
  ctaText = 'Scopri di più',
  ctaHref = '/corsi',
  className,
}) => {
  return (
    <div className={cn('relative w-full h-screen overflow-hidden', className)}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback image if video fails to load */}
        {image && (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {subtitle && (
              <p className="text-primary font-semibold text-sm uppercase tracking-wide">
                {subtitle}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              {title}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md max-w-2xl mx-auto">
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
        </div>
      </div>
    </div>
  );
};

