import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Globe2,
  BookOpen,
  Award,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../services/api';
import AdminHeader from '../components/AdminHeader';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Aggregating African academic intelligence...</p>
      </div>
    );
  }

  // Format data for charts
  const countryData = (analytics?.professorsByCountry || []).map(c => ({
    name: c.country,
    count: parseInt(c.count)
  }));

  const universityData = (analytics?.professorsByUniversity || []).map(u => ({
    name: u.university_name.length > 20 ? u.university_name.substring(0, 18) + '...' : u.university_name,
    fullName: u.university_name,
    country: u.country,
    count: parseInt(u.count)
  }));

  const statusData = (analytics?.applicationsByStatus || []).map(s => ({
    name: s.status.replace('_', ' '),
    value: parseInt(s.count)
  }));

  const impact = analytics?.impactMetrics || {};

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="African Academic Intelligence & Analytics"
        subtitle="Tracking faculty density per institution, per nation, and continental scientific impact."
        onRefresh={fetchAnalytics}
      />

      <div className="px-6 space-y-8">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-xl space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Professors Mapped</span>
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics?.totalProfessors || 0}</div>
            <p className="text-[11px] text-emerald-700 font-semibold">↑ Verified African Faculty</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-xl space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Universities Tracked</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics?.professorsByUniversity?.length || 0}</div>
            <p className="text-[11px] text-blue-700 font-semibold">Nigeria, Kenya, Ghana, S.A.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-xl space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Citations Sum</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700">
              {impact.total_citations?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Avg H-Index: {impact.avg_h_index || 0}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-xl space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Award Nominations</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics?.totalApplications || 0}</div>
            <p className="text-[11px] text-emerald-700 font-semibold">Active Review Workflows</p>
          </div>
        </div>

        {/* PRIMARY CHARTS: PROFESSORS BY COUNTRY & UNIVERSITY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Professors per Country */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-soft-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Globe2 className="w-4 h-4 text-brand-600" />
                  <span>Professors by African Country</span>
                </h3>
                <p className="text-xs text-slate-500">Verified scholar headcount distribution across nations</p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Nomination Review Status Distribution */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-soft-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Nomination Funnel Status</span>
              </h3>
              <p className="text-xs text-slate-500">Current review station states</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-400">No applications recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* SECONDARY CHART: PROFESSORS BY UNIVERSITY / SCHOOL */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Professors by University / School</span>
              </h3>
              <p className="text-xs text-slate-500">Top African institutions ranked by registered faculty</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={universityData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.06)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REGIONAL RESEARCH IMPACT SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-xl flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600 font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Total Publications</span>
              <span className="text-xl font-black text-slate-900">{impact.total_publications?.toLocaleString() || 0}</span>
              <span className="text-[10px] text-slate-400 block">Q1/Q2 & Scopus Indexed</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-xl flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Research Grants Won</span>
              <span className="text-xl font-black text-slate-900">{impact.total_grants || 0}</span>
              <span className="text-[10px] text-emerald-700 block">National & International Funds</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-xl flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold block">Granted Patents</span>
              <span className="text-xl font-black text-slate-900">{impact.total_patents || 0}</span>
              <span className="text-[10px] text-amber-700 block">Technological Inventions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
