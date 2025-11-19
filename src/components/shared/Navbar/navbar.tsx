'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { NavigationItem } from '@/types';
import { cn } from '@/lib/utils';

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Corsi', href: '/corsi' },
  { label: 'Percorso Master', href: '/percorso-master' },
  { label: 'Prodotti', href: '/prodotti' },
  { label: 'Recensioni', href: '/recensioni' },
  { label: 'Noleggio', href: '/noleggio' },
  { label: 'Contatti', href: '/contatti' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo width={150} height={50} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200 font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Button variant="primary" size="sm">
              Iscriviti
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-[var(--color-secondary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden transition-all duration-300 ease-in-out overflow-hidden',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-muted)] rounded-md transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button variant="primary" size="sm" className="w-full">
                Iscriviti
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

