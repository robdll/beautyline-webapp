'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { NavigationItem } from '@/types';
import { cn } from '@/lib/utils';

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'I Nostri Corsi', href: '/corsi' },
  { label: 'Noleggio', href: '/noleggio' },
  { label: 'I nostri prodotti', href: '/prodotti' },
  { label: 'Vendita Usato', href: '/vendita-usato' },
  { label: 'Recensioni', href: '/recensioni' },
  { label: 'Contattaci', href: '/contatti' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 transition-transform duration-200 hover:scale-105">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm font-raleway uppercase tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-secondary hover:text-primary focus:outline-none"
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
            'lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white',
            isOpen ? 'max-h-screen opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-secondary hover:text-primary hover:bg-muted/50 transition-colors duration-200 font-medium font-raleway uppercase text-sm tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Button variant="primary" size="sm" className="w-full uppercase tracking-wider font-bold">
                Iscriviti
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

