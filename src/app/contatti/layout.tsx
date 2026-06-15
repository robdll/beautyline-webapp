import { Metadata } from 'next';
import { pageCanonical } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contattaci per informazioni sui nostri corsi, prodotti e servizi. Siamo qui per aiutarti.',
  alternates: pageCanonical('/contatti'),
};

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

