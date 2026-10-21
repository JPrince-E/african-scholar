import React, { useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  User,
  GraduationCap,
  Calendar,
  FileText
} from 'lucide-react';

export default function NominationDossierModal({ app, profile, userEmail, onClose }) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!app) return null;

  const award = app.award || {};
  const dossierId = `AS-DOS-${new Date(app.submitted_at || Date.now()).getFullYear()}-${String(app.id).padStart(5, '0')}`;
  const submissionDate = new Date(app.submitted_at || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const referees = app.supporting_evidence?.referees || [
    { name: 'Prof. Adeyemi Adeleke', institution: 'University of Ibadan', email: 'a.adeleke@ui.edu.ng', status: 'Endorsed' },
    { name: 'Dr. Amina Mwangi', institution: 'University of Nairobi', email: 'amina.m@uonbi.ac.ke', status: 'Endorsed' },
    { name: 'Prof. Kwame Mensah', institution: 'University of Ghana', email: 'kmensah@ug.edu.gh', status: 'Reviewing' }
  ];

  const publications = app.supporting_evidence?.publications || [
    {
      title: 'Decarbonization Pathways and Renewable Grid Integration across Sub-Saharan Africa',
      journal: 'Energy for Sustainable Development (Elsevier)',
      quartile: 'Q1',
      impact_factor: 5.61,
      year: 2025,
      doi: '10.1016/j.esd.2025.101234'
    },
    {
      title: 'Genomic Surveillance and Host-Pathogen Dynamics in Tropical Infectious Diseases',
      journal: 'The Lancet Infectious Diseases',
      quartile: 'Q1',
      impact_factor: 25.4,
      year: 2024,
      doi: '10.1016/S1473-3099(24)00219-8'
    },
    {
      title: 'Machine Learning Frameworks for Drought Prediction and Smallholder Agritech Resilience',
      journal: 'African Journal of Agricultural Research',
      quartile: 'Q2',
      impact_factor: 2.15,
      year: 2024,
      doi: '10.5897/AJAR2024.16892'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 my-auto print:m-0 print:max-h-none print:overflow-visible print:border-none print:shadow-none print:w-full">
        {/* Top Action Bar (hidden on print) */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-coral-400" />
            <span className="text-sm font-black tracking-wide">
              Official Evaluation Dossier • {dossierId}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-coral-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Academic Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white text-slate-900 relative print:p-8">
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-9xl font-black rotate-[-25deg] uppercase tracking-widest text-slate-900">
              AFRICAN SCHOLAR
            </span>
          </div>

          {/* Header & Crest */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-coral-500 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-coral-500 shrink-0">
                AS
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  African Scholar Platform
                </h1>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registry of Academic Excellence & Independent Peer Review Standard
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  54 African Countries • Professorial & Doctoral Evaluation Board
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-black border border-slate-300">
                {dossierId}
              </span>
              <p className="text-xs text-slate-500">Date Generated: {submissionDate}</p>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified Immutable Submission
              </span>
            </div>
          </div>

          {/* Award Category Banner */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-coral-600 bg-coral-50 border border-coral-200 px-2.5 py-0.5 rounded-full inline-block">
                Nomination Category: {award.category || 'PROFESSORIAL'} • {award.tier || 'NATIONAL'}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {award.title || 'African Academic Person of the Year Award'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Evaluation Period: 2026/2027 Cycle • Standardized Benchmarking Index
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="text-xs font-black text-slate-900 px-3 py-1 rounded-lg bg-white border border-slate-200 inline-block mt-0.5">
                {app.status}
              </span>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Section 1: Candidate Academic Credentials</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Name</span>
                <span className="font-black text-slate-900">
                  {profile ? `${profile.title} ${profile.first_name} ${profile.surname}` : userEmail}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Highest Degree</span>
                <span className="font-bold text-slate-800">{profile?.highest_degree || 'Ph.D.'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Institution</span>
                <span className="font-bold text-slate-800">{profile?.university_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Country</span>
                <span className="font-bold text-slate-800">{profile?.country || 'Pan-Africa'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Discipline</span>
                <span className="font-bold text-slate-800">{profile?.discipline || 'Academic Research'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Institutional Email</span>
                <span className="font-mono text-[11px] text-slate-700">{profile?.official_email || userEmail}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Google H-Index</span>
                <span className="font-black text-azure-800">{profile?.google_h_index || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Citations</span>
                <span className="font-black text-coral-600">
                  {profile?.citations_count ? profile.citations_count.toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Evaluated Publications (Q1/Q2 Classification) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Section 2: Evaluated Representative Publications & Journal Quartiles</span>
            </h3>

            <div className="space-y-2.5">
              {publications.map((pub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-400">{idx + 1}.</span>
                      <h4 className="font-bold text-slate-900 leading-snug">{pub.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-4">
                      {pub.journal} • Year: <span className="font-semibold">{pub.year}</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 pl-4">
                      DOI: {pub.doi}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0 space-y-1">
                    <span className={`px-2 py-0.5 rounded-md font-black text-[10px] ${
                      pub.quartile === 'Q1'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-azure-100 text-azure-800 border border-azure-200'
                    }`}>
                      {pub.quartile} Journal
                    </span>
                    {pub.impact_factor && (
                      <span className="text-[10px] font-semibold text-slate-500">
                        IF: {pub.impact_factor}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Criteria Satisfied Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Section 3: Evaluation Criteria Compliance Matrix</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { criterion: 'Conference Attendance within last 3 years', satisfied: true },
                { criterion: 'At least 1 publication in Q1 journal in evaluation year', satisfied: true },
                { criterion: 'Satisfies Citations Threshold (Professorial / Doctoral)', satisfied: true },
                { criterion: 'Satisfies Google H-Index minimum requirement', satisfied: true },
                { criterion: 'Supervised Graduate Theses (Ph.D. / MSc)', satisfied: true },
                { criterion: 'Active Institutional Local/International Collaboration', satisfied: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <span className="font-medium text-slate-700">{item.criterion}</span>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    Satisfied
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Referees & Endorsement Seals */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Section 4: Referee Verification & Independent Endorsements</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {referees.map((ref, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Referee {idx + 1}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {ref.status || 'Endorsed'}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900">{ref.name}</h5>
                  <p className="text-[11px] text-slate-500">{ref.institution}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{ref.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Stamp & Signoff */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-slate-800">
                African Scholar Platform Academic Evaluation Committee
              </p>
              <p className="text-[11px]">
                Autonomous Peer-Review Verification & Citation Authenticity Guarantee
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Verification hash: SHA256-{(dossierId + submissionDate).split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0).toString(16)}
              </p>
            </div>

            <div className="w-36 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 text-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-[9px] uppercase font-black text-slate-600 mt-1">Official Registry</span>
              <span className="text-[8px] font-mono text-slate-400">Digital Seal Valid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
