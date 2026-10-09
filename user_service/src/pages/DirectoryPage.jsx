import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  Building2,
  Globe2,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
  GraduationCap,
  Briefcase,
  Share2,
  Mail,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import SponsorBanner from '../components/SponsorBanner';
import SidebarSponsorBanner from '../components/SidebarSponsorBanner';
import { AFRICAN_COUNTRIES, fetchUniversitiesByCountry } from '../utils/africanData';

export default function DirectoryPage() {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [countryUniversities, setCountryUniversities] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [sortBy, setSortBy] = useState('citations_count');

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    universities: [],
    disciplines: []
  });

  const fetchScholars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (country) params.append('country', country);
      if (university) params.append('university', university);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/profiles/directory?${params.toString()}`);
      if (res.data.success) {
        setScholars(res.data.scholars);
      }
    } catch (err) {
      console.error('Error loading scholars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/profiles/filter-options');
        if (res.data.success) {
          setFilterOptions(res.data);
        }
      } catch (err) {
        console.error('Error loading filters:', err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (country) {
      fetchUniversitiesByCountry(country).then((unis) => {
        if (isMounted) setCountryUniversities(unis || []);
      });
    } else {
      setCountryUniversities([]);
    }
    return () => { isMounted = false; };
  }, [country]);

  useEffect(() => {
    fetchScholars();
  }, [country, university, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchScholars();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountry('');
    setUniversity('');
    setSortBy('citations_count');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-azure-700 bg-azure-50 px-3 py-1 rounded-full mb-2 border border-azure-200/80">
            <Users className="w-3.5 h-3.5" />
            <span>Pan-African Academic Faculty</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Scholars & Professors Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified academic researchers across Nigeria, Kenya, Ghana, South Africa, and all African universities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Sorted by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-azure-500"
          >
            <option value="citations_count">Highest Citations</option>
            <option value="publications_count">Total Publications</option>
            <option value="google_h_index">Google H-Index</option>
          </select>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-soft-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-azure-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scholar by name, university, or research keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-azure-500 focus:ring-2 focus:ring-azure-100"
            />
          </div>
          <button
            type="submit"
            className="btn-coral px-6 py-2.5 text-sm"
          >
            Filter Directory
          </button>
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-azure-600" />
            <span>Refine by:</span>
          </div>

          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setUniversity('');
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="">All 54 African Countries</option>
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-hidden max-w-xs truncate"
          >
            <option value="">
              {countryUniversities.length > 0 ? `All Universities in ${country} (${countryUniversities.length})` : 'All Universities'}
            </option>
            {(countryUniversities.length > 0 ? countryUniversities : filterOptions.universities).map((u, i) => (
              <option key={i} value={u}>{u}</option>
            ))}
          </select>

          {(country || university || search) && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold transition flex items-center space-x-1 border border-rose-200"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Content with Sidebar Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Main Scholars Area */}
        <div className="flex-1 min-w-0 w-full">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-500">Querying faculty database...</p>
            </div>
          ) : scholars.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Scholars Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No professors matched your search criteria. Try removing filters or searching by a broader term.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-azure-50 text-azure-700 font-bold text-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholars.map((scholar) => (
                <div
                  key={scholar.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-xl hover:shadow-xl hover:border-azure-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Scholar Header */}
                    <div className="flex items-start space-x-4">
                      <img
                        src={scholar.user?.avatar_url || '/default-avatar.svg'}
                        alt={scholar.surname}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-azure-100 shadow-md group-hover:scale-105 transition bg-slate-900"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-azure-700 bg-azure-50 border border-azure-200 px-2.5 py-0.5 rounded-full inline-block">
                          {scholar.title} • {scholar.highest_degree}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                          {scholar.first_name} {scholar.surname}
                        </h3>
                        <p className="text-xs text-slate-500 truncate flex items-center mt-0.5">
                          <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                          <span>{scholar.university_name}</span>
                        </p>
                        <span className="text-[11px] font-medium text-emerald-700 flex items-center mt-0.5">
                          <Globe2 className="w-3 h-3 mr-1" />
                          {scholar.country} ({scholar.city})
                        </span>
                      </div>
                    </div>

                    {/* Discipline Tag */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Discipline & Focus</span>
                      <p className="font-semibold text-slate-800 truncate mt-0.5">{scholar.discipline}</p>
                      <p className="text-slate-500 text-[11px] truncate">{scholar.research_focus}</p>
                    </div>

                    {/* Metric Summary */}
                    <div className="grid grid-cols-4 gap-1.5 text-center pt-2">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">Citations</span>
                        <span className="text-xs font-black text-slate-900">{scholar.citations_count?.toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">Pubs</span>
                        <span className="text-xs font-black text-slate-900">{scholar.publications_count}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-azure-50">
                        <span className="text-[9px] font-bold uppercase text-azure-600 block">H-Index</span>
                        <span className="text-xs font-black text-azure-800">{scholar.google_h_index}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">i10</span>
                        <span className="text-xs font-black text-slate-900">{scholar.google_i10_index}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedScholar(scholar)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-coral-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
                    >
                      <span>View Comprehensive Bio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dedicated Sticky Sidebar for Sidebar Placements */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6 sticky top-24">
          <SidebarSponsorBanner placement="SIDEBAR" />

          {/* Quick African Scholar Fast-Facts Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-xl space-y-4">
            <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Pan-African Registry</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Faculty Verification Standards</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every listed faculty member undergoes institutional verification to showcase academic excellence across 54 African countries.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Visible Records</span>
              <span className="font-black text-brand-600">{scholars.length} Faculty</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Sponsor Banner */}
      <SponsorBanner placement="FOOTER" />

      {/* SCHOLAR PROFILE MODAL (With full document fields) */}
      {selectedScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto my-8">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Verified African Scholar Record
                </span>
              </div>
              <button
                onClick={() => setSelectedScholar(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Profile Intro Banner */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                <img
                  src={selectedScholar.user?.avatar_url || '/default-avatar.svg'}
                  alt={selectedScholar.surname}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-brand-100 shadow-xl bg-slate-900"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 font-extrabold text-xs">
                      {selectedScholar.title} ({selectedScholar.highest_degree})
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {selectedScholar.nationality}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {selectedScholar.marital_status}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 pt-1">
                    {selectedScholar.first_name} {selectedScholar.initials ? `${selectedScholar.initials} ` : ''}{selectedScholar.surname}
                  </h2>

                  <p className="text-sm font-semibold text-brand-700">
                    {selectedScholar.discipline}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedScholar.university_name} • {selectedScholar.campus || 'Main Campus'}, {selectedScholar.city}, {selectedScholar.country}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Biography</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedScholar.bio || 'No professional bio provided.'}
                </p>
              </div>

              {/* Academic Metrics Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic & Research Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-100">
                    <span className="text-[10px] uppercase font-bold text-brand-600 block">Total Citations</span>
                    <span className="text-lg font-black text-brand-900">{selectedScholar.citations_count?.toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Publications</span>
                    <span className="text-lg font-black text-indigo-900">{selectedScholar.publications_count}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Google H-Index</span>
                    <span className="text-lg font-black text-emerald-900">{selectedScholar.google_h_index}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">i10-Index</span>
                    <span className="text-lg font-black text-amber-900">{selectedScholar.google_i10_index}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">PhDs Graduated</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.phd_count || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">MScs Graduated</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.msc_count || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Mentees</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.mentees_count || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Postdocs</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.postdocs_count || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Conferences</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.conferences_count || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Patents</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.patents_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Positions Held */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Present Positions</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    {Array.isArray(selectedScholar.present_positions) && selectedScholar.present_positions.length > 0 ? (
                      selectedScholar.present_positions.map((pos, i) => (
                        <div key={i} className="text-xs font-semibold text-slate-800 flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                          <span>{pos}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">None specified</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Leadership Positions</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    {Array.isArray(selectedScholar.past_positions) && selectedScholar.past_positions.length > 0 ? (
                      selectedScholar.past_positions.map((pos, i) => (
                        <div key={i} className="text-xs font-semibold text-slate-700 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                          <span>{pos}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">None specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Community Impact Activities */}
              {Array.isArray(selectedScholar.community_impact_activities) && selectedScholar.community_impact_activities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social & Community Impact</h4>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                    {selectedScholar.community_impact_activities.map((act, i) => (
                      <div key={i} className="text-xs text-slate-800 flex items-start space-x-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies & Official Contact */}
              <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-3">
                <div>
                  <span className="font-bold text-slate-800">Hobbies / Interests: </span>
                  <span>{selectedScholar.hobbies || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-1 font-semibold text-brand-700">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedScholar.official_email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
