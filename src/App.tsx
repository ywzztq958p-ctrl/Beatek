import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ActivitiesSection from './components/ActivitiesSection';
import BookingForm from './components/BookingForm';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';

import { EventItem, ReservationRequest, IntegrationSettings } from './types';
import { INITIAL_EVENTS } from './data';
import { Volume2, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Durable local storage states
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('beatek_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [bookings, setBookings] = useState<ReservationRequest[]>(() => {
    const saved = localStorage.getItem('beatek_bookings');
    if (saved) return JSON.parse(saved);
    
    // Default mock bookings to populate Admin view instantly
    return [
      {
        id: 'RES-892301',
        name: 'Mathilde Laurent',
        email: 'mathilde.l@example.com',
        phone: '06 82 12 34 56',
        eventType: 'privé',
        date: '2026-09-12',
        location: 'Château de la Tour, Lyon',
        guestsCount: 120,
        message: 'Nous organisons un anniversaire sur le thème cyberpunk. Nous aurions besoin d\'un système son de pointe et d\'une régie d\'effets lasers complets (laser rose néon et fumée lourde).',
        status: 'pending',
        createdAt: '01 juillet 2026 à 18:32'
      },
      {
        id: 'RES-410294',
        name: 'Lucas Bernard',
        email: 'l.bernard@festgroup.fr',
        phone: '07 11 98 76 54',
        eventType: 'festival',
        date: '2026-08-15',
        location: 'Esplanade du Lac',
        guestsCount: 1500,
        message: 'Demande urgente de collaboration technique pour la régie laser et lumière du festival de musique électronique NEON FUTURE FESTIVAL.',
        status: 'confirmed',
        createdAt: '28 juin 2026 à 14:15'
      }
    ];
  });

  const [settings, setSettings] = useState<IntegrationSettings>(() => {
    const saved = localStorage.getItem('beatek_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      let updated = { ...parsed };
      let changed = false;

      // Ensure the ClickUp URL is set if not already set or if it was the empty/default state or old URL
      if (!parsed.externalBookingUrl || parsed.externalBookingUrl === '' || parsed.externalBookingUrl.includes('baserow.io') || parsed.externalBookingUrl.includes('airtable.com/appfVDFhArJGiUMTM/pag1lWqnS4ClqVSiC/form') || parsed.externalBookingUrl === 'https://airtable.com/appfVDFhArJGiUMTM/shr9eMwobSZTH1MLW' || parsed.externalBookingUrl.includes('90141391230')) {
        updated.useExternalBooking = true;
        updated.externalBookingUrl = 'https://forms.clickup.com/90141391082/f/2kydgy7a-514/APLSAMAXDVAQ3R3HBC';
        changed = true;
      }

      // Ensure the Airtable Calendar URL is set as well
      if (!parsed.externalCalendarUrl || parsed.externalCalendarUrl !== 'https://airtable.com/appfVDFhArJGiUMTM/shraiDz0yNZAW4YFv') {
        updated.useExternalCalendar = true;
        updated.externalCalendarUrl = 'https://airtable.com/appfVDFhArJGiUMTM/shraiDz0yNZAW4YFv';
        changed = true;
      }

      if (changed) {
        localStorage.setItem('beatek_settings', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    }
    return {
      googleCalendarId: '',
      sheetsWebhookUrl: '',
      syncEnabled: false,
      useExternalBooking: true,
      externalBookingUrl: 'https://forms.clickup.com/90141391082/f/2kydgy7a-514/APLSAMAXDVAQ3R3HBC',
      useExternalCalendar: true,
      externalCalendarUrl: 'https://airtable.com/appfVDFhArJGiUMTM/shraiDz0yNZAW4YFv',
      emailNotificationsEnabled: true,
      adminNotificationEmail: 'contact@beatek-events.com'
    };
  });

  // Persist modifications to local storage
  useEffect(() => {
    localStorage.setItem('beatek_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('beatek_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('beatek_settings', JSON.stringify(settings));
  }, [settings]);

  // Smooth scroll to element helper
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // State update callbacks
  const handleUpdateEvents = (updated: EventItem[]) => {
    setEvents(updated);
  };

  const handleUpdateBookings = (updated: ReservationRequest[]) => {
    setBookings(updated);
  };

  const handleUpdateSettings = (updated: IntegrationSettings) => {
    setSettings(updated);
  };

  const handleNewBooking = (newBooking: ReservationRequest) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Top Navigation Bar */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        onScrollToSection={handleScrollToSection} 
      />

      {/* Hero Section */}
      <Hero onScrollToSection={handleScrollToSection} />

      {/* Activities Section */}
      <ActivitiesSection onScrollToSection={handleScrollToSection} />

      {/* Booking Form Section */}
      <BookingForm 
        settings={settings} 
        onSubmitBooking={handleNewBooking} 
      />

      {/* Contact Section */}
      <ContactSection />

      {/* GLOBAL FOOTER */}
      <footer className="relative bg-zinc-950 border-t border-zinc-900 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12" id="footer-bento-grid">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleScrollToSection('home')}>
              <Logo size="sm" className="scale-75 -ml-2" />
              <div>
                <span className="text-sm font-extrabold text-white tracking-widest uppercase block">BEA TEK</span>
                <span className="text-[10px] font-medium text-pink-500 tracking-widest uppercase block -mt-1">EVENTS</span>
              </div>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm mt-4">
              Créateur d'événements, d'expériences scéniques holographiques et sonores de classe mondiale. Nous fusionnons la musique, les lasers et le futurisme.
            </p>
          </div>

          {/* Col 2: Navigation map */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Navigation</h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <button onClick={() => handleScrollToSection('home')} className="hover:text-pink-500 transition-colors cursor-pointer">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection('activities')} className="hover:text-pink-500 transition-colors cursor-pointer">
                  Activités
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection('contact')} className="hover:text-pink-500 transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright banner */}
        <div className="max-w-7xl mx-auto border-t border-zinc-900/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© 2026 BEA TEK EVENTS. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Mentions légales</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">Politique de confidentialité</span>
          </div>
        </div>
      </footer>

      {/* MODAL: ADMIN CONTROL DASHBOARD */}
      {isAdminOpen && (
        <AdminPanel
          events={events}
          bookings={bookings}
          settings={settings}
          onUpdateEvents={handleUpdateEvents}
          onUpdateBookings={handleUpdateBookings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
