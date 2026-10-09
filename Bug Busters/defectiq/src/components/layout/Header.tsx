import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../lib/store';
import {
  Bell,
  Search,
  Menu,
  CheckCircle,
  AlertTriangle,
  Flame,
  Shield,
  Activity,
  ChevronDown,
  LogOut,
  Sliders,
  HelpCircle,
  Check
} from 'lucide-react';
import { SeverityBadge } from '../common/StatusBadge';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenMobileMenu
}) => {
  const { currentUser, alerts, acknowledgeAlert, logout, isDemoMode, setIsDemoMode } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => a.status === 'unacknowledged');

  // Breadcrumbs title mapping
  const getPageInfo = () => {
    if (currentPath === '/' || currentPath === '/overview') return { title: 'DefectIQ Platform Overview', sub: 'Autonomous Quality Intelligence for Zero-Defect Manufacturing' };
    if (currentPath === '/about') return { title: 'About Us & Engineering Mission', sub: 'The Problem We Solve & Core Architecture' };
    if (currentPath === '/dashboard') return { title: 'Dashboard', sub: 'Plant-Wide Quality Overview' };
    if (currentPath === '/inspection/live') return { title: 'Live Inspection', sub: 'Real-Time Automated Defect Detection' };
    if (currentPath.startsWith('/inspections/')) return { title: 'Inspection Detail', sub: 'Traceable Defect Record' };
    if (currentPath === '/inspections') return { title: 'Inspections History', sub: 'Historical QC Records & Traceability' };
    if (currentPath.startsWith('/products/')) return { title: 'Product Specifications', sub: 'Catalog & Rules' };
    if (currentPath === '/products') return { title: 'Products', sub: 'Component Master List' };
    if (currentPath.startsWith('/batches/')) return { title: 'Batch Quality Dossier', sub: 'Lot Metrics & Progress' };
    if (currentPath === '/batches') return { title: 'Batches', sub: 'Production Run Tracking' };
    if (currentPath === '/analytics') return { title: 'Quality Analytics', sub: 'Statistical Process Control & Trends' };
    if (currentPath === '/analytics/defects') return { title: 'Defect Analytics', sub: 'Pareto & Root Cause Analysis' };
    if (currentPath === '/model-performance') return { title: 'Model Performance', sub: 'Neural Vision Precision & Metrics' };
    if (currentPath === '/test') return { title: 'Image Testing Workbench', sub: 'Offline Diagnostic Inference' };
    if (currentPath === '/reports') return { title: 'Quality Reports', sub: 'Audit & Compliance Export' };
    if (currentPath === '/alerts') return { title: 'Alerts Center', sub: 'Defect Warnings & System Flags' };
    if (currentPath === '/reviews') return { title: 'Manual Review', sub: 'Operator Verification Queue' };
    if (currentPath === '/admin/users') return { title: 'User Management', sub: 'Operator & Admin Permissions' };
    if (currentPath === '/admin/audit') return { title: 'Audit Trail', sub: 'Immutable Action Log' };
    if (currentPath === '/settings') return { title: 'System Settings', sub: 'Inspection Tolerances & Hardware' };
    if (currentPath === '/help') return { title: 'Knowledge Base', sub: 'Operating Procedures & Guidance' };
    return { title: 'DefectIQ', sub: 'Industrial AI Quality Control' };
  };

  const { title, sub } = getPageInfo();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toUpperCase();
    if (query.startsWith('PRD') || query.includes('PLATE') || query.includes('PCB')) {
      onNavigate('/products');
    } else if (query.startsWith('BATCH')) {
      onNavigate('/batches');
    } else {
      onNavigate('/inspections');
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#E5EAF2] bg-white/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile hamburger + Breadcrumb titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#172338] tracking-tight leading-tight flex items-center gap-2">
            <span>{title}</span>
            {currentPath === '/inspection/live' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            )}
          </h1>
          <p className="hidden sm:block text-[11px] text-[#64748B] font-medium leading-none mt-0.5">
            {sub}
          </p>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Product, Batch, or Inspection..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-[#F8FAFD] text-[#172338] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1] transition-all"
          />
        </form>
      </div>

      {/* Right: Actions, Demo Pill, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Environment / Demo indicator */}
        <div
          title="DefectIQ operates with offline industrial models & real-time edge processing simulation"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-blue-200/80 bg-[#EDF3FF] text-[#4169E1]"
        >
          <Activity size={12} className="text-[#4169E1]" />
          <span>Industrial Vision Engine</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell size={19} />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC4545] px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#E5EAF2] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#F8FAFD]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#172338]">Quality Alerts & Events</span>
                  {unreadAlerts.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#DC4545]/10 text-[#DC4545] rounded text-[10px] font-bold">
                      {unreadAlerts.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onNavigate('/alerts')}
                  className="text-[11px] font-medium text-[#4169E1] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                      alert.status === 'unacknowledged' ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-900 line-clamp-1">{alert.title}</span>
                      <SeverityBadge severity={alert.severity} size="sm" />
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                      <span>{alert.timestamp}</span>
                      {alert.status === 'unacknowledged' ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="font-medium text-[#4169E1] hover:text-[#2546B8] flex items-center gap-1"
                        >
                          <Check size={12} /> Acknowledge
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle size={11} /> Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-slate-100 bg-[#F8FAFD] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('/alerts');
                  }}
                  className="text-xs font-semibold text-[#4169E1] hover:text-[#2546B8]"
                >
                  Go to Live Alerts Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4169E1] to-[#7563E8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#172338] leading-tight">
                {currentUser?.name || 'Guest'}
              </p>
              <p className="text-[10px] text-[#64748B] font-medium leading-tight">
                {currentUser?.role || 'Operator'}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-[#E5EAF2] py-1.5 z-50 animate-in fade-in duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-[#EDF3FF] text-[#4169E1]">
                    {currentUser?.role}
                  </span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <Sliders size={14} className="text-slate-400" />
                  <span>Inspection Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('/help');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <HelpCircle size={14} className="text-slate-400" />
                  <span>Documentation & Guide</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
