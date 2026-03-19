import type { Metadata } from 'next';
import Link from 'next/link';
import { ESSENTIAL_CONSENT_TTL_MS } from '@/lib/cookie-consent';

export const metadata: Metadata = {
  title: 'Informativa cookie',
  description:
    'Informazioni sui cookie e sulle preferenze di BeautyLine Professional, inclusi strumenti analitici e pubblicitari futuri.',
};

const hours24 = ESSENTIAL_CONSENT_TTL_MS / (60 * 60 * 1000);

export default function InformativaCookiePage() {
  return (
    <>
      <header className="border-b border-primary/20 bg-secondary px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-brand text-3xl font-bold tracking-tight md:text-4xl">Informativa sui cookie</h1>
          <p className="mt-3 text-sm text-gray-400">Ultimo aggiornamento: marzo {new Date().getFullYear()}</p>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-secondary sm:px-6 md:py-16 lg:px-8">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Cosa sono i cookie</h2>
            <p className="text-gray-700">
              I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo dell&apos;utente, dove vengono
              memorizzati per essere poi ritrasmessi agli stessi siti in visite successive. Questo sito utilizza anche
              tecnologie simili (ad esempio lo spazio locale del browser, <em>local storage</em>) per ricordare le tue
              preferenze sui cookie, come descritto più avanti.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Cookie e preferenze su questo sito</h2>
            <p className="text-gray-700">
              Al primo accesso (o quando la preferenza non è più valida) ti chiediamo se accettare{' '}
              <strong>solo i cookie essenziali</strong> oppure <strong>tutti i cookie</strong>, inclusi quelli per
              statistiche e marketing quando saranno attivati.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <strong>Essenziali:</strong> vengono utilizzati solo i cookie e le tecnologie strettamente necessarie al
                funzionamento del sito (es. sicurezza, gestione sessioni o carrelli ove previsti). La tua scelta è
                memorizzata nel browser tramite <em>local storage</em> e ha validità di <strong>{hours24} ore</strong>;
                trascorso questo periodo ti verrà nuovamente mostrato il banner per rinnovare la scelta.
              </li>
              <li>
                <strong>Tutti:</strong> oltre agli essenziali, quando attiveremo Google Analytics e Google Ads, potremo
                utilizzare cookie e strumenti connessi per misurare l&apos;utilizzo del sito e proporti contenuti o
                annunci coerenti con il tuo interesse. La preferenza &quot;tutti&quot; resta memorizzata senza scadenza
                automatica, fino a quando non modificherai le impostazioni o cancellerai i dati dal browser.
              </li>
            </ul>
            <p className="text-gray-700">
              Puoi cambiare idea in qualunque momento usando il link <strong>Preferenze cookie</strong> presente nel
              piè di pagina del sito.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Cookie di terze parti (futuri)</h2>
            <p className="text-gray-700">
              In futuro potremo integrare <strong>Google Analytics</strong> per analisi statistiche aggregate sul
              traffico e <strong>Google Ads</strong> per la pubblicità e il remarketing. Questi strumenti possono
              impostare cookie propri o correlati alle proprietà Google. L&apos;attivazione avverrà solo previo tuo
              consenso espresso tramite l&apos;opzione <strong>Tutti</strong>, salvo obblighi di legge diversi.
            </p>
            <p className="text-gray-700">
              Per maggiori dettagli sul trattamento dei dati personali, vedi anche l&apos;
              <Link href="/informativa-privacy" className="text-primary underline-offset-2 hover:underline">
                informativa sulla privacy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Come gestire i cookie dal browser</h2>
            <p className="text-gray-700">
              Puoi bloccare o cancellare i cookie attraverso le impostazioni del tuo browser. Tieni presente che
              disattivare i cookie essenziali potrebbe compromettere alcune funzioni del sito.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Contatti</h2>
            <p className="text-gray-700">
              Per domande su questa informativa puoi scrivere a{' '}
              <a href="mailto:info@beautylineprofessional.com" className="text-primary underline-offset-2 hover:underline">
                info@beautylineprofessional.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
