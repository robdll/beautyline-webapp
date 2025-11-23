import React from 'react';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';

export default function ChiSiamo() {
  return (
    <>
      <Hero
        title="Chi Siamo"
        description="La nostra passione, la tua professione."
        ctaText="I Nostri Corsi"
        ctaHref="/corsi"
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              La Nostra Storia
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              BeautyLine Professional nasce dalla passione per l'estetica e dalla volontà di formare professionisti d'eccellenza. 
              Da anni siamo un punto di riferimento nel settore, offrendo corsi di alta formazione che uniscono teoria e pratica.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              La nostra accademia si distingue per l'attenzione dedicata ad ogni singolo studente, 
              con classi a numero chiuso e docenti altamente qualificati che ti seguiranno passo dopo passo nel tuo percorso di crescita.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://placehold.co/600x800"
              alt="BeautyLine Academy"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            La Nostra Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Il nostro obiettivo è trasformare la tua passione in una carriera di successo. 
            Vogliamo formare estetiste preparate, consapevoli e pronte ad affrontare le sfide del mondo del lavoro.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">Eccellenza</h3>
            <p className="text-gray-600">
              Standard formativi elevati e aggiornamento continuo sulle ultime tendenze.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">Community</h3>
            <p className="text-gray-600">
              Un ambiente inclusivo dove crescere insieme e condividere esperienze.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">Innovazione</h3>
            <p className="text-gray-600">
              Utilizzo delle tecnologie e dei metodi più avanzati nel campo estetico.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
