import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import {
  Sprout,
  TrendingUp,
  Coins,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Store,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const Home: React.FC = () => {
  const { switchRole } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-green-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Smart India Hackathon • Problem Statement ID: 26033 (DoCA)
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Farm<span className="text-emerald-400">Setu</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-emerald-100">
              AI-Powered Direct Digital Marketplace for Farmers, FPOs & Buyers
            </p>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Digital bridge between farm & buyer. From farm to buyer — fewer middlemen, fairer prices, smarter logistics. Eliminating multi-tier price inflation through artificial intelligence and optimized supply chain aggregation.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link to="/marketplace">
                <Button size="lg" variant="primary" className="gap-2 text-base px-6">
                  <Store className="w-5 h-5" /> Explore Direct Marketplace
                </Button>
              </Link>
              <Link to="/farmer/dashboard">
                <Button size="lg" variant="harvest" className="gap-2 text-base px-6">
                  <Sprout className="w-5 h-5" /> Farmer Portal (કિસાન)
                </Button>
              </Link>
              <Link to="/logistics">
                <Button size="lg" variant="outline" className="gap-2 text-white border-slate-600 hover:bg-white/10 text-base px-5">
                  <Truck className="w-5 h-5" /> Smart Logistics & Routes
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
              <div>
                <div className="text-2xl font-black text-white">35%+</div>
                <div className="text-xs text-slate-400">Farmer Income Surge</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">28.4%</div>
                <div className="text-xs text-slate-400">Logistics Cost Saved</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">92%</div>
                <div className="text-xs text-slate-400">Smart Match Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">3 Languages</div>
                <div className="text-xs text-slate-400">Gujarati / Hindi / English</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Comparison: Traditional Supply Chain vs FarmSetu (From PDF Page 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="warning">The Core Agricultural Bottleneck</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Why We Need FarmSetu: Cutting 5 Middlemen
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Problem Statement ID 26033: Multiple intermediaries reduce farmers' earnings and increase consumer prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Intermediary Chain */}
          <Card className="p-6 border-rose-200/80 dark:border-rose-950/60 bg-rose-50/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base text-rose-900 dark:text-rose-300">
                  Traditional Intermediary Model
                </h3>
              </div>
              <Badge variant="default" className="text-rose-600 bg-rose-100">High Leakage</Badge>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: '1. Farmer', note: 'Gets only ₹15/kg for tomatoes' },
                { name: '2. Local Village Trader', note: 'Takes ~10% cut' },
                { name: '3. Mandi Wholesaler', note: 'Mandi tax + auction markup' },
                { name: '4. Regional Distributor', note: 'Warehousing & transport cut' },
                { name: '5. Local Retailer', note: 'High retail markup' },
                { name: '6. Consumer / Bulk Buyer', note: 'Pays ₹45/kg (300% inflated)' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{step.name}</span>
                  <span className="text-slate-500 text-[11px]">{step.note}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-rose-700 dark:text-rose-400 pt-2 font-medium">
              Result: Farmers receive less than 35% of consumer spend; high spoilage during multiple hand-offs.
            </p>
          </Card>

          {/* FarmSetu Direct Model */}
          <Card className="p-6 border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                  FarmSetu AI Direct Pipeline
                </h3>
              </div>
              <Badge variant="success">Zero Middlemen</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Farmer / FPO Producer Org</span>
                  <span className="text-[11px] text-slate-500">Lists produce with AI Fair Price Recommendation</span>
                </div>
                <span className="font-extrabold text-emerald-600 text-sm">Receives ₹31/kg (+106%)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <div>
                    <span className="font-extrabold block">FarmSetu AI Engine</span>
                    <span className="text-[10px] text-emerald-100">Demand Forecast • Fair Price • Smart Match • Route Optimizer</span>
                  </div>
                </div>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-bold">Direct Bridge</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Consumer & Institutional Bulk Buyer</span>
                  <span className="text-[11px] text-slate-500">Fresh produce procured directly with verified grading</span>
                </div>
                <span className="font-extrabold text-slate-800 dark:text-white text-sm">Pays ₹33/kg (Save 26%)</span>
              </div>
            </div>

            <p className="text-xs text-emerald-700 dark:text-emerald-400 pt-2 font-medium">
              Result: Farmers earn 75%+ of purchase value; buyers receive guaranteed fresh Grade-A produce at fair rates!
            </p>
          </Card>
        </div>
      </section>

      {/* 4 User Roles Portals Showcase (PDF Page 2-4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="info">Role-Based Access Control</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Tailored Portals for Every Supply Chain Participant
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Click any portal below to explore with demo data and preloaded actions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Farmer */}
          <Card hoverEffect className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-2xl">
                🌾
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Farmer (કિસાન)
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Register profile & farm land</li>
                <li>List produce with AI price guidance</li>
                <li>View market demand trends</li>
                <li>Multilingual voice assistant</li>
                <li>Direct buyer requests & earnings</li>
              </ul>
            </div>
            <Link
              to="/farmer/dashboard"
              onClick={() => switchRole('farmer')}
              className="mt-6 block"
            >
              <Button variant="primary" size="sm" className="w-full gap-1">
                Enter Farmer Portal <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          {/* FPO */}
          <Card hoverEffect className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl">
                🏢
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                FPO Producer Org
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Manage registered farmers</li>
                <li>Aggregate micro-lots into bulk lots</li>
                <li>Respond to institutional demand</li>
                <li>Logistics hub coordination</li>
                <li>AI regional demand forecasts</li>
              </ul>
            </div>
            <Link
              to="/fpo/dashboard"
              onClick={() => switchRole('fpo')}
              className="mt-6 block"
            >
              <Button variant="harvest" size="sm" className="w-full gap-1">
                Enter FPO Portal <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          {/* Buyer */}
          <Card hoverEffect className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-2xl">
                🛒
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Buyer & Institutional
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Restaurants, Hotels, Retailers</li>
                <li>Post bulk procurement requirements</li>
                <li>AI ranked farmer matching (92%)</li>
                <li>Direct order placement</li>
                <li>Live GPS delivery tracking</li>
              </ul>
            </div>
            <Link
              to="/buyer/dashboard"
              onClick={() => switchRole('buyer')}
              className="mt-6 block"
            >
              <Button variant="secondary" size="sm" className="w-full gap-1">
                Enter Buyer Portal <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          {/* Admin */}
          <Card hoverEffect className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Admin & DoCA Desk
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Farmer & buyer KYC verification</li>
                <li>Product & order oversight</li>
                <li>Dispute & complaint resolution</li>
                <li>Logistics fleet monitoring</li>
                <li>DoCA market analytics</li>
              </ul>
            </div>
            <Link
              to="/admin/dashboard"
              onClick={() => switchRole('admin')}
              className="mt-6 block"
            >
              <Button variant="outline" size="sm" className="w-full gap-1">
                Enter Admin Portal <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* AI Key Capabilities (PDF Page 12: AI vs Automation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge variant="purple">AI vs Automation Architecture</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Intelligent Closed-Loop AgriTech Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Market Data → AI Prediction → Better Decisions → Better Matching → Efficient Logistics → Successful Transactions → Better Future Predictions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> AI Engine Responsibilities
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <strong>Demand Forecasting:</strong> Scikit-learn time-series predicting upcoming 30-day regional surges.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <strong>Price Recommendation:</strong> Multi-factor regression (Mandi reference + quality + season + distance).
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <strong>Smart Matching:</strong> Weighted scoring matching buyers with farmers based on distance, quantity, and grade.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <strong>Route Optimization:</strong> Google OR-Tools solving multi-pickup logistics with freshness prioritization.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <strong>Multilingual NLP Assistant:</strong> Intent parser for Gujarati, Hindi, and English voice commands.
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <Layers className="w-4 h-4" /> Automated Workflow Engine
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <strong>Order Lifecycle:</strong> 6-step progression with real-time state synchronization.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <strong>Bulk Aggregation:</strong> Grouping compatible orders from smallholders to fill bulk buyer demands.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <strong>Event Notifications:</strong> Real-time alerts for price changes, pickups, and matched buyers.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <strong>Rating & Trust System:</strong> Mutual verification system building confidence between parties.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <strong>DoCA Reporting:</strong> Intermediary savings and farm gate price analytics.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
