import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Farm<span className="text-emerald-600">Setu</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Digital bridge between farm & buyer
        </p>
      </div>

      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
