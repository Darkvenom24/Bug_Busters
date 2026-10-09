import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { Inspection } from '../types';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Sparkles,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ManualReviewPageProps {
  onNavigate: (path: string) => void;
}

export const ManualReviewPage: React.FC<ManualReviewPageProps> = ({ onNavigate }) => {
  const { inspections, verifyInspection, currentUser } = useApp();

  // Find all inspections that need review or are flagged MANUAL REVIEW
  const reviewQueue = inspections.filter(
    (i) => i.result === 'MANUAL REVIEW' || (i.defects.length > 0 && !i.verification?.isVerified)
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedInspection: Inspection | undefined = reviewQueue[selectedIndex] || reviewQueue[0];

  const [remarks, setRemarks] = useState('');
  const [correctedDefect, setCorrectedDefect] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const handleDecision = (decisionType: 'Correct' | 'False Alarm' | 'Further Review') => {
    if (!selectedInspection) return;

    if (decisionType === 'Further Review') {
      setFeedbackSuccess('Marked for Secondary Metrology Station');
      setTimeout(() => setFeedbackSuccess(null), 2500);
      return;
    }

    verifyInspection(
      selectedInspection.id,
      decisionType,
      correctedDefect || undefined,
      remarks || undefined
    );

    setFeedbackSuccess(`Decision recorded: ${decisionType}`);
    setTimeout(() => {
      setFeedbackSuccess(null);
      setRemarks('');
      setCorrectedDefect('');
      if (selectedIndex < reviewQueue.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    }, 1200);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#172338] tracking-tight">
              Manual Review & Human-in-the-Loop Queue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {reviewQueue.length} Pending Verifications
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operator triage for low-confidence optical inferences and borderline dimensional defects.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/inspection/live')}
          className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          Return to Live Station
        </button>
      </div>

      {reviewQueue.length > 0 && selectedInspection ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 4 cols: Queue list */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5EAF2] p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Awaiting Verification ({reviewQueue.length})
            </span>

            <div className="space-y-2 overflow-y-auto max-h-[580px]">
              {reviewQueue.map((insp, idx) => (
                <button
                  key={insp.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setFeedbackSuccess(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    idx === selectedIndex
                      ? 'border-[#4169E1] bg-[#EDF3FF] shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#172338]">{insp.id}</span>
                      <StatusBadge status={insp.result} size="sm" />
                    </div>
                    <p className="text-slate-600 font-medium truncate max-w-[200px]">
                      {insp.productName}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">{insp.timestamp}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-[#4169E1] block">
                      {insp.overallConfidence.toFixed(1)}%
                    </span>
                    <SeverityBadge severity={insp.overallSeverity} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right 8 cols: Active Verification Workspace */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-slate-400">{selectedInspection.id}</span>
                <h3 className="text-base font-bold text-[#172338]">{selectedInspection.productName}</h3>
              </div>
              <StatusBadge status={selectedInspection.result} size="md" />
            </div>

            {/* Inspection Image Preview with Overlaid Box */}
            <div className="relative rounded-xl overflow-hidden bg-[#0F172A] min-h-[340px] flex items-center justify-center">
              <img
                src={selectedInspection.imageUrl}
                alt="Inspection frame"
                className="w-full h-full object-contain"
              />

              {/* Bounding box */}
              {selectedInspection.defects.map((d) => (
                <div
                  key={d.id}
                  className="absolute border-2 border-amber-400 bg-amber-400/20 rounded"
                  style={{
                    left: `${d.box.x}%`,
                    top: `${d.box.y}%`,
                    width: `${d.box.width}%`,
                    height: `${d.box.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-amber-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow">
                    {d.type} ({d.confidence.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>

            {/* Telemetry Comparison (Original AI vs Current) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFD] border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Model Prediction</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {selectedInspection.defects[0]?.type || 'Standard Form'}
                </span>
                <span className="text-slate-500 font-mono text-[10px] mt-1 block">
                  Model: {selectedInspection.modelVersion}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#EDF3FF] border border-blue-100">
                <span className="text-blue-900 block text-[10px] font-semibold">Model Confidence</span>
                <span className="font-mono font-black text-xl text-[#4169E1] mt-0.5 block">
                  {selectedInspection.overallConfidence.toFixed(1)}%
                </span>
                <span className="text-slate-500 text-[10px] block">
                  Threshold: 85.0% required for auto-pass
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFD] border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Assigned Severity</span>
                <div className="mt-1">
                  <SeverityBadge severity={selectedInspection.overallSeverity} size="md" />
                </div>
                <span className="text-slate-500 text-[10px] block mt-1">
                  Location: {selectedInspection.defects[0]?.location || 'N/A'}
                </span>
              </div>
            </div>

            {/* Human Decision Form & Actions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFD] space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800">Operator Review Decision</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Corrected Defect Classification (if inaccurate)
                  </label>
                  <input
                    type="text"
                    value={correctedDefect}
                    onChange={(e) => setCorrectedDefect(e.target.value)}
                    placeholder="e.g. Superficial Reflection (False Alarm)"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Operator Verification Remarks
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Measurements confirmed under 20x magnification..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none"
                  />
                </div>
              </div>

              {feedbackSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={15} />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              {/* Decision Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleDecision('Correct')}
                  className="px-4 py-2 bg-[#15976A] hover:bg-[#0F6F4E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  <span>Confirm AI Prediction</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('False Alarm')}
                  className="px-4 py-2 bg-[#DC4545] hover:bg-[#B02828] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  <span>Reject Prediction (False Alarm)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision('Further Review')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle size={14} />
                  <span>Mark for Metrology Lab</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-2xl border border-[#E5EAF2]">
          <CheckSquare size={36} className="mx-auto mb-3 text-emerald-500 opacity-60" />
          <h3 className="text-sm font-bold text-slate-800">Verification Queue is Clear</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            All low-confidence predictions and manual inspection requests have been verified.
          </p>
          <button
            onClick={() => onNavigate('/inspection/live')}
            className="mt-4 px-4 py-2 bg-[#4169E1] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#3457C2]"
          >
            Go to Live Inspection Line
          </button>
        </div>
      )}
    </div>
  );
};
