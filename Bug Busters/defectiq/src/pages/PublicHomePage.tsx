import React from 'react';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { SAMPLE_IMAGES } from '../data/mockData';
import {
  ShieldCheck,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  LogIn,
  UserPlus,
  Lock
} from 'lucide-react';

interface PublicHomePageProps {
  onNavigate: (path: string) => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({ onNavigate }) => {
  const workflowSteps = [
    { step: '01', title: 'DETECT', desc: 'Sub-millimeter edge optical scanning across active conveyor lines.', color: 'from-blue-500 to-indigo-600' },
    { step: '02', title: 'CLASSIFY', desc: 'Deep neural categorization of cracks, bridges, slag inclusions, and blowholes.', color: 'from-indigo-600 to-violet-600' },
    { step: '03', title: 'ASSESS', desc: 'Strict separation of AI confidence from mechanical structural severity.', color: 'from-violet-600 to-purple-600' },
    { step: '04', title: 'ALERT', desc: 'Automated conveyor divert gates and acoustic floor notifications.', color: 'from-purple-600 to-pink-600' },
    { step: '05', title: 'ANALYSE', desc: 'Pareto frequency breakdowns and statistical process control (SPC).', color: 'from-pink-600 to-rose-600' },
    { step: '06', title: 'PREVENT', desc: 'Traceable root-cause engineering checks to halt repeat line drift.', color: 'from-rose-600 to-emerald-600' },
  ];

  const industries = [
    { title: 'Structural Metallurgy', spec: 'Hot/cold rolled steel plates, billet micro-fissures, surface slag inclusions.' },
    { title: 'Electronics & Avionics', spec: 'SMD controller PCBs, 0.3mm solder bridges, missing passive components.' },
    { title: 'Automotive Powertrain', spec: 'Forged wheel hubs, cast manifold porosity, precision thread burrs.' },
    { title: 'Rotating Machinery', spec: 'High-speed ball bearings, race track spalling, elastomer seal displacements.' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#172338] flex flex-col">
      {/* Top Navigation: Home, About, Register, Login */}
      <PublicNavbar currentPath="/" onNavigate={onNavigate} />

      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="homeGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#000000" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#homeGrid)" />
          </svg>
        </div>

        {/* Brand light accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#4169E1]/10 via-[#7563E8]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#EDF3FF] text-[#4169E1] border border-blue-200/80 shadow-2xs">
            <Sparkles size={14} className="text-[#7563E8]" />
            <span>Welcome to DefectIQ Quality Intelligence</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#172338] max-w-4xl mx-auto leading-[1.15]">
            Detect Defects.{' '}
            <span className="text-[#4169E1]">Ensure Quality.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] via-[#7563E8] to-[#426B8A]">
              Prevent Industrial Waste.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A product-independent, AI-powered industrial inspection platform. Real-time optical anomaly detection, automated severity assessment, lot traceability, and human verification accountability.
          </p>

          {/* Authentication Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3.5 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-[#4169E1]/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <LogIn size={16} />
              <span>Sign In to Access Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('/register')}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#172338] border border-[#E5EAF2] text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <UserPlus size={16} className="text-[#4169E1]" />
              <span>Register New Account</span>
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className="px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#4169E1] rounded-2xl transition-colors flex items-center gap-1.5"
            >
              <span>Learn About System</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Live Preview Card */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-[#E5EAF2] bg-white p-3 sm:p-4 shadow-xl overflow-hidden">
              <div className="rounded-2xl bg-[#0F172A] relative overflow-hidden min-h-[300px] sm:min-h-[440px] flex items-center justify-center">
                <img
                  src={SAMPLE_IMAGES.steelPlateDefect}
                  alt="Industrial inspection workpiece"
                  className="w-full h-full object-contain select-none opacity-90"
                />

                {/* Overlaid bounding box mockup */}
                <div
                  className="absolute border-2 border-red-500 bg-red-500/15 rounded pointer-events-none"
                  style={{ left: '28%', top: '32%', width: '26%', height: '16%' }}
                >
                  <div className="absolute -top-7 left-0 bg-red-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow whitespace-nowrap uppercase tracking-wider">
                    Surface Crack • 94.7% Conf
                  </div>
                </div>

                <div
                  className="absolute border-2 border-amber-500 bg-amber-500/15 rounded pointer-events-none"
                  style={{ left: '67%', top: '55%', width: '14%', height: '18%' }}
                >
                  <div className="absolute -top-7 left-0 bg-amber-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow whitespace-nowrap uppercase tracking-wider">
                    Slag Inclusion • 89.2%
                  </div>
                </div>

                {/* Reticle grid watermark */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OPTICAL INSPECTION SIMULATION: 29.8 FPS</span>
                </div>

                {/* Live HUD Bottom Card - Protected Console */}
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 bg-[#0F172A]/90 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-red-600 text-white rounded font-bold uppercase text-[10px]">
                      FAIL (REJECT)
                    </span>
                    <div>
                      <p className="font-bold text-sm">Rolled Precision Steel Plate 12mm</p>
                      <p className="text-[11px] text-slate-400 font-mono">Lot #BATCH-102 • Inspection ID: INSP-2041</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Model Confidence</span>
                      <span className="font-mono font-bold text-base text-[#4169E1]">94.7%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Structural Severity</span>
                      <span className="font-mono font-bold text-base text-red-400">HIGH</span>
                    </div>
                    <button
                      onClick={() => onNavigate('/login')}
                      className="px-3.5 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
                    >
                      <Lock size={12} />
                      <span>Sign In to Access Line</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Operational Lifecycle */}
      <section className="py-16 bg-white border-y border-[#E5EAF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#4169E1] uppercase tracking-wider">
              End-to-End Operational Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172338]">
              The Core Quality Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              An authoritative 6-stage lifecycle engineered to eliminate defect escapement and ensure accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((ws) => (
              <div
                key={ws.step}
                className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EAF2] hover:border-blue-300 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <span className="text-xs font-black font-mono text-slate-400 group-hover:text-[#4169E1] transition-colors">
                    {ws.step}
                  </span>
                  <h3 className="text-base font-extrabold text-[#172338] mt-1 tracking-tight">
                    {ws.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ws.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Manufacturing Disciplines */}
      <section className="py-16 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#7563E8] uppercase tracking-wider">
              Product-Independent Design
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172338]">
              Engineered Across Manufacturing Verticals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The neural detection architecture supports generic products, configurable quality rules, and multi-sensor inputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((ind) => (
              <div
                key={ind.title}
                className="bg-white p-6 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4169E1] flex items-center justify-center font-bold">
                  <Boxes size={20} />
                </div>
                <h3 className="text-sm font-bold text-[#172338] pt-1">{ind.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ind.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Highlights Banner */}
      <section className="py-16 bg-gradient-to-br from-[#172338] via-[#1E293B] to-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-[#7563E8] uppercase tracking-wider">
              Protected Quality Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Ready to Access DefectIQ Platform?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sign in with your plant credentials or register a new operator account to access the live dashboard, batches, and optical vision inspection station.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3.5 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <LogIn size={15} />
              <span>Operator Sign In</span>
            </button>

            <button
              onClick={() => onNavigate('/register')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-2"
            >
              <UserPlus size={15} />
              <span>Register Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="mt-auto bg-white border-t border-[#E5EAF2] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-800">DefectIQ</span>
            <span className="text-slate-300">|</span>
            <span>AI-Powered Real-Time Industrial Quality Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/')} className="hover:text-[#4169E1]">Home</button>
            <button onClick={() => onNavigate('/about')} className="hover:text-[#4169E1]">About</button>
            <button onClick={() => onNavigate('/login')} className="hover:text-[#4169E1]">Sign In</button>
            <button onClick={() => onNavigate('/register')} className="hover:text-[#4169E1]">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
