import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Percorso Master',
  description: 'Percorso formativo completo e avanzato per diventare un esperto nel settore dell\'estetica professionale.',
};

export default function PercorsoMasterPage() {
  return (
    <>
      <Section className="bg-muted pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Percorso Master
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un percorso formativo completo e avanzato per diventare un vero esperto nel settore dell'estetica professionale
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://placehold.co/800x600"
              alt="Percorso Master"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              Formazione Completa e Professionale
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Il Percorso Master è pensato per chi vuole raggiungere il massimo livello di competenza nel settore estetico.
              Un programma completo che copre tutte le aree fondamentali dell'estetica professionale.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Oltre 200 ore di formazione teorica e pratica</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Docenti esperti del settore</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Attestato di qualifica professionale riconosciuto</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Supporto post-corso e aggiornamenti continui</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8 text-center">
            Moduli del Percorso Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Base di Estetica', description: 'Fondamenti teorici e pratici' },
              { title: 'Trattamenti Viso', description: 'Tecniche avanzate per il viso' },
              { title: 'Massaggio Corpo', description: 'Massaggi terapeutici e rilassanti' },
              { title: 'Epilazione', description: 'Tutte le tecniche di epilazione' },
              { title: 'Manicure e Pedicure', description: 'Cura professionale delle unghie' },
              { title: 'Trucco Professionale', description: 'Make-up per ogni occasione' },
            ].map((module, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Investi nella Tua Formazione
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Il Percorso Master è l'investimento perfetto per la tua carriera nel settore estetico.
            Contattaci per maggiori informazioni e per conoscere le prossime date disponibili.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contatti">
              <Button variant="primary" size="lg">
                Richiedi Informazioni
              </Button>
            </Link>
            <Link href="/corsi">
              <Button variant="outline" size="lg">
                Vedi Tutti i Corsi
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

