import React from 'react';
import { useApp } from '../../lib/store';
import {
  LayoutDashboard,
  ScanEye,
  History,
  Layers,
  LineChart,
  BarChart3,
  Cpu,
  UploadCloud,
  FileSpreadsheet,
  Bell,
  CheckSquare,
  Users,
  Boxes,
  Sliders,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  UserCheck,
  Globe,
  Info
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: any;
  highlight?: boolean;
  adminOnly?: boolean;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const { currentUser, logout, switchRole, alerts, inspections } = useApp();

  const unreadAlertsCount = alerts.filter(a => a.status === 'unacknowledged').length;
  const pendingReviewsCount = inspections.filter(i => i.result === 'MANUAL REVIEW' && !i.verification?.isVerified).length;

  const isAdmin = currentUser?.role === 'Admin';

  const navSections: NavSection[] = [
    {
      title: 'INDUSTRIAL AI QC',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Live Inspection', path: '/inspection/live', icon: ScanEye, highlight: true },
        { label: 'Inspections', path: '/inspections', icon: History },
        { label: 'Batches', path: '/batches', icon: Layers },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Quality Analytics', path: '/analytics', icon: LineChart },
        { label: 'Defect Analytics', path: '/analytics/defects', icon: BarChart3 },
        { label: 'Model Performance', path: '/model-performance', icon: Cpu, adminOnly: true },
      ]
    },
    {
      title: 'TOOLS',
      items: [
        { label: 'Image Test', path: '/test', icon: UploadCloud },
        { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
        { label: 'Alerts', path: '/alerts', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined, badgeColor: 'bg-[#DC4545]' },
        { label: 'Manual Review', path: '/reviews', icon: CheckSquare, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-[#D99020]' },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Users', path: '/admin/users', icon: Users, adminOnly: true },
        { label: 'Products', path: '/products', icon: Boxes },
        { label: 'Settings', path: '/settings', icon: Sliders },
        { label: 'Audit Log', path: '/admin/audit', icon: FileText, adminOnly: true },
      ]
    },
    {
      title: 'PUBLIC WEBSITE',
      items: [
        { label: 'Welcome Home', path: '/', icon: Globe },
        { label: 'About DefectIQ', path: '/about', icon: Info },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { label: 'Help', path: '/help', icon: HelpCircle },
      ]
    }
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col bg-white border-r border-[#E5EAF2] select-none">
      {/* Brand Logo Header */}
      <div className={`flex items-center h-[72px] px-4 border-b border-[#E5EAF2] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          {/* Geometric Target / Inspection Mark */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4169E1] to-[#7563E8] text-white shadow-sm shadow-[#4169E1]/20 group-hover:scale-105 transition-transform">
            {/* Viewfinder brackets */}
            <div className="absolute inset-1 border border-white/40 rounded-lg pointer-events-none" />
            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeLinecap="round" />
            </svg>
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-[#172338]">
                Defect<span className="text-[#4169E1]">IQ</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#7563E8] uppercase -mt-0.5">
                AI QUALITY INTELLIGENCE
              </span>
            </div>
          )}
        </button>

        {/* Desktop Collapse Toggle */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => {
          // Filter out admin items if not admin
          const visibleItems = section.items.filter(item => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'));

                return (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={`relative group flex w-full items-center rounded-xl text-xs font-medium transition-all ${
                      collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-3'
                    } ${
                      isActive
                        ? 'bg-[#EDF3FF] text-[#4169E1] font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#172338]'
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#4169E1]" />
                    )}

                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#4169E1]'
                          : item.highlight
                          ? 'text-[#7563E8]'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    />

                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {/* Unread / Pending Badge */}
                    {item.badge !== undefined && (
                      <span
                        className={`shrink-0 flex items-center justify-center rounded-full text-white font-bold text-[10px] ${
                          item.badgeColor || 'bg-[#4169E1]'
                        } ${collapsed ? 'absolute top-1 right-1 w-4 h-4' : 'px-1.5 py-0.5 min-w-5 h-5'}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Collapsed Toggle Button when collapsed */}
      {collapsed && (
        <div className="hidden md:flex justify-center p-2 border-t border-[#E5EAF2]">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* User profile & Role switcher */}
      <div className="p-3 border-t border-[#E5EAF2] bg-[#F8FAFD]">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#426B8A] to-[#4169E1] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#172338] truncate">{currentUser?.name || 'Operator'}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    {isAdmin ? <Shield size={11} className="text-[#7563E8]" /> : <UserCheck size={11} className="text-[#4169E1]" />}
                    <span className="font-medium">{currentUser?.role || 'Operator'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>

            {/* Quick Role Switcher for Hackathon / Testing Demonstration */}
            <div className="flex items-center justify-between pt-1 text-[11px] bg-white rounded-lg border border-slate-200 p-1">
              <span className="text-slate-400 px-1 font-medium">Role:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => switchRole('Operator')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    !isAdmin ? 'bg-[#EDF3FF] text-[#4169E1]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Operator
                </button>
                <button
                  onClick={() => switchRole('Admin')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    isAdmin ? 'bg-[#F2EFFF] text-[#7563E8]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => onNavigate('/settings')}
              title={`${currentUser?.name} (${currentUser?.role})`}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#426B8A] to-[#4169E1] text-white flex items-center justify-center font-bold text-xs"
            >
              {currentUser?.name.charAt(0) || 'U'}
            </button>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-200 z-30 ${
          collapsed ? 'w-[76px]' : 'w-[248px]'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
