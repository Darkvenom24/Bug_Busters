import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Sprout, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { switchRole, login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [phone, setPhone] = useState('+91 98250 12345');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate(
      selectedRole === 'farmer'
        ? '/farmer/dashboard'
        : selectedRole === 'fpo'
        ? '/fpo/dashboard'
        : selectedRole === 'buyer'
        ? '/buyer/dashboard'
        : '/admin/dashboard'
    );
  };

  const handleQuickDemoRole = (role: UserRole) => {
    setSelectedRole(role);
    switchRole(role);
    navigate(
      role === 'farmer'
        ? '/farmer/dashboard'
        : role === 'fpo'
        ? '/fpo/dashboard'
        : role === 'buyer'
        ? '/buyer/dashboard'
        : '/admin/dashboard'
    );
  };

  const demoRoles: { role: UserRole; title: string; subtitle: string; icon: string }[] = [
    { role: 'farmer', title: 'Farmer (કિસાન)', subtitle: 'Ramesh Patel • 12 Acres Rajkot', icon: '🌾' },
    { role: 'fpo', title: 'FPO Producer Org', subtitle: 'Saurashtra Kisan Producer Co.', icon: '🏢' },
    { role: 'buyer', title: 'Buyer (Restaurant)', subtitle: 'GreenLeaf Grand Restaurant', icon: '🛒' },
    { role: 'admin', title: 'Admin (DoCA)', subtitle: 'Dr. Alok Verma • AgriTech Officer', icon: '🛡️' },
  ];

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800">
      <div className="text-center space-y-1">
        <Badge variant="success">Role-Based Access Control (RBAC)</Badge>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sign In to FarmSetu
        </h2>
        <p className="text-xs text-slate-500">
          Enter credentials or select a 1-click verified role below
        </p>
      </div>

      {/* 1-Click Role Switcher for Hackathon Judges & Evaluators */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Quick Demo Login (Preloaded Roles):
        </span>
        <div className="grid grid-cols-2 gap-2">
          {demoRoles.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => handleQuickDemoRole(r.role)}
              className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all flex items-start gap-2.5 group"
            >
              <span className="text-2xl">{r.icon}</span>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate group-hover:text-emerald-600">
                  {r.title}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {r.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
        <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-400">Or Standard Auth</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Registered Phone / Email
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Password / OTP
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full gap-1 text-sm py-2.5">
          Sign In as {selectedRole.toUpperCase()} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};
