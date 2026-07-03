import React, { useState, useEffect } from 'react';
import { EventItem, IntegrationSettings } from '../types';
import { Calendar, MapPin, Clock, Tag, Search, RefreshCw, Ticket, ExternalLink, Filter } from 'lucide-react';

interface CalendarSectionProps {
  events: EventItem[];
  settings: IntegrationSettings;
  onScrollToSection: (sectionId: string) => void;
}

// Helper to extract iframe src URL in case the user pastes the raw embed code instead of a simple link
const extractIframeSrc = (input: string): string => {
  if (!input) return '';
  if (input.includes('<iframe') && input.includes('src=')) {
    const match = input.match(/src="([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Handle Airtable URLs (e.g. share views or embed views)
  if (input.includes('airtable.com/')) {
    const shrMatch = input.match(/(shr[A-Za-z0-9]+)/);
    if (shrMatch) {
      return `https://airtable.com/embed/${shrMatch[0]}?backgroundColor=pink&viewControls=on`;
    }
    if (input.includes('/form') || input.includes('/shr')) {
      let embed = input.replace('airtable.com/', 'airtable.com/embed/');
      if (!embed.includes('backgroundColor=')) {
        embed += (embed.includes('?') ? '&' : '?') + 'backgroundColor=pink&viewControls=on';
      }
      return embed;
    }
  }

  return input;
};

export default function CalendarSection({ events, settings, onScrollToSection }: CalendarSectionProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Local state to toggle between external website calendar and local fiches
  const [showExternal, setShowExternal] = useState(false);

  useEffect(() => {
    // If external calendar is enabled and configured, default to displaying it
    if (settings.useExternalCalendar && settings.externalCalendarUrl) {
      setShowExternal(true);
    } else {
      setShowExternal(false);
    }
  }, [settings.useExternalCalendar, settings.externalCalendarUrl]);

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'soirée', label: 'Soirées' },
    { value: 'festival', label: 'Festivals' },
    { value: 'privé', label: 'Privés' },
    { value: 'expérience', label: 'Expériences' },
  ];

  // Filter events according to active tab, search query, and selected category
  const filteredEvents = events.filter((evt) => {
    const matchesTab = evt.status === activeTab;
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || evt.type === selectedCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const calendarSrc = extractIframeSrc(settings.externalCalendarUrl || '');

  return (
    <section id="calendar" className="relative py-28 bg-black border-b border-zinc-900" style={{ contentVisibility: 'auto' }}>
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-3 flex items-center justify-center gap-1.5">
            <Calendar size={14} className="animate-pulse" />
            PROGRAMMATION BEA TEK
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Calendrier des Expériences
          </h3>
          <p className="text-zinc-500 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Consultez nos festivals d'envergure, nos rave nights secrètes et revivez l'énergie de nos archives passées.
          </p>

          {/* Sync status indicator */}
          {settings.googleCalendarId && !settings.useExternalCalendar && (
            <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400 font-mono">
              <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '8s' }} />
              <span>Agenda synchronisé : {settings.googleCalendarId.substring(0, 24)}...</span>
            </div>
          )}
        </div>

        {/* Toggle between Local Calendar and External Calendar Embed */}
        {settings.useExternalCalendar && settings.externalCalendarUrl && (
          <div className="flex justify-center mb-12 animate-fade-in" id="calendar-mode-toggle">
            <div className="p-1 rounded-2xl bg-zinc-950 border border-zinc-900 inline-flex shadow-xl shadow-black/80">
              <button
                onClick={() => setShowExternal(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  showExternal
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 font-extrabold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <RefreshCw size={13} className={showExternal ? "animate-spin" : ""} style={showExternal ? { animationDuration: '8s' } : {}} />
                Calendrier Connecté (Live)
              </button>
              <button
                onClick={() => setShowExternal(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  !showExternal
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 font-extrabold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Calendar size={13} />
                Programme Local
              </button>
            </div>
          </div>
        )}

        {showExternal && calendarSrc ? (
          /* EMBEDDED EXTERNAL CALENDAR IFRAME */
          <div className="animate-fade-in space-y-6" id="external-calendar-iframe-view">
            <div className="relative w-full h-[650px] rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950/80 shadow-2xl shadow-pink-500/5">
              <div className="absolute inset-0 border-2 border-transparent hover:border-pink-500/20 rounded-3xl pointer-events-none transition-all duration-300 z-10" />
              <iframe
                src={calendarSrc}
                className="w-full h-full border-0 rounded-3xl"
                title="Calendrier Externe Connecté"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <div className="text-center text-xs text-zinc-600 font-mono flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Données synchronisées en temps réel depuis votre site de gestion de calendrier</span>
            </div>
          </div>
        ) : (
          /* STANDARD LOCAL CALENDAR CONTENT */
          <div className="animate-fade-in">
            {/* Filters and Search Bar */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Category Chips */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto" id="category-filter-chips">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une soirée, un lieu..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-pink-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all focus:ring-1 focus:ring-pink-500/30"
                />
              </div>
            </div>

            {/* Tab Selection Row */}
            <div className="flex justify-center border-b border-zinc-900 mb-12">
              <div className="flex gap-4 sm:gap-8 -mb-px">
                <button
                  onClick={() => { setActiveTab('upcoming'); setSearchQuery(''); }}
                  className={`px-4 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                    activeTab === 'upcoming'
                      ? 'border-pink-500 text-pink-500 font-extrabold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Événements à Venir
                </button>
                <button
                  onClick={() => { setActiveTab('active'); setSearchQuery(''); }}
                  className={`px-4 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                    activeTab === 'active'
                      ? 'border-blue-500 text-blue-500 font-extrabold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Activités en Cours
                </button>
                <button
                  onClick={() => { setActiveTab('past'); setSearchQuery(''); }}
                  className={`px-4 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                    activeTab === 'past'
                      ? 'border-zinc-700 text-zinc-400 font-extrabold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Archives des Soirées
                </button>
              </div>
            </div>

            {/* Events Grid Display */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-zinc-950/40 border border-zinc-900 rounded-3xl" id="no-events-fallback">
                <Calendar className="mx-auto text-zinc-800 mb-4 animate-bounce" size={48} />
                <h4 className="text-base font-bold text-zinc-400">Aucun événement trouvé</h4>
                <p className="text-zinc-600 text-xs mt-2 max-w-xs mx-auto">
                  Ajustez vos filtres de recherche ou changez d'onglet pour découvrir notre programmation.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="events-display-grid">
                {filteredEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="group relative bg-zinc-950/80 border border-zinc-900 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/5 flex flex-col h-full"
                  >
                    {/* Event Header Accent */}
                    <div className="relative h-16 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-900/40 flex items-center px-5">
                      {/* Category Badge overlay */}
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-wider font-extrabold text-pink-500">
                        {event.type}
                      </span>
                      
                      {/* Sync marker */}
                      {settings.googleCalendarId && (
                        <span className="absolute top-4 right-5 p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[9px] font-bold flex items-center gap-1 shadow-lg">
                          <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
                          G-CAL
                        </span>
                      )}
                    </div>

                    {/* Event Details Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Date & Time Row */}
                      <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-pink-500" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-blue-500" />
                          {event.time}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-base font-bold text-white group-hover:text-pink-500 transition-colors line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed line-clamp-3 flex-grow">
                        {event.description}
                      </p>

                      {/* Divider */}
                      <div className="h-px bg-zinc-900 my-5" />

                      {/* Footer Row */}
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Tarif Accès</span>
                          <span className="text-xs font-mono font-bold text-white">{event.price}</span>
                        </div>

                        <div className="flex gap-2">
                          {event.status === 'past' ? (
                            <button 
                              onClick={() => onScrollToSection('gallery')}
                              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-semibold text-zinc-300 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <ExternalLink size={12} />
                              Voir Photos
                            </button>
                          ) : (
                            <>
                              {(event.ticketUrl || settings.useExternalBooking) && (
                                <button 
                                  onClick={() => onScrollToSection('booking')}
                                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-pink-500/10 cursor-pointer flex items-center gap-1"
                                >
                                  <Ticket size={12} />
                                  Réserver
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
