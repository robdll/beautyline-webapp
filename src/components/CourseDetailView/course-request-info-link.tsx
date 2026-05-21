'use client';

import React from 'react';

import { useCookieConsent } from '@/contexts/CookieConsentContext';
import {
  googleAdsCourseInfoConversionConfigured,
  trackCourseInfoRequestConversion,
} from '@/lib/google-ads';
import { cn } from '@/lib/utils';

type CourseRequestInfoLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function CourseRequestInfoLink({ href, children, className }: CourseRequestInfoLinkProps) {
  const { marketingAllowed } = useCookieConsent();

  const handleClick = () => {
    if (!marketingAllowed || !googleAdsCourseInfoConversionConfigured()) return;
    trackCourseInfoRequestConversion();
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        'bg-primary text-white hover:bg-primary/90 rounded-[40px]',
        'px-8 py-4 text-lg uppercase tracking-wider font-bold',
        className,
      )}
    >
      {children}
    </a>
  );
}
