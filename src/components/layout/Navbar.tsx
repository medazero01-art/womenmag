"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X, Phone, Globe } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const { t, language, setLanguage, dir } = useLanguage();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100" dir={dir}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary font-poppins">
          Women Mag
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
            {t.nav.home}
          </Link>
          <Link href="/products" className="text-text-secondary hover:text-primary transition-colors">
            {t.nav.collection}
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-primary transition-colors">
            {t.nav.about}
          </Link>
          <Link href="/admin/login" className="text-text-secondary hover:text-primary transition-colors">
            {t.nav.admin}
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
          >
            <Globe className="w-4 h-4" />
            {language === 'fr' ? 'العربية' : 'Français'}
          </button>

          <a href="tel:+213555555555" className="hidden md:flex items-center text-text-secondary hover:text-primary">
            <Phone className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
            <span className="text-sm">+213 555 555 555</span>
          </a>

          <Link href="/cart" className="relative text-text-primary hover:text-primary transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 rtl:-right-auto rtl:-left-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-lg py-4 px-4 flex flex-col space-y-4 rtl:text-right animate-in slide-in-from-top-5">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-text-primary">
            {t.nav.home}
          </Link>
          <Link href="/products" onClick={() => setIsOpen(false)} className="text-lg font-medium text-text-primary">
            {t.nav.collection}
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-text-primary">
            {t.nav.about}
          </Link>
          <Link href="/admin/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-text-primary">
            {t.nav.admin}
          </Link>
          <div className="h-px bg-gray-100 my-2"></div>
          <a href="tel:+213555555555" className="flex items-center rtl:flex-row-reverse text-primary font-medium">
            <Phone className="w-5 h-5 mr-2 rtl:ml-2" />
            {t.nav.callUs}
          </a>
        </div>
      )}
    </nav>
  );
}
