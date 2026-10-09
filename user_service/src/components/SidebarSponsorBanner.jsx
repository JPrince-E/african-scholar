import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Megaphone, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function SidebarSponsorBanner({ placement = 'SIDEBAR' }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchSponsors = async () => {
      try {
        // Query specifically for SIDEBAR placement sponsors
        const res = await api.get(`/sponsors?placement=${placement}`);
        if (res.data.success && isMounted) {
          const list = res.data.sponsors || [];
          // If no specific SIDEBAR sponsors found, fallback to all active
          if (list.length > 0) {
            setSponsors(list);
          } else {
            const allRes = await api.get('/sponsors');
            if (allRes.data.success && isMounted) {
              setSponsors(allRes.data.sponsors || []);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load sidebar sponsor:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSponsors();
    return () => { isMounted = false; };
  }, [placement]);

  // Auto-rotate if multiple sidebar banners exist
  useEffect(() => {
    if (sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sponsors.length]);

  if (loading || sponsors.length === 0) {
    return null;
  }

  const sponsor = sponsors[currentIndex];

  return (
    <div className="hero-solid-bg bg-dot-pattern text-white rounded-3xl p-5 border border-slate-800 shadow-xl overflow-hidden relative space-y-4">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      {/* Header Pill */}
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
          <Sparkles className="w-3 h-3 mr-1 text-amber-400 animate-pulse" />
          Sidebar Sponsor
        </span>
        <span className="text-[10px] text-slate-400 flex items-center">
          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
          Verified Partner
        </span>
      </div>

      {/* Banner Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800/80 shadow-md">
        <img
          src={sponsor.banner_image_url}
          alt={sponsor.sponsor_name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-base text-white tracking-tight leading-snug">
          {sponsor.sponsor_name}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Empowering African academic researchers, STEM scholars, and university labs through competitive grants and sponsorships.
        </p>
      </div>

      {/* Action CTA */}
      {sponsor.redirect_url && (
        <a
          href={sponsor.redirect_url}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl btn-coral text-white font-bold text-xs shadow-md shadow-coral-500/20 transition-all hover:scale-102"
        >
          <span>Explore Opportunity</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      {/* Slide dots if multiple */}
      {sponsors.length > 1 && (
        <div className="flex justify-center space-x-1.5 pt-1">
          {sponsors.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-coral-500' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
