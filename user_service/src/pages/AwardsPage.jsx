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
          <span>African Scholar 2026 Honors & Laureate Series</span>
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

                  {/* Comprehensive Evaluation Index Checklist */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-azure-600" />
                        <span>Official Evaluation Index & Benchmark Rules</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {award.evaluation_index?.length || 0} Strict Verification Milestones
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {parseJsonArray(award.evaluation_index).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 hover:bg-azure-50/50 border border-slate-200/80 transition flex items-start space-x-3 text-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-900 block">{item.benchmark}</span>
                            <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{item.rule}</p>
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
