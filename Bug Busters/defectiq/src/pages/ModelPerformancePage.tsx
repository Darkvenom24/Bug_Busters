import React from 'react';
import { INITIAL_MODEL_METRIC } from '../data/mockData';
import {
  Cpu,
  Layers,
  Database,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Activity,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const metric = INITIAL_MODEL_METRIC;

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#172338] tracking-tight">
              AI Vision Model Performance & Benchmarks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F2EFFF] text-[#7563E8] border border-violet-200">
              {metric.version}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Neural network validation metrics, confusion matrix, and class-wise precision evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Trained on: {metric.lastTrained}</span>
          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200">
            PROD READY
          </span>
        </div>
      </div>

      {/* Top 4 Primary Benchmark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Precision</span>
          <div className="text-3xl font-black text-[#172338] font-mono mt-1">
            {metric.precision}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">True positive defect accuracy</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Recall</span>
          <div className="text-3xl font-black text-[#4169E1] font-mono mt-1">
            {metric.recall}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Defect capture sensitivity</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">F1 Score</span>
          <div className="text-3xl font-black text-[#15976A] font-mono mt-1">
            {metric.f1Score}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Harmonic precision-recall mean</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">mAP @0.5 IoU</span>
          <div className="text-3xl font-black text-[#7563E8] font-mono mt-1">
            {metric.mAP}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mean average localization precision</p>
        </div>
      </div>

      {/* Architecture & Dataset details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] space-y-1">
          <span className="text-slate-400 font-medium">Model Architecture</span>
          <p className="font-bold text-slate-800 text-sm">{metric.name}</p>
          <span className="text-slate-500 font-mono text-[11px] block">
            ResNet-101 Backbone + FPN + Anchor-free Head
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] space-y-1">
          <span className="text-slate-400 font-medium">Training Ground Truth Corpus</span>
          <p className="font-bold text-slate-800 text-sm">
            {metric.datasetSize.toLocaleString()} Annotated Industrial Frames
          </p>
          <span className="text-slate-500 text-[11px] block">
            Multi-spectral optical & X-ray radiographic samples
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] space-y-1">
          <span className="text-slate-400 font-medium">Inference Latency Profile</span>
          <p className="font-bold text-slate-800 text-sm">32.4 ms per Frame (Edge TPU)</p>
          <span className="text-slate-500 text-[11px] block">
            Supports conveyor belt speeds up to 120 items/min
          </span>
        </div>
      </div>

      {/* Class-wise Performance Table (Section 17.0) */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172338]">Class-Wise Performance Breakdown</h3>
            <p className="text-xs text-slate-400">Per-defect category detection benchmarks</p>
          </div>
          <span className="text-xs font-medium text-slate-500">5 Active Defect Classes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Defect Class</th>
                <th className="py-3 px-4">Evaluation Samples</th>
                <th className="py-3 px-4">Class Precision</th>
                <th className="py-3 px-4">Class Recall</th>
                <th className="py-3 px-4">F1 Score</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metric.classes.map((cls) => (
                <tr key={cls.className} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-[#172338]">{cls.className}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{cls.sampleCount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#4169E1]">{cls.precision}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#15976A]">{cls.recall}%</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{cls.f1Score}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      OPTIMIZED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix (Section 17.0) */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#172338]">Validation Confusion Matrix</h3>
          <p className="text-xs text-slate-400">
            True label (rows) vs Predicted label (columns) on held-out test split (10,000 units)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border border-slate-200">
            <thead>
              <tr className="bg-[#F8FAFD] border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3 text-left">Ground Truth \ Predicted</th>
                {metric.confusionMatrix.labels.map((l) => (
                  <th key={l} className="p-3">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metric.confusionMatrix.labels.map((label, rIdx) => (
                <tr key={label}>
                  <td className="p-3 text-left font-bold bg-slate-50 border-r border-slate-200 text-slate-800">
                    {label}
                  </td>
                  {metric.confusionMatrix.matrix[rIdx].map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <td
                        key={cIdx}
                        className={`p-3 font-mono font-semibold ${
                          isDiagonal
                            ? 'bg-emerald-50 text-emerald-800 font-bold'
                            : val > 20
                            ? 'bg-red-50 text-red-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
