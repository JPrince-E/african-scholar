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
  DollarSign
} from 'lucide-react';
import api from '../services/api';

const AD_PRICING_PLANS = [
  {
    tier: 'HOURLY',
    name: 'Hourly Flash Spotlight',
    price: '$2',
    unit: '/ hour',
    subtitle: 'Flexible hours per day during peak continental traffic',
    bestFor: 'Event countdowns, live symposiums & product launches',
    popular: false,
    color: 'from-amber-500/10 to-orange-500/20 border-amber-300',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    features: [
      'Choose specific hours per day (e.g. 9am - 3pm)',
      'Top sticky placement across scholar search pages',
      'Instant click-through tracking & analytics',
      'Real-time traffic multiplier during keynote hours'
    ]
  },
  {
    tier: 'DAILY',
    name: 'Daily Showcase',
    price: '$15',
    unit: '/ 24 hrs',
    subtitle: 'Full 24-hour persistent banner placement',
    bestFor: 'Conference calls for papers & single-day workshops',
    popular: false,
    color: 'from-blue-500/10 to-azure-500/20 border-blue-300',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    features: [
      '24-Hour continuous homepage banner exposure',
      'Featured placement in Scholar Directory sidebar',
      'Over 40,000+ daily page views across Africa',
      'Instant activation upon editorial review'
    ]
  },
  {
    tier: 'WEEKLY',
    name: 'Weekly Campaign',
    price: '$80',
    unit: '/ 7 days',
    subtitle: '7 days high-frequency multi-portal display',
    bestFor: 'Academic book launches & university grant announcements',
    popular: false,
    color: 'from-emerald-500/10 to-teal-500/20 border-emerald-300',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    features: [
      '7 days uninterrupted multi-portal billboard placement',
      'Featured in Continental Rankings & Award pages',
      'Includes custom promotional tagline & direct link',
      'Weekly performance impressions report'
    ]
  },
  {
    tier: 'MONTHLY',
    name: 'Monthly Premium Showcase',
    price: '$250',
    unit: '/ month',
    subtitle: '30 days flagship presence + email newsletter spot',
    bestFor: 'EdTech platforms, scientific equipment & journals',
    popular: true,
    color: 'from-brand-500/15 to-indigo-500/20 border-brand-400',
    badgeColor: 'bg-brand-600 text-white border-brand-600',
    features: [
      '30 days priority rotation across all 54 African countries',
      'Spotlight placement in monthly scholar newsletter',
      'Dedicated sponsor profile with high-res banner',
      'Direct lead capture & social link integration'
    ]
  },
  {
    tier: 'YEARLY',
    name: 'Annual Flagship Partner',
    price: '$2,400',
    unit: '/ year',
    subtitle: '365 days permanent co-branded continental partnership',
    bestFor: 'Pan-African corporations, banks & research councils',
    popular: false,
    color: 'from-purple-500/10 to-pink-500/20 border-purple-300',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    features: [
      '365 days permanent hero banner & laureate insignia',
      'Co-branded annual award ceremony recognition',
      'Unlimited promotional updates & copy revisions',
      'VIP passes to annual Continental Laureate Gala'
    ]
  }
];

export default function AdvertisementShowcase() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('MONTHLY');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [inquiryForm, setInquiryForm] = useState({
    business_name: '',
    contact_name: '',
    contact_email: '',
    website_url: '',
    pricing_tier: 'MONTHLY',
    banner_image_url: '',
    message: ''
  });

  const fetchActiveAds = async () => {
    try {
      const res = await api.get('/sponsors');
      if (res.data.success && res.data.sponsors) {
        setSponsors(res.data.sponsors);
      }
    } catch (err) {
      console.error('Failed to load active sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveAds();
  }, []);

  const handleOpenInquiry = (tier = 'MONTHLY') => {
    setSelectedPlan(tier);
    setInquiryForm(prev => ({ ...prev, pricing_tier: tier }));
    setSuccessMsg('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.post('/sponsors/inquire', inquiryForm);
      if (res.data.success) {
        setSuccessMsg('Your advertisement campaign request has been submitted! Our admin team is reviewing your placement.');
        setTimeout(() => {
          fetchActiveAds();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit advertising request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-12 py-10">
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
          Reach over <strong>1.5 Million+</strong> university professors, doctoral scholars (Ph.D.), academic deans, and research decision-makers across all 54 African countries.
        </p>
      </div>

      {/* Pricing Packages Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {AD_PRICING_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.tier;
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
                  onClick={() => handleOpenInquiry(plan.tier)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                    plan.popular
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Book {plan.tier} Ad</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Featured Business Advertisements (Managed via Admin Panel) */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Current Featured Advertisers & Sponsors</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Active Business Campaigns on African Scholar
            </h3>
          </div>
          <button
            onClick={() => handleOpenInquiry('MONTHLY')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center space-x-2 shrink-0"
          >
            <Megaphone className="w-4 h-4" />
            <span>Place Your Business Here</span>
          </button>
        </div>

        {sponsors.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No live partner ads at this moment. Click "Place Your Business Here" to be featured!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsors.slice(0, 3).map((sponsor) => (
              <div
                key={sponsor.id}
                className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition group"
              >
                <div>
                  <div className="h-40 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={sponsor.banner_image_url}
                      alt={sponsor.sponsor_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                        {sponsor.pricing_tier || 'SPONSORED'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {sponsor.sponsor_name}
                    </h4>
                    {sponsor.business_description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {sponsor.business_description}
                      </p>
                    )}
                    {sponsor.duration_details && (
                      <span className="text-[10px] text-slate-400 block pt-1">
                        ⏱ Campaign Duration: {sponsor.duration_details}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {sponsor.redirect_url && (
                    <a
                      href={sponsor.redirect_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>Visit Partner Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry & Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-600 tracking-wider">
                  Partner With African Scholar
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Book Advertising Campaign
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Request Received!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">{successMsg}</p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.business_name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, business_name: e.target.value })}
                    placeholder="e.g. Cambridge Scholarly Instruments Ltd."
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
                      value={inquiryForm.contact_name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, contact_name: e.target.value })}
                      placeholder="e.g. Dr. Ngozi Okafor"
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
                      value={inquiryForm.contact_email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, contact_email: e.target.value })}
                      placeholder="ads@yourcompany.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Website / Redirect Link
                    </label>
                    <input
                      type="url"
                      value={inquiryForm.website_url}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, website_url: e.target.value })}
                      placeholder="https://yourbusiness.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Selected Pricing Package *
                    </label>
                    <select
                      value={inquiryForm.pricing_tier}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, pricing_tier: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                    >
                      <option value="HOURLY">Hourly ($2 / hr - Select hours per day)</option>
                      <option value="DAILY">Daily ($15 / day - 24 hours)</option>
                      <option value="WEEKLY">Weekly ($80 / week - 7 days)</option>
                      <option value="MONTHLY">Monthly ($250 / month - 30 days)</option>
                      <option value="YEARLY">Yearly ($2,400 / year - 365 days)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Banner Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={inquiryForm.banner_image_url}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, banner_image_url: e.target.value })}
                    placeholder="https://yourdomain.com/banner.png or leave blank"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Campaign Details & Preferred Hours/Dates
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Tell us about the promotion, target dates, or peak hours per day you want your ad shown..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-brand-500"
                  />
                </div>

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
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition flex items-center space-x-2 shadow-md shadow-brand-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Submit Ad Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
