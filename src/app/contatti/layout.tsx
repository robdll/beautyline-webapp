import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contattaci per informazioni sui nostri corsi, prodotti e servizi. Siamo qui per aiutarti.',
};

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

