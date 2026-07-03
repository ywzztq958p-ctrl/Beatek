import React, { useState } from 'react';
import Logo from './Logo';
import { Menu, X, Shield, Phone, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Navbar({ onOpenAdmin, onScrollToSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Accueil', target: 'home', icon: Sparkles },
    { label: 'Activités', target: 'activities', icon: Activity },
    { label: 'Contact', target: 'contact', icon: Phone },
  ];

  const handleLinkClick = (target: string) => {
    onScrollToSection(target);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 shadow-xl" id="beatek-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('home')} id="navbar-logo">
            <Logo size="sm" className="scale-75 -my-2" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8" id="navbar-desktop-links">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleLinkClick(link.target)}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-pink-500 transition-colors py-2 cursor-pointer relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4" id="navbar-desktop-actions">
            {/* Quick Admin Access Key */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-zinc-600 hover:text-pink-500 hover:bg-pink-500/5 rounded-xl transition-all cursor-pointer"
              title="Espace Administrateur"
              id="admin-access-btn"
            >
              <Shield size={18} />
            </button>
            
            {/* CTA Book Button */}
            <button
              onClick={() => onScrollToSection('booking')}
              className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-pink-500/20 cursor-pointer"
              id="cta-reserve-btn"
            >
              Réserver
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2" id="navbar-mobile-actions">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-zinc-500 hover:text-pink-500 rounded-lg cursor-pointer"
              title="Admin"
              id="admin-access-mobile-btn"
            >
              <Shield size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-zinc-900 backdrop-blur-xl animate-fade-in" id="navbar-mobile-menu">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.target}
                  onClick={() => handleLinkClick(link.target)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 hover:text-pink-500 hover:bg-pink-500/5 rounded-xl transition-all text-left cursor-pointer"
                >
                  <IconComponent size={16} className="text-pink-500" />
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 border-t border-zinc-900">
              <button
                onClick={() => handleLinkClick('booking')}
                className="w-full flex items-center justify-center py-3 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-pink-500/25 cursor-pointer"
              >
                Réserver une Expérience
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
