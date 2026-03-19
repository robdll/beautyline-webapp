'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const serviceLinks = [
  { label: 'Formazione', href: '/corsi' },
  { label: 'Servizi Estetica', href: '/servizi-estetica' },
  { label: 'Attrezzature', href: '/attrezzature' },
  { label: 'Prodotti', href: '/prodotti' },
];

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navigationItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
  { label: 'I Nostri Servizi', href: '/#servizi', children: serviceLinks },
  { label: 'Recensioni', href: '/recensioni' },
  { label: 'Contattaci', href: '/contatti' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, signout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignout = async () => {
    await signout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-5">
          <Link href="/" className="shrink-0 transition-transform duration-200 hover:scale-105">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5">
            {navigationItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm font-raleway uppercase tracking-wider flex items-center gap-1"
                  >
                    {item.label}
                    <svg className={cn("w-3.5 h-3.5 transition-transform", dropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  <div
                    className={cn(
                      'absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 transition-all duration-200',
                      dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-muted/50 transition-colors font-raleway tracking-wide"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm font-raleway uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-secondary hover:text-primary transition-colors duration-200 p-1"
              aria-label="Carrello"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm font-raleway uppercase tracking-wider"
                >
                  <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </span>
                </button>

                <div
                  className={cn(
                    'absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 transition-all duration-200',
                    userMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                  )}
                >
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-muted/50 transition-colors"
                  >
                    Il Mio Account
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-muted/50 transition-colors"
                  >
                    Carrello
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleSignout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Esci
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/signin">
                <Button variant="primary" size="sm" className="uppercase tracking-wider font-bold">
                  Accedi
                </Button>
              </Link>
            )}
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
            {navigationItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-secondary hover:text-primary hover:bg-muted/50 transition-colors duration-200 font-medium font-raleway uppercase text-sm tracking-wide"
                  >
                    {item.label}
                    <svg className={cn("w-4 h-4 transition-transform", mobileServicesOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={cn("overflow-hidden transition-all duration-200", mobileServicesOpen ? "max-h-64" : "max-h-0")}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="block pl-8 pr-4 py-2.5 text-secondary hover:text-primary hover:bg-muted/50 transition-colors text-sm font-raleway tracking-wide"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-secondary hover:text-primary hover:bg-muted/50 transition-colors duration-200 font-medium font-raleway uppercase text-sm tracking-wide"
                >
                  {item.label}
                </Link>
              )
            )}

            <div className="px-4 pt-4">
              {user ? (
                <div className="space-y-2">
                  <Link href="/account" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full uppercase tracking-wider font-bold">
                      Il Mio Account
                    </Button>
                  </Link>
                  <button
                    onClick={() => { handleSignout(); setIsOpen(false); }}
                    className="w-full text-center text-sm text-red-600 py-2"
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <Link href="/signin" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full uppercase tracking-wider font-bold">
                    Accedi
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
