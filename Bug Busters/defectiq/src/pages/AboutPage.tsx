import React from 'react';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import {
  ScanEye,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  Users,
  Sliders,
  History,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const topics = [
    {
      title: 'Real-Time Edge Computer Vision',
      tag: 'OPTICAL DETECTION',
      desc: 'DefectIQ connects directly to industrial GigE cameras, coaxial vision sensors, and high-speed conveyor lines. Optical frames are evaluated in under 35 milliseconds with multi-defect bounding box coordinates, class categorizations, and sub-millimeter precision.',
      icon: ScanEye,
      color: 'text-[#4169E1] bg-blue-50 border-blue-200'
    },
    {
      title: 'Confidence vs Severity Discipline',
      tag: 'CORE PRINCIPLE',
      desc: 'Confidence describes model certainty in an optical prediction (e.g. 96.2%). Severity describes physical structural risk per engineering rules (CRITICAL, HIGH, MEDIUM, LOW). They are strictly decoupled so minor cosmetic flaws are not confused with structural fractures.',
      icon: ShieldCheck,
      color: 'text-[#7563E8] bg-violet-50 border-violet-200'
    },
    {
      title: 'Human-in-the-Loop Verification',
      tag: 'ACCOUNTABILITY',
      desc: 'Low-confidence predictions (<85%) are automatically quarantined into the Manual Review triage queue. Operators verify or correct the result without overwriting the original AI inference, establishing an immutable audit trail for model retraining.',
      icon: CheckCircle2,
      color: 'text-[#15976A] bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Batch Traceability & SPC Analytics',
      tag: 'PROCESS CONTROL',
      desc: 'Organized around production lots, shifts, and product master specifications. Statistical Process Control (SPC) charts track hourly yields, shift-to-shift performance variance, and defect frequency spikes.',
      icon: BarChart3,
      color: 'text-[#EA580C] bg-orange-50 border-orange-200'
    },
    {
      title: 'Automated Scrap Divert & Workflows',
      tag: 'CONVEYOR INTEGRATION',
      desc: 'Passing units continue automated conveyor transit without human intervention. Detected defects trigger confirmation modals to mark the workpiece as REJECTED, log operator divert reasons, and activate pneumatic divert gates.',
      icon: Layers,
      color: 'text-[#DC4545] bg-red-50 border-red-200'
    },
    {
      title: 'Certified Reporting & Compliance',
      tag: 'ISO 9001 / ASTM',
      desc: 'Generate audit-ready daily quality certificates, batch lot reports, and defect Pareto breakdowns. Fully exportable to certified print-ready PDF and CSV/Excel spreadsheets for ERP synchronization.',
      icon: FileSpreadsheet,
      color: 'text-[#426B8A] bg-slate-50 border-slate-200'
    }
  ];

  const features = [
    {
      name: 'Live Inspection HUD',
      route: '/inspection/live',
      desc: '60:40 desktop layout with live webcam feed, sample presets, scanning laser beam, FPS meter, and separate confidence/severity gauges.'
    },
    {
      name: 'Quality Dashboard',
      route: '/dashboard',
      desc: 'Today’s inspected, passed, rejected, and defect ratio KPIs with interactive Recharts area trends and recent lot logs.'
    },
    {
      name: 'Inspection Dossiers',
      route: '/inspections',
      desc: 'Searchable historical database with multi-facet filters (product, batch, result, severity, operator) and pagination.'
    },
    {
      name: 'Batch Lot Monitoring',
      route: '/batches',
      desc: 'Production lot management tracking quantity, yield progress, shift comparison, and quality scores.'
    },
    {
      name: 'Defect Analytics & Risk Alerting',
      route: '/analytics/defects',
      desc: 'Pareto distributions, temporal anomaly curves, and automated "QUALITY RISK" banners when defect spikes occur.'
    },
    {
      name: 'Manual Review Triage',
      route: '/reviews',
      desc: 'Dedicated operator workbench for confirming or correcting uncertain optical predictions.'
    },
    {
      name: 'Diagnostic Image Testing',
      route: '/test',
      desc: 'Offline diagnostic sandbox with 3-stage visual progress (Uploading → Pre-Processing → AI Detection).'
    },
    {
      name: 'Model Performance Benchmarks',
      route: '/model-performance',
      desc: 'ResNet-101 precision, recall, F1, mAP, confusion matrix, and class-wise performance table.'
    },
    {
      name: 'Role-Based User Administration',
      route: '/admin/users',
      desc: 'Operator and Admin provisioning with role-aware navigation and permissions enforcement.'
    },
    {
      name: 'Immutable Security Audit Trail',
      route: '/admin/audit',
      desc: 'Complete chronological action ledger recording every login, inspection decision, scrap divert, and setting modification.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#172338] flex flex-col">
      {/* Top Navbar */}
      <PublicNavbar currentPath="/about" onNavigate={onNavigate} />

      {/* About Header */}
      <section className="py-12 md:py-16 bg-white border-b border-[#E5EAF2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDF3FF] text-[#4169E1]">
            <Sparkles size={13} className="text-[#7563E8]" />
            <span>About DefectIQ Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172338]">
            AI-Powered Real-Time Industrial Quality Intelligence
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            DefectIQ is an industrial quality control and computer vision platform engineered to eliminate manufacturing defects, prevent material scrap, and enforce human accountability. Built specifically for high-throughput production lines across metallurgy, electronics, automotive, and precision engineering verticals.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Sign In to Access Console</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('/register')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#172338] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Register Operator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Topics Breakdown */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#4169E1] uppercase tracking-wider">
              Engineering Foundations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172338]">
              Platform Topics & Core Architectural Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The fundamental principles that distinguish DefectIQ from generic image upload tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className="bg-white p-6 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${t.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        {t.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#172338]">
                      {t.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features & Modules Directory */}
      <section className="py-16 bg-white border-y border-[#E5EAF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#7563E8] uppercase tracking-wider">
              Integrated Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172338]">
              Complete Feature Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything needed to deploy, monitor, and audit machine vision quality control on the factory floor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.name}
                className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EAF2] hover:bg-[#F2EFFF]/30 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#172338]">{f.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>

                <button
                  onClick={() => onNavigate(f.route)}
                  className="shrink-0 p-2 text-[#4169E1] hover:text-[#3457C2] hover:bg-blue-50 rounded-lg transition-colors"
                  title={`Go to ${f.name}`}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#F5F7FB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172338]">
            Ready to Begin Quality Control?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Log in to the platform or jump directly into the Live Inspection line to test optical detection in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Sign In to Operator Console
            </button>
            <button
              onClick={() => onNavigate('/register')}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
            >
              Register New Account
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
