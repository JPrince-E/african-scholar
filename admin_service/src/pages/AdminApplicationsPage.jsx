import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trophy,
  X,
  ExternalLink,
  MessageSquare,
  Award,
  Building2,
  Globe2,
  ChevronRight,
  Sparkles,
  Printer,
  BookOpen,
  FileText,
  Save,
  Scale,
  Users
} from 'lucide-react';
import api from '../services/api';
import AdminHeader from '../components/AdminHeader';

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

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  // Review modal state
  const [adminComments, setAdminComments] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Multi-Criteria Scoring Rubric
  const [rubric, setRubric] = useState({
    research_impact: 32, // 0 - 35
    continental_relevance: 23, // 0 - 25
    mentorship_graduates: 18, // 0 - 20
    grants_outreach: 17 // 0 - 20
  });

  const totalScore = (parseInt(rubric.research_impact) || 0) +
    (parseInt(rubric.continental_relevance) || 0) +
    (parseInt(rubric.mentorship_graduates) || 0) +
    (parseInt(rubric.grants_outreach) || 0);

  // Multi-Juror Consensus state
  const [juryReviews, setJuryReviews] = useState([]);
  const [juryConsensus, setJuryConsensus] = useState({ averageScore: 0, reviewCount: 0, variance: 0 });
  const [jurorName, setJurorName] = useState('Prof. Adebayo Ogunlesi (Jury Chair)');
  const [jurorRegion, setJurorRegion] = useState('Pan-African Directorate');
  const [refereesList, setRefereesList] = useState([]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/admin/applications?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleOpenReview = (app) => {
    setSelectedApp(app);
    setAdminComments(app.admin_comments || '');
    setMessage('');
    if (app.score_details) {
      try {
        const s = typeof app.score_details === 'string' ? JSON.parse(app.score_details) : app.score_details;
        setRubric({
          research_impact: s.research_impact ?? 32,
          continental_relevance: s.continental_relevance ?? 23,
          mentorship_graduates: s.mentorship_graduates ?? 18,
          grants_outreach: s.grants_outreach ?? 17
        });
      } catch (_) {
        setRubric({ research_impact: 32, continental_relevance: 23, mentorship_graduates: 18, grants_outreach: 17 });
      }
    } else {
      setRubric({ research_impact: 32, continental_relevance: 23, mentorship_graduates: 18, grants_outreach: 17 });
    }

    // Fetch consensus reviews and referees
    const fetchAppConsensus = async () => {
      try {
        const res = await api.get(`/jury/application/${app.id}`);
        if (res.data.success) {
          setJuryReviews(res.data.reviews || []);
          setJuryConsensus(res.data.consensus || { averageScore: 0, reviewCount: 0, variance: 0 });
        }
      } catch (e) {
        console.error('Error fetching jury reviews:', e);
      }

      try {
        const refRes = await api.get(`/referees/application/${app.id}`);
        if (refRes.data.success) {
          setRefereesList(refRes.data.referees || []);
        }
      } catch (e) {
        console.error('Error fetching referees:', e);
      }
    };
    fetchAppConsensus();
  };

  const handleSaveJurorRubric = async () => {
    if (!selectedApp) return;
    try {
      const res = await api.post(`/jury/application/${selectedApp.id}`, {
        juror_name: jurorName,
        juror_region: jurorRegion,
        scores: {
          researchImpact: rubric.research_impact,
          continentalRelevance: rubric.continental_relevance,
          mentorship: rubric.mentorship_graduates,
          grants: rubric.grants_outreach
        },
        recommendation: totalScore >= 85 ? 'RECOMMENDED' : (totalScore >= 60 ? 'NEEDS_REVISION' : 'DECLINED'),
        confidential_notes: adminComments
      });
      if (res.data.success) {
        setMessage('Juror scorecard logged and consensus updated successfully!');
        if (res.data.consensus) {
          setJuryConsensus(res.data.consensus);
          setJuryReviews(res.data.consensus.allReviews || []);
        }
      }
    } catch (err) {
      setMessage(`Error saving scorecard: ${err.message}`);
    }
  };


  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApp) return;
    setUpdating(true);
    setMessage('');

    try {
      const res = await api.put(`/admin/applications/${selectedApp.id}/review`, {
        status: newStatus,
        admin_comments: adminComments,
        score_details: { ...rubric, total_score: totalScore }
      });

      if (res.data.success) {
        setMessage(`Application successfully marked as ${newStatus}! (Verdict notification email dispatched)`);
        setSelectedApp(res.data.application);
        fetchApplications();
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeclareWinner = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const res = await api.put(`/admin/applications/${selectedApp.id}/winner`, {
        admin_comments: adminComments || 'Officially awarded as Laureate Winner of the Year.'
      });
      if (res.data.success) {
        setMessage('Candidate officially awarded as Winner of the Year!');
        setSelectedApp(res.data.application);
        fetchApplications();
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Submitted
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Verified / Approved
          </span>
        );
      case 'AWARDED':
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-xs flex items-center space-x-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Winner of Year</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected / Incomplete
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Nomination Review Station"
        subtitle="Evaluate candidate submissions against strict academic benchmark indices and assign winner laurels."
        onRefresh={fetchApplications}
      />

      <div className="px-6 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter by Review Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-brand-500"
            >
              <option value="">All Applications ({applications.length})</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="AWARDED">Awarded Winner</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {applications.length} submitted dossiers
          </span>
        </div>

        {/* Applications Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading dossiers...</div>
          ) : applications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">No applications found in this state.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Candidate / Scholar</th>
                    <th className="py-4 px-6">Institution & Country</th>
                    <th className="py-4 px-6">Award Tier</th>
                    <th className="py-4 px-6">Metrics Summary</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {applications.map((app) => {
                    const profile = app.applicant?.profile;
                    return (
                      <tr key={app.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={app.applicant?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                              alt="candidate"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">
                                {profile ? `${profile.title} ${profile.first_name} ${profile.surname}` : app.applicant?.email}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {app.applicant?.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-800 block">
                            {profile?.university_name || 'Not provided'}
                          </span>
                          <span className="text-emerald-700 text-[11px] font-semibold">
                            {profile?.country || 'Africa'}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100 block w-fit">
                            {app.award?.tier}
                          </span>
                          <span className="font-semibold text-slate-700 text-xs mt-0.5 block truncate max-w-xs">
                            {app.award?.title}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3 text-[11px]">
                            <span title="Citations" className="text-slate-600 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-slate-400" />
                              <span>{profile?.citations_count?.toLocaleString() || 0}</span>
                            </span>
                            <span title="Publications" className="text-slate-600 font-medium flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span>{profile?.publications_count || 0}</span>
                            </span>
                            <span title="H-Index" className="text-brand-600 font-bold">
                              h: {profile?.google_h_index || 0}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">{getStatusBadge(app.status)}</td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenReview(app)}
                            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition inline-flex items-center space-x-1"
                          >
                            <span>Open Review Station</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SIDE-BY-SIDE REVIEW STATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-y-auto my-6 flex flex-col justify-between">
            {/* Modal Top Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Nomination Evaluation Station — {selectedApp.award?.title}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Reviewing dossier for {selectedApp.applicant?.profile?.first_name} {selectedApp.applicant?.profile?.surname}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center space-x-1.5"
                  title="Print / Save complete candidate dossier pack for board review"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Dossier Pack</span>
                </button>
                {getStatusBadge(selectedApp.status)}
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {message && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{message}</span>
              </div>
            )}

            {/* Modal Body: Two Column Side-by-Side Comparison */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Candidate Dossier & Supporting Evidence */}
              <div className="lg:col-span-6 space-y-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedApp.applicant?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt="avatar"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        {selectedApp.applicant?.profile?.title} {selectedApp.applicant?.profile?.first_name} {selectedApp.applicant?.profile?.surname}
                      </h4>
                      <p className="text-xs text-brand-600 font-bold">
                        {selectedApp.applicant?.profile?.discipline}
                      </p>
                      <span className="text-xs text-slate-500">
                        {selectedApp.applicant?.profile?.university_name}, {selectedApp.applicant?.profile?.country}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Citations</span>
                      <span className="text-xs font-bold text-slate-900">{selectedApp.applicant?.profile?.citations_count?.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Pubs</span>
                      <span className="text-xs font-bold text-slate-900">{selectedApp.applicant?.profile?.publications_count}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] uppercase font-bold text-brand-600 block">H-Index</span>
                      <span className="text-xs font-bold text-brand-700">{selectedApp.applicant?.profile?.google_h_index}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[9px] uppercase font-bold text-amber-600 block">PhDs</span>
                      <span className="text-xs font-bold text-amber-700">{selectedApp.applicant?.profile?.phd_count}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Section */}
                <div className="space-y-4">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Candidate Submitted Evidence
                  </h5>

                  {/* Conferences */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 block">Conferences in last 3 years:</span>
                    {parseJsonArray(selectedApp.supporting_evidence?.conferences_list).length > 0 ? (
                      parseJsonArray(selectedApp.supporting_evidence?.conferences_list).map((c, i) => (
                        <p key={i} className="text-slate-600 text-[11px]">• {c}</p>
                      ))
                    ) : (
                      <p className="text-slate-400 text-[11px]">None listed</p>
                    )}
                  </div>

                  {/* Regional citation spread */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 block">Regional / Continental Citation Spread:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedApp.supporting_evidence?.regional_citations_spread || 'Not provided'}
                    </p>
                  </div>

                  {/* Q1 / Q2 Publications */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 block">Q1 / Q2 Journal Articles:</span>
                    {parseJsonArray(selectedApp.supporting_evidence?.q1_q2_publications).length > 0 ? (
                      parseJsonArray(selectedApp.supporting_evidence?.q1_q2_publications).map((p, i) => (
                        <p key={i} className="text-slate-700 text-[11px] font-mono">• {p}</p>
                      ))
                    ) : (
                      <p className="text-slate-400 text-[11px]">None listed</p>
                    )}
                  </div>

                  {/* Grants & Supervisions */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 block">Supervisions & Grants:</span>
                    <p className="text-slate-600 text-[11px]">
                      {selectedApp.supporting_evidence?.supervision_graduates}
                    </p>
                    {parseJsonArray(selectedApp.supporting_evidence?.grants_and_collaborations).length > 0 && (
                      <div className="pt-1">
                        {parseJsonArray(selectedApp.supporting_evidence?.grants_and_collaborations).map((g, i) => (
                          <p key={i} className="text-slate-600 text-[11px]">• {g}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Official Benchmark Checklist & Evaluation Controls */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                    <Award className="w-4 h-4" />
                    <span>Official Benchmark Evaluation Checklist</span>
                  </h5>

                  <div className="space-y-2">
                    {parseJsonArray(selectedApp.award?.evaluation_index).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs"
                      >
                        <div className="w-5 h-5 rounded-md bg-brand-100 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{item.benchmark}</span>
                          <span className="text-slate-500 text-[11px] block mt-0.5">{item.rule}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Jury Evaluation Scoring Rubric */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-brand-700 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <span>Jury Scoring Rubric</span>
                    </h5>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl shadow-xs ${
                        totalScore >= 80
                          ? 'bg-emerald-600 text-white'
                          : totalScore >= 60
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-rose-500 text-white'
                      }`}>
                        Composite Score: {totalScore} / 100 pts
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                        <span>Research & Metrics</span>
                        <span className="text-slate-400">/ 35 pts</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="35"
                        value={rubric.research_impact}
                        onChange={(e) => setRubric({ ...rubric, research_impact: Math.min(35, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-full p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-brand-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                        <span>Continental Relevance</span>
                        <span className="text-slate-400">/ 25 pts</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={rubric.continental_relevance}
                        onChange={(e) => setRubric({ ...rubric, continental_relevance: Math.min(25, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-full p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-brand-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                        <span>Mentorship & PhDs</span>
                        <span className="text-slate-400">/ 20 pts</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={rubric.mentorship_graduates}
                        onChange={(e) => setRubric({ ...rubric, mentorship_graduates: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-full p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-brand-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase">
                        <span>Grants & Outreach</span>
                        <span className="text-slate-400">/ 20 pts</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={rubric.grants_outreach}
                        onChange={(e) => setRubric({ ...rubric, grants_outreach: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-full p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Save Juror Scorecard Button */}
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">
                      Evaluator: {jurorName}
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveJurorRubric}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] transition shadow-xs flex items-center space-x-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Juror Scorecard</span>
                    </button>
                  </div>

                  {/* Multi-Juror Consensus Summary */}
                  {juryConsensus.reviewCount > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>Jury Consensus Score ({juryConsensus.reviewCount} Jurors):</span>
                        </span>
                        <span className="font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                          {juryConsensus.averageScore} / 100 avg
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Variance: ±{juryConsensus.variance} pts</span>
                        <span className="text-emerald-600 font-semibold">
                          {juryConsensus.variance <= 5 ? 'High Jury Consensus' : 'Review Deliberation Needed'}
                        </span>
                      </div>

                      {/* Jurors breakdown */}
                      <div className="divide-y divide-slate-100 pt-1 text-[11px]">
                        {juryReviews.map((rev, idx) => (
                          <div key={idx} className="py-1 flex items-center justify-between">
                            <span className="text-slate-700 font-medium">
                              {rev.juror_name} ({rev.juror_region || 'Jury'})
                            </span>
                            <span className="font-bold text-slate-900">
                              {rev.composite_score} pts • {rev.recommendation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confidential Academic Referees Status */}
                {refereesList.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>Confidential Academic Referees</span>
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                        {refereesList.filter(r => r.status === 'SUBMITTED').length} / {refereesList.length} Endorsed
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {refereesList.map((ref, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-800">{ref.referee_name}</div>
                            <div className="text-[10px] text-slate-400">{ref.referee_institution || ref.referee_email}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ref.status === 'SUBMITTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ref.status === 'SUBMITTED' ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Endorsement Received</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Awaiting Submission</span>
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* Reviewer Commentary */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Review Committee Commentary</span>
                  </label>
                  <textarea
                    rows={4}
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    placeholder="Enter formal verification notes, peer review evaluation remarks, or reasons for acceptance/rejection..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-brand-500 placeholder:text-slate-400"
                  ></textarea>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Update Application Verdict:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                      className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition"
                    >
                      Mark Under Review
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus('APPROVED')}
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition"
                    >
                      Approve Nomination
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus('REJECTED')}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition"
                    >
                      Reject Dossier
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={handleDeclareWinner}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 text-xs font-black shadow-md transition flex items-center justify-center space-x-1"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Award as Winner</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
