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
import RefereeEndorsePage from './pages/RefereeEndorsePage';

export default function App() {
  const getInitialTab = () => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.startsWith('/endorse')) return 'endorse';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/directory')) return 'directory';
    if (path.startsWith('/awards')) return 'awards';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedAwardId, setSelectedAwardId] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} setSelectedAwardId={setSelectedAwardId} />;
      case 'directory':
        return <DirectoryPage />;
      case 'register_scholar':
        return <RegisterScholarPage setActiveTab={setActiveTab} />;
      case 'awards':
        return <AwardsPage setActiveTab={setActiveTab} setSelectedAwardId={setSelectedAwardId} />;
      case 'apply_award':
        return <ApplyAwardPage selectedAwardId={selectedAwardId} setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <UserDashboardPage setActiveTab={setActiveTab} setSelectedAwardId={setSelectedAwardId} />;
      case 'endorse':
        return <RefereeEndorsePage setActiveTab={setActiveTab} />;
      default:
        return <LandingPage setActiveTab={setActiveTab} setSelectedAwardId={setSelectedAwardId} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1">
          {renderActivePage()}
        </main>

        <Footer setActiveTab={setActiveTab} />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
