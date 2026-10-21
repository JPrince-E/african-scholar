import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Globe2,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  Clock,
  ChevronRight,
  UserCheck,
  Trash2,
  Scale,
  RefreshCw
} from 'lucide-react';

export default function PrivacyPolicyPage({ setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'summary', title: 'I. Summary of Our Processing Activities' },
    { id: 'definitions', title: 'II. Definitions' },
    { id: 'registration', title: 'III. Registration for Our Services' },
    { id: 'required-registration', title: 'IV. Information About Required Registration' },
    { id: 'third-party', title: 'V. Third Party Content & Social Media Plug-ins' },
    { id: 'sharing', title: 'VI. Information Sharing' },
    { id: 'usage-reports', title: 'VII. Usage Reports' },
    { id: 'security', title: 'VIII. Security' },
    { id: 'retention', title: 'IX. Data Retention' },
    { id: 'rights', title: 'X. Your Data Protection Rights' },
    { id: 'contact', title: 'XI. Contacting Us' },
    { id: 'amendments', title: 'XII. Amendments to This Policy' },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-azure-600 bg-azure-50 border border-azure-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-azure-600" />
            <span>Bluespectrum Innovative Limited • Data Protection Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            How African Scholar and Bluespectrum Innovative Limited collect, process, protect, and manage your personal data across our pan-African scholarly index.
          </p>
        </div>

        <div className="flex items-center space-x-3 print:hidden shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-coral-600 bg-coral-50 border border-coral-200 hover:bg-coral-100 transition shadow-xs"
          >
            <Scale className="w-3.5 h-3.5 text-coral-500" />
            <span>Terms & Conditions</span>
          </button>
        </div>
      </div>

      {/* Corporate Operator Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-azure-400">
            <Building2 className="w-4 h-4" />
            <span>Operating Entity & Controller</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Bluespectrum Innovative Limited
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            This contains the privacy policy (“policy”) for African Scholar which is run and provided by Bluespectrum Innovative Limited (we, us and our). We will only use the personal data gathered over this platform as set out in this policy as outlined below with what control and information rights you may have.
          </p>
        </div>

        <a
          href="https://bluespectruminnovative.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-extrabold text-slate-950 bg-azure-400 hover:bg-azure-300 transition shadow-lg shrink-0"
        >
          <span>Visit Bluespectrum Website</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="lg:col-span-1 print:hidden">
          <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-4 shadow-soft-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Contents
              </span>
              <span className="text-[10px] font-bold text-azure-600 bg-azure-50 px-2 py-0.5 rounded-full">
                12 Sections
              </span>
            </div>

            <nav className="space-y-1 text-xs">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-azure-600 hover:bg-slate-50 transition truncate block font-medium"
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-10">
          {/* SECTION I */}
          <section id="summary" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-5 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                I
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Summary of Our Processing Activities
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-4 leading-relaxed font-normal">
              <p>
                Our platform provides metadata on Africa scholars especially on professorial and doctorial metrics as well as their affiliations and their research activities on the continent of Africa. These are mainly available to subscribers or those that registered on the platform. Below is the summary of the data processing activities that might be undertaken on our platform.
              </p>

              <div className="space-y-2.5 pl-2 border-l-2 border-azure-400">
                <div className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-azure-600 shrink-0 mt-0.5" />
                  <span>When you visit our platform without setting up an account, only limited personal data will be required and processed.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-azure-600 shrink-0 mt-0.5" />
                  <span>Should you register on our platform, personal data will be processed in the scope of purpose of the registration.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-azure-600 shrink-0 mt-0.5" />
                  <span>Furthermore, your personal data might be used to provide you with relevant advertising for our platform services and opportunities and for statistical analysis that helps us to improve our platform. Additionally, we might improve your platform experience with third party content.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-azure-600 shrink-0 mt-0.5" />
                  <span>Your personal data may be disclosed to third parties where necessary that might be located outside your country of residence; potentially, different data protection standards might apply.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-azure-600 shrink-0 mt-0.5" />
                  <span>Appropriate safeguards have been implemented to secure your personal data and retain the data only as long as necessary.</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-azure-600 shrink-0 mt-0.5" />
                  <span>Where applicable/possible and under the applicable legislation to you, you might be able or entitled to exercise certain rights regarding the processing of your personal data.</span>
                </div>
              </div>

              <p>
                We use information collected mainly to assist us in providing an effective service through the platform and to collect broad demographic information for anonymised, aggregated use.
              </p>

              {/* Institutional / University Access IP Provision */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-azure-600" />
                  <span>Customer Organisation & University Network Access</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If your IP address or an equivalent identification method indicates that you are accessing our content through a customer organisation, such as a university, research institute, or company, we may collect information identifying that organisation. This information may be used to generate usage reports that provide the organisation with an overview of how frequently its students, staff, members, or employees access the content we publish. Such reports would generally not include information associated with individual user accounts or personal logins, except where you are a designated administrator for the organisation or where the organisation’s usage-based access agreement specifically requires the inclusion of such information.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION II */}
          <section id="definitions" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-5 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                II
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Definitions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-azure-50/50 border border-azure-200/80 space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-azure-700">
                  Defined Term
                </span>
                <h3 className="text-base font-bold text-slate-900">Personal Data</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Means any data relating to a natural person who can be identified (directly or indirectly), mainly by reference to an identifier such as a name, email address, an identification number, staff number, registration number, location data, or an online identifier.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Defined Term
                </span>
                <h3 className="text-base font-bold text-slate-900">Data Processing</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Means any operation that can transform personal data into understandable structure. These operations include data collection, recording, organisation, structuring, storage, adaptation or any kind of disclosure or other necessary form.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION III */}
          <section id="registration" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                III
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Registration for Our Services
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                Access to full platform content is provided to registered users by a personal account with us and authentication carried out as much as possible. The use of your personal data for behavioural advertising and profiling will be done with consent, and you can say no to the use of your personal data for direct marketing or advertising at any time. You can inform us about your objection by contacting our customer service accordingly.
              </p>
              <p>
                We might use your personal data including contact data provided during registration to inform you directly about our additional services and opportunities.
              </p>
              <p>
                Registration data and related data will be kept until such time as an account deletion request is implemented. Receiving such a request, we will remove your data as soon as possible not more than a year of request. Statutory storage obligations or the need for legal actions that might arise from wrongdoing within the services or payment issues can lead to a longer retention of your personal data. When this happens, you will be informed accordingly.
              </p>
            </div>
          </section>

          {/* SECTION IV */}
          <section id="required-registration" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-5 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                IV
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Information About the Required Registration
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">1. Platform</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  For the use of our platform, you must set up an account. Your customer account retains your personal data for future activities. Our Contractors/third parties will only use your personal data (when necessary) to the extent required to perform their functions and will be contractually bound in this regard to process your personal data only on our behalf and in compliance with our requests. You should be able to delete the personal data as well as the account in your account’s settings.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">2. Customer Service</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  You can contact us via different routes. If you contact us either by:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-semibold text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-azure-600" />
                    <span>e-mail</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-semibold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-azure-600" />
                    <span>telephone</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-semibold text-slate-800">
                    <MessageSquare className="w-3.5 h-3.5 text-azure-600" />
                    <span>Chat/messaging support</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-semibold text-slate-800">
                    <Globe2 className="w-3.5 h-3.5 text-azure-600" />
                    <span>Website communication or other routes</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  we will process the personal data appropriately to fulfil your request as legally allowed.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION V */}
          <section id="third-party" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                V
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Third Party Content & Social Media Plug-ins
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                This platform might contain links to third party websites and platforms like Facebook, X, YouTube, and Instagram. We are not responsible for the content and the data collection on respective third-party websites/platforms; please check the privacy policy of respective websites for information on respective websites’ data processing activities.
              </p>
            </div>
          </section>

          {/* SECTION VI */}
          <section id="sharing" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                VI
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Information Sharing
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                When necessary, where personal data are to be disclosed to third parties the legal basis for the transfer of your personal data will be complied with accordingly. In the event of contractors working with us on our platform/services, we might disclose personal data to contractors who assist us in providing/enhancing the services we offer through the platform. Such a transfer will be based on data processing agreements and legality. In this case, your personal data will only be used to the extent necessary to perform their functions and will be contractually bound to process your personal data only on our behalf and in compliance with the need of the platform or our requests.
              </p>
              <p>
                If we undergo re-organisation or bought over by a third party, any personal data we hold about you may be transferred to that new entity or third party in compliance with applicable law.
              </p>
              <p>
                Please note that the processing of personal data in a foreign country may be subject to the laws and regulations of that jurisdiction. Depending on the applicable legal framework, such data may be accessible to foreign government authorities, courts, law enforcement agencies, or regulatory bodies under certain circumstances. Where personal data is transferred to another country, we will take reasonable measures, as appropriate, to help ensure an adequate level of data protection, taking into account the applicable legal requirements and the circumstances of the transfer.
              </p>
              <p>
                We might have to disclose your personal data if legally entitled or required to do so (if required by law or injunction by a court order).
              </p>
            </div>
          </section>

          {/* SECTION VII */}
          <section id="usage-reports" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                VII
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Usage Reports
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                In order to properly portray our services to prospective buyers, partners, advertisers and other reputable third parties and for other lawful purposes like counter reports, we might have to disclose anonymous aggregate statistics about users of the platform, but these reports will include no personal data.
              </p>
            </div>
          </section>

          {/* SECTION VIII */}
          <section id="security" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                VIII
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Security
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                We take reasonable measures to protect the security and confidentiality of your personal information. Although we implement appropriate safeguards to reduce the risk of loss, unauthorised access, misuse, disclosure, or alteration of information, we cannot guarantee that such incidents will never occur.
              </p>
              <p>
                You should also be aware that the transmission of information over the internet is subject to inherent security risks. Accordingly, while we take reasonable steps to protect personal information during transmission, we cannot guarantee its absolute security while it is being transmitted through our Platform or over the internet. Any information you submit electronically is therefore transmitted subject to these inherent risks.
              </p>
            </div>
          </section>

          {/* SECTION IX */}
          <section id="retention" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                IX
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Data Retention
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                Our organisation aims to limit the processing and retention of personal data to what is reasonably necessary for the purposes for which it was collected. Unless specific retention periods are established in this policy, personal data will generally be retained only for as long as necessary to fulfil the relevant purpose, subject to any applicable statutory or regulatory retention requirements.
              </p>
            </div>
          </section>

          {/* SECTION X */}
          <section id="rights" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-6 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                X
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Your Data Protection Rights
              </h2>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Depending on the applicable data protection laws and the circumstances of the processing, you may be entitled to exercise some or all of the following rights in relation to your personal data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Right 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Right of access and information
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Request confirmation of whether we process or retain your personal data and, where applicable, obtain access to and a copy of that data. This may include information about the purposes of processing, the categories of personal data concerned, the recipients or categories of recipients, and the applicable data retention periods.
                </p>
              </div>

              {/* Right 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Right to rectification, erasure, or restriction of processing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Request the correction of inaccurate or incomplete personal data, the deletion of data where legally justified, or the restriction of its processing in circumstances permitted by applicable law. Such circumstances may include situations where the data is no longer necessary for its original purpose or where consent has been withdrawn, subject to any applicable legal requirements and exceptions.
                </p>
              </div>

              {/* Right 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Right to withdraw consent
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where the processing of your personal data is based on your consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing carried out before the withdrawal. You may also choose not to provide consent; however, this may affect our ability to provide certain services where consent is necessary.
                </p>
              </div>

              {/* Right 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Right to object to processing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where provided for under applicable law, you may object to the processing of your personal data on grounds relating to your particular circumstances. Please provide relevant details to help us assess your objection. Following our assessment, we will determine whether the processing should cease or whether there are compelling legitimate grounds or other lawful bases for continuing it, as permitted by applicable law.
                </p>
              </div>

              {/* Right 5 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Right to seek redress and lodge a complaint
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where you believe that your data protection rights have been infringed, you may be entitled to seek an appropriate legal remedy and lodge a complaint with the competent data protection supervisory authority, subject to the procedures and requirements of applicable law.
                </p>
              </div>

              {/* Right 6 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Right to data portability
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where applicable, you may request to receive the personal data you have provided to us in a structured, commonly used, and machine-readable format. You may also request that the data be transmitted to another data controller, where the relevant legal conditions are met and, where technically feasible, that it be transferred directly between controllers.
                </p>
              </div>

              {/* Right 7 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 md:col-span-2">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm text-azure-700">
                  Rights relating to automated decision-making and profiling
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where applicable under data protection law, you may have the right not to be subject to a decision based solely on automated processing, including profiling, if that decision produces legal effects concerning you or similarly significantly affects you. This right may be subject to specific conditions and exceptions under applicable law.
                </p>
              </div>
            </div>

            {/* How to exercise your rights */}
            <div className="p-5 rounded-2xl bg-azure-50/70 border border-azure-200 space-y-2">
              <h3 className="font-black text-slate-900 text-sm">
                How to Exercise Your Rights
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                You may submit a request to exercise any of the rights described above, or contact us with questions or complaints concerning our processing of your personal data, using the contact details provided below. We will assess and respond to your request in accordance with applicable data protection laws, including any relevant requirements, limitations, and response deadlines.
              </p>
            </div>
          </section>

          {/* SECTION XI */}
          <section id="contact" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                XI
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Contacting Us
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                Please submit any questions, concerns, or comments regarding this Privacy Policy, or any requests relating to your personal data, by email. Any personal information provided in connection with your enquiry will be processed for the purpose of responding to and managing your request. Once the request has been resolved, the information will generally be deleted, unless further retention is necessary to comply with applicable legal or statutory obligations. Where retention is required, the information may instead be subject to restricted processing for the period prescribed by the relevant requirements.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Data Protection Contact Email
                  </span>
                  <a
                    href="mailto:support@bluespectruminnovative.com"
                    className="text-sm font-bold text-azure-600 hover:text-azure-700 hover:underline"
                  >
                    support@bluespectruminnovative.com
                  </a>
                </div>
                <a
                  href="https://bluespectruminnovative.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-azure-600"
                >
                  <span>bluespectruminnovative.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* SECTION XII */}
          <section id="amendments" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-xl space-y-4 scroll-mt-28">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-azure-100 text-azure-700 flex items-center justify-center font-bold text-xs">
                XII
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Amendments to This Policy
              </h2>
            </div>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                We reserve the right to revise this Privacy Policy from time to time. Any updates will be published on our platform, and the revised version will take effect as specified in the updated policy. Users are encouraged to visit our website periodically to review the latest version and stay informed about any changes to our privacy practices.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
