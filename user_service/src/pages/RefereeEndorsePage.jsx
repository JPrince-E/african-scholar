import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building2, Globe2, CheckCircle2, XCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://african-scholar-api.onrender.com/api' : 'http://localhost:5000/api');

const RefereeEndorsePage = ({ setActiveTab }) => {
  // Extract token from URL (e.g. /endorse/abc123token)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pathParts = pathname.split('/').filter(Boolean);
  const token = pathParts[0] === 'endorse' && pathParts[1] ? pathParts[1] : '';

  const [loading, setLoading] = useState(true);
  const [endorsementData, setEndorsementData] = useState(null);
  const [error, setError] = useState(null);


  // Form state
  const [rigorScore, setRigorScore] = useState(9);
  const [impactScore, setImpactScore] = useState(9);
  const [leadershipScore, setLeadershipScore] = useState(9);
  const [comments, setComments] = useState('');
  const [letterUrl, setLetterUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchEndorsement = async () => {
      if (!token) {
        setError('Missing or invalid endorsement token.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/referees/endorse/${token}`);
        const data = await res.json();
        if (data.success && data.endorsement) {
          setEndorsementData(data.endorsement);
          if (data.endorsement.status === 'SUBMITTED') {
            setSubmitted(true);
          }
        } else {
          setError(data.message || 'Endorsement invitation not found or has expired.');
        }
      } catch (err) {
        console.error('Endorsement fetch failed:', err);
        setError('Failed to connect to the endorsement registry. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchEndorsement();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim() && !letterUrl.trim()) {
      alert('Please provide your confidential endorsement comments or attach a recommendation letter link.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/referees/endorse/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings: {
            academicRigor: rigorScore,
            continentalImpact: impactScore,
            leadership: leadershipScore
          },
          confidential_comments: comments,
          recommendation_letter_url: letterUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit endorsement. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Securing Confidential Academic Endorsement Session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
            <XCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Invalid Endorsement Session</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => setActiveTab ? setActiveTab('landing') : window.location.assign('/')}
            className="inline-block px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition"
          >
            Return to African Scholar
          </button>
        </div>
      </div>
    );
  }

  const candidate = endorsementData?.candidate || {};

  return (
    <div className="min-h-screen hero-solid-bg bg-dot-pattern text-white font-sans selection:bg-coral-500 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-coral-500/10 border border-coral-500/30 text-coral-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-coral-400" />
            <span>Confidential Peer Review System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Academic Referee Endorsement
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Pan-African Academic Honors & Laureate Selection Committee
          </p>
        </div>

        {/* Candidate Dossier Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            Candidate Nominated For Consideration
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {candidate.name || 'Scholar Candidate'}
              </h2>
              <div className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4 text-slate-400" /> {candidate.institution}</span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1"><Globe2 className="w-4 h-4 text-slate-400" /> {candidate.country}</span>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Award Tier</div>
              <div className="text-sm font-bold text-amber-300">{candidate.awardTitle}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">Referee:</span>
            <span>{endorsementData.referee_name} ({endorsementData.referee_email})</span>
            {endorsementData.referee_institution && (
              <span className="text-slate-500">— {endorsementData.referee_institution}</span>
            )}
          </div>
        </div>

        {/* Success Confirmation State */}
        {submitted ? (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-8 sm:p-10 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Endorsement Successfully Recorded
            </h3>
            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              Thank you for contributing your esteemed academic evaluation. Your confidential feedback has been transmitted securely to the Continental Academic Jury.
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 max-w-md mx-auto text-xs text-slate-400 font-mono mb-6">
              Submission Timestamp: {new Date().toLocaleString()}
            </div>
            <button
              onClick={() => setActiveTab ? setActiveTab('landing') : window.location.assign('/')}
              className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Visit African Scholar Portal
            </button>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Confidential Candidate Assessment Rubric
              </h3>
              <p className="text-xs text-slate-400">
                Rate the candidate on a scale of 1 (Low) to 10 (World-Leading) across the three continental evaluation pillars.
              </p>
            </div>

            {/* Pillar 1 */}
            <div className="bg-slate-900/50 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-200">
                  1. Scientific Rigor, Originality & Methodological Quality
                </label>
                <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                  {rigorScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={rigorScore}
                onChange={(e) => setRigorScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/50 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-200">
                  2. Continental Relevance, Societal Impact & SDG Alignment
                </label>
                <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                  {impactScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={impactScore}
                onChange={(e) => setImpactScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/50 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-200">
                  3. Academic Mentorship, Institutional Leadership & Ethics
                </label>
                <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                  {leadershipScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={leadershipScore}
                onChange={(e) => setLeadershipScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Statement Textarea */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Confidential Recommendation Statement <span className="text-coral-400">*</span>
              </label>
              <textarea
                rows={5}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Please state how long you have known the candidate and summarize their intellectual contributions, notable achievements, and why they merit this prestigious continental honor..."
                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-azure-500/50 focus:border-azure-500 transition leading-relaxed"
                required
              />
            </div>

            {/* Letterhead Link */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1">
                Institutional Letterhead Document Link (Optional)
              </label>
              <p className="text-xs text-slate-400 mb-2">
                If you have a formal signed PDF on university letterhead, you may paste a secure Google Drive, Dropbox, or institutional repository URL here.
              </p>
              <input
                type="url"
                value={letterUrl}
                onChange={(e) => setLetterUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... or institutional link"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-azure-500/50 focus:border-azure-500 transition"
              />
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-900/70 border border-slate-700/70 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Confidentiality Guarantee:</strong> This submission is strictly confidential and will only be reviewed by appointed members of the Continental Academic Jury. It will not be shared with the nominee.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 btn-coral text-white font-bold rounded-xl text-base transition shadow-lg shadow-coral-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Transmitting Confidential Endorsement...</span>
                </>
              ) : (
                <span>Submit Confidential Recommendation</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RefereeEndorsePage;
