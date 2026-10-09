import React, { useState, useEffect } from 'react';
import { Trophy, Award } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://african-scholar-api.onrender.com/api' : 'http://localhost:5000/api');

const UniversityLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/analytics/continental-stats`);
        const data = await res.json();
        if (data.success && data.universityLeaderboard) {
          setLeaderboard(data.universityLeaderboard);
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filtered = leaderboard.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.country.toLowerCase().includes(filter.toLowerCase()) ||
    u.topDiscipline.toLowerCase().includes(filter.toLowerCase())
  );

  const getMedal = (rank) => {
    if (rank === 1) return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30" title="1st Place Continental Flagship">
        1
      </span>
    );
    if (rank === 2) return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs" title="2nd Place">
        2
      </span>
    );
    if (rank === 3) return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/80 text-amber-100 font-black text-xs" title="3rd Place">
        3
      </span>
    );
    return <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">#{rank}</span>;
  };

  return (
    <div className="hero-solid-bg bg-dot-pattern border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-azure-500/10 border border-azure-500/30 text-azure-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
            <Trophy className="w-3.5 h-3.5 text-azure-400" />
            <span>Continental Rankings 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pan-African University Impact Index
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Top tertiary institutions ranked by peer-reviewed laureates, continental citations, and patent innovations.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search university or country..."
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-azure-500/50"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <th className="py-4 px-4 text-center w-16">Rank</th>
              <th className="py-4 px-5">Institution & Country</th>
              <th className="py-4 px-4 text-center">Laureates</th>
              <th className="py-4 px-4 text-center">Faculty</th>
              <th className="py-4 px-4 text-center">Citations Evaluated</th>
              <th className="py-4 px-5">Primary Discipline Strength</th>
              <th className="py-4 px-4 text-right">Impact Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map((item) => (
              <tr 
                key={item.rank} 
                className="hover:bg-slate-800/40 transition group"
              >
                <td className="py-4 px-4 text-center">
                  {getMedal(item.rank)}
                </td>
                <td className="py-4 px-5">
                  <div className="font-bold text-white group-hover:text-amber-300 transition">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {item.countryCode || (item.country ? item.country.slice(0, 2).toUpperCase() : 'AF')}
                    </span>
                    <span>{item.country}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <Award className="w-3 h-3 text-amber-400 mr-1" />
                    <span>{item.laureatesCount}</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-slate-300 font-mono text-xs">
                  {item.scholarsCount}
                </td>
                <td className="py-4 px-4 text-center text-slate-300 font-mono text-xs">
                  {item.citationsEvaluated}
                </td>
                <td className="py-4 px-5 text-xs text-slate-400">
                  {item.topDiscipline}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-base font-extrabold text-emerald-400 font-mono">
                    {item.impactScore}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">/ 100 Index</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniversityLeaderboard;
