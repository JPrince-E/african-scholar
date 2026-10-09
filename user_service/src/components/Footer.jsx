import React from 'react';
import { Award, Globe2, Mail, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-[#041329] text-slate-400 pt-16 pb-12 border-t border-slate-800/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white shadow-md shadow-coral-500/25">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">African Scholar</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier pan-African platform celebrating academic excellence, tracking research citations, and awarding university professors across Africa.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Peer Review Standard</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="eyebrow-accent">Platform Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveTab('directory')} className="hover:text-white transition">
                  Scholars Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('awards')} className="hover:text-white transition">
                  Academic Award Categories
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('register_scholar')} className="hover:text-white transition">
                  Professor Metric Registration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('awards')} className="hover:text-white transition">
                  Benchmark Evaluation Index
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="eyebrow-accent">Award Tiers</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>National Scholar of the Year</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-coral-500"></span>
                <span>Continental Scholar of the Year</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-azure-400"></span>
                <span>Global Scholar of the Year</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-500 text-xs pt-1">
                <span>Coming: First Class Graduate Awards</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="eyebrow-accent">Administration</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Accredited institutional reviewer or committee member? Access the administrative station to review submitted indices.
            </p>
            <a
              href={import.meta.env.VITE_ADMIN_URL || "http://localhost:3001"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-azure-400 hover:text-azure-300 bg-azure-950/60 hover:bg-azure-900/60 border border-azure-800/60 px-4 py-2 rounded-xl transition"
            >
              <span>Admin Portal Subdomain</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 African Scholar Initiative. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>Nigeria • Kenya • Ghana • South Africa • Pan-Africa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
