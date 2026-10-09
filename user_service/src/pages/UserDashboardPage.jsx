import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trophy,
  ArrowRight,
  ExternalLink,
  Lock,
  Building2,
  MessageSquare,
  Bell,
  Megaphone
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BannerCarousel from '../components/BannerCarousel';
import LaureateCertificateModal from '../components/LaureateCertificateModal';
import ApplicationTimelineStepper from '../components/ApplicationTimelineStepper';
import { ShieldCheck } from 'lucide-react';


export default function UserDashboardPage({ setActiveTab, setSelectedAwardId }) {
  const { user } = useAuth();
  const [myApplications, setMyApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certModalWinner, setCertModalWinner] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await api.get('/awards/user/my-applications');
        if (res.data.success) {
          setMyApplications(res.data.applications);
        }
      } catch (err) {
        console.error('Failed to load my applications:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    if (user) {
      fetchMyApplications();
      fetchNotifications();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-soft-xl text-center">
        <p className="text-sm font-semibold text-slate-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const profile = user.profile;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" /> Submitted
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" /> Under Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified & Approved
          </span>
        );
      case 'AWARDED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs">
            <Trophy className="w-3.5 h-3.5 mr-1" /> Laureate / Winner
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Benchmark Incomplete
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start space-x-5">
          <img
            src={user.avatar_url || '/default-avatar.svg'}
            alt="avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-coral-500 shadow-md bg-slate-900"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-0.5 rounded-full border border-azure-200/60">
                {profile ? `${profile.title} (${profile.highest_degree})` : 'Scholar'}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Verified Faculty
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {profile ? `${profile.first_name} ${profile.surname}` : user.email}
            </h1>
            <p className="text-xs text-slate-500 flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {profile ? `${profile.university_name}, ${profile.country}` : 'University not yet configured'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('register_scholar')}
            className="px-5 py-2.5 rounded-xl bg-azure-50 hover:bg-azure-100 text-azure-700 font-bold text-xs border border-azure-200/80 transition"
          >
            Update Professor Metrics
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className="px-5 py-2.5 rounded-xl btn-coral font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Apply For Award</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Citations</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {profile.citations_count?.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Publications</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {profile.publications_count}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xl text-center">
            <span className="text-[10px] uppercase font-bold text-azure-600 block">Google H-Index</span>
            <span className="text-2xl font-black text-azure-800 mt-1 block">
              {profile.google_h_index}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 block">Supervised PhDs</span>
            <span className="text-2xl font-black text-amber-700 mt-1 block">
              {profile.phd_count}
            </span>
          </div>
        </div>
      )}

      {/* Administrative Announcements & System Notifications */}
      {notifications.length > 0 && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white">Administrative Bulletins & Alerts</h3>
                <p className="text-[11px] text-slate-400">Official registry broadcasts and system notices</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {notifications.length} Active Bulletin{notifications.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between space-y-2 hover:border-slate-600 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {item.type || 'NOTICE'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">{item.message}</p>
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    className="inline-flex items-center text-[11px] font-bold text-orange-400 hover:text-orange-300 transition pt-1"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsored Initiatives & Partner Announcements Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse"></span>
            <span>Sponsored Academic Opportunities & Research Grants</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Pan-African Partner Initiatives</span>
        </div>
        <BannerCarousel />
      </div>

      {/* Submitted Applications History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-azure-600" />
              <span>My Award Nominations & Review Status</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review status, internal committee feedback, and evaluation progress for submitted awards.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Entries are immutable & private</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading submitted applications...</div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Award Nominations Submitted Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore the 2026 Academic Award categories and nominate your research achievements for national and continental honours.
            </p>
            <button
              onClick={() => setActiveTab('awards')}
              className="px-5 py-2.5 rounded-xl btn-coral text-white font-bold text-xs shadow-xs"
            >
              Browse 2026 Awards
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                        {app.award?.tier}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{app.award?.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Submitted on: {new Date(app.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div>{getStatusBadge(app.status)}</div>
                </div>

                {/* 5-Stage Nomination Lifecycle Progress Stepper */}
                <ApplicationTimelineStepper
                  status={app.status}
                  refereeCount={app.supporting_evidence?.referees?.length || 0}
                />

                {/* Admin Feedback Comments if any */}
                {app.admin_comments && (
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Review Committee Commentary:</span>
                    </span>
                    <p className="text-blue-800 leading-relaxed pl-4">{app.admin_comments}</p>
                  </div>
                )}

                {/* Laureate Certificate & Credential Actions */}
                {(app.status === 'APPROVED' || app.status === 'AWARDED') && (
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => setCertModalWinner({
                        ...app,
                        applicant: {
                          email: user.email,
                          profile: user.profile
                        }
                      })}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center space-x-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>View & Download Official Laureate Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {certModalWinner && (
        <LaureateCertificateModal
          winner={certModalWinner}
          onClose={() => setCertModalWinner(null)}
        />
      )}
    </div>
  );
}
