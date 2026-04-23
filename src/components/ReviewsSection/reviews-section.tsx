import React from 'react';

import { Section } from '@/components/Section';
import { TestimonialCard } from '@/components/TestimonialCard';
import { getGooglePlaceReviews } from '@/lib/google-reviews';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/types/testimonial';

interface ReviewsSectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  title?: string;
  description?: string;
  variant?: 'light' | 'dark';
  limit?: number;
}

export async function ReviewsSection({
  id,
  className,
  containerClassName,
  title = 'Dicono di Noi',
  description = 'Le esperienze di chi ha scelto BeautyLine per la propria formazione',
  variant = 'light',
  limit = 3,
}: ReviewsSectionProps) {
  const googleReviewsData = await getGooglePlaceReviews(limit);
  const googleReviews = googleReviewsData.reviews;

  if (googleReviews.length === 0) return null;

  const testimonials: Testimonial[] = googleReviews.map((review, index) => ({
    id: `google-${index + 1}`,
    name: review.authorName || 'Cliente verificato',
    content: review.text || 'Recensione disponibile su Google.',
    image: review.photoUri || 'https://placehold.co/100x100.png',
    rating: Math.max(1, Math.min(5, Math.round(review.rating ?? 5))),
  }));

  const isDark = variant === 'dark';

  return (
    <Section
      id={id}
      className={cn(isDark && 'bg-secondary text-white', className)}
      containerClassName={containerClassName}
    >
      <div className="flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-4">
          <h2 className="heading-brand text-3xl md:text-4xl font-bold">{title}</h2>
          <p
            className={cn(
              'text-lg max-w-2xl mx-auto',
              isDark ? 'text-gray-200' : 'text-gray-600',
            )}
          >
            {description}
          </p>
          {googleReviewsData.averageRating && googleReviewsData.totalReviews ? (
            <div
              className={cn(
                'flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-base',
                isDark ? 'text-gray-200' : 'text-gray-700',
              )}
            >
              <span className={cn('font-semibold', isDark ? 'text-white' : 'text-secondary')}>
                Google {googleReviewsData.averageRating.toFixed(1).replace('.', ',')} / 5
              </span>
              <span className={isDark ? 'text-white/40' : 'text-gray-400'}>•</span>
              <span>{googleReviewsData.totalReviews} recensioni</span>
              {googleReviewsData.reviewsUrl ? (
                <>
                  <span className={isDark ? 'text-white/40' : 'text-gray-400'}>•</span>
                  <a
                    href={googleReviewsData.reviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'font-medium transition-colors',
                      isDark
                        ? 'text-white underline underline-offset-4 hover:text-white/80'
                        : 'text-primary hover:text-primary/80',
                    )}
                  >
                    Vedi tutte su Google
                  </a>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant={variant}
              className={isDark ? 'bg-white/10 border border-white/15 text-white' : undefined}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
