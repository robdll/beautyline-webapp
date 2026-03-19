import React from 'react';
import { Hero } from '@/components/Hero';
import { ContactSection } from '@/components/ContactSection';

export default function Contatti() {
  return (
    <>
      <Hero
        title="Contattaci"
        description="Siamo qui per rispondere a tutte le tue domande."
        ctaText="Chiamaci Ora"
        ctaHref="tel:+390123456789"
      />

      <ContactSection />
    </>
  );
}
