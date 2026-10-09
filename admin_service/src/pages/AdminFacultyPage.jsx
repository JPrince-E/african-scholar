import React, { useState, useEffect } from 'react';
import { Users, Search, Building2, Globe2, BookOpen, ExternalLink } from 'lucide-react';
import api from '../services/api';
import AdminHeader from '../components/AdminHeader';

export default function AdminFacultyPage() {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/profiles/directory?limit=50&search=${search}`);
      if (res.data.success) {
        setScholars(res.data.scholars);
      }
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFaculty();
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Pan-African Faculty Registry"
        subtitle="Complete database of verified professors, citations, publication volumes, and institutional affiliations."
        onRefresh={fetchFaculty}
      />

      <div className="px-6 space-y-6">
        <form onSubmit={handleSearchSubmit} className="max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name or university..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-brand-500 shadow-xs placeholder:text-slate-400"
            />
          </div>
        </form>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft-xl">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading faculty...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Professor Name</th>
                    <th className="py-4 px-6">University</th>
                    <th className="py-4 px-6">Country</th>
                    <th className="py-4 px-6">Discipline</th>
                    <th className="py-4 px-6">Publications</th>
                    <th className="py-4 px-6">Citations</th>
                    <th className="py-4 px-6">Google H-Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {scholars.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center space-x-3">
                        <img
                          src={s.user?.avatar_url || '/default-avatar.svg'}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                        />
                        <span>{s.title} {s.first_name} {s.surname}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-800">{s.university_name}</td>
                      <td className="py-4 px-6 text-emerald-700 font-semibold">{s.country}</td>
                      <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{s.discipline}</td>
                      <td className="py-4 px-6 font-bold text-slate-700">{s.publications_count}</td>
                      <td className="py-4 px-6 font-bold text-amber-700">{s.citations_count?.toLocaleString()}</td>
                      <td className="py-4 px-6 font-black text-brand-600">{s.google_h_index}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
