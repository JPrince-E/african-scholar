import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
  Briefcase,
  Share2,
  Mail,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import api from '../services/api';
import SponsorBanner from '../components/SponsorBanner';
import SidebarSponsorBanner from '../components/SidebarSponsorBanner';
import { AFRICAN_COUNTRIES, fetchUniversitiesByCountry } from '../utils/africanData';

export const isAcademicVerified = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase();
  return lower.includes('.edu') || lower.includes('.ac.') || lower.includes('.org') || lower.includes('.gov');
};

const AFRICAN_HUBS = [
  'Nigeria',
  'South Africa',
  'Egypt',
  'Kenya',
  'Ghana',
  'Uganda',
  'Ethiopia',
  'Morocco',
  'Rwanda',
  'Senegal'
];

const CITATION_TIERS = [
  { id: '', label: 'All Citation Ranks' },
  { id: '10000', label: '10,000+ Citations (Elite)' },
  { id: '5000', label: '5,000+ Citations' },
  { id: '1000', label: '1,000+ Citations' },
  { id: 'H20', label: 'H-Index 20+ High Impact' }
];

function TrajectoryChart({ citations = 0, publications = 0 }) {
  const years = [2022, 2023, 2024, 2025, 2026];
  const c = Math.max(citations || 0, 40);
  const p = Math.max(publications || 0, 5);

  const citPoints = [
    Math.round(c * 0.38),
    Math.round(c * 0.52),
    Math.round(c * 0.69),
    Math.round(c * 0.85),
    c
  ];

  const width = 560;
  const height = 130;
  const padX = 45;
  const padY = 20;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const maxCit = Math.max(...citPoints);
  const citCoords = citPoints.map((val, idx) => {
    const x = padX + (idx / (citPoints.length - 1)) * plotW;
    const y = padY + plotH - (val / (maxCit || 1)) * plotH;
    return { x, y, val };
  });

  const pathD = citCoords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaD = `${pathD} L ${citCoords[citCoords.length - 1].x} ${height - padY} L ${citCoords[0].x} ${height - padY} Z`;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-coral-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            5-Year Citation Trajectory (2022 - 2026)
          </h4>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-bold">
          <span className="flex items-center space-x-1.5 text-coral-400">
            <span className="w-2.5 h-2.5 rounded-full bg-coral-400"></span>
            <span>Citations Growth</span>
          </span>
          <span className="text-slate-400">
            Total Pubs: <span className="text-azure-400 font-extrabold">{p}</span>
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          <defs>
            <linearGradient id="citGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((ratio, i) => {
            const y = padY + plotH * ratio;
            return (
              <line
                key={i}
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          <path d={areaD} fill="url(#citGrad)" />
          <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2.5" />

          {citCoords.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#041329" stroke="#f97316" strokeWidth="2" />
              <text
                x={pt.x}
                y={pt.y - 8}
                fill="#cbd5e1"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {pt.val >= 1000 ? `${(pt.val / 1000).toFixed(1)}k` : pt.val}
              </text>
              <text
                x={pt.x}
                y={height - 5}
                fill="#64748b"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {years[i]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function DirectorySkeleton({ viewMode }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-soft-xl animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
              </div>
            </div>
            <div className="hidden sm:flex space-x-6 text-right">
              <div className="h-4 bg-slate-200 rounded-md w-16"></div>
              <div className="h-4 bg-slate-200 rounded-md w-16"></div>
            </div>
            <div className="w-24 h-8 bg-slate-200 rounded-xl shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-xl space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
            </div>
          </div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-10 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
          <div className="h-10 bg-slate-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

export default function DirectoryPage() {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [countryUniversities, setCountryUniversities] = useState([]);

  // Pagination & Volume Controls
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters (Priority Themes completely removed)
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [category, setCategory] = useState('ALL'); // 'ALL' | 'PROFESSORIAL' | 'DOCTORAL'
  const [citationTier, setCitationTier] = useState(''); // '' | '1000' | '5000' | '10000' | 'H20'
  const [sortBy, setSortBy] = useState('citations_count');

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    universities: [],
    disciplines: []
  });

  const directoryTopRef = useRef(null);

  const fetchScholars = async (targetPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (country) params.append('country', country);
      if (university) params.append('university', university);
      if (category && category !== 'ALL') params.append('category', category);
      if (citationTier) params.append('citationTier', citationTier);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', targetPage);
      params.append('limit', limit);

      const res = await api.get(`/profiles/directory?${params.toString()}`);
      if (res.data.success) {
        setScholars(res.data.scholars || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.page || 1);
      }
    } catch (err) {
      console.error('Error loading scholars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options on mount
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

  // Update universities when country changes
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

  // Refetch when filters or limit change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchScholars(1);
  }, [country, university, category, citationTier, sortBy, limit]);

  // Debounced search (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchScholars(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    fetchScholars(newPage);
    if (directoryTopRef.current) {
      directoryTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountry('');
    setUniversity('');
    setCategory('ALL');
    setCitationTier('');
    setSortBy('citations_count');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" ref={directoryTopRef}>
      {/* Directory Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-azure-900 bg-azure-100 px-4 py-1.5 rounded-full mb-2 border-2 border-azure-300 shadow-xs">
            <Users className="w-3.5 h-3.5 text-azure-700" />
            <span>Pan-African Academic Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Scholars, Ph.D. (Dr.) & Professors Directory
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1.5 leading-relaxed">
            Browse verified academic researchers, department heads, and faculty chairs across African universities.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle: Grid vs Compact List */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="Compact Table / List View"
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Compact</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-azure-500"
            >
              <option value="citations_count">Highest Citations</option>
              <option value="publications_count">Total Publications</option>
              <option value="google_h_index">Google H-Index</option>
              <option value="created_at">Recently Registered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search & Fast Filter Command Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft-xl space-y-4">
        {/* Search Input with Instant Debounce */}
        <div className="relative">
          <Search className="w-5 h-5 text-azure-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholar by name, university, or research keyword..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:border-azure-500 focus:ring-2 focus:ring-azure-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pan-African Regional Geographic Hubs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Top Hubs:</span>
          </span>
          <button
            type="button"
            onClick={() => { setCountry(''); setUniversity(''); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
              country === ''
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Africa
          </button>
          {AFRICAN_HUBS.map((hub) => {
            const active = country === hub;
            return (
              <button
                key={hub}
                type="button"
                onClick={() => {
                  setCountry(active ? '' : hub);
                  setUniversity('');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  active
                    ? 'bg-azure-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {hub}
              </button>
            );
          })}
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1">Rank / Category:</span>
          {[
            { id: 'ALL', label: 'All Faculty', icon: Users },
            { id: 'PROFESSORIAL', label: 'Professors (Full / Assoc.)', icon: Award },
            { id: 'DOCTORAL', label: 'Doctoral Scholars (Ph.D. / Dr.)', icon: GraduationCap },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-coral-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Academic Citation Metric Tiers */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>Metric Tiers:</span>
          </span>
          {CITATION_TIERS.map((tier) => {
            const active = citationTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setCitationTier(active ? '' : tier.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        {/* Specific Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-azure-600" />
            <span>Refine Institution:</span>
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

          {(country || university || search || category !== 'ALL' || citationTier) && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold transition flex items-center space-x-1 border border-rose-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Toolbar: Count, Per-Page Selector, View Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 text-xs text-slate-600">
        <div>
          {loading ? (
            <span className="font-semibold text-slate-400">Loading faculty records...</span>
          ) : (
            <span>
              Showing <strong className="text-slate-900">{total > 0 ? (page - 1) * limit + 1 : 0}</strong>–<strong className="text-slate-900">{Math.min(page * limit, total)}</strong> of <strong className="text-brand-600 font-extrabold">{total.toLocaleString()}</strong> verified scholars across Africa
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-semibold">Per page:</span>
          {[12, 24, 48].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setLimit(size)}
              className={`px-2 py-0.5 rounded-md font-bold transition ${
                limit === size
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Content with Sidebar Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Main Scholars Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {loading ? (
            <DirectorySkeleton viewMode={viewMode} />
          ) : scholars.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Scholars Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No doctoral scholars or professors matched your criteria. Try adjusting your country, university, or metric filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-azure-50 text-azure-700 font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* COMPACT LIST / TABLE VIEW (Fast Scanning for Voluminous Records) */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-xl overflow-hidden divide-y divide-slate-100">
              <div className="bg-slate-50/80 px-5 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 sm:col-span-5">Scholar & Institution</div>
                <div className="hidden sm:block col-span-3">Discipline</div>
                <div className="hidden sm:block col-span-2 text-right">Metrics</div>
                <div className="hidden sm:block col-span-2 text-right">Action</div>
              </div>

              {scholars.map((scholar) => (
                <div
                  key={scholar.id}
                  className="px-5 py-3.5 hover:bg-slate-50/80 transition grid grid-cols-12 gap-3 items-center group"
                >
                  {/* Scholar Identity */}
                  <div className="col-span-12 sm:col-span-5 flex items-center space-x-3 min-w-0">
                    <img
                      src={scholar.user?.avatar_url || '/default-avatar.svg'}
                      alt={scholar.surname}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-900"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="font-bold text-slate-900 text-sm truncate group-hover:text-azure-700 transition">
                          {scholar.first_name} {scholar.surname}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          ({scholar.title})
                        </span>
                        {isAcademicVerified(scholar.official_email || scholar.user?.email) && (
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Verified Institutional Email" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {scholar.university_name} • <span className="font-medium text-slate-600">{scholar.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* Discipline */}
                  <div className="hidden sm:block col-span-3 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{scholar.discipline || '—'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{scholar.research_focus || '—'}</p>
                  </div>

                  {/* Metrics Badges */}
                  <div className="hidden sm:flex col-span-2 items-center justify-end space-x-3 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Citations</span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {scholar.citations_count?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">H-Index</span>
                      <span className="text-xs font-extrabold text-brand-600">
                        {scholar.google_h_index || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-12 sm:col-span-2 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedScholar(scholar)}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition inline-flex items-center justify-center space-x-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* GRID CARD VIEW */
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
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-azure-100 shadow-md group-hover:scale-105 transition bg-slate-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-azure-700 bg-azure-50 border border-azure-200 px-2 py-0.5 rounded-full inline-block">
                            {scholar.title} • {scholar.highest_degree}
                          </span>
                          {(scholar.title?.toLowerCase().includes('prof') || scholar.highest_degree === 'Professor') ? (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full inline-flex items-center">
                              Professorial Chair
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full inline-flex items-center">
                              Doctoral Scholar (Ph.D.)
                            </span>
                          )}
                          {isAcademicVerified(scholar.official_email || scholar.user?.email) && (
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              <span>Verified Academic</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 truncate">
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

          {/* Server-Side Pagination Bar */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft-xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-xs text-slate-500">
                Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Numbered Page Buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pNum;
                  if (totalPages <= 5) {
                    pNum = idx + 1;
                  } else if (page <= 3) {
                    pNum = idx + 1;
                  } else if (page >= totalPages - 2) {
                    pNum = totalPages - 4 + idx;
                  } else {
                    pNum = page - 2 + idx;
                  }

                  const active = pNum === page;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => handlePageChange(pNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                        active
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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
              <span>Total in Database</span>
              <span className="font-black text-brand-600">{total.toLocaleString()} Faculty</span>
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
                  onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-brand-100 shadow-xl bg-slate-900 shrink-0"
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
                    <span className="text-[9px] font-bold text-slate-500 block tracking-tight">Ph.D.s Graduated</span>
                    <span className="text-sm font-bold text-slate-900">{selectedScholar.phd_count || 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-500 block tracking-tight">M.Sc.s Graduated</span>
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

              {/* 5-Year Citation & Publication Trajectory Chart */}
              <TrajectoryChart
                citations={selectedScholar.citations_count}
                publications={selectedScholar.publications_count}
              />

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
