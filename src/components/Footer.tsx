'use client';

import Link from 'next/link';
import { Copyright } from './Copyright';
import FooterPartners from './FooterPartners';
import FooterContacts from './FooterContacts';
import FooterLegal from './FooterLegal';
import FooterBottom from './FooterBottom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FooterPartners />
          <FooterContacts />
          <FooterLegal />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
} 