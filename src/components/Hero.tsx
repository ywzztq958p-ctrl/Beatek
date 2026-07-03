import React from 'react';
import { ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import Logo from './Logo';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Hero({ onScrollToSection }: HeroProps) {
  return (
    <section 
      id="home" 
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background with Dark & Neon Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
        {/* Neon Pink & Blue Atmospheric Glow Lights */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Interactive Laser Ray Effects */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30">
        <div 
          className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-pink-500 via-pink-400/50 to-transparent rotate-12 origin-top animate-pulse" 
          style={{ animationDuration: '3s', boxShadow: '0 0 15px #ff007f' }}
        />
        <div 
          className="absolute top-0 right-1/4 w-[2px] h-full bg-gradient-to-b from-blue-500 via-blue-400/50 to-transparent -rotate-12 origin-top animate-pulse" 
          style={{ animationDuration: '4s', boxShadow: '0 0 15px #00d2ff' }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20 flex flex-col items-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-pink-500/30 text-pink-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-bounce shadow-lg shadow-pink-500/5">
          <Sparkles size={12} className="animate-spin" style={{ animationDuration: '5s' }} />
          L'EXCELLENCE DE L'ÉVÉNEMENTIEL NOCTURNE
        </div>

        {/* Hero Slogan */}
        <h1 className="select-none flex flex-col items-center justify-center mb-6" id="hero-logo-heading">
          <Logo 
            size="xl" 
            transparent={true} 
            className="max-w-full drop-shadow-[0_0_35px_rgba(255,0,127,0.65)] filter hover:scale-105 transition-all duration-500 cursor-pointer" 
            style={{ 
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDuration: '4s'
            }} 
          />
        </h1>

        {/* Secondary Catchphrase */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-zinc-300 font-medium max-w-2xl leading-relaxed">
          Créateur d'expériences sonores immersives, de shows lasers éblouissants et de soirées légendaires. Nous façonnons le futur de vos nuits.
        </p>

        {/* Audio Vibe Indicator */}
        <div className="flex items-center gap-1.5 mt-6 px-4 py-2 rounded-xl bg-zinc-900/30 border border-zinc-800 text-xs text-zinc-500 font-mono">
          <Volume2 size={14} className="text-pink-500 animate-bounce" />
          <span>FÉDÉRATEURS DE BASSES ET D'ÉLECTRO</span>
        </div>

        {/* CTA Button Group */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button
            onClick={() => onScrollToSection('booking')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 cursor-pointer"
            id="hero-booking-cta"
          >
            Réserver maintenant
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => onScrollToSection('calendar')}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold text-sm uppercase tracking-wider rounded-2xl transition-all hover:-translate-y-0.5 cursor-pointer"
            id="hero-calendar-cta"
          >
            Voir le Calendrier
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => onScrollToSection('calendar')}>
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Explorer</span>
        <div className="w-5 h-8 border-2 border-zinc-800 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
