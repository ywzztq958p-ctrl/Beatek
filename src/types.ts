export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  type: 'soirée' | 'festival' | 'privé' | 'expérience';
  image: string;
  status: 'upcoming' | 'active' | 'past';
  facebookUrl?: string;
  ticketUrl?: string;
}

export interface ReservationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: 'soirée' | 'festival' | 'privé' | 'expérience' | 'autre';
  date: string;
  location: string;
  guestsCount: number;
  message: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface IntegrationSettings {
  googleCalendarId: string;
  sheetsWebhookUrl: string;
  syncEnabled: boolean;
  externalBookingUrl?: string; // URL du site externe pour les réservations (ex: Calendly, Yurplan)
  useExternalBooking?: boolean; // Activer le redirection vers le site externe de réservation
  externalCalendarUrl?: string; // URL d'un calendrier externe (ex: iframe Google Calendar ou widget)
  useExternalCalendar?: boolean; // Activer l'affichage du calendrier externe
  emailNotificationsEnabled?: boolean; // Activer la réception des réservations par email
  adminNotificationEmail?: string; // Adresse email de l'administrateur pour recevoir les demandes
  web3formsAccessKey?: string; // Clé d'accès gratuite Web3Forms pour l'envoi fiable d'emails
}
