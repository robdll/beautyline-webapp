import Link from 'next/link';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { SERVICE_CATEGORIES, serviceCategoryAnchorId } from '@/lib/service-categories';
import { cn } from '@/lib/utils';

type ServiziEsteticaIntroSectionProps = {
  sectionId?: string;
  className?: string;
  showDiscoverMoreButton?: boolean;
};

export function ServiziEsteticaIntroSection({
  sectionId = 'servizi-estetica',
  className,
  showDiscoverMoreButton = true,
}: ServiziEsteticaIntroSectionProps) {
  return (
    <Section id={sectionId} className={cn('bg-muted', className)}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
        <h2 className="heading-brand text-center text-3xl font-bold tracking-wide md:text-4xl">
          Servizi Estetica
        </h2>
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-600">
          I nostri trattamenti professionali di estetica sono pensati per offrire il massimo della
          qualità e del benessere. Dall&apos;epilazione alla pedicure, ogni servizio è eseguito con
          prodotti di alta gamma e tecniche all&apos;avanguardia.
        </p>
        <ul className="flex flex-wrap justify-center gap-3 py-1">
          {SERVICE_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/servizi-estetica#${serviceCategoryAnchorId(category)}`}
                className="inline-block cursor-pointer rounded-full bg-purple/10 px-4 py-2 text-sm font-medium text-purple transition-opacity hover:opacity-90"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/servizi-estetica"
          className={cn(!showDiscoverMoreButton && 'hidden')}
        >
          <Button variant="primary" size="lg" className="font-bold uppercase tracking-wider">
            Scopri di più
          </Button>
        </Link>
      </div>
    </Section>
  );
}
