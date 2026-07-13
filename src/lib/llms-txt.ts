import { SITE_URL } from '@/lib/site';

/** Contenuto di /llms.txt — indice per LLM e agenti (spec https://llmstxt.org). */
export function buildLlmsTxt(): string {
  const u = SITE_URL;

  return `# BeautyLine Professional

> BeautyLine Professional è un'accademia di estetica a Monza: corsi di formazione, percorsi accademici, servizi estetici, attrezzature e prodotti professionali.

Il sito è in italiano. I percorsi formativi (pacchetti multi-corso) sono elencati nella pagina Corsi, sezione «Percorsi accademici» (\`/corsi#percorsi-accademici\`). Ogni percorso ha una pagina dedicata sotto \`/percorsi/{slug}\`. I singoli corsi sono sotto \`/corsi/{tipo}/{slug}\` (tipo: unghie, occhi, …).

## Pagine principali

- [Home](${u}/): presentazione generale e panoramica dei servizi
- [Corsi](${u}/corsi): corsi, calendario, prossime date e percorsi accademici
- [Chi siamo](${u}/chi-siamo): storia, missione e team dell'accademia
- [Servizi estetica](${u}/servizi-estetica): trattamenti, promozioni e listino
- [Attrezzature](${u}/attrezzature): catalogo attrezzature in vendita e noleggio
- [Prodotti](${u}/prodotti): linee di prodotti professionali per estetica
- [Contatti](${u}/contatti): modulo di contatto e recapiti telefonici

## Formazione

- [Percorsi accademici](${u}/corsi#percorsi-accademici): catalogo percorsi formativi multi-corso sulla pagina Corsi
- [Calendario corsi](${u}/corsi#calendario-corsi): locandine mensili dei corsi in programma
- [Prossimi corsi](${u}/corsi#prossimi-corsi): corsi in partenza ordinati per data

## Optional

- [Informativa cookie](${u}/informativa-cookie): policy sui cookie e consenso
- [Informativa privacy](${u}/informativa-privacy): trattamento dei dati personali
- [Sitemap](${u}/sitemap.xml): elenco URL pubblici indicizzabili (corsi, percorsi, prodotti, attrezzature)
`;
}
