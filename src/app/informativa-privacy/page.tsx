import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Informativa privacy',
  description:
    "Informativa sul trattamento dei dati personali di BeautyLine Professional ai sensi del Regolamento UE 2016/679 (GDPR).",
};

export default function InformativaPrivacyPage() {
  return (
    <>
      <header className="border-b border-primary/20 bg-secondary px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-brand text-3xl font-bold tracking-tight md:text-4xl">Informativa sulla privacy</h1>
          <p className="mt-3 text-sm text-gray-400">Ultimo aggiornamento: marzo {new Date().getFullYear()}</p>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-secondary sm:px-6 md:py-16 lg:px-8">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Titolare del trattamento</h2>
            <p className="text-gray-700">
              Il titolare del trattamento dei dati personali raccolti tramite il sito{' '}
              <strong>BeautyLine Professional</strong> (di seguito anche &quot;Titolare&quot;) è identificabile ai
              recapiti indicati sul sito e raggiungibile all&apos;indirizzo email{' '}
              <a href="mailto:info@beautylineprofessional.com" className="text-primary underline-offset-2 hover:underline">
                info@beautylineprofessional.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Tipologie di dati trattati</h2>
            <p className="text-gray-700">In base alle funzioni del sito e alle tue interazioni, possono essere trattati:</p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <strong>Dati di navigazione e tecnici:</strong> ad esempio indirizzo IP, tipo di browser, pagine
                visitate, identificativi di sessione o preferenze memorizzate localmente (come la scelta sui cookie).
              </li>
              <li>
                <strong>Dati forniti volontariamente:</strong> nome, email, telefono o altre informazioni inserite in
                moduli di contatto, iscrizione a corsi o aree riservate ove presenti.
              </li>
              <li>
                <strong>Dati relativi a acquisti o prenotazioni</strong> ove gestiti tramite il sito o piattaforme
                collegate.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Finalità e base giuridica</h2>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <strong>Erogazione del sito e servizi richiesti:</strong> esecuzione di misure precontrattuali o del
                contratto e, ove necessario, obblighi legali.
              </li>
              <li>
                <strong>Gestione delle preferenze cookie:</strong> preferenze salvate in <em>local storage</em>; per le
                scelte descritte nell&apos;
                <Link href="/informativa-cookie" className="text-primary underline-offset-2 hover:underline">
                  informativa cookie
                </Link>
                .
              </li>
              <li>
                <strong>Analisi delle visite e pubblicità (futuro):</strong> con strumenti quali{' '}
                <strong>Google Analytics</strong> e <strong>Google Ads</strong>, solo previo tuo consenso espresso
                tramite l&apos;opzione &quot;Tutti&quot; nel banner cookie, salvo utilizzi basati su legittimo interesse
                laddove ammessi dalla legge.
              </li>
              <li>
                <strong>Comunicazioni:</strong> per rispondere alle richieste inviate tramite i canali di contatto.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Destinatari e trasferimenti</h2>
            <p className="text-gray-700">
              I dati possono essere trattati da personale autorizzato del Titolare e da fornitori tecnici che operano
              come responsabili del trattamento (es. hosting, manutenzione del sito). L&apos;uso di servizi Google
              (Analytics, Ads) può comportare trasferimenti verso paesi extra-UE secondo le garanzie previste dagli
              articoli 44 e seguenti del GDPR (es. clausole contrattuali standard o decisioni di adeguatezza), quando
              tali servizi saranno attivi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Conservazione</h2>
            <p className="text-gray-700">
              I dati sono conservati per il tempo necessario alle finalità per cui sono stati raccolti, nei limiti di
              legge. La preferenza sui cookie &quot;essenziali&quot; ha durata di 24 ore come da{' '}
              <Link href="/informativa-cookie" className="text-primary underline-offset-2 hover:underline">
                informativa cookie
              </Link>
              ; altre conservazioni dipendono dalla tipologia di trattamento (es. adempimenti contabili, contestazioni).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-brand text-xl font-bold">Diritti dell&apos;interessato</h2>
            <p className="text-gray-700">
              Ai sensi degli artt. 15–22 GDPR hai diritto di accesso, rettifica, cancellazione, limitazione del
              trattamento, portabilità (ove applicabile) e opposizione, nonché di revocare il consenso in qualsiasi
              momento senza pregiudicare la liceità del trattamento basata sul consenso prima della revoca. Puoi
              esercitare i diritti scrivendo al Titolare ai recapiti sopra indicati. Hai inoltre diritto di proporre
              reclamo all&apos;Autorità Garante per la protezione dei dati personali (
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                www.garanteprivacy.it
              </a>
              ).
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
