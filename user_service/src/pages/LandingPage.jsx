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
import AdvertisementShowcase from '../components/AdvertisementShowcase';

const LAUREATE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    title: "Celebrating African Scholar, Ph.D. & Professor of the Year",
    subtitle: "Rewarding scientific breakthrough & youth mentorship"
  },
  {
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    title: "Honouring Doctoral Researchers & Pioneering Faculty",
    subtitle: "Groundbreaking biomedical, energy & climate discovery"
  },
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
    title: "Continental Academic Keynotes & Symposia",
    subtitle: "Connecting scholars across all 54 African nations"
  },
  {
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80",
    title: "Nurturing the Next Generation of African Ph.D.s",
    subtitle: "Post-graduate supervision, publishing & international fellowships"
  }
];

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState({
    totalProfessors: 5,
    totalUniversities: 5,
    totalCitations: 80920,
    totalPublications: 517
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Periodically cycle through laureate images (every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % LAUREATE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
                The premier registry tracking professors, doctoral scholars (Ph.D. / Dr.), citations, and high-impact research output. From national recognition to continental and global laureates.
              </p>

              {/* Action Buttons Pair */}
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
                  <span>Register Scholar Metrics (Ph.D. & Prof.)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('awards')}
                  className="px-7 py-3.5 rounded-xl btn-azure text-white font-bold text-sm shadow-sm transition"
                >
                  View 2027 Award Criteria
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
                    placeholder="Search by Scholar (Ph.D. / Professor), University, or Discipline..."
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

            {/* Right Hero Visual with Periodically Changing Laureate Image (Requirement 14) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="rounded-3xl overflow-hidden border border-white/20 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl space-y-6">
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img
                      key={currentImageIndex}
                      src={LAUREATE_IMAGES[currentImageIndex].url}
                      alt={LAUREATE_IMAGES[currentImageIndex].title}
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-100 animate-fadeIn"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent"></div>
                    
                    {/* Slide Indicator Dots */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {LAUREATE_IMAGES.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentImageIndex(dotIdx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            dotIdx === currentImageIndex ? 'w-4 bg-coral-400' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-full bg-coral-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm">
                        Continental Laureate
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1 leading-snug">
                        {LAUREATE_IMAGES[currentImageIndex].title}
                      </h4>
                      <p className="text-xs text-slate-200 mt-0.5">
                        {LAUREATE_IMAGES[currentImageIndex].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Stat widgets on card (Requirements 2 & 3) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                      <span className="text-[11px] text-slate-300 block">Total Citations Recorded</span>
                      <span className="text-xl font-black text-amber-300 mt-0.5 block">1M +</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Verified Scopus / Google Scholar</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                      <span className="text-[11px] text-slate-300 block">African Universities</span>
                      <span className="text-xl font-black text-white mt-0.5 block">1300+</span>
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

      {/* 3. PLATFORM KPI COUNTERS - Distinct Rich Background Containers (Requirements 4, 5, 6, 17) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Container 1: Azure / Indigo Background */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100/90 border-2 border-blue-200/90 rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white mb-3 shadow-md shadow-blue-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">1.5 M +</div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-900 mt-1">Professors & Ph.D. Scholars Mapped</div>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-3 pt-3 border-t border-blue-200/60">Nigeria, Kenya, Ghana, S.A.</p>
          </div>

          {/* Container 2: Emerald / Mint Background */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-100/90 border-2 border-emerald-200/90 rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-emerald-600 text-white mb-3 shadow-md shadow-emerald-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">1000+</div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-900 mt-1">Universities Covered</div>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-3 pt-3 border-t border-emerald-200/60">Institutions of higher learning</p>
          </div>

          {/* Container 3: Amber / Warm Gold Background */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100/90 border-2 border-amber-200/90 rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-amber-600 text-white mb-3 shadow-md shadow-amber-500/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">12,500+</div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-900 mt-1">Indexed Publications</div>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-3 pt-3 border-t border-amber-200/60">Q1 & Q2 Scientific Journals</p>
          </div>

          {/* Container 4: Purple / Violet Background */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100/90 border-2 border-purple-200/90 rounded-3xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-purple-600 text-white mb-3 shadow-md shadow-purple-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">$50,000+</div>
              <div className="text-xs font-black uppercase tracking-wider text-purple-900 mt-1">Annual Award Pool</div>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-3 pt-3 border-t border-purple-200/60">Monetary, Plaques & Media</p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED UNIVERSITIES STRIP (Requirement 7: Big & Bold Heading) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Continental Academic Network</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Faculty Networked from Leading African Universities
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
            Active doctoral researchers (Ph.D.), deans, and professors collaborating across premier African tertiary institutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {[
            'University of Cape Town (South Africa)',
            'Cairo University (Egypt)',
            'University of Ibadan (Nigeria)',
            'University of the Witwatersrand (South Africa)',
            'Makerere University (Uganda)',
            'Kwame Nkrumah University of Science & Technology (Ghana)',
            'University of Nairobi (Kenya)',
            'Stellenbosch University (South Africa)'
          ].map((uni, idx) => (
            <div
              key={idx}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs sm:text-sm font-bold text-slate-800 hover:border-brand-400 hover:text-brand-600 hover:shadow-md transition cursor-default flex items-center space-x-2.5"
            >
              <Building2 className="w-4 h-4 text-brand-500" />
              <span>{uni}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 2027 ACADEMIC AWARD TIERS (Requirement 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="eyebrow-accent-dark inline-flex w-fit mx-auto">
            <Award className="w-3.5 h-3.5 text-coral-500" />
            <span>2027 Honours Cycle & Criteria</span>
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

      {/* 7. ADVERTISE WITH US / BUSINESS & SPONSOR SHOWCASE (Requirement 16) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdvertisementShowcase />
      </section>
    </div>
  );
}
