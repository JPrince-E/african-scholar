import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Printer, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  ArrowRight,
  Award
} from 'lucide-react';
import LaureateCertificateModal from '../components/LaureateCertificateModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://african-scholar-api.onrender.com/api' : 'http://localhost:5000/api');

const VerifyCertificatePage = ({ setActiveTab }) => {
  // Extract code from URL if present (e.g. /verify/AS-2026-0001)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pathParts = pathname.split('/').filter(Boolean);
  const codeFromPath = pathParts[0] === 'verify' && pathParts[1] ? decodeURIComponent(pathParts[1]) : '';

  const [searchInput, setSearchInput] = useState(codeFromPath || '');
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState(null);
  const [showFullCert, setShowFullCert] = useState(false);

  const fetchVerification = async (queryCode) => {
    if (!queryCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/verify/${encodeURIComponent(queryCode.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setCertificateData(data.data);
      } else {
        setError(data.message || 'No registered academic record found for this credential code.');
        setCertificateData(null);
      }
    } catch (err) {
      console.error('Verification query failed:', err);
      setError('Unable to connect to the African Scholar Academic Registry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeFromPath) {
      fetchVerification(codeFromPath);
    } else {
      fetchVerification('AS-2026-0001');
    }
  }, [codeFromPath]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchVerification(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Banner (Academic Dark Header with Dot Pattern) */}
      <div className="hero-solid-bg bg-dot-pattern border-b border-slate-800 py-14 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden text-white">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-coral-500/10 border border-coral-500/30 text-coral-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-coral-400" />
            Official Continental Public Registry
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Academic Laureate & Credential Verification
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Verify the authenticity of African Scholar honors, laureate degrees, and institutional peer-review citations issued by the Continental Academic Council.
          </p>

          {/* Verification Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Credential Code (e.g. AS-2026-0001)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-azure-500/30 focus:border-azure-500 transition shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 btn-coral text-white font-bold rounded-xl transition shadow-md shadow-coral-500/20 disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Credential</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Verification Card Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center mb-8 shadow-xs">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-600">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-rose-800 mb-1">Credential Not Found</h3>
            <p className="text-rose-600 text-sm max-w-md mx-auto">{error}</p>
          </div>
        )}

        {certificateData && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            {/* Status Header */}
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-slate-50 border-b border-emerald-200/80 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-800 font-extrabold text-sm tracking-wide uppercase">
                      {certificateData.status}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      {certificateData.verificationCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Verified through the Pan-African Academic Credential Ledger
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullCert(true)}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>View Official Certificate</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                  title="Print Verification Dossier"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Print Record</span>
                </button>
              </div>
            </div>

            {/* Candidate & Award Details */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Scholar Information */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                  <div className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Conferred Laureate Recipient
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {certificateData.recipientName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-2">
                    <span className="flex items-center gap-1 font-medium text-slate-800">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {certificateData.institution}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Globe2 className="w-4 h-4 text-slate-500" />
                      {certificateData.country}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center sm:text-right min-w-[200px]">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Award Classification
                  </div>
                  <div className="text-sm font-bold text-amber-800">
                    {certificateData.awardTitle}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">
                    {certificateData.edition}
                  </div>
                </div>
              </div>

              {/* Official Citation */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Official Academic Citation
                </div>
                <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-5 relative">
                  <span className="text-amber-400/40 text-4xl font-serif absolute top-2 left-3 pointer-events-none">“</span>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed italic pl-6">
                    {certificateData.citation}
                  </p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Date Conferred
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {certificateData.dateConferred}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Conferring Body
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {certificateData.conferredBy}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Cryptographic Ledger Hash
                  </div>
                  <div className="text-xs font-mono text-emerald-700 font-semibold truncate" title={certificateData.blockchainStamp}>
                    {certificateData.blockchainStamp || '0x41532d32303236...'}
                  </div>
                </div>
              </div>

              {/* Signatories Footer */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {certificateData.signatories && certificateData.signatories.map((sig, i) => (
                    <div key={i} className="text-left">
                      <div className="font-serif italic text-slate-900 text-sm font-bold tracking-wide">
                        {sig.name}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {sig.role}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab ? setActiveTab('awards') : window.location.assign('/awards')}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1.5 transition"
                >
                  <span>Explore 2026 Laureates Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Certificate Modal */}
      {showFullCert && certificateData && (
        <LaureateCertificateModal
          isOpen={showFullCert}
          onClose={() => setShowFullCert(false)}
          laureateData={{
            recipientName: certificateData.recipientName,
            institution: certificateData.institution,
            country: certificateData.country,
            awardTitle: certificateData.awardTitle,
            tier: certificateData.tier,
            citation: certificateData.citation,
            edition: certificateData.edition,
            certificateCode: certificateData.verificationCode,
            dateConferred: certificateData.dateConferred,
            prizeAmount: '$15,000 USD'
          }}
        />
      )}
    </div>
  );
};

export default VerifyCertificatePage;
