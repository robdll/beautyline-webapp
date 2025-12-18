'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxDividerProps {
  imageSrc?: string;
  className?: string;
  heightClassName?: string;
  overlayClassName?: string;
  showOverlay?: boolean;
  /** 0..1-ish. Higher = more movement */
  strength?: number;
}

export const ParallaxDivider: React.FC<ParallaxDividerProps> = ({
  imageSrc = '/images/parallax-bg.jpg',
  className,
  heightClassName = 'h-48 sm:h-64 md:h-80 lg:h-[420px]',
  overlayClassName,
  showOverlay = false,
  strength = 2.9,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!root || !layer) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      layer.style.backgroundPosition = '50% 50%';
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 0;

      // 0 when just below viewport, 1 when just above viewport
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));

      // Move background position instead of translating an oversized layer.
      // This avoids the “zoomed” feeling while still giving a parallax effect.
      const maxShiftPct = 28 * strength; // total range: +/- (maxShiftPct)%
      const y = 50 + (clamped - 0.5) * 2 * maxShiftPct;
      layer.style.backgroundPosition = `50% ${y.toFixed(2)}%`;
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [strength]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        'relative w-full overflow-hidden',
        heightClassName,
        // slight separators so the transition between sections feels intentional
        'border-y border-black/5',
        className,
      )}
    >
      <div
        ref={layerRef}
        className={cn(
          'absolute inset-0 bg-cover bg-center will-change-[background-position]',
        )}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: '50% 50%',
        }}
      />

      {/* Optional overlay for polish/readability */}
      {showOverlay ? (
        <div
          className={cn(
            'absolute inset-0 bg-linear-to-b from-white/15 via-white/0 to-white/15',
            overlayClassName,
          )}
        />
      ) : null}
    </div>
  );
};
