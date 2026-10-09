import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Role } from '../types';
import { Eye, EyeOff, Lock, Mail, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useApp();

  const [email, setEmail] = useState('operator@defectiq.ai');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('Operator');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide a valid operator email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, password, role);
      setIsLoading(false);
      onNavigate('/dashboard');
    }, 400);
  };

  const handleDemoFill = (selectedRole: Role) => {
    if (selectedRole === 'Admin') {
      setEmail('admin@defectiq.ai');
      setPassword('adminpass');
      setRole('Admin');
    } else {
      setEmail('operator@defectiq.ai');
      setPassword('opertorpass');
      setRole('Operator');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F5F7FB]">
      {/* 5.1 Left Panel - Industrial Brand Identity & Vision */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-gradient-to-br from-[#172338] via-[#1E293B] to-[#0F172A] text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric grid / alignment marks */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridAuth" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridAuth)" />
          </svg>
        </div>

        {/* Ambient brand glow */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#4169E1]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#7563E8]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Mark Header */}
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

        {/* Mission / Value Proposition */}
        <div className="relative z-10 space-y-4 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Edge Computer Vision</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight text-white">
            Detect Defects.<br />
            Ensure Quality.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] to-[#7563E8]">
              Prevent Industrial Waste.
            </span>
          </h2>

          <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
            Automate production line inspection with sub-millimeter precision, multi-class defect classification, and continuous traceability.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 size={15} className="text-[#15976A]" />
              <span>DETECT → CLASSIFY → ASSESS → ALERT → ANALYSE</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 size={15} className="text-[#15976A]" />
              <span>Full human verification loop with immutable audit trails</span>
            </div>
          </div>
        </div>

        {/* Security / Compliance footer */}
        <div className="relative z-10 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Industrial ISO 9001 / ASTM E-45 QC Compliant</span>
          <span>v3.4.2 Production</span>
        </div>
      </div>

      {/* 5.1 Right Panel - Login Form */}
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
              onClick={() => onNavigate('/register')}
              className="text-[#4169E1] font-bold hover:underline"
            >
              Register
            </button>
          </div>
        </div>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#E5EAF2] shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#172338] tracking-tight">
              Sign In to DefectIQ
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your plant credentials to access the live inspection line.
            </p>
          </div>

          {/* Quick Demo Credentials Fill Buttons */}
          <div className="p-3 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Demonstration Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('Operator')}
                className="py-1.5 px-3 rounded-xl border border-blue-200 bg-white text-xs font-semibold text-[#4169E1] hover:bg-blue-50 transition-colors text-center"
              >
                Elena (Operator)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('Admin')}
                className="py-1.5 px-3 rounded-xl border border-violet-200 bg-white text-xs font-semibold text-[#7563E8] hover:bg-violet-50 transition-colors text-center"
              >
                Marcus (Admin)
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@defectiq.ai"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[#4169E1]"
                />
                <span>Remember terminal</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password recovery: Contact plant IT administrator to reset LDAP/local terminal token.')}
                className="text-[#4169E1] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#4169E1] hover:bg-[#3457C2] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
            >
              <span>{isLoading ? 'Authenticating Station...' : 'Sign In to Station'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Need an operator account? </span>
            <button
              onClick={() => onNavigate('/register')}
              className="font-bold text-[#4169E1] hover:underline"
            >
              Register New Operator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
