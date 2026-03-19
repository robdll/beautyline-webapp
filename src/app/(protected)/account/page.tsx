'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Section } from '@/components/Section';
import { Button } from '@/components/shared/Button';

interface ProfileForm {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    streetNumber: string;
    postalCode: string;
    city: string;
    province: string;
  };
}

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    address: { street: '', streetNumber: '', postalCode: '', city: '', province: '' },
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: {
          street: user.address?.street || '',
          streetNumber: user.address?.streetNumber || '',
          postalCode: user.address?.postalCode || '',
          city: user.address?.city || '',
          province: user.address?.province || '',
        },
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Errore nel salvataggio.');
      } else {
        setSuccess('Profilo aggiornato con successo.');
        await refreshUser();
      }
    } catch {
      setError('Errore di connessione.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  if (!user) return null;

  return (
    <Section className="bg-muted min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="heading-brand text-3xl font-bold mb-2 uppercase tracking-wide">
          Il Mio Account
        </h1>
        <p className="text-gray-500 mb-8 text-sm">{user.email}</p>

        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-6">
          <h2 className="heading-brand text-lg font-bold">Informazioni Personali</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          <hr className="border-gray-100" />
          <h2 className="heading-brand text-lg font-bold">Indirizzo</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
              <input
                id="street"
                type="text"
                value={form.address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                placeholder="Via Roma"
              />
            </div>
            <div>
              <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700 mb-1">N. Civico</label>
              <input
                id="streetNumber"
                type="text"
                value={form.address.streetNumber}
                onChange={(e) => updateAddress('streetNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">CAP</label>
              <input
                id="postalCode"
                type="text"
                value={form.address.postalCode}
                onChange={(e) => updateAddress('postalCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                placeholder="00100"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Città</label>
              <input
                id="city"
                type="text"
                value={form.address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                placeholder="Roma"
              />
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
              <input
                id="province"
                type="text"
                value={form.address.province}
                onChange={(e) => updateAddress('province', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                placeholder="RM"
                maxLength={2}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="lg" disabled={saving}>
              {saving ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
