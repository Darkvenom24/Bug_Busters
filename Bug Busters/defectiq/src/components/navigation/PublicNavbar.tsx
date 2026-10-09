import React from 'react';
import { useApp } from '../../lib/store';
import { ArrowRight, LogIn, UserPlus, LogOut } from 'lucide-react';

interface PublicNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ currentPath, onNavigate }) => {
  const { isAuthenticated, currentUser, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5EAF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4169E1] to-[#7563E8] text-white shadow-sm shadow-[#4169E1]/20 group-hover:scale-105 transition-transform">
            <div className="absolute inset-1 border border-white/40 rounded-lg pointer-events-none" />
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-lg text-[#172338]">
              Defect<span className="text-[#4169E1]">IQ</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#7563E8] uppercase -mt-0.5">
              AI QUALITY INTELLIGENCE
            </span>
          </div>
        </button>

        {/* Center Nav Links: Strictly Home and About */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentPath === '/' || currentPath === '/home'
                ? 'bg-[#EDF3FF] text-[#4169E1]'
                : 'text-slate-600 hover:text-[#172338] hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('/about')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentPath === '/about'
                ? 'bg-[#EDF3FF] text-[#4169E1]'
                : 'text-slate-600 hover:text-[#172338] hover:bg-slate-50'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right actions: Register & Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#172338] hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogIn size={14} className="text-slate-500" />
                <span>Login</span>
              </button>

              <button
                onClick={() => onNavigate('/register')}
                className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus size={14} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
