import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function BannerCarousel({ placement, className = '' }) {
  const [sponsors, setSponsors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSponsors = async () => {
      try {
        // If placement provided, query by placement, else fetch all active sponsors
        const url = placement ? `/sponsors?placement=${placement}` : '/sponsors';
        const res = await api.get(url);
        if (res.data.success && isMounted) {
          const list = res.data.sponsors || [];
          setSponsors(list);
        }
      } catch (err) {
        console.error('Failed to load banner sponsors for carousel:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSponsors();
    return () => { isMounted = false; };
  }, [placement]);

  // Auto-advance timer (5.5s)
  useEffect(() => {
    if (sponsors.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sponsors.length, isPaused, currentIndex]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % sponsors.length);
  };

  if (loading || sponsors.length === 0) {
    return null;
  }

  const currentSponsor = sponsors[currentIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-950 text-white shadow-2xl transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Banner Image with Masking */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentSponsor.id || currentIndex}
          src={currentSponsor.banner_image_url}
          alt={currentSponsor.sponsor_name}
          className="w-full h-full object-cover object-center opacity-30 mix-blend-screen scale-105 transition-all duration-700 ease-out"
        />
        {/* Multilayered high-contrast overlays */}
        <div className="absolute inset-0 bg-slate-950/80 bg-dot-pattern" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 min-h-[200px]">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1.5 text-amber-400 animate-pulse" />
              Official Sponsor & Partner
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300 border border-white/15 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
              Verified Initiative
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {currentIndex + 1} of {sponsors.length}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {currentSponsor.sponsor_name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 line-clamp-2 max-w-xl">
              Supporting academic excellence, pan-African research dissemination, and scientific discovery across universities in Africa.
            </p>
          </div>
        </div>

        {/* Action Button & Carousel Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto">
          {currentSponsor.redirect_url && (
            <a
              href={currentSponsor.redirect_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl btn-coral text-white font-bold text-xs sm:text-sm shadow-lg shadow-coral-500/20 transition-all hover:scale-102"
            >
              <span>Explore Partner Initiative</span>
              <ExternalLink className="w-4 h-4 text-white" />
            </a>
          )}

          {/* Navigation Arrows for multi-item carousel */}
          {sponsors.length > 1 && (
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Sponsor Banner"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Sponsor Banner"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition hover:scale-105"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots / Bars */}
      {sponsors.length > 1 && (
        <div className="relative z-10 px-6 sm:px-8 pb-4 pt-0 flex items-center space-x-2">
          {sponsors.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to sponsor ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-coral-500'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
