import React from 'react';
import {
  BarChart3,
  FileCheck,
  Trophy,
  Megaphone,
  Users,
  Bell,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { admin, logout } = useAdminAuth();

  const navItems = [
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'applications', label: 'Review Nominations', icon: FileCheck },
    { id: 'winners', label: 'Award Winners Manager', icon: Trophy },
    { id: 'awards', label: 'Award Categories', icon: Award },
    { id: 'sponsors', label: 'Sponsor Ads Manager', icon: Megaphone },
    { id: 'notifications', label: 'Broadcast Notifications', icon: Bell },
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block">
                African Scholar
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 block">
                Admin Station
              </span>
            </div>
          </div>
          <div className="mt-3 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Subdomain Node</span>
            <span className="text-emerald-600 font-bold">admin.*</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & External Links */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <a
          href={import.meta.env.VITE_USER_CLIENT_URL || "http://localhost:3000"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition"
        >
          <span>View Public Scholar Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
              {admin?.email?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {admin?.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-amber-700 font-bold uppercase block">
                {admin?.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
