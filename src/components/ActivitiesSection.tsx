import React from 'react';
import { Sparkles, Music, Users, Zap, Shield, Star } from 'lucide-react';

interface ActivitiesSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function ActivitiesSection({ onScrollToSection }: ActivitiesSectionProps) {
  const activities = [
    {
      id: 'act-1',
      title: 'Soirées Club & Raves',
      description: 'Soirées immersives en club et raves clandestines dans des lieux insolites. Nous nous chargeons de la sonorisation haute-fidélité, du light-show d\'exception et d\'un line-up de DJs pointus.',
      icon: Music,
      image: '/src/assets/images/night_crowd_1783097221940.jpg',
      color: 'from-pink-500 to-purple-500',
      glow: 'shadow-pink-500/10',
      tag: 'TECHNO & HOUSE',
      highlights: ['Light-show 100% sur-mesure', 'Système son L-Acoustics', 'Scénographie laser immersive']
    },
    {
      id: 'act-2',
      title: 'Festivals Électro',
      description: 'Production technique et artistique complète pour des festivals de musique électronique en intérieur et en plein air. De la conception 3D de la scène jusqu\'à la régie live.',
      icon: Zap,
      color: 'from-blue-500 to-indigo-500',
      glow: 'shadow-blue-500/10',
      tag: 'GRANDE ENVERGURE',
      highlights: ['Show de lasers de classe mondiale', 'Scénographie LED architecturale', 'Gestion des flux et logistique']
    },
    {
      id: 'act-3',
      title: 'Événements Privés VIP',
      description: 'Anniversaires privés, lancements de marques haut de gamme et soirées d\'entreprise. Nous transformons n\'importe quel espace en un lounge cyberpunk exclusif et ultra-VIP.',
      icon: Users,
      color: 'from-amber-500 to-red-500',
      glow: 'shadow-amber-500/10',
      tag: 'SUR MESURE CHIC',
      highlights: ['DJ sets haut de gamme', 'Bars à cocktails lumineux', 'Espace lounge modulaire']
    },
    {
      id: 'act-4',
      title: 'Expériences Musicales',
      description: 'Spectacles audiovisuels uniques, live synthétiseurs couplés à des projections holographiques et ateliers de sound design futuristes. Repoussez les limites de la musique.',
      icon: Sparkles,
      image: '/src/assets/images/dj_mix_1783097207580.jpg',
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/10',
      tag: 'AVANT-GARDE',
      highlights: ['Hologrammes 3D interactifs', 'Art génératif sonore', 'Performances live hybrides']
    }
  ];

  return (
    <section id="activities" className="relative py-28 bg-black border-b border-zinc-900" style={{ contentVisibility: 'auto' }}>
      {/* Glow Ambient behind activities */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-pink-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-3 flex items-center justify-center gap-1.5">
            <Star size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
            NOTRE EXPERTISE
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Nos Univers Événementiels
          </h3>
          <p className="text-zinc-500 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            BEA TEK EVENTS crée des concepts sur-mesure combinant programmation d'artistes d'exception et technologies scénographiques avancées.
          </p>
        </div>

        {/* List of Activities with alternating styles / high quality layout */}
        <div className="space-y-24" id="activities-cards-container">
          {activities.map((act, idx) => {
            const Icon = act.icon;
            const isEven = idx % 2 === 0;
            const hasImage = !!act.image;
            return (
              <div 
                key={act.id}
                className={hasImage ? `flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }` : 'flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 bg-zinc-950/30 p-8 sm:p-12 rounded-3xl border border-zinc-900/40 shadow-xl relative overflow-hidden group'}
              >
                {!hasImage && (
                  <div className={`absolute -inset-1.5 rounded-3xl bg-gradient-to-r ${act.color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-all duration-500`} />
                )}

                {/* Visual Image container with Laser Neon outline */}
                {hasImage && act.image && (
                  <div className="w-full lg:w-1/2 group relative animate-fade-in">
                    <div className={`absolute -inset-1.5 rounded-3xl bg-gradient-to-r ${act.color} opacity-20 blur-xl group-hover:opacity-45 transition-all duration-500`} />
                    <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
                      <img 
                        src={act.image} 
                        alt={act.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Shadow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    </div>
                  </div>
                )}

                {/* Text Content */}
                <div className={`w-full ${hasImage ? 'lg:w-1/2' : 'max-w-2xl'} space-y-6 relative z-10`}>
                  {/* Category Tag */}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${act.color}`}>
                    <Icon size={12} />
                    {act.tag}
                  </span>

                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                    {act.title}
                  </h3>

                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {act.description}
                  </p>

                  {/* Bullet features */}
                  <div className={`pt-2 ${hasImage ? 'space-y-2.5' : 'flex flex-wrap justify-center gap-x-6 gap-y-3'}`}>
                    {act.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${act.color}`} />
                        <span className="text-xs sm:text-sm text-zinc-300 font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA button inside activity */}
                  <div className="pt-6">
                    <button
                      onClick={() => onScrollToSection('booking')}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-800 hover:border-pink-500 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Nous solliciter
                      <span className="text-pink-500 font-extrabold">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
