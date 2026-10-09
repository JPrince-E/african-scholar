import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Building2,
  Globe2,
  ExternalLink,
  BookOpen,
  Users
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ApplyAwardPage({ selectedAwardId, setActiveTab }) {
  const { user, openAuth } = useAuth();
  const [awards, setAwards] = useState([]);
  const [currentAwardId, setCurrentAwardId] = useState(selectedAwardId || null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Evidence inputs
  const [evidence, setEvidence] = useState({
    conferences_list: '',
    regional_citations_spread: '',
    q1_q2_publications: '',
    high_impact_publications: '',
    grants_and_collaborations: '',
    supervision_graduates: '',
    supporting_urls: ''
  });

  // Crossref DOI Lookup state
  const [doiInput, setDoiInput] = useState('');
  const [doiLoading, setDoiLoading] = useState(false);
  const [doiResult, setDoiResult] = useState(null);
  const [doiError, setDoiError] = useState('');

  // Live ORCID iD Sync state
  const [orcidInput, setOrcidInput] = useState('');
  const [orcidLoading, setOrcidLoading] = useState(false);
  const [orcidResult, setOrcidResult] = useState(null);
  const [orcidError, setOrcidError] = useState('');

  // Confidential Academic Referees state
  const [referees, setReferees] = useState([
    { name: '', email: '', institution: '', title: 'Dean / Senior Professor' },
    { name: '', email: '', institution: '', title: 'International Research Collaborator' }
  ]);

  const handleVerifyDoi = async () => {
    if (!doiInput.trim()) return;
    setDoiLoading(true);
    setDoiError('');
    setDoiResult(null);

    try {
      const res = await api.get(`/publications/lookup-doi?doi=${encodeURIComponent(doiInput.trim())}`);
      if (res.data.success) {
        setDoiResult(res.data.publication);
      } else {
        setDoiError(res.data.message || 'Could not resolve DOI');
      }
    } catch (err) {
      setDoiError(err.response?.data?.message || 'DOI verification failed. Please check DOI string.');
    } finally {
      setDoiLoading(false);
    }
  };

  const handleInsertDoiCitation = () => {
    if (!doiResult) return;
    const newCitation = `${doiResult.journal} (${doiResult.year}) — "${doiResult.title}" by ${doiResult.authors}. Citations: ${doiResult.citations_count?.toLocaleString()}. DOI: ${doiResult.doi}`;
    
    setEvidence(prev => {
      const existing = prev.q1_q2_publications.trim();
      return {
        ...prev,
        q1_q2_publications: existing ? `${existing}\n${newCitation}` : newCitation
      };
    });
  };

  const handleVerifyOrcid = async () => {
    if (!orcidInput.trim()) return;
    setOrcidLoading(true);
    setOrcidError('');
    setOrcidResult(null);

    try {
      const res = await api.get(`/publications/lookup-orcid?orcid=${encodeURIComponent(orcidInput.trim())}`);
      if (res.data.success && res.data.profile) {
        setOrcidResult(res.data.profile);
      } else {
        setOrcidError(res.data.message || 'ORCID iD could not be resolved');
      }
    } catch (err) {
      setOrcidError(err.response?.data?.message || 'Failed to query ORCID registry. Please check format (e.g. 0000-0002-1825-0097).');
    } finally {
      setOrcidLoading(false);
    }
  };

  const handleInsertOrcidWorks = () => {
    if (!orcidResult) return;
    const worksText = (orcidResult.recentPublications || [])
      .map(w => `${w.title} (${w.year}) ${w.doi ? '— DOI: ' + w.doi : ''}`)
      .join('\n');

    setEvidence(prev => ({
      ...prev,
      q1_q2_publications: prev.q1_q2_publications 
        ? `${prev.q1_q2_publications}\n${worksText}` 
        : worksText,
      supporting_urls: prev.supporting_urls 
        ? `${prev.supporting_urls}\nhttps://orcid.org/${orcidResult.orcid}`
        : `https://orcid.org/${orcidResult.orcid}`
    }));
  };

  const handleRefereeChange = (index, field, value) => {
    setReferees(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get('/awards');
        if (res.data.success) {
          setAwards(res.data.awards);
          if (!currentAwardId && res.data.awards.length > 0) {
            setCurrentAwardId(res.data.awards[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load awards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  const selectedAward = awards.find((a) => a.id === parseInt(currentAwardId)) || awards[0];

  const handleEvidenceChange = (e) => {
    const { name, value } = e.target;
    setEvidence(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuth('login');
      return;
    }

    if (!user.profile) {
      setError('Please complete your Professor Metrics Profile before submitting an award application.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const validReferees = referees.filter(r => r.name.trim() && r.email.trim());

      const payload = {
        award_id: selectedAward.id,
        supporting_evidence: {
          conferences_list: evidence.conferences_list.split('\n').filter(Boolean),
          regional_citations_spread: evidence.regional_citations_spread,
          q1_q2_publications: evidence.q1_q2_publications.split('\n').filter(Boolean),
          high_impact_publications: evidence.high_impact_publications.split('\n').filter(Boolean),
          grants_and_collaborations: evidence.grants_and_collaborations.split('\n').filter(Boolean),
          supervision_graduates: evidence.supervision_graduates,
          supporting_urls: evidence.supporting_urls.split('\n').filter(Boolean),
          referees: validReferees
        }
      };

      const res = await api.post('/awards/apply', payload);
      if (res.data.success) {
        const appId = res.data.application?.id;
        // Dispatch referee invitations via SMTP
        if (appId && validReferees.length > 0) {
          for (const ref of validReferees) {
            api.post(`/referees/application/${appId}/invite`, {
              refereeName: ref.name,
              refereeEmail: ref.email,
              refereeInstitution: ref.institution,
              refereeTitle: ref.title
            }).catch(e => console.error('Referee auto-invite error:', e));
          }
        }

        setSuccess(true);
        setTimeout(() => {
          setActiveTab('dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-soft-xl text-center space-y-4">
        <Award className="w-12 h-12 text-brand-600 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">Sign in to Submit Nomination</h3>
        <p className="text-xs text-slate-500">
          Nomination submissions require an authenticated scholar account linked to your academic institution.
        </p>
        <button
          onClick={() => openAuth('login')}
          className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Nomination Station</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Award Nomination Application
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit verifiable evidence matching the Evaluation Index for your chosen award tier.
        </p>
      </div>

      {/* Select Award Tier */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft-xl space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Select Award Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {awards.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setCurrentAwardId(a.id)}
              className={`p-4 rounded-2xl text-left border transition ${
                selectedAward?.id === a.id
                  ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-200 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-brand-600 block">
                {a.tier} TIER
              </span>
              <span className="text-sm font-bold block mt-1">{a.title}</span>
              <span className="text-xs text-amber-600 font-black mt-2 block">
                {a.award_value?.prize_amount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Immutability & Privacy Banner Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Important Application Integrity Notice:</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Submitted applications are completely private to reviewers and strictly immutable. Once submitted, your nomination entry is permanently locked for evaluation and cannot be edited by the applicant.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-emerald-950">Application Successfully Submitted!</h3>
          <p className="text-xs text-emerald-800">
            Your nomination has been locked and assigned to the Review Committee. Redirecting to your dashboard...
          </p>
        </div>
      )}

      {!success && selectedAward && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Supporting Evidence for {selectedAward.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Please enter citations, DOI links, or conference documentation.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Conferences Attended within the Last 3 Years (One per line) *
            </label>
            <textarea
              rows={3}
              required
              name="conferences_list"
              value={evidence.conferences_list}
              onChange={handleEvidenceChange}
              placeholder="e.g. Nigerian Society of Engineers Annual National Conference, Abuja (2025)&#10;West African Clean Energy Summit, Lagos (2024)"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:border-brand-500 focus:outline-hidden"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Regional / Continental Citation Spread Evidence *
            </label>
            <textarea
              rows={3}
              required
              name="regional_citations_spread"
              value={evidence.regional_citations_spread}
              onChange={handleEvidenceChange}
              placeholder="Detail citations from different regions (West, East, South, North) or continents with Google Scholar / Scopus corroboration..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-brand-500 focus:outline-hidden"
            ></textarea>
          </div>

          {/* Crossref DOI Auto-Validator & Inserter */}
          <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-slate-800">
                  Crossref DOI Auto-Verification Assistant
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                Official Crossref API
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Paste any Digital Object Identifier (DOI) to verify its indexing metadata and automatically generate verified citations for your application.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={doiInput}
                onChange={(e) => setDoiInput(e.target.value)}
                placeholder="e.g. 10.1038/s41586-020-2649-2 or https://doi.org/..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-brand-500 font-mono placeholder:text-slate-400"
              />
              <button
                type="button"
                disabled={doiLoading || !doiInput.trim()}
                onClick={handleVerifyDoi}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 shrink-0"
              >
                <span>{doiLoading ? 'Verifying...' : 'Verify DOI'}</span>
              </button>
            </div>

            {doiError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{doiError}</span>
              </div>
            )}

            {doiResult && (
              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-2 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified: {doiResult.journal} ({doiResult.year})</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs">{doiResult.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doiResult.authors}</p>
                    <span className="text-[10px] font-semibold text-brand-600 flex items-center gap-1 mt-1">
                      <BookOpen className="w-3 h-3 text-brand-600" />
                      <span>{doiResult.citations_count?.toLocaleString()} Crossref Citations recorded</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleInsertDoiCitation}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs shrink-0 flex items-center space-x-1"
                  >
                    <span>+ Insert into Dossier</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live ORCID iD Auto-Sync Assistant */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#a6ce39] text-white flex items-center justify-center text-[10px] font-bold">iD</span>
                <span className="text-xs font-bold text-slate-800">
                  ORCID Academic Profile & Works Auto-Sync
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#a6ce39]/20 text-[#4c6012]">
                Global Researcher ID
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Connect your verified ORCID iD to auto-import your academic biography, institutional affiliations, and recent publications directly into this dossier.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={orcidInput}
                onChange={(e) => setOrcidInput(e.target.value)}
                placeholder="e.g. 0000-0002-1825-0097 or https://orcid.org/..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 font-mono placeholder:text-slate-400"
              />
              <button
                type="button"
                disabled={orcidLoading || !orcidInput.trim()}
                onClick={handleVerifyOrcid}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 shrink-0"
              >
                <span>{orcidLoading ? 'Syncing...' : 'Sync via ORCID'}</span>
              </button>
            </div>

            {orcidError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{orcidError}</span>
              </div>
            )}

            {orcidResult && (
              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{orcidResult.fullName} ({orcidResult.orcid})</span>
                    </div>
                    {orcidResult.primaryAffiliation && (
                      <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{orcidResult.role ? orcidResult.role + ' at ' : ''}{orcidResult.primaryAffiliation}</span>
                      </p>
                    )}
                    <span className="text-[10px] font-semibold text-brand-600 flex items-center gap-1 mt-1">
                      <BookOpen className="w-3 h-3 text-brand-600" />
                      <span>{orcidResult.totalWorksCount} Total Publications indexed in ORCID registry</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleInsertOrcidWorks}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs shrink-0 flex items-center space-x-1"
                  >
                    <span>+ Append Works to Dossier</span>
                  </button>
                </div>
              </div>
            )}
          </div>


          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Q1 and Q2 Journal Publications (With DOIs, One per line) *
            </label>
            <textarea
              rows={3}
              required
              name="q1_q2_publications"
              value={evidence.q1_q2_publications}
              onChange={handleEvidenceChange}
              placeholder="e.g. Nature Energy (Q1, 2025) - DOI: 10.1038/s41560-025-0123-x&#10;Applied Energy (Q1, 2025) - DOI: 10.1016/j.apenergy.2025.119200"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:border-brand-500 focus:outline-hidden"
            ></textarea>
          </div>

          {selectedAward.tier === 'GLOBAL' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Publications in Journals with Impact Factor (IF) &gt; 10 in Evaluation Year
              </label>
              <textarea
                rows={2}
                name="high_impact_publications"
                value={evidence.high_impact_publications}
                onChange={handleEvidenceChange}
                placeholder="e.g. Nature (IF 64.8, 2025), Science (IF 56.9, 2024)"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:border-brand-500 focus:outline-hidden"
              ></textarea>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              5. Research Grants & Institutional Collaborations *
            </label>
            <textarea
              rows={3}
              required
              name="grants_and_collaborations"
              value={evidence.grants_and_collaborations}
              onChange={handleEvidenceChange}
              placeholder="List granting agencies, amounts, collaborative partner institutions across Africa or internationally..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-brand-500 focus:outline-hidden"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              6. Doctoral & Masters Supervision Summary *
            </label>
            <input
              type="text"
              required
              name="supervision_graduates"
              value={evidence.supervision_graduates}
              onChange={handleEvidenceChange}
              placeholder="e.g. 14 PhDs & 32 MSc graduates verified by Postgraduate School"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              7. Additional Supporting URLs / Scopus / Google Scholar Link
            </label>
            <textarea
              rows={2}
              name="supporting_urls"
              value={evidence.supporting_urls}
              onChange={handleEvidenceChange}
              placeholder="https://scholar.google.com/citations?user=...&#10;https://orcid.org/..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-brand-500 focus:outline-hidden"
            ></textarea>
          </div>

          {/* Section 8: Confidential Academic Referees */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-sm font-bold text-white">
                  8. Confidential Academic Referees & Peer Endorsement
                </h4>
              </div>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Institutional Validation
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Provide two distinguished academic peers (e.g. Dean, Vice-Chancellor, or international research collaborator). Upon dossier submission, our system will automatically email them a confidential zero-login evaluation link.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Referee 1 */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2.5">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Primary Academic Referee
                </div>
                <input
                  type="text"
                  placeholder="Full Name (e.g. Prof. Olanrewaju Bello)"
                  value={referees[0].name}
                  onChange={(e) => handleRefereeChange(0, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="email"
                  placeholder="Official Email (e.g. o.bello@university.edu)"
                  value={referees[0].email}
                  onChange={(e) => handleRefereeChange(0, 'email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Institution & Faculty"
                  value={referees[0].institution}
                  onChange={(e) => handleRefereeChange(0, 'institution', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Referee 2 */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2.5">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Secondary Academic Referee
                </div>
                <input
                  type="text"
                  placeholder="Full Name (e.g. Dr. Catherine Mutua)"
                  value={referees[1].name}
                  onChange={(e) => handleRefereeChange(1, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Official Email (e.g. c.mutua@uonbi.ac.ke)"
                  value={referees[1].email}
                  onChange={(e) => handleRefereeChange(1, 'email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Institution & Faculty"
                  value={referees[1].institution}
                  onChange={(e) => handleRefereeChange(1, 'institution', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-royal-700 to-brand-600 hover:from-royal-800 hover:to-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Submitting Application...' : 'Submit Nomination'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
