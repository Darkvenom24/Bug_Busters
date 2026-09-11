import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Sprout, ShieldCheck, Heart, Award } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-white">FarmSetu</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI-Powered Direct Digital Marketplace for Farmers, FPOs & Buyers.
                Digital bridge between farm & buyer.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Smart India Hackathon — PS ID 26033
              </div>
            </div>

            {/* Platform Modules */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/farmer/dashboard" className="hover:text-emerald-400 transition-colors">Farmer Portal (કિસાન પોર્ટલ)</Link></li>
                <li><Link to="/fpo/dashboard" className="hover:text-emerald-400 transition-colors">FPO Aggregation Hub</Link></li>
                <li><Link to="/buyer/dashboard" className="hover:text-emerald-400 transition-colors">Bulk Buyer & Consumer Desk</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-emerald-400 transition-colors">Admin & Verification Desk</Link></li>
              </ul>
            </div>

            {/* AI Core Capabilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">AI Technologies</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Scikit-Learn Demand Forecasting</li>
                <li>Regression-Based Price Intelligence</li>
                <li>Smart Weighted Farmer-Buyer Matching</li>
                <li>Google OR-Tools Route Optimization</li>
                <li>Multilingual Voice AI (Gujarati, Hindi, English)</li>
              </ul>
            </div>

            {/* Problem Statement Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Initiative Context</h4>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
                <p className="font-bold text-slate-200">Department of Consumer Affairs (DoCA)</p>
                <p className="text-[11px] text-slate-400">
                  "Multiple intermediaries reduce farmers' earnings and increase consumer prices."
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Fair Price Architecture
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 FarmSetu — Connecting Agriculture Directly to Opportunity.
            </div>
            <div className="flex items-center gap-4">
              <span>Fewer Middlemen</span>
              <span>•</span>
              <span>Fairer Prices</span>
              <span>•</span>
              <span>Smarter Logistics</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
