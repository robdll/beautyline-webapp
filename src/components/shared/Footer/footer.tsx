import React from 'react';
import Link from 'next/link';
import { Logo } from '../Logo';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL_HREF } from '@/lib/contact';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white border-t border-primary/20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Sezione 1: Informazioni Aziendali */}
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              BeautyLine Professional offre corsi di alta formazione nel settore dell&apos;estetica,
              con percorsi professionali e master per diventare esperti del settore.
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <span className="text-primary">Email:</span>
                <a href="mailto:info@beautylineprofessional.com" className="hover:text-primary transition-colors">
                  info@beautylineprofessional.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">Telefono:</span>
                <a href={BUSINESS_PHONE_TEL_HREF} className="hover:text-primary transition-colors">
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          {/* Sezione 2: Link Utili */}
          <div className="flex flex-col gap-6">
            <h3 className="heading-brand text-lg font-bold uppercase tracking-wider border-b-2 border-primary inline-block pb-1">Link Utili</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/chi-siamo" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/corsi" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Corsi
                </Link>
              </li>
              <li>
                <Link href="/servizi-estetica" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Servizi Estetica
                </Link>
              </li>
              <li>
                <Link href="/prodotti" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Prodotti
                </Link>
              </li>
              <li>
                <Link href="/attrezzature" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Attrezzature
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Sezione 3: Social Media */}
          <div className="flex flex-col gap-6">
            <h3 className="heading-brand text-lg font-bold uppercase tracking-wider border-b-2 border-primary inline-block pb-1">Seguici</h3>
            <p className="text-gray-400 text-sm">
              Resta aggiornato sulle nostre novità e promozioni
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/beautylineacademymonza/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-white text-gray-400 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCvFeks3fQ1sFk9ZhxDcPDog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-white text-gray-400 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@beautylineacademymonza"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-white text-gray-400 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.01 2.96-.02 4.44-.9-.22-1.91-.1-2.67.49-.76.6-1.19 1.59-1.15 2.56.01.89.45 1.77 1.16 2.27.71.49 1.65.63 2.51.39.87-.25 1.57-.94 1.84-1.81.1-.28.14-.57.14-.86.05-2.25.02-4.49.04-6.74z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/beautylineacademy/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-white text-gray-400 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BeautyLine Professional. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

