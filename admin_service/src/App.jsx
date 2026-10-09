import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminAnalyticsDashboard from './pages/AdminAnalyticsDashboard';
import AdminApplicationsPage from './pages/AdminApplicationsPage';
import AdminWinnersPage from './pages/AdminWinnersPage';
import AdminSponsorsPage from './pages/AdminSponsorsPage';
import AdminFacultyPage from './pages/AdminFacultyPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminAwardsPage from './pages/AdminAwardsPage';

function AdminMainContent() {
  const { admin, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLoginPage />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'analytics':
        return <AdminAnalyticsDashboard />;
      case 'applications':
        return <AdminApplicationsPage />;
      case 'winners':
        return <AdminWinnersPage />;
      case 'awards':
        return <AdminAwardsPage />;
      case 'sponsors':
        return <AdminSponsorsPage />;
      case 'faculty':
        return <AdminFacultyPage />;
      case 'notifications':
        return <AdminNotificationsPage />;
      default:
        return <AdminAnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 bg-slate-100/60 min-h-screen overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminMainContent />
    </AdminAuthProvider>
  );
}
