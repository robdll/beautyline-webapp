'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxDividerProps {
  imageSrc?: string;
  className?: string;
  heightClassName?: string;
  overlayClassName?: string;
  showOverlay?: boolean;
  /** Higher = more movement */
  strength?: number;
}

export const ParallaxDivider: React.FC<ParallaxDividerProps> = ({
  imageSrc = '/images/parallax-bg.jpg',
  className,
  heightClassName = 'h-48 sm:h-64 md:h-80 lg:h-[420px]',
  overlayClassName,
  showOverlay = false,
  strength = 1.25,
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
      layer.style.transform = 'translate3d(0, 0, 0) scale(1.12)';
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 0;

      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const maxDistance = vh / 2 + rect.height / 2;
      const normalized = Math.max(-1, Math.min(1, centerOffset / maxDistance));

      // Translate an oversized layer for a clear parallax effect without clipping.
      const maxShiftPx = Math.min(vh * 0.18, rect.height * 0.22) * strength;
      const y = -normalized * maxShiftPx;
      layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(1.12)`;
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
          'absolute inset-0 bg-cover bg-center will-change-transform',
        )}
        style={{
          backgroundImage: `url(${imageSrc})`,
          transform: 'translate3d(0, 0, 0) scale(1.12)',
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
