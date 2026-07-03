import React, { useState, useEffect } from 'react';
import { EventItem, ReservationRequest, IntegrationSettings } from '../types';
import { Plus, Edit2, Trash2, Calendar, FileText, Check, X, ShieldAlert, Key, Settings, Download, RefreshCw, Layers } from 'lucide-react';

interface AdminPanelProps {
  events: EventItem[];
  bookings: ReservationRequest[];
  settings: IntegrationSettings;
  onUpdateEvents: (updated: EventItem[]) => void;
  onUpdateBookings: (updated: ReservationRequest[]) => void;
  onUpdateSettings: (updated: IntegrationSettings) => void;
  onClose: () => void;
}

export default function AdminPanel({
  events,
  bookings,
  settings,
  onUpdateEvents,
  onUpdateBookings,
  onUpdateSettings,
  onClose
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'settings'>('bookings');
  
  // Event Form State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState<Omit<EventItem, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    type: 'soirée',
    image: '/src/assets/images/hero_stage_1783097192928.jpg',
    status: 'upcoming'
  });

  // Settings form State
  const [settingsForm, setSettingsForm] = useState<IntegrationSettings>({ ...settings });

  // Handle Admin login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'beatek2026' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Mot de passe incorrect. Astuce: utilisez "beatek2026"');
    }
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Type Événement', 'Date', 'Lieu', 'Invités', 'Message', 'Status', 'Date de création'];
    const rows = bookings.map(b => [
      b.id,
      b.name,
      b.email,
      b.phone,
      b.eventType,
      b.date,
      b.location,
      b.guestsCount,
      `"${b.message.replace(/"/g, '""')}"`,
      b.status,
      b.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `beatek_reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Booking action handlers
  const handleApproveBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'confirmed' as const } : b);
    onUpdateBookings(updated);
  };

  const handleRejectBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'rejected' as const } : b);
    onUpdateBookings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette demande de réservation ?')) {
      const updated = bookings.filter(b => b.id !== id);
      onUpdateBookings(updated);
    }
  };

  // Event form handler
  const handleOpenEventModal = (event?: EventItem) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        type: event.type,
        image: event.image,
        status: event.status,
        ticketUrl: event.ticketUrl,
        facebookUrl: event.facebookUrl
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        price: 'Gratuit',
        type: 'soirée',
        image: '/src/assets/images/hero_stage_1783097192928.jpg',
        status: 'upcoming'
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Edit
      const updated = events.map(evt => 
        evt.id === editingEvent.id ? { ...evt, ...eventForm } : evt
      );
      onUpdateEvents(updated);
    } else {
      // Create
      const newEvent: EventItem = {
        id: `evt-${Date.now()}`,
        ...eventForm
      };
      onUpdateEvents([newEvent, ...events]);
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      const updated = events.filter(evt => evt.id !== id);
      onUpdateEvents(updated);
    }
  };

  const handleClearAllBookings = () => {
    if (window.confirm('🚨 ATTENTION : Voulez-vous vraiment supprimer TOUTES les demandes de réservation ? Cette action effacera toute la liste locale définitivement.')) {
      if (window.confirm('Veuillez confirmer une seconde fois. Êtes-vous sûr à 100% ?')) {
        onUpdateBookings([]);
      }
    }
  };

  const handleClearAllEvents = () => {
    if (window.confirm('🚨 ATTENTION : Voulez-vous vraiment supprimer tous les événements du calendrier ? Votre programmation locale s\'affichera vide.')) {
      if (window.confirm('Veuillez confirmer une seconde fois. Êtes-vous sûr à 100% ?')) {
        onUpdateEvents([]);
      }
    }
  };

  // Sync settings form state when prop changes
  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Save integration settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    alert('Configurations enregistrées avec succès !');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-950 border border-pink-500/30 rounded-2xl p-8 shadow-2xl shadow-pink-500/10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-pink-500/10 text-pink-500 mb-4 animate-pulse">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Espace BEA TEK Admin</h2>
            <p className="text-zinc-400 text-sm mt-2">Connectez-vous pour gérer les événements et réservations</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Mot de passe de sécurité</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Key size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
                  placeholder="Saisissez le mot de passe..."
                  required
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-pink-500 text-xs mt-2 font-medium">{authError}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded-xl py-3 transition-all text-sm font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-3 transition-all text-sm font-semibold shadow-lg shadow-pink-500/20"
              >
                Accéder
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-xs text-zinc-600">
            <p>Code de secours par défaut : <span className="font-mono text-zinc-500">beatek2026</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/98 z-50 overflow-y-auto">
      {/* Admin Header */}
      <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 z-10 py-4 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <Settings size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">BEA TEK EVENTS</h1>
            <p className="text-xs text-zinc-500">Tableau de Bord Administrateur v1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition-all"
          >
            Quitter l'Admin
          </button>
        </div>
      </div>

      {/* Main Admin Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-12">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-900 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-3 font-sans font-medium text-sm border-b-2 transition-all ${
              activeTab === 'bookings'
                ? 'border-pink-500 text-pink-500 bg-pink-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FileText size={16} />
            Demandes de Réservation
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold">
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-3 font-sans font-medium text-sm border-b-2 transition-all ${
              activeTab === 'events'
                ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calendar size={16} />
            Gestion du Calendrier ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 font-sans font-medium text-sm border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Layers size={16} />
            Intégrations Externes (Sheets / Calendar)
          </button>
        </div>

        {/* Tab Content: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Réservations reçues</h2>
                <p className="text-xs text-zinc-500">Gérez les demandes d'événements privés, de soirées ou de festivals.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={bookings.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Download size={14} />
                  Exporter en CSV
                </button>
                <button
                  onClick={handleClearAllBookings}
                  disabled={bookings.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs font-semibold transition-all cursor-pointer font-mono"
                >
                  <Trash2 size={14} />
                  Tout Supprimer
                </button>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-zinc-950 border border-zinc-900 rounded-2xl">
                <FileText className="mx-auto text-zinc-700 mb-3" size={40} />
                <p className="text-zinc-500 text-sm">Aucune demande de réservation enregistrée pour le moment.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`bg-zinc-950 border rounded-2xl p-6 transition-all ${
                      booking.status === 'confirmed'
                        ? 'border-emerald-500/20 shadow-lg shadow-emerald-500/2'
                        : booking.status === 'rejected'
                        ? 'border-zinc-900 opacity-60'
                        : 'border-pink-500/20 shadow-lg shadow-pink-500/2'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: User Details */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white">{booking.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : booking.status === 'rejected'
                              ? 'bg-zinc-800 text-zinc-500'
                              : 'bg-pink-500/10 text-pink-500'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmé' : booking.status === 'rejected' ? 'Refusé' : 'En attente'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 text-[10px] font-mono">
                            {booking.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs">
                          <p className="text-zinc-400">
                            <span className="text-zinc-600 font-medium">Email :</span> {booking.email}
                          </p>
                          <p className="text-zinc-400">
                            <span className="text-zinc-600 font-medium">Téléphone :</span> {booking.phone}
                          </p>
                          <p className="text-zinc-400">
                            <span className="text-zinc-600 font-medium">Date souhaitée :</span> <span className="font-semibold text-white">{booking.date}</span>
                          </p>
                          <p className="text-zinc-400">
                            <span className="text-zinc-600 font-medium">Type :</span> <span className="capitalize text-pink-500 font-medium">{booking.eventType}</span>
                          </p>
                          <p className="text-zinc-400">
                            <span className="text-zinc-600 font-medium">Lieu :</span> {booking.location}
                          </p>
                          <p className="text-zinc-400">
                            <span className="text-zinc-600 font-medium">Invités :</span> <span className="text-white font-semibold">{booking.guestsCount}</span>
                          </p>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3 text-xs text-zinc-300">
                          <p className="italic">"{booking.message}"</p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex md:flex-col items-center justify-end gap-2 self-end md:self-start w-full md:w-auto border-t border-zinc-900 md:border-0 pt-3 md:pt-0">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveBooking(booking.id)}
                              className="flex-1 md:w-full flex items-center justify-center gap-1 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              <Check size={14} />
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking.id)}
                              className="flex-1 md:w-full flex items-center justify-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              <X size={14} />
                              Refuser
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-all ml-auto md:ml-0 cursor-pointer"
                          title="Supprimer la fiche"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Events */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Gestion du Calendrier</h2>
                <p className="text-xs text-zinc-500">Ajoutez ou modifiez les événements qui s'affichent sur le site.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAllEvents}
                  disabled={events.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs font-semibold transition-all cursor-pointer font-mono"
                >
                  <Trash2 size={14} />
                  Tout Supprimer
                </button>
                <button
                  onClick={() => handleOpenEventModal()}
                  className="flex items-center gap-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <Plus size={14} />
                  Nouvel Événement
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {events.map((event) => (
                <div key={event.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
                  {/* Event Thumbnail */}
                  <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Event Summary */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        event.status === 'active'
                          ? 'bg-amber-500/10 text-amber-500'
                          : event.status === 'upcoming'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {event.status === 'active' ? 'En Cours' : event.status === 'upcoming' ? 'À Venir' : 'Passé'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 capitalize font-medium">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{event.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{event.date} • {event.time} • {event.location}</p>
                  </div>

                  {/* Event Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEventModal(event)}
                      className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs transition-all cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-all cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Settings / Integrations */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-2xl bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8">
            <div>
              <h2 className="text-xl font-bold text-white">Intégrations de Données Externes</h2>
              <p className="text-xs text-zinc-500 mt-1">Configurez la synchronisation automatique gratuite pour BEA TEK EVENTS.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* SECTION 1: REDIRECTION VERS UN PORTAIL EXTERNE */}
              <div className="border border-zinc-900 rounded-2xl p-5 bg-zinc-900/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-pink-500 uppercase tracking-widest">1. Portail de Réservation Externe</h3>
                    <p className="text-[10px] text-zinc-500">Rediriger les clients vers un outil comme Calendly, Yurplan, Shotgun...</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.useExternalBooking || false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, useExternalBooking: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500 peer-checked:after:bg-white peer-checked:after:border-pink-500"></div>
                  </label>
                </div>

                {settingsForm.useExternalBooking && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">URL du site de Réservation Externe</label>
                    <input
                      type="url"
                      value={settingsForm.externalBookingUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, externalBookingUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
                      placeholder="https://calendly.com/... ou https://shotgun.live/..."
                    />
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      Une fois actif, tous les boutons "Réserver" du site redirigeront l'utilisateur vers ce lien partenaire au lieu d'ouvrir le formulaire local.
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 2: CALENDRIER EXTERNE INTÉGRÉ */}
              <div className="border border-zinc-900 rounded-2xl p-5 bg-zinc-900/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-blue-500 uppercase tracking-widest">2. Calendrier / Agenda Externe</h3>
                    <p className="text-[10px] text-zinc-500">Afficher un widget d'agenda interactif (ex: Google Calendar, Airtable, etc.)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.useExternalCalendar || false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, useExternalCalendar: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white peer-checked:after:border-blue-500"></div>
                  </label>
                </div>

                {settingsForm.useExternalCalendar && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Lien ou Code d'Intégration (Iframe / URL)</label>
                    <textarea
                      value={settingsForm.externalCalendarUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, externalCalendarUrl: e.target.value })}
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
                      placeholder="https://calendar.google.com/calendar/embed?... ou copiez le code <iframe ...></iframe>"
                    />
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      Notre système extrait automatiquement l'adresse web de l'iframe si vous collez le code d'intégration complet Google Calendar. Le calendrier sera consultable en live par vos visiteurs !
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 3: SYNC CLASSIQUE GOOGLE CALENDAR / SPREADSHEETS */}
              <div className="border border-zinc-900 rounded-2xl p-5 bg-zinc-900/10 space-y-4">
                <h3 className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">3. Synchro Tableur & Agenda Classique</h3>
                
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">ID d'agenda Google API</label>
                  <input
                    type="text"
                    value={settingsForm.googleCalendarId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleCalendarId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all font-mono"
                    placeholder="exemple: c_123456789@group.calendar.google.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">URL Webhook de Réservation (Google Sheets / Airtable)</label>
                  <input
                    type="url"
                    value={settingsForm.sheetsWebhookUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, sheetsWebhookUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all font-mono"
                    placeholder="https://script.google.com/macros/s/..."
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/40 border border-zinc-900 rounded-xl">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">Activer la Synchronisation Webhook</h4>
                    <p className="text-[9px] text-zinc-500">Transmettre les réservations locales au tableur.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.syncEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, syncEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white peer-checked:after:border-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* SECTION 4: NOTIFICATIONS PAR EMAIL AUTOMATIQUES */}
              <div className="border border-zinc-900 rounded-2xl p-5 bg-zinc-900/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-purple-500 uppercase tracking-widest">4. Réception des Réservations par E-mail</h3>
                    <p className="text-[10px] text-zinc-500">Recevoir automatiquement un email à chaque nouvelle demande.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.emailNotificationsEnabled || false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailNotificationsEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500 peer-checked:after:bg-white peer-checked:after:border-purple-500"></div>
                  </label>
                </div>

                {settingsForm.emailNotificationsEnabled && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Votre Adresse Email Destinataire</label>
                      <input
                        type="email"
                        required={settingsForm.emailNotificationsEnabled}
                        value={settingsForm.adminNotificationEmail || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminNotificationEmail: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all font-mono"
                        placeholder="exemple: contact@beatek-events.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Clé d'Accès Web3Forms Gratuite (Recommandée)</label>
                      <input
                        type="text"
                        value={settingsForm.web3formsAccessKey || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, web3formsAccessKey: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all font-mono"
                        placeholder="ex: e83b8b60-4b95-46f9-b883-9bf89a87d00f (facultatif)"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                        Pour l'envoi direct vers votre boîte mail sans configuration de serveur. Si vous la laissez vide, un jeton de test BEA TEK sera utilisé ! Pour obtenir votre clé gratuite en 3 secondes : visitez <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">web3forms.com</a> et saisissez votre adresse email.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit settings button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer"
                >
                  Enregistrer les configurations de synchronisation
                </button>
              </div>
            </form>

            <div className="border-t border-zinc-900 pt-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <RefreshCw size={12} />
                Comment connecter gratuitement Google Sheets ?
              </h4>
              <ol className="list-decimal list-inside text-[10px] text-zinc-500 space-y-1.5 leading-relaxed">
                <li>Créez un tableur Google Sheets avec vos colonnes (Nom, Email, Téléphone, etc.).</li>
                <li>Cliquez sur <span className="text-zinc-400 font-semibold">Extensions &gt; Apps Script</span> dans votre Google Sheet.</li>
                <li>Collez une fonction <span className="font-mono text-pink-400">doPost(e)</span> qui lit les paramètres JSON et les insère dans la feuille.</li>
                <li>Déployez en tant qu'application web et définissez l'accès sur <span className="text-zinc-400 font-semibold">"Tout le monde"</span>.</li>
                <li>Copiez l'URL de déploiement et collez-la dans la Section 3 comme URL de Webhook !</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* EVENT FORM MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-blue-500/30 rounded-2xl overflow-y-auto max-h-[90vh] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingEvent ? 'Modifier l\'Événement' : 'Créer un Événement'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Titre de l'événement</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Type d'expérience</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all capitalize"
                  >
                    <option value="soirée">Soirée Club</option>
                    <option value="festival">Festival</option>
                    <option value="privé">Événement Privé</option>
                    <option value="expérience">Expérience Musicale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs h-20 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Horaires</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="ex: 22:00 - 06:00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Prix ou accès</label>
                  <input
                    type="text"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="ex: 15€ / Gratuit"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Lieu de l'événement</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Statut d'affichage</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="upcoming">À venir (Calendrier)</option>
                    <option value="active">Activité en cours (Actif)</option>
                    <option value="past">Archive passée (Archives)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">URL de l'image de couverture</label>
                <select
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
                >
                  <option value="/src/assets/images/hero_stage_1783097192928.jpg">Image de Scène de Festival (Néon)</option>
                  <option value="/src/assets/images/dj_mix_1783097207580.jpg">Image Performance DJ (Decks)</option>
                  <option value="/src/assets/images/night_crowd_1783097221940.jpg">Image Ambiance Clubbing (Dancefloor)</option>
                  <option value="/src/assets/images/private_vip_1783097233547.jpg">Image VIP & Lounge Privé (Sleek)</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="flex-1 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 text-xs font-semibold transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
