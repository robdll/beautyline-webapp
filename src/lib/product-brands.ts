export type ProductSubcategory = {
  id: string;
  title: string;
  /** Testo descrittivo della sottocategoria; se assente, la card mostra solo il titolo. */
  description?: string;
};

export type ProductBrand = {
  id: string;
  title: string;
  tagline?: string;
  paragraphs: string[];
  subcategories: ProductSubcategory[];
};

export const PRODUCT_BRANDS: ProductBrand[] = [
  {
    id: 'chris-nails',
    title: 'Chris Nails',
    paragraphs: [
      'Dopo anni di collaborazioni con grandi Master e distributori del settore Nails, il mio sogno era uno: associare il mio nome a un prodotto che potesse essere utilizzato da tutte le ragazze che partecipavano ai corsi. Da lì è iniziato tutto.',
      'Con i numerosi corsi organizzati insieme alle più grandi Master che sono passate nella nostra accademia, Christian e Barbara volevano creare una linea professionale e completa, capace di offrire tutto ciò che oggi il mercato propone, ma con un tocco in più — la qualità testata e approvata da chi lavora ogni giorno nel settore. L’ho voluta associare al mio nome perché la sentivo mia, personale, dopo anni di test e studi nel mondo Nails.',
      'Ho iniziato a selezionare le migliori aziende europee, facendo testare i prodotti direttamente alle Master, fino a creare, passo dopo passo, una linea completa, professionale e conforme alle normative TPO FREE. Una linea che rispetta gli standard di sicurezza europei e che permette alle professioniste di acquistare prodotti di alta qualità a un prezzo ottimale.',
      'Oggi Chris Nails offre una gamma di oltre 300 referenze tra colori, gel, acrygel, basi soak off, builder, fiber e rubber, tutti disponibili anche in accademia. Ogni mese lanciamo nuovi colori e prodotti, seguendo le stagioni e le tendenze del momento, perché Chris Nails non è solo un marchio, ma una garanzia di applicazione, stesura e qualità.',
      'Attraverso i corsi, cerchiamo ogni giorno di trasmettere alle nostre corsiste un messaggio importante: usare un prodotto di qualità non è un dettaglio, ma il primo passo per creare lavori perfetti, duraturi e professionali.',
      'Non possiamo pensare che un prodotto venga solo messo sul banco e lasciato a prendere polvere: ogni prodotto ha un valore, un ruolo e una responsabilità — quella di garantire sicurezza, fiducia e risultati eccellenti a chi lo utilizza e a chi lo riceve.',
      'Chris Nails nasce da una passione autentica, cresce con la formazione e vive ogni giorno sulle mani di chi sceglie la qualità.',
    ],
    subcategories: [
      { id: 'soak-off', title: 'Soak Off' },
      { id: 'gel', title: 'Gel' },
      { id: 'acrygel', title: 'Acrygel' },
      { id: 'nail-art', title: 'Nail Art' },
      { id: 'rubber-fiber-base', title: 'Rubber & Fiber Base' },
    ],
  },
  {
    id: 'skin-renew',
    title: 'Skin Renew',
    tagline: 'Prodotti Professionali per Skincare',
    paragraphs: [
      'Quanto è fondamentale una linea cosmetica per un centro estetico? Per noi, è la base di ogni trattamento di qualità.',
      'Una linea studiata in diversi formati — da 50 ml fino a 500 ml — pensata sia per professionisti che per clienti privati, con una vasta gamma di prodotti adatti a ogni stagione e a ogni trattamento.',
      'Il nostro obiettivo è chiaro: fare in modo che sia la professionista che la cliente privata possano prendersi cura di sé utilizzando prodotti di qualità, sicuri ed efficaci.',
      'Beauty Line Skin Renew nasce dal desiderio di offrire trattamenti viso e corpo professionali, frutto di una ricerca accurata e di un costante impegno nel settore cosmetico.',
      'Abbiamo creato una linea completa, utilizzata sia nei centri estetici che a casa, da chi desidera mantenere la pelle sana e luminosa ogni giorno.',
      'La cura e il benessere di ogni persona vengono valorizzati dal trattamento giusto: Beautylineacademy offre cosmetici certificati e di alta qualità, formulati per rispettare e rigenerare la pelle, senza rischi o irritazioni.',
      'Da noi puoi trovare creme viso e corpo studiate per ogni esigenza, realizzate con ingredienti selezionati e testati.',
      'Siamo costantemente alla ricerca di novità e innovazione, creando per ogni trattamento con le nostre tecnologie BLTECH l’abbinamento perfetto tra cosmetica e tecnologia, per risultati visibili, duraturi e sicuri.',
    ],
    subcategories: [
      { id: 'cosmetica-viso', title: 'Cosmetica Viso' },
      { id: 'cosmetica-corpo', title: 'Cosmetica Corpo' },
    ],
  },
];
