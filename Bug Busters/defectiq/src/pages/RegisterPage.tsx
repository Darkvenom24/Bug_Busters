import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Role } from '../types';
import { Lock, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('Operator');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full operator name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid manufacturing work email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    register(name, email, password, role);
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F5F7FB]">
      {/* Left Identity Panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-gradient-to-br from-[#172338] via-[#1E293B] to-[#0F172A] text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4169E1] to-[#7563E8] shadow-md shadow-[#4169E1]/30">
            <svg className="w-6 h-6 fill-none stroke-white stroke-[2.5]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white">
              Defect<span className="text-[#4169E1]">IQ</span>
            </span>
            <span className="block text-[9px] font-bold tracking-widest text-[#7563E8] uppercase -mt-0.5">
              AI QUALITY INTELLIGENCE
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-4 my-auto py-8">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Join the Next-Generation Industrial QC Platform
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
            Empower your plant operations with automated computer vision defect screening, instant batch traceability, and closed-loop corrective action.
          </p>
        </div>

        <div className="relative z-10 pt-4 border-t border-slate-700/60 text-[11px] text-slate-400">
          Manufacturing Terminal Provisioning Portal
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md mb-3 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('/')}
            className="text-slate-500 hover:text-[#4169E1] font-semibold flex items-center gap-1 transition-colors"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/about')}
              className="text-slate-500 hover:text-[#4169E1] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="text-[#4169E1] font-bold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#E5EAF2] shadow-sm space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-[#172338] tracking-tight">
              Register Operator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Create an account to begin executing optical quality inspections.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.m@defectiq.ai"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operational Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Operator')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'Operator'
                      ? 'border-[#4169E1] bg-[#EDF3FF] text-[#4169E1]'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  Floor Operator
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'Admin'
                      ? 'border-[#7563E8] bg-[#F2EFFF] text-[#7563E8]'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  Plant Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#4169E1] hover:bg-[#3457C2] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs mt-2"
            >
              <span>Create Operator Profile</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="text-center pt-1 text-xs text-slate-500">
            <span>Already have an account? </span>
            <button
              onClick={() => onNavigate('/login')}
              className="font-bold text-[#4169E1] hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
