import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Calendar,
  DollarSign,
  Mic,
  Shield,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';

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

export const PROFESSORIAL_AWARDS = [
  {
    id: 1,
    category: 'PROFESSORIAL',
    tier: 'NATIONAL',
    title: 'National Professorial Scholar of the Year (Nigeria)',
    country: 'Nigeria',
    description: 'Recognizing outstanding academic output, high impact research, and national leadership across Nigerian universities.',
    award_value: {
      prize_amount: '$5,000',
      plaque: 'National Academic Laureate Plaque',
      icon_items: 'Gold Medal Pin of Excellence',
      podcast_interview: 'Exclusive Feature on The African Scholar Podcast'
    },
    evaluation_index: [
      { rule: 'Attended at least 3 conferences within Nigeria in the last 3 years (including evaluation year)', benchmark: '>= 3 Conferences', key: 'conferences_last_3_years' },
      { rule: 'Cited by researchers across different regions (West, East, South, North Nigeria)', benchmark: 'All 4 Regional Citations', key: 'national_citation_spread' },
      { rule: 'At least 25 total publications by evaluation year', benchmark: '>= 25 Publications', key: 'min_publications' },
      { rule: 'At least 1 publication in Q1 journal OR at least 3 in Q2 in evaluation year', benchmark: '>= 1 Q1 or >= 3 Q2', key: 'q1_q2_journals' },
      { rule: 'At least 2,500 citations by evaluation year', benchmark: '>= 2,500 Citations', key: 'min_citations' },
      { rule: 'At least h-index of 15 by evaluation year', benchmark: '>= 15 h-index', key: 'min_h_index' },
      { rule: 'Supervised at least 5 MSc and 3 PhD graduates', benchmark: '>= 5 MSc & 3 PhD', key: 'graduates_supervised' },
      { rule: 'At least 1 local/national research collaboration within the last 5 years', benchmark: '>= 1 Collaboration', key: 'national_collaboration' },
      { rule: 'At least 1 research grant within the last 5 years', benchmark: '>= 1 Grant', key: 'research_grants' }
    ],
    year: 2027
  },
  {
    id: 2,
    category: 'PROFESSORIAL',
    tier: 'CONTINENTAL',
    title: 'Continental Professorial Scholar of the Year (Africa)',
    country: null,
    description: 'The highest continental academic honour, celebrating pioneering research that addresses African development and cross-border innovation.',
    award_value: {
      prize_amount: '$15,000',
      plaque: 'Pan-African Scholar Trophy',
      icon_items: 'African Scholar Commemorative Insignia',
      podcast_interview: 'Continental Broadcast & Documentary Feature'
    },
    evaluation_index: [
      { rule: 'Attended at least 2 conferences on the African continent in the last 3 years', benchmark: '>= 2 Continental Conferences', key: 'continental_conferences' },
      { rule: 'Cited by researchers from diverse African regions (West, East, South, North)', benchmark: 'Pan-African Regional Spread', key: 'continental_citations' },
      { rule: 'At least 50 total publications by evaluation year', benchmark: '>= 50 Publications', key: 'min_publications' },
      { rule: 'At least 2 publications in Q1 journal OR at least 5 in Q2 in evaluation year', benchmark: '>= 2 Q1 or >= 5 Q2', key: 'q1_q2_journals' },
      { rule: 'At least 5,000 citations by evaluation year', benchmark: '>= 5,000 Citations', key: 'min_citations' },
      { rule: 'At least h-index of 25 by evaluation year', benchmark: '>= 25 h-index', key: 'min_h_index' },
      { rule: 'Supervised at least 10 MSc and 5 PhD graduates', benchmark: '>= 10 MSc & 5 PhD', key: 'graduates_supervised' },
      { rule: 'At least 1 research grant (national/continental/international) in last 3 years', benchmark: '>= 1 Grant (3 yrs)', key: 'research_grants' },
      { rule: 'At least 1 continental or international collaboration in last 3 years', benchmark: '>= 1 Continental Collab', key: 'continental_collaboration' }
    ],
    year: 2027
  },
  {
    id: 3,
    category: 'PROFESSORIAL',
    tier: 'GLOBAL',
    title: 'Global Professorial Scholar of the Year',
    country: null,
    description: 'Honouring an African scholar whose breakthrough contributions have gained definitive international acclaim and worldwide adoption.',
    award_value: {
      prize_amount: '$30,000',
      plaque: 'Global Academic Laureate Plaque & Sash',
      icon_items: 'Custom Diamond Lapel & Medal of Honour',
      podcast_interview: 'Global Keynote Address & International Media Circuit'
    },
    evaluation_index: [
      { rule: 'Attended conferences on at least 2 continents in the last 3 years', benchmark: '>= 2 Continents', key: 'global_conferences' },
      { rule: 'Cited by researchers from all continents (Africa, Europe, Asia, Americas, Oceania)', benchmark: 'Worldwide Citations', key: 'global_citations' },
      { rule: 'At least 75 total publications by evaluation year', benchmark: '>= 75 Publications', key: 'min_publications' },
      { rule: 'At least 3 publications in Q1 journal OR at least 10 in Q2 in evaluation year', benchmark: '>= 3 Q1 or >= 10 Q2', key: 'q1_q2_journals' },
      { rule: 'At least 2 publications in journals with Impact Factor (IF) > 10 in evaluation year', benchmark: '>= 2 IF > 10', key: 'high_impact_publications' },
      { rule: 'At least 50,000 citations by evaluation year', benchmark: '>= 50,000 Citations', key: 'min_citations' },
      { rule: 'At least h-index of 50 by evaluation year', benchmark: '>= 50 h-index', key: 'min_h_index' },
      { rule: 'Supervised at least 10 MSc and 10 PhD graduates', benchmark: '>= 10 MSc & 10 PhD', key: 'graduates_supervised' },
      { rule: 'At least 1 international collaboration in last 3 years', benchmark: '>= 1 Global Collab', key: 'international_collaboration' },
      { rule: 'At least 2 research grants (national/continental/international) in last 3 years', benchmark: '>= 2 Major Grants', key: 'research_grants' }
    ],
    year: 2027
  }
];

export const DOCTORAL_AWARDS = [
  {
    id: 4,
    category: 'DOCTORAL',
    tier: 'NATIONAL',
    title: 'National Doctoral Scholar of the Year (Nigeria)',
    country: 'Nigeria',
    description: 'Recognizing emerging doctoral scholars and PhD researchers demonstrating outstanding citation velocity and national peer impact.',
    award_value: {
      prize_amount: '$2,500',
      plaque: 'Plaque award',
      icon_items: 'Icon item/s',
      podcast_interview: 'Interview/Podcast session with doctoral person of the year'
    },
    evaluation_index: [
      { rule: 'Attended at least one (1) conference within the country WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Conference within country (last 3 yrs)', key: 'conferences_last_3_years' },
      { rule: 'At least 25 publications BY the year of the evaluation', benchmark: '>= 25 Publications', key: 'min_publications' },
      { rule: 'At least one (1) publication in Q1 journal or at least three (3) publications in Q2 IN the year of the evaluation', benchmark: '>= 1 Q1 or >= 3 Q2 (eval year)', key: 'q1_q2_journals' },
      { rule: 'At least 2000 citations BY the year of the evaluation', benchmark: '>= 2,000 Citations', key: 'min_citations' },
      { rule: 'At least h-index 12 BY the year of the evaluation', benchmark: '>= 12 h-index', key: 'min_h_index' },
      { rule: 'At least 3 MSc (graduating PhD/s is an added advantage) BY the year of the evaluation', benchmark: '>= 3 MSc (PhD added advantage)', key: 'graduates_supervised' },
      { rule: 'At least one (1) collaboration (locally/national) WITHIN the last five years (with the year of evaluation included)', benchmark: '>= 1 Collaboration locally/national (last 5 yrs)', key: 'national_collaboration' }
    ],
    year: 2027
  },
  {
    id: 5,
    category: 'DOCTORAL',
    tier: 'CONTINENTAL',
    title: 'Continental Doctoral Scholar of the Year (Africa)',
    country: null,
    description: 'Celebrating high-caliber African doctoral researchers and PhD fellows whose cross-regional investigations address key African challenges.',
    award_value: {
      prize_amount: '$7,500',
      plaque: 'Plaque award',
      icon_items: 'Icon item/s',
      podcast_interview: 'Interview/Podcast session with doctoral person of the year'
    },
    evaluation_index: [
      { rule: 'Attended one (1) conference on the continent (Africa) WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Conference in Africa (last 3 yrs)', key: 'continental_conferences' },
      { rule: 'Cited by researchers from different regions of Africa: west, east, south, north BY the year of the evaluation', benchmark: 'Cited by West, East, South & North Africa', key: 'continental_citations' },
      { rule: 'At least 40 publications BY the year of the evaluation', benchmark: '>= 40 Publications', key: 'min_publications' },
      { rule: 'At least one (1) publication in Q1 journal or at least three (3) publications in Q2 IN the year of the evaluation', benchmark: '>= 1 Q1 or >= 3 Q2 (eval year)', key: 'q1_q2_journals' },
      { rule: 'At least 3500 citations BY the year of the evaluation', benchmark: '>= 3,500 Citations', key: 'min_citations' },
      { rule: 'At least h-index 20 BY the year of the evaluation', benchmark: '>= 20 h-index', key: 'min_h_index' },
      { rule: 'At least 5 MSc & 2 PhD BY the year of the evaluation', benchmark: '>= 5 MSc & 2 PhD', key: 'graduates_supervised' },
      { rule: 'At least one (1) research grant (national/continental/international) WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Research Grant (last 3 yrs)', key: 'research_grants' }
    ],
    year: 2027
  },
  {
    id: 6,
    category: 'DOCTORAL',
    tier: 'GLOBAL',
    title: 'Global Doctoral Scholar of the Year',
    country: null,
    description: 'Honouring an extraordinary African doctoral scholar whose PhD discoveries and international collaborations achieve world-class recognition.',
    award_value: {
      prize_amount: '$15,000',
      plaque: 'Plaque award',
      icon_items: 'Icon item/s',
      podcast_interview: 'Interview/Podcast session with doctoral person of the year'
    },
    evaluation_index: [
      { rule: 'Attended conference on at least one (1) continent (Africa, Europe, Asia, South America, North America, Oceania) WITHIN the last three years (with the year of evaluation included)', benchmark: 'Conference on >= 1 Continent (last 3 yrs)', key: 'global_conferences' },
      { rule: 'Cited by researchers from all the continents: Africa, Europe, Asia, South America, North America, Oceania BY the year of the evaluation', benchmark: 'Cited Across All Continents', key: 'global_citations' },
      { rule: 'At least 60 publications BY the year of the evaluation', benchmark: '>= 60 Publications', key: 'min_publications' },
      { rule: 'At least two (2) publications in Q1 journal or at least seven (7) publications in Q2 IN the year of the evaluation', benchmark: '>= 2 Q1 or >= 7 Q2 (eval year)', key: 'q1_q2_journals' },
      { rule: 'At least one (1) publications in journal’s of impact factor (IF) >10 IN the year of the evaluation', benchmark: '>= 1 Publication in IF > 10 Journal', key: 'high_impact_publications' },
      { rule: 'At least 10000 citations BY the year of the evaluation', benchmark: '>= 10,000 Citations', key: 'min_citations' },
      { rule: 'At least h-index 35 BY the year of the evaluation', benchmark: '>= 35 h-index', key: 'min_h_index' },
      { rule: 'At least 7 MSc & 5 PhD BY the year of the evaluation', benchmark: '>= 7 MSc & 5 PhD Supervised', key: 'graduates_supervised' },
      { rule: 'At least one (1) international collaboration WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 International Collaboration (last 3 yrs)', key: 'international_collaboration' },
      { rule: 'At least one (1) research grant (national/continental/international) WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Research Grant (last 3 yrs)', key: 'research_grants' }
    ],
    year: 2027
  }
];

export default function AwardsPage({ setActiveTab, setSelectedAwardId }) {
  const [awards, setAwards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('PROFESSORIAL'); // 'PROFESSORIAL' or 'DOCTORAL'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get('/awards');
        if (res.data.success && res.data.awards && res.data.awards.length > 0) {
          setAwards(res.data.awards);
        } else {
          setAwards([...PROFESSORIAL_AWARDS, ...DOCTORAL_AWARDS]);
        }
      } catch (err) {
        console.error('Failed to load awards, using default benchmark dataset:', err);
        setAwards([...PROFESSORIAL_AWARDS, ...DOCTORAL_AWARDS]);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  const handleApplyClick = (awardId) => {
    if (setSelectedAwardId) setSelectedAwardId(awardId);
    setActiveTab('apply_award');
  };

  // Filter awards by currently selected category
  const activeAwards = awards.filter((a) => (a.category || 'PROFESSORIAL') === selectedCategory);
  const displayedAwards = activeAwards.length > 0 ? activeAwards : (selectedCategory === 'PROFESSORIAL' ? PROFESSORIAL_AWARDS : DOCTORAL_AWARDS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-4xl lg:max-w-5xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-coral-900 bg-coral-100 border-2 border-coral-300 px-4 py-2 rounded-full shadow-xs">
          <Award className="w-4 h-4 text-coral-600" />
          <span>African Scholar 2027 Honors & Laureate Series</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pan-African Academic Awards
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
          Rewarding academic integrity, high citation density, international peer esteem, and impactful doctoral mentorship across Africa.
        </p>

        {/* Category Switcher Pill (Professorial vs Doctoral) */}
        <div className="pt-2 flex justify-center">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 flex items-center gap-1.5 shadow-inner">
            <button
              onClick={() => setSelectedCategory('PROFESSORIAL')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center space-x-2 ${
                selectedCategory === 'PROFESSORIAL'
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'PROFESSORIAL' ? 'bg-coral-500 ring-2 ring-coral-300' : 'bg-slate-400'}`}></span>
              <span>Professorial Category (Professors)</span>
            </button>
            <button
              onClick={() => setSelectedCategory('DOCTORAL')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center space-x-2 ${
                selectedCategory === 'DOCTORAL'
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'DOCTORAL' ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-slate-400'}`}></span>
              <span>Doctoral Category (PhDs / Dr.)</span>
            </button>
          </div>
        </div>

        {/* Selected Category Highlights Notice */}
        <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900">
            {selectedCategory === 'PROFESSORIAL' ? 'Professorial Honors Pool' : 'Doctoral (PhD) Honors Pool'}:
          </span>
          <span>
            {selectedCategory === 'PROFESSORIAL'
              ? 'National: $5,000 • Continental: $15,000 • Global: $30,000'
              : 'National: $2,500 • African: $7,500 • Global: $15,000'}
          </span>
        </div>
      </div>

      {/* Award Tiers Comparison */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading award tiers and evaluation indices...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {displayedAwards.map((award) => {
            const isContinental = award.tier === 'CONTINENTAL';
            const isGlobal = award.tier === 'GLOBAL';

            return (
              <div
                key={award.id}
                className={`bg-white rounded-3xl border overflow-hidden transition-all duration-300 shadow-soft-xl ${
                  isContinental
                    ? 'border-coral-500 ring-2 ring-coral-400/30'
                    : isGlobal
                    ? 'border-azure-400 shadow-azure-500/10'
                    : 'border-slate-200'
                }`}
              >
                {/* Award Banner Header */}
                <div
                  className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hero-solid-bg bg-dot-pattern text-white"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          award.tier === 'NATIONAL'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : award.tier === 'CONTINENTAL'
                            ? 'bg-coral-500/20 text-coral-300 border border-coral-500/30'
                            : 'bg-azure-500/20 text-azure-300 border border-azure-500/30'
                        }`}
                      >
                        {award.tier} LAUREATE TIER
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Evaluation Cycle: {award.year}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black">{award.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{award.description}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center shrink-0 w-full md:w-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">Monetary Honorarium</span>
                    <span className="text-3xl font-black text-amber-300 mt-1 block">
                      {award.award_value?.prize_amount || '$5,000'}
                    </span>
                    <button
                      onClick={() => handleApplyClick(award.id)}
                      className="mt-3 w-full py-2.5 px-6 rounded-xl btn-coral font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <span>Apply For Nomination</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Award Inclusions & Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 shadow-xs">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block tracking-tight">Physical Award Plaque</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">{award.award_value?.plaque}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 shadow-xs">
                      <div className="p-2 rounded-xl bg-azure-100 text-azure-800 shrink-0">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block tracking-tight">Podcast / Media Session</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">{award.award_value?.podcast_interview}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 shadow-xs">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block tracking-tight">Icon Item</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">{award.award_value?.icon_items}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Evaluation Index Checklist (Requirement 13: Catchy & Prominent Redesign) */}
                  <div className="space-y-4 pt-4">
                    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-slate-800">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-coral-500/20 border border-coral-500/40 text-coral-400 flex items-center justify-center font-black shrink-0">
                          <Layers className="w-6 h-6 text-coral-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Continental Benchmark Matrix
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Peer-Reviewed Verification</span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                            Official Evaluation Index & Benchmark Rules
                          </h4>
                        </div>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-amber-300 font-extrabold shrink-0 text-center shadow-xs">
                        ★ {parseJsonArray(award.evaluation_index).length} Mandatory Verification Milestones
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parseJsonArray(award.evaluation_index).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-white hover:bg-slate-50/80 border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-start space-x-4 group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] uppercase font-black tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                Milestone #{idx + 1}
                              </span>
                              <span className="font-black text-slate-900 text-sm group-hover:text-coral-600 transition">
                                {item.benchmark}
                              </span>
                            </div>
                            <p className="text-slate-700 text-xs sm:text-sm mt-1.5 leading-relaxed font-medium">
                              {item.rule}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* General Award Conditions & Participant Notice Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Governance & Award Terms</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              General Award Conditions
            </h2>
            <p className="text-sm text-slate-600">
              Essential conditions, eligibility categories, and participant rights for the African Scholar Honours series.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('terms', 'awards')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>View Full Legal Terms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Condition Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Award types/categories */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">1</span>
              <span>Award Types & Categories</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              There are two (2) categories of the awards: The Professorial category and the Doctoral (PhD) category.
            </p>
            <div className="flex gap-2 pt-1">
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
                • Professorial Category
              </span>
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
                • Doctoral (PhD) Category
              </span>
            </div>
          </div>

          {/* 2. Awards arrangements */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-azure-700">
              <span className="w-6 h-6 rounded-lg bg-azure-100 text-azure-800 flex items-center justify-center font-black">2</span>
              <span>Awards Arrangements</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Award organiser and sponsor may make reasonable adjustments to the award schedule, speakers, venue, award benefits or program structure where necessary in line with available funds. Participants will be informed of significant changes where practicable.
            </p>
          </div>

          {/* 3. Registration benefits (70% / 30%) */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">3</span>
              <span>Registration Benefits & Research Allocation</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Registration benefits are intended for the registered participant (only registered individual can compete for the awards). It should be used in accordance with the applicable awards terms. Misuse may result in applicable cancellation and refund policy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-emerald-300 shadow-xs flex items-center space-x-4">
                <div className="text-3xl font-black text-emerald-600">70%</div>
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase block">Direct to Beneficiary</span>
                  <p className="text-xs text-slate-600 mt-0.5">Disbursed directly to the honored awardee.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-azure-300 shadow-xs flex items-center space-x-4">
                <div className="text-3xl font-black text-azure-600">30%</div>
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase block">For Research Activities</span>
                  <p className="text-xs text-slate-600 mt-0.5">Earmarked to support scholarly research and investigations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Acceptance of terms */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-black">4</span>
              <span>Acceptance of Terms</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              By completing the registration process, participants acknowledge that they have read, understood, and agreed to the applicable terms and conditions.
            </p>
          </div>
        </div>

        {/* Notice to awardees and participants */}
        <div className="rounded-2xl border-2 border-azure-200 bg-azure-50/70 p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-azure-600 flex items-center justify-center text-white shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-azure-700">
                Participation Contingency Directive
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Notice to Awardees and Participants
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-medium">
            <p>
              In the event of natural disasters, travel restrictions, or other unforeseen circumstances that may affect awardee’s/participants’ ability to attend the conference in person, virtual participation options may be provided, where feasible. Information on accessing the virtual platform, if applicable, will be communicated approximately two months before the conference.
            </p>
            <p>
              The award platform will be updated regularly with information regarding any changes to the event format, applicable safety measures, and other important announcements. Awardees or participants are encouraged to check the platform periodically for the latest information and updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
