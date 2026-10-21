import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  Megaphone,
  Award,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  Building2,
  DollarSign,
  Radio,
  Printer,
  ChevronRight
} from 'lucide-react';

export default function TermsPage({ setActiveTab, initialSection = 'all' }) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-coral-600 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full">
            <Scale className="w-3.5 h-3.5 text-coral-500" />
            <span>African Scholar Legal & Regulatory Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-600">
            Binding legal provisions governing Advertisements, Sponsorships, Partnerships, and Academic Awards.
          </p>
        </div>

        <div className="flex items-center space-x-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Document</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-azure-600 bg-azure-50 border border-azure-200 hover:bg-azure-100 transition shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-azure-600" />
            <span>Privacy Policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="flex flex-wrap gap-2 print:hidden border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSection === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Terms & Conditions
        </button>
        <button
          onClick={() => setActiveSection('advertising')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeSection === 'advertising'
              ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Advertising, Sponsorships & Partnerships (T&Cs)</span>
        </button>
        <button
          onClick={() => setActiveSection('awards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeSection === 'awards'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>General Award Conditions</span>
        </button>
      </div>

      {/* SECTION 1: ADVERTISING TERMS AND CONDITIONS */}
      {(activeSection === 'all' || activeSection === 'advertising') && (
        <section id="advertising-terms" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-coral-500 flex items-center justify-center text-white shadow-md shadow-coral-500/25">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-coral-600">
                  Section 1
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Advertising Terms and Conditions (T&Cs)
                </h2>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Commercial & Promotional Standard</span>
            </div>
          </div>

          {/* Official Core Statement */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="absolute top-4 right-4 text-slate-700 pointer-events-none">
              <Scale className="w-20 h-20 opacity-20" />
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-coral-400">
              <CheckCircle2 className="w-4 h-4 text-coral-400" />
              <span>Official Enforceable Policy</span>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium font-serif italic">
              “The T&Cs shall apply to all Sponsorships (S), Partnerships (P) and Advertisements (A) with African Scholar Platform. Any “S”, “P” and “A” with African Scholar Platform shall not be deemed to come into effect unless and until either confirmed in writing by African Scholar Platform or after signing an MOU and the first “S”, “P” and “A” appears in the relevant section of the platform. By contacting African Scholar with “S”, “P” and “A”, the Customer/Client agrees to be bound by these T&Cs and the Rates offered, even if it is acting as agent or buyer for the actual advertiser/organisation. For the avoidance of doubt, the Customer/Client’s standard terms and conditions of purchase (or any other standard terms and conditions) shall not be applicable.”
            </p>
          </div>

          {/* Detailed Legal Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-700 flex items-center justify-center font-bold text-xs">
                S • P • A
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Scope of Application</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies comprehensively to all commercial bookings, institutional sponsorship packages, academic foundation partnerships, conference banners, and sponsored profiles published across the African Scholar web and mobile ecosystem.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                MOU
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Effective Commencement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No agreement enters into legal effect until written confirmation is executed by African Scholar Platform or an official Memorandum of Understanding (MOU) is bilateral signed, followed by the first placement appearing live on the platform.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                REP
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Agency & Representative Liability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Any media agency, PR firm, or broker contacting African Scholar on behalf of a third-party brand or academic organization is fully and jointly bound by these T&Cs and the officially quoted billing rates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                LAW
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Supersession of Customer Terms</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For the avoidance of any doubt, all boilerplate terms of purchase or standard vendor terms originating from the client or agency are expressly negated and inapplicable to African Scholar engagements.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-coral-50/60 border border-coral-200">
            <div className="flex items-center space-x-3">
              <Megaphone className="w-5 h-5 text-coral-600 shrink-0" />
              <p className="text-xs text-slate-700 font-medium">
                Ready to sponsor academic excellence or showcase an educational conference?
              </p>
            </div>
            <button
              onClick={() => setActiveTab('landing')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-coral-500 hover:bg-coral-600 transition shadow-xs shrink-0"
            >
              <span>Explore Sponsorship Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* SECTION 2: GENERAL AWARD CONDITIONS */}
      {(activeSection === 'all' || activeSection === 'awards') && (
        <section id="award-conditions" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/25">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">
                  Section 2
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  General Award Conditions
                </h2>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Laureate & Candidate Regulations</span>
            </div>
          </div>

          {/* The 4 Core Condition Points */}
          <div className="space-y-6">
            {/* Point 1: Award types/categories */}
            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Award Types & Categories
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  There are two (2) categories of the awards. The Professorial category and the Doctoral (PhD) category.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Professorial Category</span>
                      <span className="text-[11px] text-slate-500">Full, Associate & Emeriti University Professors</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral-500"></span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Doctoral (PhD) Category</span>
                      <span className="text-[11px] text-slate-500">Doctoral scholars, PhD holders & Postdoctoral fellows</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Point 2: Awards arrangements */}
            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Awards Arrangements & Adjustments
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  Award organiser and sponsor may make reasonable adjustments to the award schedule, speakers, venue, award benefits or program structure where necessary in line with available funds. Participants will be informed of significant changes where practicable.
                </p>
              </div>
            </div>

            {/* Point 3: Registration benefits (70% directly to beneficiary, 30% for research) */}
            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Registration Benefits & Fund Allocation
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  Registration benefits are intended for the registered participant (only registered individual can compete for the awards). It should be used in accordance with the applicable awards terms. Misuse may result in applicable cancellation and refund policy.
                </p>

                {/* Statutory Allocation Breakdown */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <span>Award Financial Disbursement Ratio</span>
                    <span className="text-emerald-700">100% Total Award Endowment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start space-x-3">
                      <div className="text-2xl font-black text-emerald-700">70%</div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950 uppercase">Direct Beneficiary Allocation</h4>
                        <p className="text-xs text-emerald-800 leading-snug mt-0.5">
                          Disbursed directly to the designated laureate beneficiary.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-azure-50 border border-azure-300 flex items-start space-x-3">
                      <div className="text-2xl font-black text-azure-700">30%</div>
                      <div>
                        <h4 className="text-xs font-bold text-azure-950 uppercase">Research Activities Fund</h4>
                        <p className="text-xs text-azure-800 leading-snug mt-0.5">
                          Earmarked specifically to fund ongoing academic research, laboratory investigation, and scientific publication activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Point 4: Acceptance of terms */}
            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Acceptance of Terms
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  By completing the registration process, participants acknowledge that they have read, understood, and agreed to the applicable terms and conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Notice to Awardees and Participants */}
          <div className="rounded-2xl border-2 border-azure-200 bg-azure-50/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-azure-600 flex items-center justify-center text-white shadow-md">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-azure-700">
                  Important Operational Notice
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Notice to Awardees and Participants
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-medium">
              <p>
                In the event of natural disasters, travel restrictions, or other unforeseen circumstances that may affect awardee’s/participants’ ability to attend the conference in person, virtual participation options may be provided, where feasible. Information on accessing the virtual platform, if applicable, will be communicated approximately two months before the conference.
              </p>
              <p>
                The award platform will be updated regularly with information regarding any changes to the event format, applicable safety measures, and other important announcements. Awardees or participants are encouraged to check the platform periodically for the latest information and updates.
              </p>
            </div>

            <div className="pt-3 border-t border-azure-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-azure-900">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-azure-600" />
                <span>Virtual Platform Briefing: approx. 2 months prior to ceremony</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-azure-600" />
                <span>Continual safety & schedule updates on platform</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-slate-700 font-medium">
                Ready to review the award evaluation indices or submit a candidature?
              </p>
            </div>
            <button
              onClick={() => setActiveTab('awards')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs shrink-0"
            >
              <span>View Academic Awards Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
