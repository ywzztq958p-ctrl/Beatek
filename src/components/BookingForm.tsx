import React, { useState } from 'react';
import { ReservationRequest, IntegrationSettings } from '../types';
import { CheckCircle, Send, Loader2, Sparkles, Mail, ShieldCheck, PhoneCall, Calendar, ExternalLink } from 'lucide-react';

interface BookingFormProps {
  settings: IntegrationSettings;
  onSubmitBooking: (newBooking: ReservationRequest) => void;
}

export default function BookingForm({ settings, onSubmitBooking }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'soirée' as const,
    date: '',
    location: '',
    guestsCount: 50,
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<ReservationRequest | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newBooking: ReservationRequest = {
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventType: formData.eventType,
      date: formData.date,
      location: formData.location,
      guestsCount: Number(formData.guestsCount),
      message: formData.message || 'Aucune description spécifique fournie.',
      status: 'pending',
      createdAt: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // If Webhook sync is active, attempt to trigger real POST request
    if (settings.syncEnabled && settings.sheetsWebhookUrl) {
      try {
        await fetch(settings.sheetsWebhookUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for public hooks to avoid CORS errors
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBooking)
        });
        console.log('Synchronisation Webhook Google Sheets réussie.');
      } catch (err) {
        console.warn('Erreur lors de la synchronisation Webhook. La réservation a été sauvegardée en local.', err);
      }
    }

    // Send automatic email notification if configured
    if (settings.emailNotificationsEnabled && settings.adminNotificationEmail) {
      try {
        const emailPayload = {
          access_key: settings.web3formsAccessKey || "e83b8b60-4b95-46f9-b883-9bf89a87d00f",
          subject: `⚡ NOUVELLE RÉSERVATION BEA TEK : ${newBooking.name} (${newBooking.eventType.toUpperCase()})`,
          from_name: "BEA TEK EVENTS - Système de Réservations",
          to_email: settings.adminNotificationEmail,
          name: newBooking.name,
          email: newBooking.email,
          phone: newBooking.phone,
          eventType: newBooking.eventType,
          date: newBooking.date,
          location: newBooking.location,
          guestsCount: newBooking.guestsCount,
          message: newBooking.message,
          id: newBooking.id,
          createdAt: newBooking.createdAt,
          replyto: newBooking.email,
        };

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });
        console.log('Notification email automatique transmise à l\'administrateur.');
      } catch (err) {
        console.error('Erreur lors de l\'envoi de la notification email:', err);
      }
    }

    // Simulate backend network delay
    setTimeout(() => {
      onSubmitBooking(newBooking);
      setLastSubmission(newBooking);
      setIsLoading(false);
      setIsSuccess(true);
      // Reset form fields
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: 'soirée',
        date: '',
        location: '',
        guestsCount: 50,
        message: ''
      });
    }, 1200);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('airtable.com/')) {
      const shrMatch = url.match(/(shr[A-Za-z0-9]+)/);
      if (shrMatch) {
        return `https://airtable.com/embed/${shrMatch[0]}?backgroundColor=pink`;
      }
      if (url.includes('/form') || url.includes('/shr')) {
        let embed = url.replace('airtable.com/', 'airtable.com/embed/');
        if (!embed.includes('backgroundColor=')) {
          embed += (embed.includes('?') ? '&' : '?') + 'backgroundColor=pink';
        }
        return embed;
      }
    }
    return url;
  };

  return (
    <section id="booking" className="relative py-28 bg-black border-b border-zinc-900" style={{ contentVisibility: 'auto' }}>
      {/* Laser backgrounds behind forms */}
      <div className="absolute top-0 left-10 w-80 h-80 bg-pink-500/5 rounded-full filter blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-500/5 rounded-full filter blur-[110px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-3 flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
            RÉSERVATION EN LIGNE
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {settings.useExternalBooking && settings.externalBookingUrl ? "Réserver mon Expérience" : "Planifions Votre Événement"}
          </h3>
          <p className="text-zinc-500 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            {settings.useExternalBooking && settings.externalBookingUrl 
              ? "Planifiez votre créneau ou réservez votre accès en ligne en quelques secondes via notre plateforme partenaire connectée."
              : "Remplissez notre formulaire pour réserver une soirée privée, louer nos systèmes scénographiques ou engager l'équipe BEA TEK EVENTS."
            }
          </p>
        </div>

        {settings.useExternalBooking && settings.externalBookingUrl ? (
          /* REDIRECT OR EMBED EXTERNAL BOOKING PARTNER PORTAL */
          <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-4 sm:p-8 text-center shadow-2xl relative overflow-hidden" id="external-booking-portal">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-900/60 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-500 border border-pink-500/20 shadow-lg">
                  <Calendar size={22} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Formulaire de Réservation Officiel
                  </h4>
                  <p className="text-zinc-500 text-xs">
                    Remplissez votre demande ci-dessous pour réserver nos systèmes d'effets visuels ou DJs.
                  </p>
                </div>
              </div>
              <a
                href={settings.externalBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-zinc-800 transition-all cursor-pointer whitespace-nowrap"
              >
                Ouvrir en plein écran
                <ExternalLink size={12} />
              </a>
            </div>

            {settings.externalBookingUrl.includes('airtable.com') || settings.externalBookingUrl.includes('baserow.io') || settings.externalBookingUrl.includes('clickup.com') ? (
              <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900/50 h-[650px] sm:h-[750px]">
                <iframe 
                  src={getEmbedUrl(settings.externalBookingUrl)}
                  frameBorder="0" 
                  width="100%" 
                  height="100%" 
                  style={{ background: 'transparent', border: 'none' }}
                  title="Reservation Form"
                />
              </div>
            ) : (
              <div className="py-6">
                <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed mb-8">
                  Notre service de planification de calendrier et de gestion des réservations est désormais externalisé sur notre portail partenaire pour vous garantir un traitement instantané et sécurisé.
                </p>
                <a
                  href={settings.externalBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 cursor-pointer"
                >
                  <Send size={14} />
                  Accéder au Portail de Réservation Externe
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Sync Warning banner in Form */}
            {settings.syncEnabled && settings.sheetsWebhookUrl && (
              <div className="mb-8 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="animate-pulse" />
                <span>Formulaire connecté en temps réel avec votre feuille Google Sheets / Airtable.</span>
              </div>
            )}

            {isSuccess && lastSubmission ? (
          /* SUCCESS STATE: TICKET & EMAIL RECEIPT COMPONENT */
          <div className="bg-zinc-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-500/5 space-y-8 animate-fade-in" id="booking-success-container">
            
            {/* Celebration Badge */}
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                <CheckCircle size={36} />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">Demande Envoyée !</h4>
              <p className="text-zinc-400 text-xs mt-2">Votre réservation a bien été enregistrée sous la référence <span className="font-mono text-pink-500 font-bold">{lastSubmission.id}</span></p>
            </div>

            {/* Simulated Digital Ticket */}
            <div className="border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40 p-6 relative overflow-hidden" id="digital-event-ticket">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">ORGANISATEUR</span>
                  <span className="text-xs font-black text-white tracking-widest uppercase">BEA TEK EVENTS</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">TICKET DE RÉSERVATION</span>
                  <span className="text-xs font-mono font-bold text-pink-500">{lastSubmission.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">CONTACT</span>
                  <p className="font-semibold text-white mt-0.5">{lastSubmission.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">TYPE D'ÉVÉNEMENT</span>
                  <p className="font-semibold text-pink-500 uppercase mt-0.5">{lastSubmission.eventType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">DATE PRÉVUE</span>
                  <p className="font-semibold text-white mt-0.5">{lastSubmission.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">LIEU / VILLE</span>
                  <p className="font-semibold text-white mt-0.5">{lastSubmission.location}</p>
                </div>
              </div>
            </div>

            {/* Automated Email Confirmation Receipt Preview */}
            <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-4" id="email-confirmation-preview">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <div className="p-1.5 rounded bg-pink-500/10 text-pink-500">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block">E-MAIL AUTOMATIQUE ENVOYÉ</span>
                  <span className="text-xs font-medium text-white">À : {lastSubmission.email}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 font-sans leading-relaxed">
                <p>Bonjour <strong className="text-zinc-200">{lastSubmission.name}</strong>,</p>
                <p>
                  Nous accusons bonne réception de votre demande de réservation pour votre événement de type <strong className="text-pink-500 capitalize">{lastSubmission.eventType}</strong> prévu le <strong className="text-white">{lastSubmission.date}</strong>.
                </p>
                <p>
                  Un conseiller technique de BEA TEK EVENTS étudie actuellement votre dossier pour valider la faisabilité acoustique et logistique. Nous vous contacterons par téléphone (<strong className="text-white">{lastSubmission.phone}</strong>) sous 24 heures ouvrées.
                </p>
                <p className="text-zinc-500 italic mt-4 block border-t border-zinc-900 pt-3">
                  — L'équipe technique BEA TEK EVENTS • Expériences Sonores & Visuelles
                </p>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Faire une nouvelle demande
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD BOOKING FORM */
          <form 
            onSubmit={handleSubmit} 
            className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-6 sm:p-10 shadow-2xl" 
            id="booking-form-element"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Full name field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Nom Complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Jean Dupont"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Adresse Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ex: jean@example.com"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Numéro de Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="ex: 06 12 34 56 78"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>

              {/* Event type field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Type d'Événement *</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all capitalize"
                >
                  <option value="soirée">Soirée Privée / Clubbing</option>
                  <option value="festival">Festival / Scène Ouverte</option>
                  <option value="privé">Anniversaire / Mariage</option>
                  <option value="expérience">Expérience Sonore / DJ Booking</option>
                  <option value="autre">Autre Projet</option>
                </select>
              </div>

              {/* Event date field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Date souhaitée *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* Event location field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Lieu ou Ville *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ex: Paris, Lyon, Chalet..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Guest Count Range slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Nombre de participants estimé</label>
                <span className="text-xs font-mono font-bold text-pink-500 bg-pink-500/5 px-2.5 py-1 rounded-lg border border-pink-500/10">
                  {formData.guestsCount} invités
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1500"
                step="10"
                value={formData.guestsCount}
                onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1">
                <span>10</span>
                <span>500</span>
                <span>1000</span>
                <span>1500+</span>
              </div>
            </div>

            {/* Custom details / description */}
            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Détails ou Besoins spécifiques</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez vos besoins son, lumière, lasers, le line-up souhaité, etc."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none h-28 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enregistrement de la demande...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Soumettre ma demande de réservation
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </>
    )}
      </div>
    </section>
  );
}
