import React from 'react';
import { Mail, MapPin, Instagram, Facebook, Disc } from 'lucide-react';

export default function ContactSection() {
  const socialLinks = [
    { label: 'Instagram', url: 'https://www.instagram.com/beatek_events/', icon: Instagram, color: 'hover:text-pink-500' },
    { label: 'Facebook', url: '#', icon: Facebook, color: 'hover:text-blue-500' },
    { label: 'SoundCloud', url: '#', icon: Disc, color: 'hover:text-amber-500 animate-spin' },
  ];

  return (
    <section id="contact" className="relative py-28 bg-black border-b border-zinc-900" style={{ contentVisibility: 'auto' }}>
      {/* Background neon elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-3 flex items-center justify-center gap-1.5">
            <Mail size={14} className="animate-pulse" />
            CONTACT & SOCIALS
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Entrons En Contact
          </h3>
          <p className="text-zinc-500 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Une question générale, un projet d'événement, ou une demande de booking ? Nos équipes vous répondent en moins de 24h.
          </p>
        </div>

        <div className="bg-zinc-950/30 p-8 sm:p-12 rounded-3xl border border-zinc-900/40 shadow-xl relative overflow-hidden group max-w-2xl mx-auto text-center space-y-8" id="contact-content-grid">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 opacity-[0.02] blur-2xl group-hover:opacity-[0.06] transition-all duration-500" />
          
          <div className="space-y-4 relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">BEA TEK HQ</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Notre agence technique et artistique se situe à Warwick. Passez nous voir pour écouter nos démos et tester notre parc de matériel de scène.
            </p>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 max-w-xl mx-auto text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-900">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-500 uppercase block">Adresse Email</span>
                <a href="mailto:beatek_events@hotmail.com" className="text-xs sm:text-sm font-mono font-bold text-white hover:text-blue-500 transition-colors break-all">
                  beatek_events@hotmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-900">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Siège technique</span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  Warwick
                </span>
              </div>
            </div>
          </div>

          {/* Social Icons links */}
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">SUIVEZ BEA TEK EVENTS</span>
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    className={`p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 ${social.color} hover:bg-zinc-900 transition-all shadow-lg`}
                    title={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
