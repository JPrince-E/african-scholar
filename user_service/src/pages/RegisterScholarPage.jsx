import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  User,
  Building2,
  Award,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AFRICAN_COUNTRIES, fetchUniversitiesByCountry } from '../utils/africanData';

export default function RegisterScholarPage({ setActiveTab }) {
  const { user, openAuth, fetchCurrentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [externalUniversities, setExternalUniversities] = useState([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showTrialNotificationModal, setShowTrialNotificationModal] = useState(false);

  const isEditMode = Boolean(user && user.profile && (user.profile.id || user.profile.first_name));

  // Form State
  const [formData, setFormData] = useState({
    title: 'Full Prof',
    highest_degree: 'PhD',
    first_name: '',
    initials: '',
    surname: '',
    gender: 'Male',
    marital_status: 'Married',
    official_email: '',
    secondary_email: '',
    phone: '',
    university_name: '',
    campus: 'Main Campus',
    city: '',
    country: 'Nigeria',
    discipline: '',
    research_focus: '',
    nationality: 'Nigeria',
    hobbies: '',
    bio: '',
    avatar_url: '/default-avatar.svg',
    // Positions
    past_positions: [''],
    present_positions: [''],
    // Academic metrics (initialized as empty string so no stubborn zero)
    mentees_count: '',
    postdocs_count: '',
    phd_count: '',
    msc_count: '',
    honours_count: '',
    conferences_count: '',
    publications_count: '',
    citations_count: '',
    google_h_index: '',
    google_i10_index: '',
    // Milestones
    awards_count: '',
    grants_count: '',
    patents_count: '',
    // Community impact
    community_impact_activities: [''],
    fee_paid: true,
    paystack_reference: 'PROMO-2027-WAIVED'
  });

  // Pre-load existing profile if logged in
  useEffect(() => {
    if (user && user.profile) {
      const p = user.profile;
      setFormData({
        title: p.title || 'Full Prof',
        highest_degree: p.highest_degree || 'PhD',
        first_name: p.first_name || '',
        initials: p.initials || '',
        surname: p.surname || '',
        gender: p.gender || 'Male',
        marital_status: p.marital_status || 'Married',
        official_email: p.official_email || user.email,
        secondary_email: p.secondary_email || '',
        phone: p.phone || '',
        university_name: p.university_name || '',
        campus: p.campus || 'Main Campus',
        city: p.city || '',
        country: p.country || 'Nigeria',
        discipline: p.discipline || '',
        research_focus: p.research_focus || '',
        nationality: p.nationality || 'Nigeria',
        hobbies: p.hobbies || '',
        bio: p.bio || '',
        avatar_url: user.avatar_url || '/default-avatar.svg',
        past_positions: Array.isArray(p.past_positions) && p.past_positions.length ? p.past_positions : [''],
        present_positions: Array.isArray(p.present_positions) && p.present_positions.length ? p.present_positions : [''],
        mentees_count: p.mentees_count != null ? String(p.mentees_count) : '',
        postdocs_count: p.postdocs_count != null ? String(p.postdocs_count) : '',
        phd_count: p.phd_count != null ? String(p.phd_count) : '',
        msc_count: p.msc_count != null ? String(p.msc_count) : '',
        honours_count: p.honours_count != null ? String(p.honours_count) : '',
        conferences_count: p.conferences_count != null ? String(p.conferences_count) : '',
        publications_count: p.publications_count != null ? String(p.publications_count) : '',
        citations_count: p.citations_count != null ? String(p.citations_count) : '',
        google_h_index: p.google_h_index != null ? String(p.google_h_index) : '',
        google_i10_index: p.google_i10_index != null ? String(p.google_i10_index) : '',
        awards_count: p.awards_count != null ? String(p.awards_count) : '',
        grants_count: p.grants_count != null ? String(p.grants_count) : '',
        patents_count: p.patents_count != null ? String(p.patents_count) : '',
        community_impact_activities: Array.isArray(p.community_impact_activities) && p.community_impact_activities.length ? p.community_impact_activities : [''],
        fee_paid: true,
        paystack_reference: p.paystack_reference || 'PROMO-2027-WAIVED'
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        official_email: user.email,
        avatar_url: user.avatar_url || '/default-avatar.svg'
      }));
    }
  }, [user]);

  // Fetch official universities from external API when country changes
  useEffect(() => {
    let isMounted = true;
    if (formData.country) {
      setLoadingUniversities(true);
      fetchUniversitiesByCountry(formData.country)
        .then((unis) => {
          if (isMounted) {
            setExternalUniversities(unis || []);
            setLoadingUniversities(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingUniversities(false);
        });
    }
    return () => { isMounted = false; };
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow digits only; blank string when cleared so no stubborn zero remains
    const cleanValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, [name]: cleanValue }));
  };

  // Dynamic Array handlers
  const handleArrayItemChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field, maxLimit) => {
    if (formData[field].length < maxLimit) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    }
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updated = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: updated }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Immediately display preview with zero delay
    const localPreview = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar_url: localPreview }));
    setUploadingAvatar(true);

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/uploads', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.file_url) {
        setFormData(prev => ({ ...prev, avatar_url: res.data.file_url }));
      }
    } catch (err) {
      console.error('Upload failed, falling back to local Base64:', err);
      // Fallback base64 so profile save still persists the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuth('login');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Clean up empty strings in arrays & parse string counts to clean numbers
      const cleanedData = {
        ...formData,
        publications_count: parseInt(formData.publications_count, 10) || 0,
        citations_count: parseInt(formData.citations_count, 10) || 0,
        google_h_index: parseInt(formData.google_h_index, 10) || 0,
        google_i10_index: parseInt(formData.google_i10_index, 10) || 0,
        phd_count: parseInt(formData.phd_count, 10) || 0,
        msc_count: parseInt(formData.msc_count, 10) || 0,
        mentees_count: parseInt(formData.mentees_count, 10) || 0,
        postdocs_count: parseInt(formData.postdocs_count, 10) || 0,
        conferences_count: parseInt(formData.conferences_count, 10) || 0,
        honours_count: parseInt(formData.honours_count, 10) || 0,
        grants_count: parseInt(formData.grants_count, 10) || 0,
        patents_count: parseInt(formData.patents_count, 10) || 0,
        past_positions: formData.past_positions.filter(p => p.trim() !== ''),
        present_positions: formData.present_positions.filter(p => p.trim() !== ''),
        community_impact_activities: formData.community_impact_activities.filter(a => a.trim() !== '')
      };

      const isExistingProfile = Boolean(user && user.profile && (user.profile.id || user.profile.first_name));
      const res = await api.post('/profiles/me/profile', cleanedData);
      if (res.data.success) {
        await fetchCurrentUser();
        if (isExistingProfile || !res.data.is_new_registration) {
          setSuccessMessage('Scholar profile & metrics updated successfully!');
          setTimeout(() => {
            setActiveTab('dashboard');
          }, 1500);
        } else {
          // Brand new registration: Show 1-Year Free Trial notification modal which stays until the user clicks OK
          setSuccessMessage('Scholar registration saved successfully!');
          setShowTrialNotificationModal(true);
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-soft-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-azure-50 text-azure-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Scholar Registration Portal (Ph.D. & Professors)</h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Please log in or create an account with your university email address to register your academic achievements and nomination portfolio.
          </p>
        </div>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => openAuth('login')}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
          >
            Log In
          </button>
          <button
            onClick={() => openAuth('register')}
            className="px-6 py-3 rounded-xl btn-coral font-bold text-sm shadow-md transition"
          >
            Create Scholar Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step Tracker Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-azure-700 bg-azure-50 border border-azure-200/80 px-3 py-1 rounded-full w-fit mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEditMode ? 'Faculty Profile & Metrics Editor' : 'African Scholar Registration Wizard'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isEditMode ? 'Update Scholar Metrics & Faculty Profile' : 'Scholar Metrics & Profile Registration (Ph.D. & Professors)'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isEditMode
            ? 'Update your academic milestones, publications, and supervised degrees.'
            : 'Complete the official fields specified for the African Scholar faculty registry and annual academic awards.'}
        </p>

        {/* Active Free Trial Status for Existing Profile */}
        {isEditMode && user?.profile && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-azure-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950 text-xs shadow-xs">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>1-Year Free Trial Active:</strong> Started at registration on{' '}
                {new Date(user.profile.trial_started_at || user.profile.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                . Expires on{' '}
                <strong>
                  {new Date(user.profile.trial_expires_at || (new Date(user.profile.trial_started_at || user.profile.created_at || Date.now()).getTime() + 365*24*60*60*1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </strong>
                .
              </span>
            </div>
            <span className="shrink-0 font-extrabold px-3 py-1 rounded-xl bg-emerald-600 text-white shadow-xs">
              {user.profile.trial_days_remaining != null ? user.profile.trial_days_remaining : 365} Days Remaining
            </span>
          </div>
        )}

        {/* Step indicator pills */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
          {[
            { s: 1, label: 'Personal & Bio' },
            { s: 2, label: 'Institution & Roles' },
            { s: 3, label: 'Academic Metrics' },
            { s: 4, label: 'Impact & Submit' }
          ].map((item) => (
            <button
              key={item.s}
              onClick={() => setStep(item.s)}
              className={`p-3 rounded-2xl text-left transition-all border ${
                step === item.s
                  ? 'bg-azure-50 border-azure-500 ring-2 ring-azure-200 text-azure-900 shadow-xs'
                  : step > item.s
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Step 0{item.s}
              </span>
              <span className="text-xs font-extrabold truncate block mt-0.5">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-rose-800 text-sm font-semibold animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft-xl space-y-8">
        {/* STEP 1: PERSONAL & BIO */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <User className="w-5 h-5 text-azure-600" />
              <span>Section 1: Personal Details & Contact</span>
            </h3>

            {/* Avatar Upload */}
            <div className="flex items-center space-x-6">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-coral-500 shadow-md bg-slate-900 flex items-center justify-center shrink-0">
                <img
                  src={formData.avatar_url || '/default-avatar.svg'}
                  alt="avatar"
                  onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
                  className="w-full h-full object-cover"
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                    <span className="text-[9px] font-bold tracking-tight">Uploading...</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wider">
                  Profile Photo (Faculty Portrait)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-azure-50 file:text-azure-700 hover:file:bg-azure-100 cursor-pointer"
                  />
                  {formData.avatar_url && formData.avatar_url !== '/default-avatar.svg' && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar_url: '/default-avatar.svg' }))}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Reset to Default Avatar
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Default profile avatar is active until you upload an official faculty portrait.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                >
                  <option value="Dr">Dr</option>
                  <option value="Assistant Prof">Assistant Prof</option>
                  <option value="Associate Prof">Associate Prof</option>
                  <option value="Full Prof">Full Prof</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Highest Degree *
                </label>
                <select
                  name="highest_degree"
                  value={formData.highest_degree}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                >
                  <option value="PhD">PhD</option>
                  <option value="DSc">DSc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Babajide"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initials
                </label>
                <input
                  type="text"
                  name="initials"
                  value={formData.initials}
                  onChange={handleChange}
                  placeholder="e.g. B.O."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Surname *
                </label>
                <input
                  type="text"
                  required
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="e.g. Adebayo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Marital Status *
                </label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                >
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nationality (African Country) *
                </label>
                <select
                  required
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden bg-white"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work / Cell Phone (Optional)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="official_email"
                  value={formData.official_email}
                  onChange={handleChange}
                  placeholder="official.scholar@university.edu.ng"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Other Email Address/es
                </label>
                <input
                  type="email"
                  name="secondary_email"
                  value={formData.secondary_email}
                  onChange={handleChange}
                  placeholder="personal.scholar@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hobbies & Interests
              </label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="e.g. Chess, Botanical Photography, Classical Afrobeat"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Professional Bio (500 Words Max) *
              </label>
              <textarea
                rows={4}
                required
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Summarize your academic milestones, research interests, and career background..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
              ></textarea>
            </div>
          </div>
        )}

        {/* STEP 2: INSTITUTION & POSITIONS */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              <span>Section 2: University Affiliation & Positions Held</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country in Africa *
                </label>
                <select
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden bg-white"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    University / Institution *
                  </label>
                  {loadingUniversities && (
                    <span className="text-[10px] text-brand-600 font-semibold animate-pulse">
                      Loading {formData.country} universities...
                    </span>
                  )}
                </div>
                <input
                  list="external-universities-list"
                  type="text"
                  required
                  name="university_name"
                  value={formData.university_name}
                  onChange={handleChange}
                  placeholder={`Select or type university in ${formData.country}...`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
                <datalist id="external-universities-list">
                  {externalUniversities.map((u, i) => (
                    <option key={i} value={u} />
                  ))}
                </datalist>
                {externalUniversities.length > 0 && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {externalUniversities.length} official institutions loaded from External Universities API
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Ibadan / Nairobi / Accra"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Name
                </label>
                <input
                  type="text"
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  placeholder="e.g. Main Campus / Chiromo / Akoka"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Discipline / Faculty *
                </label>
                <input
                  type="text"
                  required
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  placeholder="e.g. Mechanical & Energy Engineering"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Research Focus *
                </label>
                <input
                  type="text"
                  required
                  name="research_focus"
                  value={formData.research_focus}
                  onChange={handleChange}
                  placeholder="e.g. Solar Thermal Harvesting, Bio-energy Systems"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Present Positions (max 3) */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Present Positions Held (Max 3)
                </label>
                {formData.present_positions.length < 3 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('present_positions', 3)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Present Position</span>
                  </button>
                )}
              </div>
              {formData.present_positions.map((pos, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pos}
                    onChange={(e) => handleArrayItemChange('present_positions', idx, e.target.value)}
                    placeholder={`Present Position ${idx + 1} (e.g. Dean, Faculty of Technology)`}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                  />
                  {formData.present_positions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('present_positions', idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Past Positions (max 10) */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Past Positions Held (Max 10)
                </label>
                {formData.past_positions.length < 10 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('past_positions', 10)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Past Position</span>
                  </button>
                )}
              </div>
              {formData.past_positions.map((pos, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pos}
                    onChange={(e) => handleArrayItemChange('past_positions', idx, e.target.value)}
                    placeholder={`Past Position ${idx + 1} (e.g. Head of Department of Mechanical Engineering 2015-2018)`}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                  />
                  {formData.past_positions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('past_positions', idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: ACADEMIC METRICS */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Award className="w-5 h-5 text-brand-600" />
              <span>Section 3: Academic / Research Achievements (Index Metrics)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Publications Count *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  required
                  name="publications_count"
                  value={formData.publications_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Citations Count *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  required
                  name="citations_count"
                  value={formData.citations_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Google H-Index *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  required
                  name="google_h_index"
                  value={formData.google_h_index}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden font-bold text-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Google i10-Index *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  required
                  name="google_i10_index"
                  value={formData.google_i10_index}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Ph.D.s Supervised *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="phd_count"
                  value={formData.phd_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  M.Sc.s Supervised *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="msc_count"
                  value={formData.msc_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Academic Mentees
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="mentees_count"
                  value={formData.mentees_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Postdoctoral Fellows
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="postdocs_count"
                  value={formData.postdocs_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Conferences / Workshops
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="conferences_count"
                  value={formData.conferences_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Academic Honours
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="honours_count"
                  value={formData.honours_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Research Grants Won
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="grants_count"
                  value={formData.grants_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1">
                  Patents Granted
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  name="patents_count"
                  value={formData.patents_count}
                  onChange={handleNumberChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: COMMUNITY IMPACT & CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Section 4: Social/Community Impact & Fee Confirmation</span>
            </h3>

            {/* 10 Recent activities max */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Social / Community Impact Activities (Max 10)
                </label>
                {formData.community_impact_activities.length < 10 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('community_impact_activities', 10)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Community Activity</span>
                  </button>
                )}
              </div>
              {formData.community_impact_activities.map((act, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={act}
                    onChange={(e) => handleArrayItemChange('community_impact_activities', idx, e.target.value)}
                    placeholder={`Recent impact activity ${idx + 1} (e.g. Deployed clean water tech to 15 rural communities)`}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:outline-hidden"
                  />
                  {formData.community_impact_activities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('community_impact_activities', idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Registration Fee & Paystack Confirmation */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Annual Scholar Registry Fee</h4>
                    <p className="text-xs text-slate-400">Regular fee: $1 / year</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">$0.00</span>
                  <span className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                    1st Year Promo
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-slate-300 pt-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                {isEditMode && user?.profile ? (
                  <div>
                    <p className="leading-relaxed text-emerald-300 font-bold">
                      1-Year Free Trial Active: {user.profile.trial_days_remaining != null ? user.profile.trial_days_remaining : 365} Days Remaining
                    </p>
                    <p className="text-slate-400 mt-1">
                      Your trial began on {new Date(user.profile.trial_started_at || user.profile.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} and remains valid until {new Date(user.profile.trial_expires_at || (new Date(user.profile.trial_started_at || user.profile.created_at || Date.now()).getTime() + 365*24*60*60*1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}.
                    </p>
                  </div>
                ) : (
                  <p className="leading-relaxed">
                    The African Scholar board has waived all registration fees for the inaugural 2027 academic cycle. Your 1-Year Free Trial starts immediately upon registration and will remain active for 365 days.
                  </p>
                )}
              </div>
            </div>

            {/* Acceptance of Terms Statement */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Acceptance of Terms & Policies</span>
              </div>
              <p className="leading-relaxed">
                By completing the registration process, participants acknowledge that they have read, understood, and agreed to the applicable{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className="font-bold text-coral-600 hover:underline"
                >
                  Terms and Conditions
                </button>
                {' '}(including the General Award Conditions and 70%/30% allocation) and the{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('privacy')}
                  className="font-bold text-azure-600 hover:underline"
                >
                  Privacy Policy
                </button>
                {' '}provided by Bluespectrum Innovative Limited.
              </p>
            </div>
          </div>
        )}

        {/* Navigation & Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl btn-azure text-white font-bold text-xs shadow-md flex items-center space-x-2 transition"
            >
              <span>Continue to Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl btn-coral text-white font-bold text-sm shadow-md flex items-center space-x-2 transition disabled:opacity-50"
            >
              <span>
                {submitting
                  ? (isEditMode ? 'Saving Updates...' : 'Saving Registration...')
                  : (isEditMode ? 'Save Updated Scholar Metrics (Ph.D. / Prof.)' : 'Complete Scholar Registration (Ph.D. / Prof.)')}
              </span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* 1-Year Free Trial Activation Modal (Persistent until user clicks OK) */}
      {showTrialNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-100 shadow-2xl text-center space-y-6 relative animate-scale-up my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
              <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Inaugural Benefit Active
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                1-Year Free Trial Activated!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Welcome to the African Scholar Registry. As an inaugural scholar, your annual membership fee of <span className="font-semibold line-through text-slate-400">$1.00</span> has been <span className="font-bold text-emerald-600">100% waived ($0.00)</span> for your first year.
              </p>
            </div>

            {/* Trial Expiry Details Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <span className="text-slate-600 font-semibold">Trial Duration:</span>
                <span className="font-extrabold text-emerald-800">365 Days (1 Full Year)</span>
              </div>
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <span className="text-slate-600 font-semibold">Start Date:</span>
                <span className="font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Expiry Date:</span>
                <span className="font-bold text-emerald-700">{new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Important Trial Information:</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-600">
                <li>Your trial begins today upon registration.</li>
                <li>You can track how many days you have left on your Scholar Dashboard at any time.</li>
                <li>Automated academic evaluation for National, African & Global awards is active.</li>
                <li>No payment, credit card, or renewal fee is required during this 1-year period.</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTrialNotificationModal(false);
                  setActiveTab('dashboard');
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-coral-600 hover:bg-coral-700 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition transform active:scale-98 flex items-center justify-center space-x-2"
              >
                <span>OK, Proceed to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
