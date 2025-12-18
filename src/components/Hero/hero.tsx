import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  description?: string;
  videoSrc?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  description,
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
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center md:items-start justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 flex flex-col items-center">
          <div className="lg:pt-15 max-w-4xl w-full flex flex-col items-center space-y-6 gap-14 lg:text-lg">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple leading-tight text-center text-shadow-soft-white"
            >
              {title}
            </h1>
            {description && (
              <p className="md:max-w-[340px] lg:max-w-[600px] text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed drop-shadow-md text-center">
                {description}
              </p>
            )}
            {ctaText && (
              <div className="pt-4 flex justify-center">
                <Link href={ctaHref}>
                  <Button variant="primary" size="lg" className="cursor-pointer">
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

