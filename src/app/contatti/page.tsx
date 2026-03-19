import React from 'react';
import { Hero } from '@/components/Hero';
import { ContactSection } from '@/components/ContactSection';
import { BUSINESS_PHONE_TEL_HREF } from '@/lib/contact';

export default function Contatti() {
  return (
    <>
      <Hero
        title="Contattaci"
        description="Siamo qui per rispondere a tutte le tue domande."
        ctaText="Chiamaci Ora"
        ctaHref={BUSINESS_PHONE_TEL_HREF}
      />

      <ContactSection />
    </>
  );
}
