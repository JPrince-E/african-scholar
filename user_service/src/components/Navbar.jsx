import React, { useState, useRef, useEffect } from 'react';
import { Award, BookOpen, Users, LogOut, Menu, X, Sparkles, ChevronRight, ShieldCheck, User as UserIcon, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, openAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'directory', label: 'Scholars Directory' },
    { id: 'awards', label: 'Academic Awards' },
    { id: 'register_scholar', label: 'Profile Registration' },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Mark */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white shadow-md shadow-coral-500/25 group-hover:scale-105 transition-transform duration-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                African Scholar
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-coral-500">
                Academic Excellence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-coral-500'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-coral-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Auth Action & Notification Bell */}
          <div className="hidden md:flex items-center space-x-3">
            <NotificationBell />

            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                {/* Profile Avatar Button (Icon/Picture only, no name) */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`relative p-0.5 rounded-full border-2 transition-all focus:outline-none ${
                    profileDropdownOpen || activeTab === 'dashboard'
                      ? 'border-coral-500 ring-4 ring-coral-500/20'
                      : 'border-slate-300 hover:border-coral-400'
                  }`}
                  title="My Scholar Profile Account"
                  aria-label="User Profile Menu"
                >
                  <img
                    src={user.avatar_url || '/default-avatar.svg'}
                    alt="profile avatar"
                    className="w-10 h-10 rounded-full object-cover bg-slate-900"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </button>

                {/* Profile Popover Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header: Scholar Profile Summary */}
                    <div className="p-4 bg-slate-900 text-white space-y-1">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar_url || '/default-avatar.svg'}
                          alt="profile avatar"
                          className="w-11 h-11 rounded-xl object-cover border border-coral-500 bg-slate-800"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">
                            {user.profile ? `${user.profile.title} ${user.profile.first_name} ${user.profile.surname}` : user.email}
                          </h4>
                          <p className="text-[11px] text-slate-300 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items inside Profile Dropdown */}
                    <div className="p-2 space-y-1 divide-y divide-slate-100">
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'dashboard'
                              ? 'bg-coral-50 text-coral-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4 text-coral-500" />
                          <span>My Dashboard & Nominations</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('register_scholar');
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'register_scholar'
                              ? 'bg-coral-50 text-coral-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Update Profile Metrics</span>
                        </button>
                      </div>

                      {/* Log Out Button */}
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Log Out Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-coral-500 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="btn-coral px-5 py-2.5 text-sm rounded-xl font-bold shadow-md"
                >
                  Join Platform
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-left font-semibold text-sm ${
                  isActive ? 'bg-coral-50 text-coral-600 font-bold border-l-4 border-coral-500' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold"
                >
                  <span>My Profile & Applications</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-rose-600 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-coral-500 rounded-xl shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
