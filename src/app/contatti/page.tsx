'use client';

import React, { useState } from 'react';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';
import { ContactFormData } from '@/types';

export default function ContattiPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Grazie per il tuo messaggio! Ti contatteremo presto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Section className="bg-[var(--color-muted)] pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-4">
            Contattaci
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Siamo qui per rispondere a tutte le tue domande. Contattaci per informazioni sui corsi, prodotti o servizi.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-6">
              Invia un Messaggio
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                  placeholder="tua.email@esempio.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                  placeholder="+39 123 456 7890"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Messaggio *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Scrivi il tuo messaggio..."
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Invia Messaggio
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-6">
              Informazioni di Contatto
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-secondary)] mb-1">Telefono</h3>
                  <a href="tel:+390123456789" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                    +39 012 345 6789
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-secondary)] mb-1">Email</h3>
                  <a href="mailto:info@beautylineprofessional.com" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                    info@beautylineprofessional.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-secondary)] mb-1">Indirizzo</h3>
                  <p className="text-gray-600">
                    Via dell'Estetica, 123<br />
                    00100 Roma, Italia
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-secondary)] mb-1">Orari</h3>
                  <p className="text-gray-600">
                    Lun-Ven: 9:00 - 18:00<br />
                    Sabato: 9:00 - 13:00<br />
                    Domenica: Chiuso
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

