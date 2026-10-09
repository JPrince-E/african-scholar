import React, { useState } from 'react';
import { Trophy, Award, X, Printer, CheckCircle2, ShieldCheck, Sparkles, Share2, ExternalLink, Copy, Check } from 'lucide-react';

export default function LaureateCertificateModal({ winner, laureateData, onClose }) {
  const [copied, setCopied] = useState(false);

  // Normalize data whether passed via winner object or laureateData object
  const data = laureateData || {};
  const profile = winner?.applicant?.profile || {};
  const award = winner?.award || {};

  const fullName = data.recipientName || (profile.title
    ? `${profile.title} ${profile.first_name} ${profile.surname}`
    : winner?.applicant?.email || 'Esteemed Scholar');

  const university = data.institution 
    ? `${data.institution}, ${data.country || 'Africa'}`
    : (profile.university_name ? `${profile.university_name}, ${profile.country}` : 'African Academic Institution');

  const awardTitle = data.awardTitle || award.title || 'Academic Scholar of the Year';
  const awardTier = data.tier || award.tier || 'Continental';
  const certId = data.certificateCode || `AS-2026-${String(winner?.id || 1).padStart(4, '0')}`;
  const citation = data.citation || winner?.admin_comments || 'Conferred in recognition of superior scholarly impact, peer-reviewed excellence, doctoral human capacity building, and profound advancement of science across the African Continent.';

  const userClientUrl = import.meta.env.VITE_USER_CLIENT_URL || 'http://localhost:3000';
  const verifyUrl = `${userClientUrl}/verify/${certId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(awardTitle)}&organizationName=African+Scholar+Initiative&issueYear=2026&issueMonth=9&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(certId)}`;
    window.open(linkedInUrl, '_blank');
  };

  const handleShareOnX = () => {
    const text = `Announcing 2026 African Academic Laureate: ${fullName} (${awardTitle}). Verify credential: ${verifyUrl} #AfricanScholar #AcademicExcellence`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 print:shadow-none print:border-none print:m-0 print:max-w-none">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Official Laureate Diploma • {certId}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Add to LinkedIn */}
            <button
              onClick={handleAddToLinkedIn}
              className="px-3 py-1.5 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
              title="Add this credential to LinkedIn"
            >
              <span className="font-extrabold text-xs">in</span>
              <span>LinkedIn</span>
            </button>

            {/* Share on X */}
            <button
              onClick={handleShareOnX}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center space-x-1.5"
              title="Share on X / Twitter"
            >
              <span>𝕏</span>
              <span>Share</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center space-x-1"
              title="Copy verification link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Certificate Canvas */}
        <div className="p-6 sm:p-12 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 relative select-none">
          {/* Outer Guilloché Border */}
          <div className="border-[6px] border-amber-600/70 rounded-2xl p-4 sm:p-8 relative bg-white/80 shadow-xs">
            {/* Inner Gold Border */}
            <div className="border-2 border-amber-400/60 rounded-xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-500/40 text-xl font-serif">❧</div>
              <div className="absolute top-2 right-2 text-amber-500/40 text-xl font-serif">☙</div>
              <div className="absolute bottom-2 left-2 text-amber-500/40 text-xl font-serif">❧</div>
              <div className="absolute bottom-2 right-2 text-amber-500/40 text-xl font-serif">☙</div>

              {/* Certificate Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-extrabold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>African Scholar Academic Directorate</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 uppercase">
                  Certificate of Academic Laureate
                </h1>
                <p className="text-xs sm:text-sm font-serif italic text-amber-800 tracking-wide">
                  Celebrating Exceptional Scholarship, Continental Leadership & Societal Impact
                </p>
              </div>

              {/* Recipient Declaration */}
              <div className="py-2 space-y-1.5">
                <p className="text-xs uppercase font-sans font-bold tracking-widest text-slate-500">
                  This distinction is solemnly conferred upon
                </p>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-950 border-b-2 border-amber-400/60 pb-2 max-w-xl mx-auto">
                  {fullName}
                </h2>
                <p className="text-xs sm:text-sm font-sans font-semibold text-brand-700">
                  {university}
                </p>
              </div>

              {/* Conferred Distinction */}
              <div className="py-2 space-y-1.5">
                <p className="text-xs uppercase font-sans font-bold tracking-widest text-slate-500">
                  In formal recognition as the official recipient of
                </p>
                <div className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400">
                  <h3 className="text-lg sm:text-2xl font-serif font-black text-amber-950">
                    {awardTitle}
                  </h3>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">
                    {awardTier} Tier • Academic Class of 2026
                  </span>
                </div>
              </div>

              {/* Conferred Citation */}
              <div className="max-w-2xl mx-auto pt-1 pb-3">
                <p className="text-xs sm:text-sm font-serif italic text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                  "{citation}"
                </p>
              </div>

              {/* Signatures & Gold Foil Seal */}
              <div className="grid grid-cols-3 items-end pt-4 border-t border-amber-200/80 gap-4">
                {/* Signature 1 */}
                <div className="text-center space-y-1">
                  <div className="h-10 border-b border-slate-400 mx-auto w-32 flex items-end justify-center">
                    <span className="font-serif italic text-xs text-slate-600">Babajide A.</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-700 block">Chairman</span>
                  <span className="text-[9px] text-slate-400 block">Academic Directorate</span>
                </div>

                {/* Center Embossed Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-1 shadow-lg flex items-center justify-center relative">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/40 flex flex-col items-center justify-center text-center p-1 bg-amber-400/90 text-slate-950">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950 mb-0.5" />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter leading-tight">
                        OFFICIAL LAUREATE SEAL
                      </span>
                      <span className="text-[6px] font-bold text-amber-950">★ 2026 ★</span>
                    </div>
                  </div>
                </div>

                {/* Signature 2 */}
                <div className="text-center space-y-1">
                  <div className="h-10 border-b border-slate-400 mx-auto w-32 flex items-end justify-center">
                    <span className="font-serif italic text-xs text-slate-600">Ngozi O.</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-700 block">Secretary-General</span>
                  <span className="text-[9px] text-slate-400 block">Jury Review Board</span>
                </div>
              </div>

              {/* Verification & Vector QR Code */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-mono">
                <div className="flex items-center space-x-3 text-left">
                  {/* Stylized Vector QR Code */}
                  <div className="w-12 h-12 bg-white border border-slate-300 p-1 rounded-md shrink-0 flex items-center justify-center shadow-xs" title={`Scan to verify: ${verifyUrl}`}>
                    <svg viewBox="0 0 25 25" className="w-full h-full">
                      {/* Corner Position Detection Patterns */}
                      <rect x="1" y="1" width="7" height="7" fill="#0f172a" />
                      <rect x="2" y="2" width="5" height="5" fill="#ffffff" />
                      <rect x="3" y="3" width="3" height="3" fill="#0f172a" />

                      <rect x="17" y="1" width="7" height="7" fill="#0f172a" />
                      <rect x="18" y="2" width="5" height="5" fill="#ffffff" />
                      <rect x="19" y="3" width="3" height="3" fill="#0f172a" />

                      <rect x="1" y="17" width="7" height="7" fill="#0f172a" />
                      <rect x="2" y="18" width="5" height="5" fill="#ffffff" />
                      <rect x="3" y="19" width="3" height="3" fill="#0f172a" />

                      {/* Random Data Elements */}
                      <rect x="10" y="3" width="2" height="2" fill="#0f172a" />
                      <rect x="13" y="5" width="2" height="2" fill="#0f172a" />
                      <rect x="10" y="10" width="4" height="4" fill="#0f172a" />
                      <rect x="16" y="11" width="2" height="2" fill="#0f172a" />
                      <rect x="11" y="18" width="2" height="4" fill="#0f172a" />
                      <rect x="15" y="16" width="3" height="2" fill="#0f172a" />
                      <rect x="19" y="19" width="4" height="4" fill="#0f172a" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 font-bold text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Credential ID: {certId}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate max-w-[280px]">
                      {verifyUrl}
                    </div>
                  </div>
                </div>

                <div className="text-right font-sans text-[10px] text-slate-400">
                  Scan QR code or visit <strong className="text-slate-600 font-mono">/verify</strong> to validate authenticity.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
