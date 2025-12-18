import React from 'react';

import { cn } from '@/lib/utils';

type AlertVariant = 'info' | 'success' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const variants: Record<AlertVariant, string> = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-red-200 bg-red-50 text-red-900',
  };

  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className={cn(
        'w-full rounded-xl border px-4 py-3 text-sm',
        variants[variant],
        className
      )}
    >
      {title ? <div className="mb-1 font-semibold">{title}</div> : null}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
