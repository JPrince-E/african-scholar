import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Mic,
  DollarSign,
  Building2,
  Globe2,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import AdminHeader from '../components/AdminHeader';
import LaureateCertificateModal from '../components/LaureateCertificateModal';

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certModalWinner, setCertModalWinner] = useState(null);

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/applications?status=AWARDED');
      if (res.data.success) {
        setWinners(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load winners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Official Laureates & Award Winners"
        subtitle="Manage declared winners, prize disbursement records, and African Scholar podcast interview schedules."
        onRefresh={fetchWinners}
      />

      <div className="px-6 space-y-6">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading laureates...</div>
        ) : winners.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-soft-xl">
            <Trophy className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">No Laureates Awarded Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Open the Nomination Review Station to review submitted dossiers and declare official winners.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {winners.map((winner) => {
              const profile = winner.applicant?.profile;
              const award = winner.award;

              return (
                <div
                  key={winner.id}
                  className="bg-white border border-amber-300 rounded-3xl p-6 shadow-soft-xl space-y-6 relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-100/60 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={winner.applicant?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt="winner"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
                          {award?.tier} LAUREATE 2026
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-1">
                          {profile?.title} {profile?.first_name} {profile?.surname}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {profile?.university_name}, {profile?.country}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-amber-600">
                        {award?.award_value?.prize_amount || '$5,000'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">Prize Allocated</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 space-y-2">
                    <span className="font-bold text-amber-800 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Executive Citation:</span>
                    </span>
                    <p className="text-[11px] leading-relaxed italic text-slate-600">
                      "{winner.admin_comments || 'Selected as official winner in recognition of superior scholarship and pan-African research leadership.'}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Plaque & Medal</span>
                      <span className="font-semibold text-slate-800 block text-[11px]">
                        {award?.award_value?.plaque}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Podcast Feature</span>
                      <span className="font-semibold text-slate-800 block text-[11px]">
                        {award?.award_value?.podcast_interview}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setCertModalWinner(winner)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center space-x-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>View & Print Official Certificate</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
