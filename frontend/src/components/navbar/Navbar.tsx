import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { UserRole } from '../../types';
import {
  Sprout,
  Mic,
  Bell,
  CheckCircle2,
  Store,
  Truck,
  LayoutDashboard,
  Shield,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { VoiceAssistantModal } from '../common/VoiceAssistantModal';

export const Navbar: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const roles: { role: UserRole; label: string; icon: string; desc: string }[] = [
    { role: 'farmer', label: 'Farmer (કિસાન)', icon: '🌾', desc: 'List produce, check AI prices & demand' },
    { role: 'fpo', label: 'FPO Producer Org', icon: '🏢', desc: 'Aggregate bulk produce & fulfill demand' },
    { role: 'buyer', label: 'Buyer (Restaurant/Retail)', icon: '🛒', desc: 'Post bulk needs & match farmers' },
    { role: 'admin', label: 'Admin (DoCA Officer)', icon: '🛡️', desc: 'Verify users, monitor logistics & AI' },
  ];

  const getDashboardPath = (userRole: UserRole) => {
    switch (userRole) {
      case 'farmer': return '/farmer/dashboard';
      case 'fpo': return '/fpo/dashboard';
      case 'buyer': return '/buyer/dashboard';
      case 'admin': return '/admin/dashboard';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Farm<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-sm">
                      AI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                    Digital bridge between farm & buyer
                  </p>
                </div>
              </Link>

              {/* Main Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 ml-4 text-sm font-semibold">
                <Link
                  to="/marketplace"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
                    location.pathname === '/marketplace'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Marketplace
                </Link>

                <Link
                  to={getDashboardPath(role)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
                    location.pathname.includes('/dashboard')
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Portal
                </Link>

                <Link
                  to="/logistics"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
                    location.pathname === '/logistics'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Smart Logistics
                </Link>
              </nav>
            </div>

            {/* Right Header Actions: Voice Assistant, Role Switcher, Notifications, Theme */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Multilingual AI Voice Assistant Button */}
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all transform hover:scale-[1.02] active:scale-95"
                title="Open AI Voice Assistant (Gujarati / Hindi / English)"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Voice (વાણી)</span>
              </button>

              {/* Role Switcher Pill Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-colors"
                >
                  <span>{roles.find(r => r.role === role)?.icon}</span>
                  <span className="font-bold capitalize">{role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setIsRoleDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                      Switch Role (Instant Demo)
                    </div>
                    {roles.map(r => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors ${
                          role === r.role ? 'bg-emerald-50/70 dark:bg-emerald-950/40' : ''
                        }`}
                      >
                        <span className="text-xl mt-0.5">{r.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            {r.label}
                            {role === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <p className="text-[10px] text-slate-400">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-fade-in"
                    onMouseLeave={() => setShowNotifications(false)}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Smart Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2 py-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-2.5 rounded-xl cursor-pointer text-left transition-colors text-xs ${
                              n.read
                                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                                : 'bg-emerald-50/60 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200 border border-emerald-100 dark:border-emerald-800/40'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                            </div>
                            <p className="text-[11px] mt-1 text-slate-600 dark:text-slate-300">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Dark/Light Mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Avatar */}
              <Link to={getDashboardPath(role)} className="flex items-center gap-2 pl-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/30"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Multilingual AI Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </>
  );
};
