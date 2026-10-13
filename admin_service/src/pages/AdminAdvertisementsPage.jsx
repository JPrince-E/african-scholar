import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  DollarSign,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Tag,
  ShieldCheck,
  X
} from 'lucide-react';
import api from '../services/api';
import AdminHeader from '../components/AdminHeader';

export default function AdminAdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING_REVIEW'); // 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ALL'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAdForReject, setSelectedAdForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Create Form State
  const [newAd, setNewAd] = useState({
    business_name: '',
    contact_name: '',
    contact_email: '',
    headline: '',
    description: '',
    banner_image_url: '',
    target_url: '',
    placement: 'HERO_BANNER',
    pricing_tier: 'MONTHLY',
    amount_usd: 250
  });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/advertisements/admin/all');
      if (res.data.success) {
        setAds(res.data.advertisements || []);
        setCounts(res.data.counts || { pending: 0, approved: 0, rejected: 0, total: 0 });
      }
    } catch (err) {
      console.error('Failed to load advertisements:', err);
      setError('Failed to fetch advertisements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleApprove = async (ad) => {
    try {
      const res = await api.put(`/advertisements/admin/${ad.id}/approve`, {
        admin_notes: 'Approved and published by Administrator.'
      });
      if (res.data.success) {
        setMessage(`Ad for "${ad.business_name}" is now APPROVED and live on the site!`);
        fetchAds();
      }
    } catch (err) {
      console.error('Error approving ad:', err);
      setError(err.response?.data?.message || 'Failed to approve advertisement.');
    }
  };

  const handleOpenRejectModal = (ad) => {
    setSelectedAdForReject(ad);
    setRejectReason('Does not meet current academic content guidelines or banner specifications.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedAdForReject) return;
    try {
      const res = await api.put(`/advertisements/admin/${selectedAdForReject.id}/reject`, {
        admin_notes: rejectReason
      });
      if (res.data.success) {
        setMessage(`Ad for "${selectedAdForReject.business_name}" has been REJECTED.`);
        setRejectModalOpen(false);
        setSelectedAdForReject(null);
        fetchAds();
      }
    } catch (err) {
      console.error('Error rejecting ad:', err);
      setError(err.response?.data?.message || 'Failed to reject advertisement.');
    }
  };

  const handleToggle = async (ad) => {
    try {
      const res = await api.put(`/advertisements/admin/${ad.id}/toggle`);
      if (res.data.success) {
        setMessage(`Ad "${ad.business_name}" status toggled.`);
        fetchAds();
      }
    } catch (err) {
      console.error('Error toggling ad status:', err);
      setError('Failed to toggle status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      const res = await api.delete(`/advertisements/admin/${id}`);
      if (res.data.success) {
        setMessage('Advertisement deleted successfully.');
        fetchAds();
      }
    } catch (err) {
      console.error('Error deleting ad:', err);
      setError('Failed to delete ad.');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/advertisements/admin/create', newAd);
      if (res.data.success) {
        setMessage('New advertisement created and published directly!');
        setCreateModalOpen(false);
        setNewAd({
          business_name: '',
          contact_name: '',
          contact_email: '',
          headline: '',
          description: '',
          banner_image_url: '',
          target_url: '',
          placement: 'HERO_BANNER',
          pricing_tier: 'MONTHLY',
          amount_usd: 250
        });
        fetchAds();
      }
    } catch (err) {
      console.error('Error creating ad:', err);
      setError(err.response?.data?.message || 'Failed to create advertisement.');
    }
  };

  const filteredAds = ads.filter(ad => {
    if (activeTab === 'PENDING_REVIEW') return ad.status === 'PENDING_REVIEW';
    if (activeTab === 'APPROVED') return ad.status === 'APPROVED';
    if (activeTab === 'REJECTED') return ad.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="Advertisement Approvals & Management Station"
        subtitle="Review third-party business advertisements, verify Paystack payment settlements, and accept or reject submissions before they go live on the user service app."
        onRefresh={fetchAds}
      />

      <div className="px-6 space-y-6">
        {/* Alerts */}
        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-rose-600 hover:text-rose-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            onClick={() => setActiveTab('PENDING_REVIEW')}
            className={`p-6 rounded-3xl bg-white border cursor-pointer transition shadow-soft-xl space-y-2 ${
              activeTab === 'PENDING_REVIEW' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending Review</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600">{counts.pending}</div>
            <p className="text-[11px] text-amber-700 font-semibold">Requires Admin Acceptance</p>
          </div>

          <div 
            onClick={() => setActiveTab('APPROVED')}
            className={`p-6 rounded-3xl bg-white border cursor-pointer transition shadow-soft-xl space-y-2 ${
              activeTab === 'APPROVED' ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Live Approved Ads</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700">{counts.approved}</div>
            <p className="text-[11px] text-emerald-700 font-semibold">Active on User App</p>
          </div>

          <div 
            onClick={() => setActiveTab('REJECTED')}
            className={`p-6 rounded-3xl bg-white border cursor-pointer transition shadow-soft-xl space-y-2 ${
              activeTab === 'REJECTED' ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Rejected</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-rose-700">{counts.rejected}</div>
            <p className="text-[11px] text-rose-700 font-semibold">Declined Applications</p>
          </div>

          <div 
            onClick={() => setActiveTab('ALL')}
            className={`p-6 rounded-3xl bg-white border cursor-pointer transition shadow-soft-xl space-y-2 ${
              activeTab === 'ALL' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Submissions</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{counts.total}</div>
            <p className="text-[11px] text-blue-700 font-semibold">All Historical Ad Inquiries</p>
          </div>
        </div>

        {/* Tab Filters & Create Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('PENDING_REVIEW')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'PENDING_REVIEW'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Review</span>
              {counts.pending > 0 && (
                <span className="bg-white text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {counts.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('APPROVED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'APPROVED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Approved ({counts.approved})
            </button>

            <button
              onClick={() => setActiveTab('REJECTED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'REJECTED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({counts.rejected})
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Ads ({counts.total})
            </button>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-brand-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Direct Ad</span>
          </button>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading advertisement applications...</div>
        ) : filteredAds.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-soft-xl">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Advertisements Found in "{activeTab.replace('_', ' ')}"</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When users apply for ad placements via the user portal, they will appear here awaiting your editorial acceptance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAds.map((ad) => {
              const isPending = ad.status === 'PENDING_REVIEW';
              const isApproved = ad.status === 'APPROVED';
              const isRejected = ad.status === 'REJECTED';

              return (
                <div
                  key={ad.id}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-soft-xl transition flex flex-col justify-between ${
                    isPending
                      ? 'border-amber-300 ring-1 ring-amber-300'
                      : isApproved
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div>
                    {/* Banner Image Preview */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={ad.banner_image_url}
                        alt={ad.headline}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                      {/* Status Badges on Banner */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {isPending && (
                          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                            <Clock className="w-3 h-3" />
                            <span>Action Required • Pending Review</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-sm ${
                            ad.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{ad.is_active ? '● LIVE ON USER PORTAL' : 'PAUSED'}</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                            <XCircle className="w-3 h-3" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </div>

                      {/* Pricing Tier Tag */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                          {ad.pricing_tier} • ${ad.amount_usd} USD
                        </span>
                      </div>

                      {/* Headline on Banner */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="font-extrabold text-base leading-snug drop-shadow-sm truncate">
                          {ad.headline}
                        </h3>
                        <p className="text-[11px] text-slate-300 drop-shadow-sm">
                          By <strong className="text-amber-300">{ad.business_name}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Description */}
                      {ad.description && (
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{ad.description}"
                        </p>
                      )}

                      {/* Contact & Advertiser Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 block flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>Contact Email</span>
                          </span>
                          <span className="font-semibold text-slate-800 truncate block text-[11px]" title={ad.contact_email}>
                            {ad.contact_email}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 block flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Paystack Payment</span>
                          </span>
                          <span className="font-semibold text-emerald-700 block text-[11px]">
                            {ad.payment_status === 'PAID' ? '✓ Verified Settlement' : 'Pending Payment'}
                          </span>
                        </div>
                      </div>

                      {/* Destination URL & Reference */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                        {ad.target_url ? (
                          <a
                            href={ad.target_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-600 hover:text-brand-700 font-bold flex items-center space-x-1 truncate max-w-[220px]"
                          >
                            <span>Visit: {ad.target_url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">No destination URL</span>
                        )}

                        {ad.payment_reference && (
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            Ref: {ad.payment_reference.slice(0, 16)}...
                          </span>
                        )}
                      </div>

                      {/* Admin Notes if rejected */}
                      {isRejected && ad.admin_notes && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                          <strong className="block text-[10px] uppercase font-bold text-rose-900">Rejection Reason:</strong>
                          <span className="text-[11px]">{ad.admin_notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {isApproved && (
                        <button
                          onClick={() => handleToggle(ad)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                            ad.is_active
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {ad.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{ad.is_active ? 'Pause Ad' : 'Resume Ad'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Ad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleOpenRejectModal(ad)}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => handleApprove(ad)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept & Publish Live</span>
                          </button>
                        </>
                      )}

                      {isRejected && (
                        <button
                          onClick={() => handleApprove(ad)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
                        >
                          Re-evaluate & Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectModalOpen && selectedAdForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Reject Advertisement Submission
              </h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide feedback or a reason for declining the ad from <strong className="text-slate-900">{selectedAdForReject.business_name}</strong>:
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              placeholder="e.g. Creative banner does not meet required aspect ratio or contains prohibited content."
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Direct Ad Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Create & Publish Direct Ad</h3>
                <p className="text-xs text-slate-500">Post an ad directly without going through user application queue.</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newAd.business_name}
                    onChange={(e) => setNewAd({ ...newAd, business_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Oxford University Press Africa"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={newAd.contact_email}
                    onChange={(e) => setNewAd({ ...newAd, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    placeholder="ads@business.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Ad Headline *</label>
                <input
                  type="text"
                  required
                  value={newAd.headline}
                  onChange={(e) => setNewAd({ ...newAd, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="e.g. 50% Research Grant Subsidies for African Authors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  value={newAd.banner_image_url}
                  onChange={(e) => setNewAd({ ...newAd, banner_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destination Target URL</label>
                <input
                  type="url"
                  value={newAd.target_url}
                  onChange={(e) => setNewAd({ ...newAd, target_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="https://business.com/call-for-papers"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Ad Plan / Tier</label>
                  <select
                    value={newAd.pricing_tier}
                    onChange={(e) => {
                      const tier = e.target.value;
                      const amounts = { HOURLY: 2, DAILY: 15, WEEKLY: 80, MONTHLY: 250, YEARLY: 2400 };
                      setNewAd({ ...newAd, pricing_tier: tier, amount_usd: amounts[tier] || 250 });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="HOURLY">Hourly ($2/hr)</option>
                    <option value="DAILY">Daily ($15/24hrs)</option>
                    <option value="WEEKLY">Weekly ($80/7days)</option>
                    <option value="MONTHLY">Monthly ($250/30days)</option>
                    <option value="YEARLY">Yearly ($2,400/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Placement Slot</label>
                  <select
                    value={newAd.placement}
                    onChange={(e) => setNewAd({ ...newAd, placement: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="HERO_BANNER">Hero Banner</option>
                    <option value="SIDEBAR">Sidebar Widget</option>
                    <option value="DIRECTORY_FEED">Directory Sponsored Feed</option>
                    <option value="FOOTER">Footer Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="Brief promotional copy..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20"
                >
                  Create & Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
