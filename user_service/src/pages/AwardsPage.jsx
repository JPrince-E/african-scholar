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

export default function AwardsPage({ setActiveTab, setSelectedAwardId }) {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndexId, setExpandedIndexId] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get('/awards');
        if (res.data.success) {
          setAwards(res.data.awards);
        }
      } catch (err) {
        console.error('Failed to load awards:', err);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-coral-700 bg-coral-50 border border-coral-200 px-3.5 py-1.5 rounded-full">
          <Award className="w-4 h-4 text-coral-600" />
          <span>African Scholar 2027 Honors & Laureate Series</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pan-African Academic Awards
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Rewarding academic integrity, high citation density, international peer esteem, and impactful doctoral mentorship across Africa.
        </p>
      </div>

      {/* Award Tiers Comparison */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading award tiers and evaluation indices...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {awards.map((award) => {
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
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Physical Award Plaque</span>
                        <span className="text-xs text-slate-500">{award.award_value?.plaque}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-azure-100 text-azure-800 shrink-0">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Podcast / Media Session</span>
                        <span className="text-xs text-slate-500">{award.award_value?.podcast_interview}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Icon Item</span>
                        <span className="text-xs text-slate-500">{award.award_value?.icon_items}</span>
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
                          className="p-5 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-azure-50/40 hover:to-azure-100/60 border-2 border-slate-200/90 hover:border-azure-400/80 shadow-md hover:shadow-xl transition-all duration-300 flex items-start space-x-4 group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] uppercase font-black tracking-wider text-azure-700 bg-azure-50 px-2 py-0.5 rounded-md border border-azure-200">
                                Milestone #{idx + 1}
                              </span>
                              <span className="font-black text-slate-900 text-sm group-hover:text-azure-700 transition">
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
    </div>
  );
}
