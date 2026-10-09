import React, { useState } from 'react';
import { X, Mail, Lock, Award, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuth, login, register, openAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      closeAuth();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillScholar = () => {
    setEmail('prof.adebayo@ui.edu.ng');
    setPassword('ScholarPass123!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="hero-solid-bg bg-dot-pattern p-6 text-white text-center relative">
          <button
            onClick={closeAuth}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-coral-500 text-white border border-coral-400/30 mx-auto flex items-center justify-center mb-3 shadow-md shadow-coral-500/30">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">
            {authMode === 'login' ? 'Scholar Portal Login' : 'Join African Scholar'}
          </h3>
          <p className="text-xs text-coral-200 mt-1">
            {authMode === 'login'
              ? 'Access your academic profile & nomination portfolio'
              : 'Register your academic metrics and join the pan-African faculty'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. prof.name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-azure-500 focus:ring-3 focus:ring-azure-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-azure-500 focus:ring-3 focus:ring-azure-100 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl btn-coral font-semibold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : authMode === 'login' ? 'Sign In to Profile' : 'Create Scholar Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {authMode === 'login' ? (
              <p>
                Not registered yet?{' '}
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="font-bold text-azure-600 hover:text-azure-700 underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="font-bold text-azure-600 hover:text-azure-700 underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Pre-fill for testing */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handlePrefillScholar}
              className="text-[11px] font-medium text-slate-500 hover:text-azure-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Prefill Sample Scholar (Prof. Adebayo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
