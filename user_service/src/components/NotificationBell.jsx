import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, Sparkles, Bell } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://african-scholar-api.onrender.com/api' : 'http://localhost:5000/api');

const NotificationBell = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };


  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (link) {
        setIsOpen(false);
        if (onNavigate) {
          onNavigate(link);
        } else {
          window.location.assign(link);
        }
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'AWARD': return { icon: <Award className="w-4 h-4" />, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'REFEREE': return { icon: <Users className="w-4 h-4" />, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'SPONSOR': return { icon: <Sparkles className="w-4 h-4" />, bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default: return { icon: <Bell className="w-4 h-4" />, bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-slate-950 font-extrabold text-[9px] items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-slate-400 hover:text-amber-300 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => {
                const style = getTypeIcon(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleMarkAsRead(item.id, item.link)}
                    className={`p-3.5 hover:bg-slate-800/60 transition cursor-pointer flex gap-3 items-start ${
                      !item.is_read ? 'bg-slate-800/30' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 ${style.bg}`}>
                      {style.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className={`text-xs font-bold truncate ${!item.is_read ? 'text-white' : 'text-slate-300'}`}>
                          {item.title}
                        </div>
                        {!item.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                      <div className="text-[9px] text-slate-500 mt-1">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-800/50 border-t border-slate-700/80 text-center">
            <span className="text-[10px] text-slate-500">
              African Scholar Academic Notification Center
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
