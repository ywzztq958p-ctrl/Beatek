import { EventItem } from './types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'NEON FUTURE FESTIVAL 2026',
    description: 'Le festival électro-futuriste phare de l\'été. Une immersion totale avec un show laser de classe mondiale, des basses surpuissantes et une scénographie cyberpunk inédite. Avec notre line-up de DJs internationaux résidents BEA TEK.',
    date: '2026-08-15',
    time: '18:00 - 05:00',
    location: 'Esplanade du Lac, Ville-en-Sélect',
    price: '35€ - 55€',
    type: 'festival',
    image: '/src/assets/images/hero_stage_1783097192928.jpg',
    status: 'upcoming',
    ticketUrl: '#',
    facebookUrl: '#'
  },
  {
    id: 'evt-2',
    title: 'CYBERPUNK WAREHOUSE EXPERIENCE',
    description: 'Une plongée souterraine dans un entrepôt industriel transformé en temple de la techno minimale. Des installations LED suspendues et des néons bleu électrique vous guideront jusqu\'au lever du jour.',
    date: '2026-07-25',
    time: '23:00 - 06:00',
    location: 'Hangar 14, Zone Industrielle',
    price: '15€',
    type: 'soirée',
    image: '/src/assets/images/night_crowd_1783097221940.jpg',
    status: 'upcoming',
    ticketUrl: '#',
    facebookUrl: '#'
  },
  {
    id: 'evt-3',
    title: 'ELECTRO RAVE WEEKEND',
    description: 'L\'événement de cette semaine ! Une rave urbaine gratuite en plein air avec DJ set en direct, food trucks rétro-futuristes et un dôme de projections 360°. Retrait des invitations obligatoires en ligne.',
    date: '2026-07-04',
    time: '16:00 - 02:00',
    location: 'Parc des Expositions, Hall B',
    price: 'Gratuit',
    type: 'soirée',
    image: '/src/assets/images/dj_mix_1783097207580.jpg',
    status: 'active',
    ticketUrl: '#',
    facebookUrl: '#'
  },
  {
    id: 'evt-4',
    title: 'BEA TEK SHOWCASE #14',
    description: 'Notre soirée de clubbing intime de rentrée. Une communion intime autour du son House et Deep Melodic, orchestrée par BEA TEK EVENTS avec des performances lives immersives.',
    date: '2026-06-20',
    time: '23:00 - 05:00',
    location: 'The Club Neon, Paris',
    price: '12€',
    type: 'soirée',
    image: '/src/assets/images/dj_mix_1783097207580.jpg',
    status: 'past'
  },
  {
    id: 'evt-5',
    title: 'TECHNO VIP CHALET - PRIVATE SESSION',
    description: 'Une session privée ultra-sélectionnée en plein cœur de la nature savoyarde. Chalet d\'exception, systèmes audio L-Acoustics de pointe et lounge bar chic illuminé sous les néons.',
    date: '2026-05-12',
    time: '20:00 - 04:00',
    location: 'Alpes Secrètes, Chamonix',
    price: 'Sur Invitation',
    type: 'privé',
    image: '/src/assets/images/private_vip_1783097233547.jpg',
    status: 'past'
  },
  {
    id: 'evt-6',
    title: 'LASER ARENA NEW YEAR RAVE',
    description: 'La soirée mythique du réveillon de l\'an dernier. 1500 ravers réunis sous une forêt de lasers roses et violets, célébrant la transition vers le futur de BEA TEK.',
    date: '2025-12-31',
    time: '22:00 - 08:00',
    location: 'Dome Arena, Métropole',
    price: '40€',
    type: 'festival',
    image: '/src/assets/images/hero_stage_1783097192928.jpg',
    status: 'past'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g-1',
    title: 'Show Laser Époustouflant',
    category: 'lasers',
    image: '/src/assets/images/hero_stage_1783097192928.jpg'
  },
  {
    id: 'g-2',
    title: 'DJ résident en action',
    category: 'dj',
    image: '/src/assets/images/dj_mix_1783097207580.jpg'
  },
  {
    id: 'g-3',
    title: 'Ambiance Dancefloor',
    category: 'crowd',
    image: '/src/assets/images/night_crowd_1783097221940.jpg'
  },
  {
    id: 'g-4',
    title: 'VIP Lounge Expérience',
    category: 'ambiance',
    image: '/src/assets/images/private_vip_1783097233547.jpg'
  },
  {
    id: 'g-5',
    title: 'Régie DJ & Lights',
    category: 'dj',
    image: '/src/assets/images/dj_mix_1783097207580.jpg'
  },
  {
    id: 'g-6',
    title: 'Arène de lasers néons',
    category: 'lasers',
    image: '/src/assets/images/hero_stage_1783097192928.jpg'
  }
];
