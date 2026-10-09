import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, Award, Users, Sparkles, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('AWARD');
  const [link, setLink] = useState('/awards');
  const [targetUserId, setTargetUserId] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications/admin/all');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load admin notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setErrorMsg('Please enter both a Title and Message for the broadcast notification.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/notifications/admin/create', {
        title: title.trim(),
        message: message.trim(),
        type,
        link: link.trim(),
        target_user_id: targetUserId.trim() ? Number(targetUserId) : null
      });

      if (res.data.success) {
        setSuccessMsg('Notification successfully broadcasted to users!');
        setTitle('');
        setMessage('');
        setTargetUserId('');
        fetchNotifications();
      } else {
        setErrorMsg(res.data.message || 'Failed to broadcast notification.');
      }
    } catch (err) {
      console.error('Broadcast error:', err);
      setErrorMsg('Failed to broadcast notification. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification from user dashboards?')) return;

    try {
      const res = await api.delete(`/notifications/admin/${id}`);
      if (res.data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Delete notification error:', err);
      alert('Failed to delete notification.');
    }
  };

  const getTypeBadge = (nType) => {
    switch (nType) {
      case 'AWARD':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">AWARD ANNOUNCEMENT</span>;
      case 'REFEREE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">REFEREE REVIEW</span>;
      case 'SPONSOR':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">SPONSOR INITIATIVE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">GENERAL SYSTEM ALERT</span>;
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Administrative Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            User Dashboard Notification Broadcasts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, broadcast, and control real-time alerts displayed across user dashboards and the notification bell.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Alerts</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Create Broadcast Notification */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Broadcast New Notification</h3>
              <p className="text-xs text-slate-500">Publish a live alert to user dashboards instantly.</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Notification Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2026 Laureate Selection Phase Open"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Alert Message / Content *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. The Continental Jury has finalized the 2026 evaluation benchmarks. Review your nomination status on the dashboard."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notification Type / Icon Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                >
                  <option value="AWARD">AWARD (Gold Award Badge)</option>
                  <option value="REFEREE">REFEREE (Peer Review Badge)</option>
                  <option value="SPONSOR">SPONSOR (Grant & Initiative)</option>
                  <option value="INFO">INFO (General Announcement)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Route Link
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/awards or /dashboard"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Audience (Optional User ID)
              </label>
              <input
                type="number"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="Leave blank to broadcast to ALL enrolled scholars"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                * Note: Leaving target user ID blank will broadcast this alert to all user dashboards.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{submitting ? 'Broadcasting Alert...' : 'Publish Live Notification'}</span>
            </button>
          </form>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Live User Dashboard Preview</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">User Bell Preview</span>
            </div>

            {/* Notification Item Box */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex gap-3 items-start shadow-md">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">
                    {title || 'Sample Notification Headline'}
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {message || 'This is how your broadcast notification message will appear on the user dashboard.'}
                </p>
                <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center justify-between">
                  <span>Target Route: {link || '/awards'}</span>
                  <span className="text-emerald-400 font-bold">Just Now</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Notifications created here will instantly appear in the bell dropdown for all active users logged into the public portal.
            </p>
          </div>

          {/* Active Notifications Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Active System Broadcasts</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {notifications.length} Total Alerts
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading system notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No broadcast notifications active.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(item.type)}
                        <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.message}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 font-mono">
                        <span>Audience: {item.user_id ? `User #${item.user_id}` : 'All Scholars'}</span>
                        <span>•</span>
                        <span>Route: {item.link}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0"
                      title="Delete Broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
