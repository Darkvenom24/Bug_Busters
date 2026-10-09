import React from 'react';
import {
  Shield,
  Target,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Sparkles,
  ArrowRight,
  TrendingDown,
  FileCheck2,
  Play,
  RotateCcw
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (path: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 max-w-[1400px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5EAF2] shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF3FF] text-[#4169E1] border border-blue-200">
          <Target size={14} />
          <span>PROJECT GENESIS & ENGINEERING MISSION</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#172338] tracking-tight leading-tight max-w-3xl">
          Why We Developed DefectIQ: Ending the Multi-Billion Dollar Industrial Scrap Crisis
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Modern manufacturing pushes conveyor speeds and precision tolerances to unprecedented limits. Yet quality control has remained shockingly manual, slow, and error-prone. DefectIQ was engineered to solve this fundamental mismatch by placing autonomous computer vision directly onto the factory floor.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('/inspection/live')}
            className="px-5 py-2.5 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Play size={14} />
            <span>Try Live Inspection System</span>
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
          >
            Explore Dashboard
          </button>
        </div>
      </div>

      {/* Section 1: The Core Problem We Set Out to Solve */}
      <section className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            THE ROOT CHALLENGE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172338] tracking-tight mt-2">
            The Critical Flaws of Conventional Factory Quality Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Why manual inspection lines fail in modern high-throughput environments:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-red-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC4545] flex items-center justify-center font-bold text-sm">
              !
            </div>
            <h3 className="font-bold text-base text-[#172338]">Catastrophic Batch Scrapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In traditional plants, products are inspected post-production in batches. When a tool wear or thermal anomaly occurs early in a shift, hundreds or thousands of defective parts pass down the line before detection, resulting in entire lots being condemned to scrap.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-red-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC4545] flex items-center justify-center font-bold text-sm">
              !
            </div>
            <h3 className="font-bold text-base text-[#172338]">Human Physiological Limits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visual inspection under intense factory lighting causes eye fatigue, micro-sleep, and attention lapses. Studies show human operators miss up to 20% to 30% of micro-fissures, sub-millimeter inclusions, or solder bridges during standard shift rotations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-red-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC4545] flex items-center justify-center font-bold text-sm">
              !
            </div>
            <h3 className="font-bold text-base text-[#172338]">Subjective Quality Grading</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Without algorithmic standards, different operators classify borderline blemishes inconsistently. A product rejected on the morning shift might pass on the night shift, leading to customer rejections, warranty penalties, and damaged brand reputation.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: What We Engineered — The DefectIQ Solution */}
      <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E5EAF2] shadow-xs space-y-8">
        <div>
          <span className="text-[10px] font-bold text-[#15976A] uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            OUR PURPOSE-BUILT SOLUTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172338] tracking-tight mt-2">
            AI-Powered In-Line Quality Intelligence in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            DefectIQ operates as an intelligent edge system monitoring conveyor lines 24 hours a day, 7 days a week:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD]">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#4169E1] flex items-center justify-center shrink-0">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172338]">High-Speed Optical In-Line Detection</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Connects directly to GigE cameras and machine vision strobes. Captures frames up to 60+ FPS and evaluates every single passing workpiece with sub-millimeter precision before it reaches finishing stations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD]">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-[#7563E8] flex items-center justify-center shrink-0">
              <Workflow size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172338]">Multi-Class Defect Classification</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Automatically identifies cracks, slag inclusions, solder bridges, porosity, blowholes, and surface scoring. Bounding boxes locate exact coordinates, highlighting flaws with instant visual overlays.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD]">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D99020] flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172338]">Instant Plant Alerts & Automated Rejection</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                When a defect violates configured engineering rules, DefectIQ halts line advance, prompts the operator to divert the defective unit, and triggers desktop/acoustic alarms to prevent repeated errors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-[#F8FAFD]">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15976A] flex items-center justify-center shrink-0">
              <FileCheck2 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172338]">Audit-Ready Traceability & Compliance</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every inspection is permanently logged with timestamps, operator IDs, confidence values, and bounding box images. Export certified PDF lot certificates and CSV summaries for ISO 9001 and ASTM standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Unique Features that Set DefectIQ Apart */}
      <section className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-[#7563E8] uppercase tracking-widest bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
            OUR UNIQUE COMPETITIVE ADVANTAGES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172338] tracking-tight mt-2">
            What Makes DefectIQ Truly Unique
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Built from scratch for real manufacturing environments, avoiding the pitfalls of generic vision demos:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#4169E1] block">01 • MODULARITY</span>
            <h3 className="font-bold text-sm text-[#172338]">Product-Independent Core</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Not locked into a single material. The interface and engine use generic manufacturing taxonomy (Product, Batch, Lot, Inspection) supporting steel, avionics PCBs, castings, and automotive bearings.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#7563E8] block">02 • INTEGRITY</span>
            <h3 className="font-bold text-sm text-[#172338]">Decoupled Confidence & Severity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confidence is model certainty; severity is mechanical engineering risk. DefectIQ never confuses the two, ensuring critical micro-defects are never ignored simply because confidence was borderline.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#15976A] block">03 • ACCOUNTABILITY</span>
            <h3 className="font-bold text-sm text-[#172338]">Non-Destructive Human Loop</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When operators review or correct false alarms, the original AI inference is preserved in the audit log alongside the human remark. No data is silently overwritten, enabling continuous model retraining.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#DC4545] block">04 • PREVENTATIVE</span>
            <h3 className="font-bold text-sm text-[#172338]">Continuous SPC Prevention</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Pareto defect engine identifies repetitive flaw clusters (e.g., 3 consecutive solder bridges) and raises automated "QUALITY RISK" alarms before an entire production run is compromised.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer CTA */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <h3 className="text-lg font-bold">Experience DefectIQ in Action</h3>
          <p className="text-xs text-slate-400 mt-1">
            Step onto the virtual inspection floor and test real defect scenarios now.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/inspection/live')}
            className="px-5 py-2.5 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Launch Live Line</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Back to Home Overview
          </button>
        </div>
      </div>
    </div>
  );
};
