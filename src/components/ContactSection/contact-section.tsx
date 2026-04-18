import React from 'react';
import { Section } from '@/components/Section';
import { ContactForm } from '@/components/ContactForm';
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL_HREF,
  ESTETICA_PHONE_DISPLAY,
  ESTETICA_PHONE_TEL_HREF,
} from '@/lib/contact';

interface ContactSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ContactSection({
  title = 'Informazioni di Contatto',
  description = 'Compila il modulo o contattaci direttamente utilizzando i recapiti qui sotto. Saremo lieti di fornirti tutte le informazioni di cui hai bisogno.',
  className,
}: ContactSectionProps) {
  return (
    <Section className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-8">
          <h2 className="heading-brand text-3xl font-bold mb-6">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="heading-brand text-lg font-semibold">Sede</h3>
                <p className="text-gray-600">Via M. Buonarroti, 24, 20900 Monza (MB)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="heading-brand text-lg font-semibold">Email</h3>
                <a href="mailto:info@beautylineprofessional.com" className="text-gray-600 hover:text-primary transition-colors">
                  info@beautylineprofessional.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="heading-brand text-lg font-semibold leading-snug">
                  Telefono per informazioni su Corsi e Tecnologie
                </h3>
                <a href={BUSINESS_PHONE_TEL_HREF} className="text-gray-600 hover:text-primary transition-colors">
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="heading-brand text-lg font-semibold leading-snug">
                  Telefono per informazioni su Estetica e Negozio
                </h3>
                <a href={ESTETICA_PHONE_TEL_HREF} className="text-gray-600 hover:text-primary transition-colors">
                  {ESTETICA_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
