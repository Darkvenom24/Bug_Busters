import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  Store,
  Layers,
  Truck,
  TrendingUp,
  Package,
  Users,
  ShieldCheck,
  FileText,
  BadgeCheck,
  Bell
} from 'lucide-react';

export const DashboardSidebar: React.FC = () => {
  const { role, user } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'farmer':
        return [
          { to: '/farmer/dashboard', label: 'My Dashboard', icon: Sprout },
          { to: '/farmer/dashboard#produce', label: 'My Produce Listings', icon: Package },
          { to: '/farmer/dashboard#insights', label: 'AI Demand & Prices', icon: TrendingUp },
          { to: '/farmer/dashboard#orders', label: 'Buyer Orders', icon: Store },
          { to: '/logistics', label: 'Pickup Logistics', icon: Truck },
        ];
      case 'fpo':
        return [
          { to: '/fpo/dashboard', label: 'FPO Overview', icon: Layers },
          { to: '/fpo/dashboard#aggregation', label: 'Bulk Produce Aggregator', icon: Package },
          { to: '/fpo/dashboard#farmers', label: 'Member Farmers', icon: Users },
          { to: '/fpo/dashboard#bulk-orders', label: 'Institutional Demands', icon: Store },
          { to: '/logistics', label: 'Cluster Route Optimizer', icon: Truck },
        ];
      case 'buyer':
        return [
          { to: '/buyer/dashboard', label: 'Procurement Desk', icon: Store },
          { to: '/marketplace', label: 'Browse Marketplace', icon: Package },
          { to: '/buyer/dashboard#matching', label: 'AI Sourcing Matches', icon: TrendingUp },
          { to: '/buyer/dashboard#orders', label: 'Track Active Orders', icon: Truck },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Command Center', icon: ShieldCheck },
          { to: '/admin/dashboard#users', label: 'User Verification', icon: BadgeCheck },
          { to: '/admin/dashboard#analytics', label: 'DoCA Market KPIs', icon: TrendingUp },
          { to: '/admin/dashboard#logistics', label: 'Logistics Fleet Monitor', icon: Truck },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-5rem)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h4>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize block">
              ● {user.role} Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-wider">
            Role Navigation
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to.includes('#') ? false : true}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* DoCA Banner */}
      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-slate-600 dark:text-slate-300">
        <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
          DoCA AgriTech Portal
        </span>
        Direct digital connectivity minimizing intermediary margin leakage.
      </div>
    </aside>
  );
};
