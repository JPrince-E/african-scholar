import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';
import AdminHeader from '../components/AdminHeader';

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    sponsor_name: '',
    banner_image_url: '',
    redirect_url: '',
    placement: 'HERO_BANNER',
    is_active: true
  });

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sponsors/all');
      if (res.data.success) {
        setSponsors(res.data.sponsors);
      }
    } catch (err) {
      console.error('Failed to load sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/uploads', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData(prev => ({ ...prev, banner_image_url: res.data.file_url }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      // fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, banner_image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateSponsor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sponsors', formData);
      if (res.data.success) {
        setMessage('Sponsor ad banner created successfully!');
        setModalOpen(false);
        setFormData({
          sponsor_name: '',
          banner_image_url: '',
          redirect_url: '',
          placement: 'HERO_BANNER',
          is_active: true
        });
        fetchSponsors();
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (!window.confirm('Delete this sponsor campaign?')) return;
    try {
      await api.delete(`/sponsors/${id}`);
      fetchSponsors();
    } catch (err) {
      console.error('Failed to delete sponsor:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Sponsor Advertising & Partnerships"
        subtitle="Manage sponsored hero banners, sidebar callouts, and institutional grant campaigns displayed across the platform."
        onRefresh={fetchSponsors}
      />

      <div className="px-6 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 font-semibold">
            {sponsors.length} Active & Scheduled Campaigns
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sponsor Banner</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading sponsor campaigns...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-soft-xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                    <img
                      src={sponsor.banner_image_url}
                      alt={sponsor.sponsor_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-amber-800 border border-amber-300 shadow-xs">
                        {sponsor.placement}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="text-base font-bold text-slate-900">{sponsor.sponsor_name}</h4>
                    {sponsor.redirect_url && (
                      <a
                        href={sponsor.redirect_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-600 hover:text-brand-700 truncate flex items-center space-x-1"
                      >
                        <span className="truncate">{sponsor.redirect_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-emerald-700">
                    ● Active on User Portal
                  </span>
                  <button
                    onClick={() => handleDeleteSponsor(sponsor.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Sponsor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-brand-600" />
                <span>Add Sponsor Ad Campaign</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSponsor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Sponsor Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sponsor_name}
                  onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                  placeholder="e.g. African Development Bank Research Fund"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Banner Image (Upload or Cloudinary URL) *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 mb-2"
                />
                <input
                  type="text"
                  required
                  value={formData.banner_image_url}
                  onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                  placeholder="Or paste direct image URL https://..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Destination / Redirect URL
                </label>
                <input
                  type="url"
                  value={formData.redirect_url}
                  onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                  placeholder="https://sponsor.org/grant"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Placement Area
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                >
                  <option value="HERO_BANNER">HERO_BANNER (Landing Page Spotlight)</option>
                  <option value="DASHBOARD">DASHBOARD (User Dashboard Carousel)</option>
                  <option value="SIDEBAR">SIDEBAR (Directory Sidebar)</option>
                  <option value="FOOTER">FOOTER (Bottom Banner)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  {uploading ? 'Uploading...' : 'Save & Publish Sponsor Ad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
