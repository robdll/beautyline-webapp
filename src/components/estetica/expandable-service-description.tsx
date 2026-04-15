'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ExpandableServiceDescriptionProps = {
  text: string;
  className?: string;
};

function scheduleMeasure(run: () => void) {
  const id = requestAnimationFrame(run);
  return () => cancelAnimationFrame(id);
}

/**
 * Three-line clamp with a clickable ellipsis that expands to the full description.
 */
export function ExpandableServiceDescription({ text, className }: ExpandableServiceDescriptionProps) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const measure = useCallback(() => {
    const el = pRef.current;
    if (!el) return;
    if (expanded) {
      setIsTruncated(false);
      return;
    }
    setIsTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

  useLayoutEffect(() => {
    return scheduleMeasure(measure);
  }, [measure, text]);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let rafCleanup: (() => void) | undefined;
    const ro = new ResizeObserver(() => {
      rafCleanup?.();
      rafCleanup = scheduleMeasure(measure);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      rafCleanup?.();
    };
  }, [measure]);

  return (
    <div className={cn('relative mb-4 min-h-0 grow', className)}>
      <p
        ref={pRef}
        className={cn(
          'text-sm text-gray-600 whitespace-pre-wrap break-words',
          !expanded && 'line-clamp-3',
        )}
      >
        {text}
      </p>
      {isTruncated && !expanded && (
        <button
          type="button"
          aria-expanded={false}
          aria-label="Mostra tutta la descrizione"
          onClick={() => setExpanded(true)}
          className={cn(
            'absolute bottom-0 right-0 inline-flex cursor-pointer items-end border-0 pb-px pl-10',
            'bg-gradient-to-l from-white from-40% via-white to-transparent',
            'text-sm font-semibold text-gray-600 hover:text-primary',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          )}
        >
          …
        </button>
      )}
      {expanded && (
        <button
          type="button"
          aria-expanded
          aria-label="Mostra meno testo"
          className={cn(
            'mt-2 cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-primary',
            'hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          )}
          onClick={() => setExpanded(false)}
        >
          Mostra meno
        </button>
      )}
    </div>
  );
}
