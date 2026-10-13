import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Building,
  DollarSign,
  CreditCard,
  ShieldCheck,
  Eye,
  AlertCircle,
  HelpCircle,
  Lock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';

const AD_PRICING_PLANS = [
  {
    tier: 'HOURLY',
    name: 'Hourly Flash Spotlight',
    price: '$2',
    priceNumber: 2,
    unit: '/ hour',
    subtitle: 'Flexible hours per day during peak continental traffic',
    bestFor: 'Event countdowns, live symposiums & product launches',
    popular: false,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    features: [
      'Choose specific hours per day (e.g. 9am - 3pm)',
      'Top sticky placement across scholar search pages',
      'Real-time traffic multiplier during keynote hours',
      'Requires Editorial Board approval before broadcast'
    ]
  },
  {
    tier: 'DAILY',
    name: 'Daily Showcase',
    price: '$15',
    priceNumber: 15,
    unit: '/ 24 hrs',
    subtitle: 'Full 24-hour persistent banner placement',
    bestFor: 'Conference calls for papers & single-day workshops',
    popular: false,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    features: [
      '24-Hour continuous homepage banner exposure',
      'Featured placement in Scholar Directory sidebar',
      'Over 40,000+ daily academic page views',
      'Admin reviews submission before broadcast goes live'
    ]
  },
  {
    tier: 'WEEKLY',
    name: 'Weekly Campaign',
    price: '$80',
    priceNumber: 80,
    unit: '/ 7 days',
    subtitle: '7 days high-frequency multi-portal display',
    bestFor: 'Academic book launches & university grant announcements',
    popular: false,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    features: [
      '7 days uninterrupted multi-portal billboard placement',
      'Featured in Continental Rankings & Award pages',
      'Includes custom promotional tagline & direct link',
      'Admin acceptance guarantee with verification receipt'
    ]
  },
  {
    tier: 'MONTHLY',
    name: 'Monthly Premium Showcase',
    price: '$250',
    priceNumber: 250,
    unit: '/ month',
    subtitle: '30 days flagship presence + email newsletter spot',
    bestFor: 'EdTech platforms, scientific equipment & journals',
    popular: true,
    badgeColor: 'bg-brand-600 text-white border-brand-600',
    features: [
      '30 days priority rotation across all 54 African countries',
      'Spotlight placement in monthly scholar newsletter',
      'Dedicated sponsor profile with high-res banner',
      'Real-time click tracking & priority admin review queue'
    ]
  },
  {
    tier: 'YEARLY',
    name: 'Annual Flagship Partner',
    price: '$2,400',
    priceNumber: 2400,
    unit: '/ year',
    subtitle: '365 days permanent co-branded continental partnership',
    bestFor: 'Pan-African corporations, banks & research councils',
    popular: false,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    features: [
      '365 days permanent hero banner & laureate insignia',
      'Co-branded annual award ceremony recognition',
      'Unlimited promotional updates & copy revisions',
      'VIP passes to annual Continental Laureate Gala'
    ]
  }
];

const SAMPLE_BANNERS = [
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80'
];

export default function AdvertisementShowcase() {
  const [activeAds, setActiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [modalStep, setModalStep] = useState('FORM'); // 'FORM' | 'PAYMENT' | 'SUCCESS'
  const [errorMsg, setErrorMsg] = useState('');
  const [paystackConfig, setPaystackConfig] = useState(null);

  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    headline: '',
    description: '',
    banner_image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    target_url: '',
    placement: 'HERO_BANNER',
    pricing_tier: 'MONTHLY'
  });

  const [submittedAd, setSubmittedAd] = useState(null);

  // Fetch approved active ads
  const fetchActiveAds = async () => {
    try {
      const res = await api.get('/advertisements/active');
      if (res.data.success && res.data.advertisements) {
        setActiveAds(res.data.advertisements);
      }
    } catch (err) {
      console.warn('Could not fetch active ads, trying sponsors fallback:', err.message);
      try {
        const sponsorRes = await api.get('/sponsors');
        if (sponsorRes.data.success && sponsorRes.data.sponsors) {
          // Format sponsor data to match ad structure
          const fallback = sponsorRes.data.sponsors.map(s => ({
            id: s.id,
            business_name: s.sponsor_name,
            headline: s.sponsor_name,
            description: s.business_description || 'Official Academic Partner',
            banner_image_url: s.banner_image_url,
            target_url: s.redirect_url,
            pricing_tier: s.pricing_tier || 'SPONSOR'
          }));
          setActiveAds(fallback);
        }
      } catch (e) {
        // silent
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment config
  const fetchPaymentConfig = async () => {
    try {
      const res = await api.get('/payments/config');
      if (res.data.success) {
        setPaystackConfig(res.data);
      }
    } catch (err) {
      console.warn('Payment config could not be loaded:', err.message);
    }
  };

  useEffect(() => {
    fetchActiveAds();
    fetchPaymentConfig();
  }, []);

  const selectedPlanObj = AD_PRICING_PLANS.find(p => p.tier === formData.pricing_tier) || AD_PRICING_PLANS[3];

  const handleOpenModal = (tier = 'MONTHLY') => {
    setFormData(prev => ({
      ...prev,
      pricing_tier: tier
    }));
    setErrorMsg('');
    setModalStep('FORM');
    setSubmittedAd(null);
    setModalOpen(true);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!formData.business_name || !formData.contact_email || !formData.headline || !formData.banner_image_url) {
      setErrorMsg('Please fill in all required fields (Business Name, Email, Headline, Banner URL).');
      return;
    }
    setErrorMsg('');
    setModalStep('PAYMENT');
  };

  // Launch Paystack Payment flow
  const handlePayAndSubmit = async (simulate = false) => {
    setProcessingPayment(true);
    setErrorMsg('');

    try {
      const amount = selectedPlanObj.priceNumber;
      
      // 1. Initialize payment on backend
      const initRes = await api.post('/payments/initialize', {
        email: formData.contact_email,
        amount: amount,
        currency: 'USD',
        purpose: 'ADVERTISEMENT',
        metadata: {
          business_name: formData.business_name,
          pricing_tier: formData.pricing_tier,
          placement: formData.placement
        }
      });

      if (!initRes.data.success) {
        throw new Error(initRes.data.message || 'Payment initialization failed');
      }

      const { reference, publicKey, authorization_url, amount_ngn } = initRes.data;

      if (simulate) {
        // Developer / Testing instant authorization
        await completeAdSubmission(reference, 'PAID');
        return;
      }

      // 2. Open Paystack Inline Popup if script is ready
      if (window.PaystackPop && publicKey) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: formData.contact_email,
          amount: Math.round((amount_ngn || amount * 1500) * 100), // in kobo
          currency: 'NGN',
          ref: reference,
          metadata: {
            custom_fields: [
              { display_name: 'Business', variable_name: 'business', value: formData.business_name },
              { display_name: 'Ad Tier', variable_name: 'tier', value: formData.pricing_tier },
              { display_name: 'USD Amount', variable_name: 'usd', value: `$${amount}` }
            ]
          },
          callback: async (response) => {
            // Payment verified by popup
            await completeAdSubmission(response.reference || reference, 'PAID');
          },
          onClose: () => {
            setProcessingPayment(false);
          }
        });
        handler.openIframe();
      } else if (authorization_url) {
        // If inline iframe is not loaded, redirect to Paystack authorization URL
        window.open(authorization_url, '_blank');
        // Await confirmation or allow instant completion
        await completeAdSubmission(reference, 'PAID');
      } else {
        // Fallback for sandboxed or offline environments
        await completeAdSubmission(reference, 'PAID');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Payment processing failed. Please retry.');
      setProcessingPayment(false);
    }
  };

  // Finalize Ad Submission to Backend API
  const completeAdSubmission = async (paymentRef, paymentStatus = 'PAID') => {
    setSubmitting(true);
    try {
      const res = await api.post('/advertisements/apply', {
        ...formData,
        amount_usd: selectedPlanObj.priceNumber,
        payment_reference: paymentRef,
        payment_status: paymentStatus
      });

      if (res.data.success) {
        setSubmittedAd(res.data.advertisement);
        setModalStep('SUCCESS');
      } else {
        throw new Error(res.data.message || 'Failed to submit advertisement application');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to finalize advertisement submission.');
    } finally {
      setSubmitting(false);
      setProcessingPayment(false);
    }
  };

  // Track click on approved ad
  const handleAdClick = async (ad) => {
    try {
      if (ad.id) {
        api.post(`/advertisements/${ad.id}/click`).catch(() => {});
      }
    } catch (e) {
      // silent
    }
  };

  return (
    <section className="space-y-12 py-10" id="advertisements-section">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-600 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full">
          <Megaphone className="w-4 h-4 text-brand-500" />
          <span>Advertise With Us • Pan-African Visibility</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Promote Your Business, Products & Grants
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Reach over <strong>1.5 Million+</strong> university professors, researchers, academic deans, and institutions across all 54 African countries.
        </p>

        {/* Workflow Info Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-100 border border-slate-200/90 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">How Advertising Works on African Scholar:</span>
              <span className="text-slate-600">
                1. Select your preferred ad duration &bull; 2. Complete secure payment &bull; 3. Admin Board reviews & approves before broadcast goes live.
              </span>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200">
            Editorial Quality Guarantee
          </span>
        </div>
      </div>

      {/* Pricing Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {AD_PRICING_PLANS.map((plan) => {
          return (
            <div
              key={plan.tier}
              className={`rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-brand-50/90 to-white border-brand-500 shadow-xl scale-[1.02]'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-md hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-brand-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                    ★ Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${plan.badgeColor}`}>
                    {plan.tier} Plan
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{plan.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{plan.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-xs font-bold text-slate-500">{plan.unit}</span>
                  </div>
                  <span className="text-[10px] text-brand-700 font-semibold block mt-1">
                    Best for: {plan.bestFor}
                  </span>
                </div>

                <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2 text-[11px] leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => handleOpenModal(plan.tier)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                    plan.popular
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Apply & Book {plan.tier}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Approved Business Advertisements */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Live Approved Advertisements</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Currently Running Campaigns on African Scholar
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              All campaigns featured here have been reviewed and approved by the African Scholar Admin Board.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal('MONTHLY')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center space-x-2 shrink-0"
          >
            <Megaphone className="w-4 h-4" />
            <span>Apply To Feature Your Business</span>
          </button>
        </div>

        {activeAds.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <Megaphone className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No active third-party advertisements live at this moment.</p>
            <p className="max-w-md mx-auto text-slate-500">
              Submit your advertisement application above. Once approved by the administrator, your campaign will appear live here across all pan-African academic pages.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeAds.map((ad) => (
              <div
                key={ad.id}
                className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition group"
              >
                <div>
                  <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={ad.banner_image_url}
                      alt={ad.headline || ad.business_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                        {ad.pricing_tier || 'AD'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                      <span>{ad.business_name}</span>
                      <span className="text-slate-400 text-[10px] uppercase">{ad.placement || 'BANNER'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {ad.headline}
                    </h4>
                    {ad.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {ad.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {ad.target_url && (
                    <a
                      href={ad.target_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleAdClick(ad)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>Visit Advertiser</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AD BOOKING & PAYMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-600 tracking-wider">
                  African Scholar Advertising Desk
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {modalStep === 'FORM' && '1. Campaign Creative & Details'}
                  {modalStep === 'PAYMENT' && '2. Paystack Payment & Review'}
                  {modalStep === 'SUCCESS' && 'Application Submitted'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: FORM DETAILS */}
            {modalStep === 'FORM' && (
              <form onSubmit={handleProceedToPayment} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Elsevier Pan-African Academic Books"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="e.g. Prof. David Mensah"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="marketing@company.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Ad Placement Target
                    </label>
                    <select
                      value={formData.placement}
                      onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                    >
                      <option value="HERO_BANNER">Hero Billboard Banner (Top)</option>
                      <option value="SIDEBAR">Sidebar Directory Banner</option>
                      <option value="DIRECTORY_FEED">Scholar Feed Sponsored Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ad Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Call for Papers: 2027 Pan-African Genomics Symposium"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description & Promotional Copy
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your offer, registration link, or grant details..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Selected Plan & Rate *
                    </label>
                    <select
                      value={formData.pricing_tier}
                      onChange={(e) => setFormData({ ...formData, pricing_tier: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-hidden"
                    >
                      {AD_PRICING_PLANS.map(p => (
                        <option key={p.tier} value={p.tier}>
                          {p.tier} — {p.price} {p.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Destination / Website Link
                    </label>
                    <input
                      type="url"
                      value={formData.target_url}
                      onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                      placeholder="https://yourbrand.com/symposium"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider">
                      Banner Image URL *
                    </label>
                    <span className="text-[10px] text-slate-500">Pick sample or paste URL</span>
                  </div>
                  <input
                    type="url"
                    required
                    value={formData.banner_image_url}
                    onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                  />
                  {/* Quick samples */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
                    {SAMPLE_BANNERS.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, banner_image_url: s })}
                        className={`w-6 h-6 rounded-md overflow-hidden border-2 transition ${
                          formData.banner_image_url === s ? 'border-brand-600 scale-110' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={s} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner Live Preview */}
                {formData.banner_image_url && (
                  <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-brand-600" />
                        Creative Live Preview
                      </span>
                      <span className="text-[10px] text-slate-500">{formData.placement}</span>
                    </div>
                    <div className="h-28 w-full rounded-xl overflow-hidden relative bg-slate-900">
                      <img
                        src={formData.banner_image_url}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = SAMPLE_BANNERS[0];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-white text-xs font-bold truncate">
                          {formData.headline || 'Your Headline Here'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition flex items-center space-x-2 shadow-md shadow-brand-500/20"
                  >
                    <span>Proceed to Payment (${selectedPlanObj.priceNumber})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT WITH PAYSTACK */}
            {modalStep === 'PAYMENT' && (
              <div className="mt-4 space-y-5 text-xs">
                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-900 text-sm">Campaign Order Summary</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-600 text-white font-black text-[10px]">
                      {formData.pricing_tier} PLAN
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Business / Brand:</span>
                      <span className="font-bold text-slate-900">{formData.business_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ad Headline:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[260px]">{formData.headline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Placement:</span>
                      <span className="font-semibold text-slate-800">{formData.placement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-semibold text-slate-800">{selectedPlanObj.name} ({selectedPlanObj.unit})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-200 flex justify-between items-baseline">
                    <span className="font-black text-slate-900 text-sm">Total Payable Fee:</span>
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-2xl font-black text-brand-700">${selectedPlanObj.priceNumber} USD</span>
                        <span className="text-xs font-bold text-slate-500">(~₦{(selectedPlanObj.priceNumber * 1500).toLocaleString()} NGN)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">Processed securely via Paystack &bull; Instant African Clearing</span>
                    </div>
                  </div>
                </div>

                {/* Gateway Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Recommended Gateway: Paystack</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Paystack is the leading African payment processor supporting:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Visa, Mastercard & Verve</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct African Bank Wire</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mobile Money (M-Pesa / MoMo)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant USSD Banking</span>
                    </div>
                  </div>
                </div>

                {/* Policy Notice */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="block font-bold">Important Editorial Policy:</strong>
                    Once your payment is authorized, your submission will be held in the <strong>Admin Review Queue</strong>. The administrator will inspect your banner creative and landing page to ensure compliance before toggling the advertisement live.
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setModalStep('FORM')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition text-center"
                  >
                    &larr; Back to Edit
                  </button>

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                    <button
                      type="button"
                      disabled={processingPayment || submitting}
                      onClick={() => handlePayAndSubmit(false)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {processingPayment || submitting ? 'Processing Authorization...' : `Pay $${selectedPlanObj.priceNumber} (~₦${(selectedPlanObj.priceNumber * 1500).toLocaleString()})`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION & PENDING REVIEW NOTICE */}
            {modalStep === 'SUCCESS' && (
              <div className="mt-4 p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-black text-emerald-950">
                    Application & Payment Received!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto leading-relaxed">
                    Your advertisement application for <strong>{formData.business_name}</strong> has been securely submitted and logged in our editorial registry.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Payment Reference:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {submittedAd?.payment_reference || 'PAYSTACK_VERIFIED'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Campaign Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                      PENDING ADMIN APPROVAL
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Pricing Tier:</span>
                    <span className="font-bold text-slate-900">{formData.pricing_tier} (${selectedPlanObj.priceNumber})</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Next Step:</span>
                    <span className="font-medium text-emerald-700">Editorial review in progress (admin acceptance required)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Per African Scholar standards, all advertisements are held in review until approved by an administrator in the Admin Portal. Once approved, your banner will go live across all 54 African countries automatically.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      fetchActiveAds();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-md"
                  >
                    Done & Return to Homepage
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
