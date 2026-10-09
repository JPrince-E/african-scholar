import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Users,
  Search,
  Sparkles,
  TrendingUp,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Building2,
  Star,
  Quote
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SponsorBanner from '../components/SponsorBanner';
import AfricanExcellenceMap from '../components/AfricanExcellenceMap';
import UniversityLeaderboard from '../components/UniversityLeaderboard';


const parseJsonArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseJsonObject = (val) => {
  if (!val) return {};
  if (typeof val === 'object' && val !== null) return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return {};
    }
  }
  return {};
};

export default function LandingPage({ setActiveTab, setSelectedAwardId }) {
  const { user, openAuth } = useAuth();
  const [topScholars, setTopScholars] = useState([]);
  const [awards, setAwards] = useState([]);
  const [stats, setStats] = useState({
    totalProfessors: 5,
    totalUniversities: 5,
    totalCitations: 80920,
    totalPublications: 517
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scholarsRes, awardsRes] = await Promise.all([
          api.get('/profiles/directory?limit=3&sortBy=citations_count'),
          api.get('/awards')
        ]);

        if (scholarsRes.data.success) {
          setTopScholars(scholarsRes.data.scholars);
        }
        if (awardsRes.data.success) {
          setAwards(awardsRes.data.awards);
        }
      } catch (err) {
        console.error('Error loading landing data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveTab('directory');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION (Bluespectrum Navy & Orange Aesthetic) */}
      <section className="relative overflow-hidden hero-bluespectrum-bg text-white pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Decorative subtle ambient glows */}
        <div className="absolute top-12 left-10 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy-600/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Top Eyebrow Tag Pill with Left Orange Bar Accent */}
              <div className="eyebrow-accent inline-flex w-fit mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4 text-coral-400" />
                <span>Celebrating African Academic Milestones & Excellence</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white font-display">
                Honouring <span className="text-coral-500">Pioneering Scholars</span> Across Africa
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                The premier registry tracking professors, citations, and high-impact research output. From national recognition to continental and global laureates.
              </p>

              {/* Action Buttons Pair (Bluespectrum Primary Orange & Translucent Navy Secondary) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    if (user) {
                      setActiveTab('register_scholar');
                    } else {
                      openAuth('register');
                    }
                  }}
                  className="px-7 py-3.5 rounded-xl btn-coral text-white font-bold text-sm shadow-md transition flex items-center space-x-2"
                >
                  <span>Register Professor Metrics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('awards')}
                  className="px-7 py-3.5 rounded-xl btn-azure text-white font-bold text-sm shadow-sm transition"
                >
                  View 2026 Award Criteria
                </button>
              </div>

              {/* Search Bar Widget */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0 mt-4"
              >
                <div className="flex items-center px-3 w-full text-slate-700">
                  <Search className="w-5 h-5 text-coral-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Professor, University, or Discipline..."
                    className="w-full py-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-450 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl btn-coral text-sm font-bold shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Small metric tags */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-300 pt-3">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" /> Peer Verified
                </span>
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" /> First Year Promo $0
                </span>
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" /> Q1/Q2 Index Benchmarks
                </span>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="rounded-3xl overflow-hidden border border-white/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl space-y-6">
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                      alt="African Scholars Excellence"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-full bg-coral-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm">
                        Continental Laureate
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">Celebrating African Professor of the Year</h4>
                      <p className="text-xs text-slate-200">Rewarding scientific breakthrough & youth mentorship</p>
                    </div>
                  </div>

                  {/* Stat widgets on card */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                      <span className="text-[11px] text-slate-300 block">Total Citations Recorded</span>
                      <span className="text-xl font-black text-amber-300 mt-0.5 block">80,000+</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Verified Scopus / Google Scholar</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                      <span className="text-[11px] text-slate-300 block">African Universities</span>
                      <span className="text-xl font-black text-white mt-0.5 block">100+ Schools</span>
                      <span className="text-[10px] text-azure-300 font-medium">Pan-African Spread</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1 - Top Left */}
                <div className="absolute -top-4 -left-6 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center space-x-3 text-slate-900 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                    <Award className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold block">Annual Laureates</span>
                    <span className="text-[11px] text-slate-500">$50K+ In Research Grants</span>
                  </div>
                </div>

                {/* Floating Badge 2 - Bottom Right */}
                <div className="absolute -bottom-6 -right-4 bg-slate-900 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white flex items-center space-x-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-azure-500/20 border border-azure-400/30 text-azure-400 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">100% Peer Reviewed</span>
                    <span className="text-[10px] text-emerald-400">Strict Q1/Q2 Index Criteria</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPONSOR BANNER SLOT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <SponsorBanner placement="HERO_BANNER" />
      </div>

      {/* 3. PLATFORM KPI COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-soft-xl border border-slate-200/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="text-center px-4">
              <div className="inline-flex p-3 rounded-2xl bg-azure-50 text-azure-600 mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">1,200+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Professors Mapped</div>
              <p className="text-xs text-slate-500 mt-1">Nigeria, Kenya, Ghana, S.A.</p>
            </div>

            <div className="text-center px-4 pt-6 lg:pt-0">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">85+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Universities Covered</div>
              <p className="text-xs text-slate-500 mt-1">Institutions of higher learning</p>
            </div>

            <div className="text-center px-4 pt-6 lg:pt-0">
              <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">12,500+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Indexed Publications</div>
              <p className="text-xs text-slate-500 mt-1">Q1 & Q2 Scientific Journals</p>
            </div>

            <div className="text-center px-4 pt-6 lg:pt-0">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">$50,000+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Annual Award Pool</div>
              <p className="text-xs text-slate-500 mt-1">Monetary, Plaques & Media</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED UNIVERSITIES STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Faculty Networked from Leading African Universities
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {[
            'University of Ibadan (Nigeria)',
            'University of Lagos (Nigeria)',
            'University of Nairobi (Kenya)',
            'University of Ghana (Ghana)',
            'University of Cape Town (South Africa)',
            'Ahmadu Bello University (Nigeria)',
            'Cairo University (Egypt)'
          ].map((uni, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs font-bold text-slate-700 hover:border-brand-300 hover:text-brand-600 transition cursor-default flex items-center space-x-2"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-500" />
              <span>{uni}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 2026 ACADEMIC AWARD TIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="eyebrow-accent-dark inline-flex w-fit mx-auto">
            <Award className="w-3.5 h-3.5 text-coral-500" />
            <span>2026 Honours Cycle & Criteria</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Excellence Awards
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Benchmarked against verified publication indices, international citation spread, and youth mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award) => {
            const isContinental = award.tier === 'CONTINENTAL';
            const isGlobal = award.tier === 'GLOBAL';

            return (
              <div
                key={award.id}
                className={`relative rounded-3xl p-8 bg-white border transition-all duration-300 flex flex-col justify-between ${
                  isContinental
                    ? 'border-coral-500 shadow-xl shadow-coral-500/10 ring-2 ring-coral-400/30'
                    : 'border-slate-200 shadow-soft-xl hover:shadow-xl'
                }`}
              >
                {isContinental && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-coral-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Flagship Continental
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        award.tier === 'NATIONAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : award.tier === 'CONTINENTAL'
                          ? 'bg-coral-100 text-coral-800'
                          : 'bg-azure-100 text-azure-800'
                      }`}
                    >
                      {award.tier} TIER
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {parseJsonObject(award.award_value).prize_amount || '$5,000'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{award.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{award.description}</p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <span className="font-bold text-slate-800 block">Award Inclusions:</span>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{parseJsonObject(award.award_value).plaque || 'Academic Laureate Plaque'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{parseJsonObject(award.award_value).podcast_interview || 'Exclusive Media Feature'}</span>
                    </div>
                  </div>

                  {/* Benchmark highlights */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Key Benchmark Index
                    </span>
                    {parseJsonArray(award.evaluation_index).slice(0, 4).map((rule, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-1.5 shrink-0"></div>
                        <span className="line-clamp-2">{rule.rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (setSelectedAwardId) setSelectedAwardId(award.id);
                      setActiveTab('apply_award');
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 ${
                      isContinental
                        ? 'btn-coral text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Submit Nomination</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5b. CONTINENTAL EXCELLENCE RADAR & UNIVERSITY LEADERBOARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <AfricanExcellenceMap />
        <UniversityLeaderboard />
      </section>

      {/* 6. FEATURED SCHOLARS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              Leading Researchers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Top Ranked African Faculty
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('directory')}
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>View All Faculty Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topScholars.map((scholar) => (
            <div
              key={scholar.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start space-x-4">
                  <img
                    src={(scholar.user?.avatar_url && !scholar.user?.avatar_url.includes('unsplash')) ? scholar.user.avatar_url : '/default-avatar.svg'}
                    alt={scholar.surname}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100 shadow-md bg-slate-900"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {scholar.title} ({scholar.highest_degree})
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1 truncate">
                      {scholar.first_name} {scholar.surname}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{scholar.university_name}</p>
                    <span className="text-[11px] text-slate-400 font-medium">{scholar.country}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                  {scholar.bio}
                </p>

                {/* Metric pills */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Citations</span>
                    <span className="text-sm font-black text-slate-900">{scholar.citations_count?.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Pubs</span>
                    <span className="text-sm font-black text-slate-900">{scholar.publications_count}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">h-index</span>
                    <span className="text-sm font-black text-brand-600">{scholar.google_h_index}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  onClick={() => setActiveTab('directory')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-bold transition"
                >
                  View Full Academic Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
