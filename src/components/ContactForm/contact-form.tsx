'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/shared/Button';
import { Alert } from '@/components/shared/Alert';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: string;
  message: string;
};

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  guests: '',
  message: '',
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputClassName = useMemo(
    () =>
      'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none',
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
        messageId?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Si è verificato un errore. Per favore riprova.');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(INITIAL_FORM_DATA);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Si è verificato un errore. Per favore riprova o contattaci direttamente.'
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-secondary mb-6">Scrivici</h3>

      {errorMessage ? (
        <Alert variant="error" title="Non siamo riusciti a inviare il messaggio" className="mb-6">
          {errorMessage}
        </Alert>
      ) : null}

      {isSubmitted ? (
        <div className="text-center py-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-secondary">Messaggio inviato!</h4>
          <p className="mt-2 text-gray-600">Ti risponderemo entro 24 ore.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Il tuo nome"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                placeholder="La tua email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Telefono <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Il tuo numero"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="eventType" className="text-sm font-medium text-gray-700">
                Tipo di evento <span className="text-red-600">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                required
                value={formData.eventType}
                onChange={handleChange}
                className={`${inputClassName} bg-white`}
              >
                <option value="">Seleziona...</option>
                <option value="festa-privata">Festa privata / Matrimonio</option>
                <option value="evento-aziendale">Evento aziendale / Team building</option>
                <option value="festival">Festival / Fiera</option>
                <option value="noleggio">Noleggio</option>
                <option value="altro">Altro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="eventDate" className="text-sm font-medium text-gray-700">
                Data evento
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className={inputClassName}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="guests" className="text-sm font-medium text-gray-700">
                Numero ospiti
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                min={1}
                inputMode="numeric"
                value={formData.guests}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Es. 50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`${inputClassName} resize-none`}
              placeholder="Come possiamo aiutarti?"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Invio in corso…' : 'Invia richiesta'}
          </Button>

          <p className="text-xs text-gray-500">
            I campi contrassegnati con <span className="text-red-600">*</span> sono obbligatori.
          </p>
        </form>
      )}
    </div>
  );
}
