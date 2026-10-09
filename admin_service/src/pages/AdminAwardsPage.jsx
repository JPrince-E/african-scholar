import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Layers,
  Eye,
  EyeOff,
  Sparkles,
  DollarSign,
  Globe,
  Building2,
  X,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    tier: 'NATIONAL',
    country: 'Nigeria',
    year: 2026,
    description: '',
    is_active: true,
    prize_amount: '$5,000',
    plaque: 'Gold-Plated Pan-African Laureate Plaque',
    podcast_interview: 'Exclusive 30-minute Scholar Spotlight Interview',
    icon_items: 'Official Laureate Lapel Pin & Academic Crest',
    evaluation_index: [
      { benchmark: 'Google H-Index >= 15', rule: 'Must be verified via live ORCID or Google Scholar link.' }
    ]
  });

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/awards/admin/all');
      if (res.data.success) {
        setAwards(res.data.awards || []);
      }
    } catch (err) {
      console.error('Error loading awards:', err);
      setError('Failed to fetch awards from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingAward(null);
    setFormData({
      title: '',
      tier: 'NATIONAL',
      country: 'Nigeria',
      year: 2026,
      description: '',
      is_active: true,
      prize_amount: '$5,000',
      plaque: 'Gold-Plated Pan-African Laureate Plaque',
      podcast_interview: 'Exclusive 30-minute Scholar Spotlight Interview',
      icon_items: 'Official Laureate Lapel Pin & Academic Crest',
      evaluation_index: [
        { benchmark: 'Google H-Index >= 15', rule: 'Must be verified via live ORCID or Google Scholar link.' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (award) => {
    setEditingAward(award);
    const awardValue = award.award_value || {};
    const evalIndex = Array.isArray(award.evaluation_index) ? award.evaluation_index : [];

    setFormData({
      title: award.title || '',
      tier: award.tier || 'NATIONAL',
      country: award.country || '',
      year: award.year || 2026,
      description: award.description || '',
      is_active: award.is_active !== undefined ? award.is_active : true,
      prize_amount: awardValue.prize_amount || '$5,000',
      plaque: awardValue.plaque || 'Gold-Plated Plaque',
      podcast_interview: awardValue.podcast_interview || 'Scholar Interview',
      icon_items: awardValue.icon_items || 'Official Crest',
      evaluation_index: evalIndex.length > 0 ? evalIndex : [
        { benchmark: 'Citation Count Threshold', rule: 'Minimum 500 total verified citations.' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleAddBenchmark = () => {
    setFormData(prev => ({
      ...prev,
      evaluation_index: [
        ...prev.evaluation_index,
        { benchmark: '', rule: '' }
      ]
    }));
  };

  const handleRemoveBenchmark = (index) => {
    setFormData(prev => ({
      ...prev,
      evaluation_index: prev.evaluation_index.filter((_, i) => i !== index)
    }));
  };

  const handleBenchmarkChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.evaluation_index];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, evaluation_index: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Please provide an award category title.');
      return;
    }

    const payload = {
      title: formData.title,
      tier: formData.tier,
      country: formData.tier === 'NATIONAL' ? formData.country : null,
      year: parseInt(formData.year) || 2026,
      description: formData.description,
      is_active: formData.is_active,
      award_value: {
        prize_amount: formData.prize_amount,
        plaque: formData.plaque,
        podcast_interview: formData.podcast_interview,
        icon_items: formData.icon_items
      },
      evaluation_index: formData.evaluation_index.filter(item => item.benchmark.trim() !== '')
    };

    try {
      if (editingAward) {
        const res = await api.put(`/awards/admin/${editingAward.id}`, payload);
        if (res.data.success) {
          setSuccessMsg('Award category updated successfully!');
          setIsModalOpen(false);
          fetchAwards();
        }
      } else {
        const res = await api.post('/awards/admin/create', payload);
        if (res.data.success) {
          setSuccessMsg('New award category created successfully!');
          setIsModalOpen(false);
          fetchAwards();
        }
      }
    } catch (err) {
      console.error('Failed saving award:', err);
      setError(err.response?.data?.message || 'Error saving award category.');
    }
  };

  const handleToggleStatus = async (award) => {
    try {
      const res = await api.put(`/awards/admin/${award.id}`, {
        is_active: !award.is_active
      });
      if (res.data.success) {
        setAwards(prev => prev.map(a => a.id === award.id ? { ...a, is_active: !award.is_active } : a));
        setSuccessMsg(`Award category ${!award.is_active ? 'activated' : 'deactivated'}.`);
      }
    } catch (err) {
      console.error('Failed toggling status:', err);
      setError('Failed to update award status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this award category?')) return;

    try {
      const res = await api.delete(`/awards/admin/${id}`);
      if (res.data.success) {
        setAwards(prev => prev.filter(a => a.id !== id));
        setSuccessMsg('Award category deleted successfully.');
      }
    } catch (err) {
      console.error('Failed deleting award:', err);
      setError(err.response?.data?.message || 'Failed to delete award category.');
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Registry Honors Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Award Categories & Benchmark Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure award tiers, evaluation benchmarks, prize honorariums, and active status for scholars across Africa.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Award Category</span>
        </button>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-600 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Award Categories</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{awards.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-azure-50 text-azure-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Awards</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              {awards.filter(a => a.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Inactive / Drafts</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">
              {awards.filter(a => !a.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Award Listings */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading registry award categories...</div>
      ) : awards.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 shadow-sm">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Award Categories Configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create award categories for national, continental, and global academic achievements to enable scholar applications.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-sm"
          >
            Create First Award
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {awards.map((award) => {
            const evalList = Array.isArray(award.evaluation_index) ? award.evaluation_index : [];
            const awardVal = award.award_value || {};

            return (
              <div
                key={award.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-sm ${
                  !award.is_active ? 'opacity-70 border-slate-200 bg-slate-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Row */}
                <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        award.tier === 'NATIONAL'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : award.tier === 'CONTINENTAL'
                          ? 'bg-coral-500/20 text-coral-300 border border-coral-500/30'
                          : 'bg-azure-500/20 text-azure-300 border border-azure-500/30'
                      }`}>
                        {award.tier} TIER
                      </span>
                      {award.country && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {award.country}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">Cycle Year: {award.year}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white">{award.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{award.description}</p>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 shrink-0 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Honorarium Prize</span>
                      <span className="text-2xl font-black text-amber-400 block">{awardVal.prize_amount || '$5,000'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(award)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition ${
                          award.is_active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                      >
                        {award.is_active ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Active (Live)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Inactive (Hidden)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(award)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 transition flex items-center space-x-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(award.id)}
                        className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition"
                        title="Delete Award"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Prize Inclusions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-slate-900 block text-[11px]">Physical Plaque</span>
                      <span className="text-slate-500 text-[11px]">{awardVal.plaque}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-slate-900 block text-[11px]">Media / Podcast</span>
                      <span className="text-slate-500 text-[11px]">{awardVal.podcast_interview}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-slate-900 block text-[11px]">Registry Emblem</span>
                      <span className="text-slate-500 text-[11px]">{awardVal.icon_items}</span>
                    </div>
                  </div>

                  {/* Benchmark Verification Rules */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-600" />
                      <span>Configured Evaluation Benchmarks ({evalList.length})</span>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evalList.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">{item.benchmark}</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.rule}</p>
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

      {/* Award Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {editingAward ? 'Edit Award Category' : 'Create New Award Category'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure tier, benchmarks, and monetary honorarium</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Award Category Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Continental Laureate in Agricultural Research & Food Security"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Award Tier *
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="NATIONAL">NATIONAL</option>
                    <option value="CONTINENTAL">CONTINENTAL</option>
                    <option value="GLOBAL">GLOBAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formData.tier === 'NATIONAL' && (
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Country Target
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. Nigeria, Kenya, Ghana"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Cycle Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Honorarium Prize Amount
                  </label>
                  <input
                    type="text"
                    value={formData.prize_amount}
                    onChange={(e) => setFormData({ ...formData, prize_amount: e.target.value })}
                    placeholder="e.g. $5,000"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the academic impact and eligibility scope..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              {/* Honorarium Package Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-black uppercase text-slate-800 block">Honorarium Package Deliverables</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Physical Plaque</label>
                    <input
                      type="text"
                      value={formData.plaque}
                      onChange={(e) => setFormData({ ...formData, plaque: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Podcast Interview</label>
                    <input
                      type="text"
                      value={formData.podcast_interview}
                      onChange={(e) => setFormData({ ...formData, podcast_interview: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Registry Emblem</label>
                    <input
                      type="text"
                      value={formData.icon_items}
                      onChange={(e) => setFormData({ ...formData, icon_items: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Evaluation Benchmarks */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-slate-800">
                    Evaluation Index & Verification Benchmarks ({formData.evaluation_index.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddBenchmark}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Benchmark Rule</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.evaluation_index.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item.benchmark}
                          onChange={(e) => handleBenchmarkChange(idx, 'benchmark', e.target.value)}
                          placeholder="Benchmark Milestone Title (e.g. Google H-Index >= 15)"
                          className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 outline-none"
                        />
                        <input
                          type="text"
                          value={item.rule}
                          onChange={(e) => handleBenchmarkChange(idx, 'rule', e.target.value)}
                          placeholder="Verification Requirement Rule (e.g. Must possess verified ORCID iD with min 15 h-index)"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none"
                        />
                      </div>

                      {formData.evaluation_index.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBenchmark(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Publish & Activate Category for Scholar Applications
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition"
                >
                  {editingAward ? 'Update Award Category' : 'Publish Award Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
