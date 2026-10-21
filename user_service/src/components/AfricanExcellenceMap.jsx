import React, { useState, useEffect } from 'react';
import { Globe2, Building2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://african-scholar-api.onrender.com/api' : 'http://localhost:5000/api');

const AfricanExcellenceMap = () => {
  const [stats, setStats] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/analytics/continental-stats`);
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch continental stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const [metricFilter, setMetricFilter] = useState('ALL'); // 'ALL' | 'PROFESSORS' | 'PHDS'

  const countryData = stats?.countryStats || {
    'Nigeria': { professors: '240,000+', phds: '180,000+', scholars: '420,000+', applications: 84, laureates: 17, flagship: 'University of Ibadan', countryCode: 'NG' },
    'South Africa': { professors: '190,000+', phds: '160,000+', scholars: '350,000+', applications: 76, laureates: 28, flagship: 'University of Cape Town', countryCode: 'ZA' },
    'Egypt': { professors: '170,000+', phds: '140,000+', scholars: '310,000+', applications: 68, laureates: 21, flagship: 'Cairo University', countryCode: 'EG' },
    'Kenya': { professors: '68,000+', phds: '52,000+', scholars: '120,000+', applications: 52, laureates: 11, flagship: 'University of Nairobi', countryCode: 'KE' },
    'Ghana': { professors: '54,000+', phds: '41,000+', scholars: '95,000+', applications: 44, laureates: 13, flagship: 'KNUST', countryCode: 'GH' },
    'Uganda': { professors: '42,000+', phds: '33,000+', scholars: '75,000+', applications: 38, laureates: 14, flagship: 'Makerere University', countryCode: 'UG' },
    'Senegal': { professors: '25,000+', phds: '20,000+', scholars: '45,000+', applications: 28, laureates: 7, flagship: 'Cheikh Anta Diop University', countryCode: 'SN' },
    'Ethiopia': { professors: '31,000+', phds: '24,000+', scholars: '55,000+', applications: 32, laureates: 6, flagship: 'Addis Ababa University', countryCode: 'ET' },
    'Rwanda': { professors: '19,000+', phds: '16,000+', scholars: '35,000+', applications: 26, laureates: 5, flagship: 'University of Rwanda', countryCode: 'RW' },
    'Morocco': { professors: '34,000+', phds: '26,000+', scholars: '60,000+', applications: 30, laureates: 6, flagship: 'Mohammed V University', countryCode: 'MA' }
  };

  const countries = Object.keys(countryData);
  const activeCountry = countryData[selectedCountry] || countryData['Nigeria'];

  return (
    <div className="hero-solid-bg bg-dot-pattern border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-azure-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-coral-500/10 border border-coral-500/30 text-coral-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Pan-African Excellence Radar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Continental Academic Footprint
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Mapping professors and doctoral (Ph.D.) scholars across Nigeria, Kenya, Ghana, and all 54 African nations.
          </p>
        </div>

        {/* View Toggle: All Scholars vs Professors vs PhDs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setMetricFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Scholars (1.5M+)
          </button>
          <button
            type="button"
            onClick={() => setMetricFilter('PROFESSORS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricFilter === 'PROFESSORS'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Professors (850k+)
          </button>
          <button
            type="button"
            onClick={() => setMetricFilter('PHDS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricFilter === 'PHDS'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ph.D. Scholars (650k+)
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">54</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">African Nations</div>
        </div>
        <div className={`bg-slate-800/70 border rounded-2xl p-4 text-center transition ${metricFilter === 'PROFESSORS' ? 'border-blue-400 bg-blue-950/40' : 'border-slate-700/60'}`}>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">850k+</div>
          <div className="text-xs text-slate-300 font-semibold mt-0.5">Professors Mapped</div>
        </div>
        <div className={`bg-slate-800/70 border rounded-2xl p-4 text-center transition ${metricFilter === 'PHDS' ? 'border-emerald-400 bg-emerald-950/40' : 'border-slate-700/60'}`}>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">650k+</div>
          <div className="text-xs text-slate-300 font-semibold mt-0.5">Ph.D. Scholars Mapped</div>
        </div>
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">1.5M+</div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">Total Enrolled Scholars</div>
        </div>
      </div>

      {/* Interactive Map & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Stylized Vector Map of Africa */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[380px]">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-4 text-center">
            Interactive Continental Radar — Click Country Node
          </div>

          {/* Africa Stylized Vector Map */}
          <svg viewBox="0 0 500 520" className="w-full max-w-[400px] h-auto drop-shadow-2xl">
            {/* Continental Silhouette Outline */}
            <path
              d="M 170 40 C 230 35, 330 40, 360 80 C 400 130, 420 180, 470 200 C 490 220, 460 250, 410 270 C 370 290, 350 340, 340 380 C 320 440, 270 490, 250 500 C 230 490, 210 440, 190 380 C 170 330, 130 310, 100 290 C 70 260, 50 220, 60 180 C 70 140, 120 90, 170 40 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2.5"
              className="transition-colors"
            />
            {/* Madagascar */}
            <path
              d="M 430 360 C 445 350, 455 380, 440 430 C 430 445, 420 430, 425 390 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Country Nodes on the SVG */}
            {/* North Africa / Egypt */}
            <g 
              onClick={() => setSelectedCountry('Egypt')}
              className="cursor-pointer group"
            >
              <circle cx="340" cy="110" r={selectedCountry === 'Egypt' ? '14' : '9'} fill={selectedCountry === 'Egypt' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="340" y="113" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" pointerEvents="none">EG</text>
              <text x="340" y="130" textAnchor="middle" fontSize="9" fill={selectedCountry === 'Egypt' ? '#f59e0b' : '#94a3b8'} fontWeight="bold">Egypt</text>
            </g>

            {/* Morocco */}
            <g 
              onClick={() => setSelectedCountry('Morocco')}
              className="cursor-pointer group"
            >
              <circle cx="150" cy="80" r={selectedCountry === 'Morocco' ? '14' : '9'} fill={selectedCountry === 'Morocco' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="150" y="83" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" pointerEvents="none">MA</text>
              <text x="150" y="100" textAnchor="middle" fontSize="9" fill={selectedCountry === 'Morocco' ? '#f59e0b' : '#94a3b8'} fontWeight="bold">Morocco</text>
            </g>

            {/* West Africa / Nigeria */}
            <g 
              onClick={() => setSelectedCountry('Nigeria')}
              className="cursor-pointer group"
            >
              <circle cx="210" cy="220" r={selectedCountry === 'Nigeria' ? '16' : '11'} fill={selectedCountry === 'Nigeria' ? '#10b981' : '#10b981'} className="transition-all duration-300 group-hover:scale-125 animate-pulse" />
              <text x="210" y="223" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" pointerEvents="none">NG</text>
              <text x="210" y="242" textAnchor="middle" fontSize="10" fill={selectedCountry === 'Nigeria' ? '#10b981' : '#cbd5e1'} fontWeight="bold">Nigeria</text>
            </g>

            {/* Ghana */}
            <g 
              onClick={() => setSelectedCountry('Ghana')}
              className="cursor-pointer group"
            >
              <circle cx="150" cy="230" r={selectedCountry === 'Ghana' ? '14' : '9'} fill={selectedCountry === 'Ghana' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="150" y="233" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" pointerEvents="none">GH</text>
              <text x="150" y="250" textAnchor="middle" fontSize="9" fill={selectedCountry === 'Ghana' ? '#f59e0b' : '#94a3b8'} fontWeight="bold">Ghana</text>
            </g>

            {/* Senegal */}
            <g 
              onClick={() => setSelectedCountry('Senegal')}
              className="cursor-pointer group"
            >
              <circle cx="95" cy="200" r={selectedCountry === 'Senegal' ? '14' : '9'} fill={selectedCountry === 'Senegal' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="95" y="203" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" pointerEvents="none">SN</text>
              <text x="95" y="220" textAnchor="middle" fontSize="9" fill={selectedCountry === 'Senegal' ? '#f59e0b' : '#94a3b8'} fontWeight="bold">Senegal</text>
            </g>

            {/* East Africa / Kenya */}
            <g 
              onClick={() => setSelectedCountry('Kenya')}
              className="cursor-pointer group"
            >
              <circle cx="360" cy="270" r={selectedCountry === 'Kenya' ? '15' : '10'} fill={selectedCountry === 'Kenya' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="360" y="273" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" pointerEvents="none">KE</text>
              <text x="360" y="292" textAnchor="middle" fontSize="10" fill={selectedCountry === 'Kenya' ? '#f59e0b' : '#cbd5e1'} fontWeight="bold">Kenya</text>
            </g>

            {/* Uganda */}
            <g 
              onClick={() => setSelectedCountry('Uganda')}
              className="cursor-pointer group"
            >
              <circle cx="320" cy="265" r={selectedCountry === 'Uganda' ? '14' : '9'} fill={selectedCountry === 'Uganda' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="320" y="268" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" pointerEvents="none">UG</text>
              <text x="320" y="283" textAnchor="middle" fontSize="8" fill={selectedCountry === 'Uganda' ? '#f59e0b' : '#94a3b8'} fontWeight="bold">Uganda</text>
            </g>

            {/* Ethiopia */}
            <g 
              onClick={() => setSelectedCountry('Ethiopia')}
              className="cursor-pointer group"
            >
              <circle cx="370" cy="200" r={selectedCountry === 'Ethiopia' ? '14' : '9'} fill={selectedCountry === 'Ethiopia' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="370" y="203" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" pointerEvents="none">ET</text>
              <text x="370" y="220" textAnchor="middle" fontSize="9" fill={selectedCountry === 'Ethiopia' ? '#f59e0b' : '#94a3b8'} fontWeight="bold">Ethiopia</text>
            </g>

            {/* Rwanda */}
            <g 
              onClick={() => setSelectedCountry('Rwanda')}
              className="cursor-pointer group"
            >
              <circle cx="310" cy="290" r={selectedCountry === 'Rwanda' ? '13' : '8'} fill={selectedCountry === 'Rwanda' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="310" y="293" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold" pointerEvents="none">RW</text>
            </g>

            {/* Southern Africa / South Africa */}
            <g 
              onClick={() => setSelectedCountry('South Africa')}
              className="cursor-pointer group"
            >
              <circle cx="270" cy="460" r={selectedCountry === 'South Africa' ? '16' : '11'} fill={selectedCountry === 'South Africa' ? '#f59e0b' : '#3b82f6'} className="transition-all duration-300 group-hover:scale-125" />
              <text x="270" y="463" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" pointerEvents="none">ZA</text>
              <text x="270" y="484" textAnchor="middle" fontSize="10" fill={selectedCountry === 'South Africa' ? '#f59e0b' : '#cbd5e1'} fontWeight="bold">South Africa</text>
            </g>
          </svg>
        </div>

        {/* Selected Country Spotlight Card */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold flex items-center justify-center text-sm shadow-inner shrink-0">
                {activeCountry.countryCode || selectedCountry.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCountry}</h3>
                <span className="text-xs text-amber-400 font-medium">Flagship National Academic Hub</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Honored Laureates</div>
              <div className="text-xl font-extrabold text-amber-400">{activeCountry.laureates}</div>
            </div>
          </div>

          {/* Professorial vs Doctoral Census Breakdown */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className={`p-3.5 rounded-xl border transition ${metricFilter === 'PROFESSORS' ? 'bg-blue-950/70 border-blue-400 ring-2 ring-blue-500/30' : 'bg-slate-800/60 border-slate-700/60'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-300 uppercase font-black tracking-wider">Professors Mapped</span>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              </div>
              <div className="text-xl font-extrabold text-white mt-1">{activeCountry.professors || '—'}</div>
              <span className="text-[10px] text-slate-400">Full & Assoc. Professors</span>
            </div>

            <div className={`p-3.5 rounded-xl border transition ${metricFilter === 'PHDS' ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/30' : 'bg-slate-800/60 border-slate-700/60'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-300 uppercase font-black tracking-wider">Doctoral (Ph.D.)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-xl font-extrabold text-white mt-1">{activeCountry.phds || '—'}</div>
              <span className="text-[10px] text-slate-400">Ph.D. Researchers & Fellows</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Country Scholars</div>
              <div className="text-base font-bold text-amber-300 mt-0.5">{activeCountry.scholars}</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Evaluated Dossiers</div>
              <div className="text-base font-bold text-white mt-0.5">{activeCountry.applications}</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 mb-5">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Principal University Contributor</div>
            <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{activeCountry.flagship}</span>
            </div>
          </div>

          {/* Country Quick Selector Pills */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Continental Hub:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedCountry === c
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfricanExcellenceMap;
