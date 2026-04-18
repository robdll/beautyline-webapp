import Link from 'next/link';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { SERVICE_CATEGORIES, serviceCategoryAnchorId } from '@/lib/service-categories';
import { cn } from '@/lib/utils';

const primaryCtaClass =
  'inline-flex items-center justify-center rounded-[40px] bg-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

type ServiziEsteticaIntroSectionProps = {
  sectionId?: string;
  className?: string;
  showDiscoverMoreButton?: boolean;
  /** When set, shows “Listino Prezzi” (download) for visitors. */
  listinoPrezziUrl?: string | null;
  /** e.g. `#promozioni` on `/servizi-estetica` — shows “Scopri le Promozioni”. */
  promozioniHref?: string;
};

export function ServiziEsteticaIntroSection({
  sectionId = 'servizi-estetica',
  className,
  showDiscoverMoreButton = true,
  listinoPrezziUrl,
  promozioniHref,
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
        {listinoPrezziUrl || promozioniHref ? (
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            {listinoPrezziUrl ? (
              <a
                href={listinoPrezziUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className={primaryCtaClass}
              >
                Listino Prezzi
              </a>
            ) : null}
            {promozioniHref ? (
              <Link href={promozioniHref} className={primaryCtaClass}>
                Scopri le Promozioni
              </Link>
            ) : null}
          </div>
        ) : null}
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
