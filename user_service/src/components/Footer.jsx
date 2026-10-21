import React from 'react';
import { Award, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-[#041329] text-slate-400 pt-16 pb-12 border-t border-slate-800/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Platform Overview */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white shadow-md shadow-coral-500/25">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">African Scholar</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier pan-African platform celebrating academic excellence, tracking research citations, and awarding university professors and doctoral scholars (Ph.D. / Dr.) across Africa.
            </p>
          </div>

          {/* Col 2: Platform Services */}
          <div className="space-y-3">
            <h4 className="eyebrow-accent">Platform Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveTab('directory')} className="text-left block hover:text-white transition">
                  Scholars Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('awards')} className="text-left block hover:text-white transition">
                  Academic Award Categories
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('register_scholar')} className="text-left block hover:text-white transition">
                  Academic Metric Registration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('landing')} className="text-left block hover:text-white transition">
                  Sponsorships & Showcase
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Award Tiers */}
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
                <span>Doctoral & Professorial Laureates</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="eyebrow-accent">Legal & Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('terms', 'advertising')}
                  className="text-left block text-coral-400 hover:text-coral-300 font-medium transition"
                >
                  Advertising Terms (T&Cs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('terms', 'awards')}
                  className="text-left block text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  General Award Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('terms', 'all')}
                  className="text-left block hover:text-white transition"
                >
                  All Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="text-left block hover:text-white transition"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2027 African Scholar Platform. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('terms', 'advertising')}
              className="hover:text-coral-400 transition"
            >
              Advertising T&Cs
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('terms', 'awards')}
              className="hover:text-emerald-400 transition"
            >
              General Award Conditions
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('privacy')}
              className="hover:text-azure-400 transition"
            >
              Privacy Policy
            </button>
          </div>

          <div className="flex items-center space-x-1.5 font-medium text-slate-400 hover:text-white transition">
            <span>Provided by</span>
            <a
              href="https://bluespectruminnovative.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-azure-400 hover:text-azure-300 font-semibold underline underline-offset-2 inline-flex items-center space-x-1"
            >
              <span>Bluespectrum Innovative Ltd</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
