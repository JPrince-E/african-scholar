import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import DirectoryPage from './pages/DirectoryPage';
import RegisterScholarPage from './pages/RegisterScholarPage';
import AwardsPage from './pages/AwardsPage';
import ApplyAwardPage from './pages/ApplyAwardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

export default function App() {
  const getInitialTab = () => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.startsWith('/endorse')) return 'endorse';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/directory')) return 'directory';
    if (path.startsWith('/awards')) return 'awards';
    if (path.startsWith('/terms')) return 'terms';
    if (path.startsWith('/privacy')) return 'privacy';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedAwardId, setSelectedAwardId] = useState(null);
  const [termsSection, setTermsSection] = useState('all');

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab, extra = 'all') => {
    if (tab === 'terms') {
      setTermsSection(typeof extra === 'string' ? extra : 'all');
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', '/terms');
      }
    } else if (tab === 'privacy') {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', '/privacy');
      }
    } else {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', tab === 'landing' ? '/' : `/${tab}`);
      }
    }
    setActiveTab(tab);
  };

  // Ensure every newly opened page starts at the top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={handleTabChange} setSelectedAwardId={setSelectedAwardId} />;
      case 'directory':
        return <DirectoryPage />;
      case 'register_scholar':
        return <RegisterScholarPage setActiveTab={handleTabChange} />;
      case 'awards':
        return <AwardsPage setActiveTab={handleTabChange} setSelectedAwardId={setSelectedAwardId} />;
      case 'apply_award':
        return <ApplyAwardPage selectedAwardId={selectedAwardId} setActiveTab={handleTabChange} />;
      case 'dashboard':
        return <UserDashboardPage setActiveTab={handleTabChange} setSelectedAwardId={setSelectedAwardId} />;
      case 'endorse':
        return <RefereeEndorsePage setActiveTab={handleTabChange} />;
      case 'terms':
        return <TermsPage setActiveTab={handleTabChange} initialSection={termsSection} />;
      case 'privacy':
        return <PrivacyPolicyPage setActiveTab={handleTabChange} />;
      default:
        return <LandingPage setActiveTab={handleTabChange} setSelectedAwardId={setSelectedAwardId} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
        
        <main className="flex-1">
          {renderActivePage()}
        </main>

        <Footer setActiveTab={handleTabChange} />
        <AuthModal setActiveTab={handleTabChange} />
      </div>
    </AuthProvider>
  );
}
