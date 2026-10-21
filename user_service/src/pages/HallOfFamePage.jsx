import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Crown,
  GraduationCap,
  Building2,
  Globe2,
  BookOpen,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Code,
  Check,
  Share2,
  Medal,
  Mic,
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import SponsorBanner from '../components/SponsorBanner';

const LAUREATES = [
  {
    id: 1,
    name: 'Prof. Adeyemi Adeleke',
    title: 'Professor of Infectious Disease Genomics',
    highest_degree: 'Ph.D., FAS',
    category: 'PROFESSORIAL',
    tier: 'GLOBAL',
    award_title: 'Global African Scholar Person of the Year (Professorial)',
    year: '2026',
    university: 'University of Ibadan',
    country: 'Nigeria',
    citations: 28450,
    publications: 192,
    h_index: 48,
    q1_pubs: 42,
    prize: '$50,000 & 24k Gold Laureate Plaque',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    citation_text: 'For seminal pioneering research in genomic epidemiology and real-time surveillance of viral pathogens across Western and Central Africa, radically accelerating pandemic preparedness across the continent.',
    podcast_episode: 'Ep. 42: Genomic Frontiers & Pan-African Disease Defences'
  },
  {
    id: 2,
    name: 'Dr. Amina Mwangi',
    title: 'Senior Research Fellow in Agritech Genomics',
    highest_degree: 'Ph.D.',
    category: 'DOCTORAL',
    tier: 'GLOBAL',
    award_title: 'Global African Doctoral Person of the Year (Ph.D.)',
    year: '2026',
    university: 'University of Nairobi',
    country: 'Kenya',
    citations: 9240,
    publications: 48,
    h_index: 22,
    q1_pubs: 14,
    prize: '$15,000 & Plaque Award',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    citation_text: 'For breakthrough molecular breeding and CRISPR-assisted drought tolerance enhancements in staple sorghum crops, safeguarding food sovereignty for over 12 million smallholder farmers.',
    podcast_episode: 'Ep. 39: Climate-Resilient Crops & African Agricultural Self-Sufficiency'
  },
  {
    id: 3,
    name: 'Prof. Kwame Mensah',
    title: 'Professor of Renewable Materials & Nanotechnology',
    highest_degree: 'Ph.D., FGA',
    category: 'PROFESSORIAL',
    tier: 'CONTINENT',
    award_title: 'Continental African Scholar Person of the Year (Professorial)',
    year: '2026',
    university: 'Kwame Nkrumah University of Science and Technology',
    country: 'Ghana',
    citations: 18900,
    publications: 135,
    h_index: 39,
    q1_pubs: 28,
    prize: '$25,000 & Silver Laureate Plaque',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    citation_text: 'For groundbreaking synthesis of biodegradable nano-composites from agricultural biomass, providing affordable off-grid energy storage matrices tailored for equatorial microgrids.',
    podcast_episode: 'Ep. 36: Biomass Nanotech & Powering Rural Africa'
  },
  {
    id: 4,
    name: 'Dr. Thandiwe Khumalo',
    title: 'Senior Researcher in Climate Informatics & Hydrology',
    highest_degree: 'Ph.D.',
    category: 'DOCTORAL',
    tier: 'CONTINENT',
    award_title: 'Continental Doctoral Person of the Year (Ph.D.)',
    year: '2026',
    university: 'University of Cape Town',
    country: 'South Africa',
    citations: 6850,
    publications: 36,
    h_index: 18,
    q1_pubs: 9,
    prize: '$7,500 & Plaque Award',
    avatar: 'https://images.unsplash.com/photo-1580894732454-defbe5ff2886?auto=format&fit=crop&q=80&w=400',
    citation_text: 'For high-resolution hydrological modeling under extreme southern African climatic variations, underpinning modern municipal water resilience strategies.',
    podcast_episode: 'Ep. 31: Hydro-Informatics & Climate Volatility'
  },
  {
    id: 5,
    name: 'Prof. Fatima El-Sayed',
    title: 'Chair of Artificial Intelligence & Health Informatics',
    highest_degree: 'Ph.D.',
    category: 'PROFESSORIAL',
    tier: 'NATIONAL',
    award_title: 'National African Scholar of the Year (Egypt)',
    year: '2025',
    university: 'Cairo University',
    country: 'Egypt',
    citations: 21300,
    publications: 160,
    h_index: 41,
    q1_pubs: 34,
    prize: '$10,000 & Bronze Plaque',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    citation_text: 'For establishing scalable deep-learning diagnostic pipelines for rural oncology screenings across Northern and North-Eastern Africa.',
    podcast_episode: 'Ep. 28: Deep Learning Diagnostics in Resource-Constrained Clinics'
  },
  {
    id: 6,
    name: 'Dr. Ousmane Diop',
    title: 'Doctoral Fellow in Solar Photovoltaic Engineering',
    highest_degree: 'Ph.D.',
    category: 'DOCTORAL',
    tier: 'NATIONAL',
    award_title: 'National Doctoral Person of the Year (Senegal)',
    year: '2025',
    university: 'Cheikh Anta Diop University',
    country: 'Senegal',
    citations: 4120,
    publications: 29,
    h_index: 15,
    q1_pubs: 6,
    prize: '$2,500 & Plaque Award',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    citation_text: 'For developing anti-soiling perovskite coatings optimized for sub-Saharan Sahelian dust storms, boosting solar cell longevity by 40%.',
    podcast_episode: 'Ep. 24: Perovskite Solar Cells in Sahelian Climates'
  }
];

export default function HallOfFamePage({ setActiveTab }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' | 'PROFESSORIAL' | 'DOCTORAL'
  const [selectedTier, setSelectedTier] = useState('ALL'); // 'ALL' | 'GLOBAL' | 'CONTINENT' | 'NATIONAL'
  const [activeLaureateModal, setActiveLaureateModal] = useState(null);
  const [copiedBadgeId, setCopiedBadgeId] = useState(null);

  const filteredLaureates = LAUREATES.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedTier !== 'ALL' && item.tier !== selectedTier) return false;
    return true;
  });

  const handleCopyBadge = (id, name) => {
    const badgeHtml = `<a href="https://africanscholar.org/laureates/${id}" target="_blank" rel="noopener noreferrer"><img src="https://africanscholar.org/badges/laureate-verified.svg" alt="${name} - African Scholar Verified Laureate" width="220" height="54"/></a>`;
    navigator.clipboard.writeText(badgeHtml);
    setCopiedBadgeId(id);
    setTimeout(() => setCopiedBadgeId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
            <Crown className="w-4 h-4" />
            <span>Pan-African Laureate Honors</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Hall of Fame & Academic Laureates
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Celebrating Africa’s most distinguished Professorial Chairs and Doctoral (Ph.D.) pioneers. Each Laureate represents the highest independently audited scientific benchmarks, transformative citations, and continental leadership.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Professorial & Doctoral Categories</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Audited Q1/Q2 SCImago Criteria</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center space-x-2">
              <Mic className="w-4 h-4 text-coral-400" />
              <span>Official Laureate Podcasts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-soft-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Category:</span>
          {[
            { id: 'ALL', label: 'All Laureates', icon: Trophy },
            { id: 'PROFESSORIAL', label: 'Professorial Category ($10k - $50k)', icon: Award },
            { id: 'DOCTORAL', label: 'Doctoral Category ($2.5k - $15k)', icon: GraduationCap },
          ].map((c) => {
            const Icon = c.icon;
            const active = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-coral-400' : 'text-slate-500'}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tier Toggle */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-slate-400 font-bold mr-1">Tier:</span>
          {['ALL', 'GLOBAL', 'CONTINENT', 'NATIONAL'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${
                selectedTier === t
                  ? 'bg-coral-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Laureates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLaureates.map((laureate) => {
          const isCopied = copiedBadgeId === laureate.id;
          const isGlobal = laureate.tier === 'GLOBAL';
          const isProf = laureate.category === 'PROFESSORIAL';

          return (
            <div
              key={laureate.id}
              className={`rounded-3xl p-6 bg-white border transition-all duration-200 flex flex-col justify-between space-y-5 shadow-soft-xl hover:shadow-2xl ${
                isGlobal
                  ? 'border-amber-300 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-coral-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    isGlobal
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : laureate.tier === 'CONTINENT'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {laureate.tier} SCHOLAR • {laureate.year}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-400">
                    {isProf ? 'Professorial' : 'Doctoral (Ph.D.)'}
                  </span>
                </div>

                {/* Avatar and Name */}
                <div className="flex items-center space-x-4">
                  <img
                    src={laureate.avatar}
                    alt={laureate.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-900 shadow-md shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-base leading-snug truncate">
                      {laureate.name}
                    </h3>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{laureate.title}</p>
                    <p className="text-[11px] font-semibold text-slate-500 flex items-center mt-0.5">
                      <Building2 className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                      <span className="truncate">{laureate.university}, {laureate.country}</span>
                    </p>
                  </div>
                </div>

                {/* Prize & Plaque highlight */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-2.5">
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="text-xs">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">Conferred Award</span>
                    <span className="font-black text-slate-900">{laureate.prize}</span>
                  </div>
                </div>

                {/* Key Citations & Impact Index */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Citations</span>
                    <span className="font-black text-slate-900 text-xs">{laureate.citations.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Pubs</span>
                    <span className="font-black text-slate-900 text-xs">{laureate.publications}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50">
                    <span className="text-[9px] uppercase font-bold text-emerald-600 block">Q1 Pubs</span>
                    <span className="font-black text-emerald-900 text-xs">{laureate.q1_pubs}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-azure-50">
                    <span className="text-[9px] uppercase font-bold text-azure-600 block">H-Index</span>
                    <span className="font-black text-azure-900 text-xs">{laureate.h_index}</span>
                  </div>
                </div>

                {/* Citation Snippet */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  "{laureate.citation_text}"
                </p>

                {/* Podcast highlight */}
                <div className="flex items-center space-x-2 text-xs font-semibold text-coral-600">
                  <Mic className="w-3.5 h-3.5" />
                  <span className="truncate">{laureate.podcast_episode}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setActiveLaureateModal(laureate)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Award className="w-3.5 h-3.5 text-coral-400" />
                  <span>View Official Laureate Citation</span>
                </button>

                <button
                  onClick={() => handleCopyBadge(laureate.id, laureate.name)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
                    isCopied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Embed HTML Badge Copied!</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Embeddable Laureate Badge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sponsor Banner */}
      <SponsorBanner placement="FOOTER" />

      {/* Laureate Citation Modal */}
      {activeLaureateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={activeLaureateModal.avatar}
                  alt={activeLaureateModal.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Official African Scholar Citation
                  </span>
                  <h3 className="text-xl font-black text-white">{activeLaureateModal.name}</h3>
                  <p className="text-xs text-slate-300">{activeLaureateModal.university}, {activeLaureateModal.country}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLaureateModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800">Conferred Award Distinction</span>
                <h4 className="font-black text-slate-900 text-sm">{activeLaureateModal.award_title}</h4>
                <p className="text-xs text-amber-900 font-semibold">{activeLaureateModal.prize}</p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Laudatio & Citation</h5>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeLaureateModal.citation_text}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-coral-500/20 border border-coral-500/30 flex items-center justify-center text-coral-400">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-coral-400">Podcast Session</span>
                    <h5 className="text-xs font-bold text-white">{activeLaureateModal.podcast_episode}</h5>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Streaming audio interview for ${activeLaureateModal.name}...`)}
                  className="px-3.5 py-1.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs transition"
                >
                  Listen
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveLaureateModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Close Citation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
