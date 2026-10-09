import React from 'react';
import { useApp } from '../lib/store';
import { SAMPLE_IMAGES } from '../data/mockData';
import {
  ScanEye,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Cpu,
  BarChart3,
  TrendingDown,
  RefreshCw,
  Boxes,
  Eye,
  HelpCircle,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';

interface LandingIndexPageProps {
  onNavigate: (path: string) => void;
}

export const LandingIndexPage: React.FC<LandingIndexPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, currentUser, login } = useApp();

  const handleQuickLaunch = (role: 'Admin' | 'Operator') => {
    if (role === 'Admin') {
      login('admin@defectiq.ai', 'adminpass', 'Admin');
      onNavigate('/dashboard');
    } else {
      login('operator@defectiq.ai', 'operatorpass', 'Operator');
      onNavigate('/inspection/live');
    }
  };

  return (
    <div className="space-y-12 max-w-[1500px] mx-auto pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172338] via-[#1E293B] to-[#0F172A] text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
        {/* Subtle geometric reticle watermark */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </div>

        {/* Ambient brand radial glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4169E1]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7563E8]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Text - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Edge Computer Vision • v3.4 Production</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Autonomous Quality Intelligence for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4169E1] via-[#60A5FA] to-[#7563E8]">
                Zero-Defect Manufacturing
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              DefectIQ combines high-speed industrial optical vision with deep neural networks to detect, classify, and assess surface & dimensional anomalies in real-time directly on production lines — preventing scrap waste, slashing manual inspection overhead, and enforcing infallible traceability.
            </p>

            {/* Workflow tags */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-300 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">DETECT</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">CLASSIFY</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">ASSESS</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">ALERT</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">ANALYSE</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PREVENT</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => handleQuickLaunch('Operator')}
                className="px-5 py-3 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#4169E1]/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <Play size={16} />
                <span>Launch Line as Operator</span>
              </button>

              <button
                onClick={() => handleQuickLaunch('Admin')}
                className="px-5 py-3 bg-[#7563E8] hover:bg-[#5E4BD4] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#7563E8]/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <ShieldCheck size={16} />
                <span>Launch as Plant Admin</span>
              </button>

              <button
                onClick={() => onNavigate('/about')}
                className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5"
              >
                <span>About Us & Mission</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Hero Right Visual Demonstration Card - 5 cols */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0F172A] p-3.5 border border-slate-700/80 shadow-2xl overflow-hidden group">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>CONVEYOR FEED 01 • ACTIVE</span>
                </div>
                <span className="font-mono text-slate-400">30.2 FPS • 32ms</span>
              </div>

              {/* Optical display mockup with live reticle & defect boxes */}
              <div className="relative rounded-xl overflow-hidden mt-2 aspect-[4/3] bg-slate-950 flex items-center justify-center">
                <img
                  src={SAMPLE_IMAGES.steelPlateDefect}
                  alt="Industrial preview"
                  className="w-full h-full object-contain opacity-90"
                />

                {/* Simulated Bounding Box 1 */}
                <div className="absolute top-[32%] left-[28%] w-[26%] h-[18%] border-2 border-red-500 bg-red-500/15 rounded">
                  <div className="absolute -top-6 left-0 bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                    Surface Crack (95.8%)
                  </div>
                </div>

                {/* Simulated Bounding Box 2 */}
                <div className="absolute top-[55%] left-[67%] w-[14%] h-[18%] border-2 border-amber-500 bg-amber-500/15 rounded">
                  <div className="absolute -top-6 left-0 bg-amber-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                    Inclusion (89.2%)
                  </div>
                </div>

                {/* Scanning Laser Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#4169E1] to-transparent shadow-[0_0_12px_#4169E1] pointer-events-none scanner-beam" />

                {/* Status Watermark */}
                <div className="absolute bottom-2 left-2 bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono border border-slate-700 text-red-400 font-bold">
                  AUTOPASS: BLOCKED • CRITICAL DEFECT
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Class</span>
                  <span className="font-bold text-white text-xs">Rolled Plate</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Confidence</span>
                  <span className="font-bold text-[#4169E1] text-xs font-mono">95.8%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Severity</span>
                  <span className="font-bold text-red-400 text-xs">HIGH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Impact Banner */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs text-center">
          <div className="text-3xl font-black text-[#4169E1] font-mono">98.4%</div>
          <p className="text-xs font-bold text-[#172338] mt-1">Detection Precision</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Benchmarked across 148k+ industrial samples</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs text-center">
          <div className="text-3xl font-black text-[#15976A] font-mono">&lt; 35ms</div>
          <p className="text-xs font-bold text-[#172338] mt-1">Inference Latency</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Edge TPU line speed up to 120 parts/min</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs text-center">
          <div className="text-3xl font-black text-[#7563E8] font-mono">75%</div>
          <p className="text-xs font-bold text-[#172338] mt-1">Manual Overhead Saved</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Eliminates human visual fatigue errors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs text-center">
          <div className="text-3xl font-black text-[#DC4545] font-mono">90%</div>
          <p className="text-xs font-bold text-[#172338] mt-1">Scrap Waste Reduction</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Prevents defective lot propagation</p>
        </div>
      </section>

      {/* Problem vs DefectIQ Solution Matrix */}
      <section className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5EAF2] shadow-xs space-y-8">
        <div>
          <span className="text-[10px] font-bold text-[#4169E1] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            THE CURRENT MANUFACTURING CRISIS & OUR SOLUTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172338] tracking-tight mt-2">
            Why Traditional Inspection Fails & How DefectIQ Solves It
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Manufacturing plants lose millions each year to delayed defect discovery, operator eye fatigue, and subjective quality assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD] space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#DC4545] flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h3 className="font-bold text-sm text-[#172338]">The Problem: Inspector Fatigue</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Human inspectors experience cognitive fatigue after 90 minutes, missing micro-cracks, inclusions, and fine soldering bridges.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs">
              <strong className="text-[#15976A] block">DefectIQ Solution:</strong>
              <p className="text-slate-700 text-[11px] mt-0.5">
                Consistent, 24/7 continuous optical inference at sub-millimeter scale with zero attention decay.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD] space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h3 className="font-bold text-sm text-[#172338]">The Problem: Delayed Discovery</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Flaws discovered at the end of a shift result in scrapping thousands of already-manufactured lot components.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs">
              <strong className="text-[#15976A] block">DefectIQ Solution:</strong>
              <p className="text-slate-700 text-[11px] mt-0.5">
                In-line real-time alerts. Conveyor diverter triggered within 50ms of defect confirmation to isolate root causes.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD] space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D99020] flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h3 className="font-bold text-sm text-[#172338]">The Problem: Subjective Discrepancies</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Different shift operators grade cosmetic vs. structural defects differently, causing customer warranty returns.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs">
              <strong className="text-[#15976A] block">DefectIQ Solution:</strong>
              <p className="text-slate-700 text-[11px] mt-0.5">
                Rule-authoritative quality engine strictly separating statistical certainty from physical engineering severity.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD] space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#4169E1] flex items-center justify-center font-bold text-xs mb-3">
                04
              </div>
              <h3 className="font-bold text-sm text-[#172338]">The Problem: Zero Traceability</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Paper inspection clipboards lack digital image history, preventing root-cause statistical process control.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs">
              <strong className="text-[#15976A] block">DefectIQ Solution:</strong>
              <p className="text-slate-700 text-[11px] mt-0.5">
                Full cryptographic audit trail preserving original frames, bounding boxes, operator reviews, and certified PDF/Excel reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Unique Features Grid */}
      <section className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-[#7563E8] uppercase tracking-widest bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
            SYSTEM ARCHITECTURE & CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172338] tracking-tight mt-2">
            Engineered Specifically for Industrial Factory Environments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4169E1] flex items-center justify-center">
              <Boxes size={20} />
            </div>
            <h3 className="font-bold text-base text-[#172338]">Product-Independent Core</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed from the ground up to support any manufacturing vertical — structural metallurgy, automotive powertrain, precision PCBs, or rotating machinery — through flexible quality rules.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7563E8] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-base text-[#172338]">Confidence vs Severity Separation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unlike generic AI toys, DefectIQ explicitly decouples visual confidence (model certainty) from defect severity (mechanical risk), guaranteeing compliance with ISO/ASTM tolerances.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15976A] flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
            <h3 className="font-bold text-base text-[#172338]">Human-in-the-Loop Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Borderline predictions route to the Manual Review triage station. Operators verify or flag false alarms, recording traceable feedback for model retraining without overwriting original AI telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Launch Callout Footer */}
      <section className="bg-gradient-to-r from-[#4169E1] to-[#7563E8] text-white p-8 sm:p-10 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Ready to test live inspection line?
          </h3>
          <p className="text-xs text-blue-100 max-w-md">
            Trigger real-time optical inferences, simulate conveyor diverts, and explore our quality control analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/inspection/live')}
            className="px-6 py-3 bg-white text-[#4169E1] hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Play size={16} />
            <span>Open Live Station</span>
          </button>
          <button
            onClick={() => onNavigate('/about')}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Read Technical Dossier
          </button>
        </div>
      </section>
    </div>
  );
};
