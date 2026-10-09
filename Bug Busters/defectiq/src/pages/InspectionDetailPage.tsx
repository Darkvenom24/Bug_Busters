import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { Inspection, DefectItem } from '../types';
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Printer,
  Calendar,
  Layers,
  Boxes,
  User,
  Cpu
} from 'lucide-react';

interface InspectionDetailPageProps {
  inspectionId: string;
  onNavigate: (path: string) => void;
}

export const InspectionDetailPage: React.FC<InspectionDetailPageProps> = ({
  inspectionId,
  onNavigate
}) => {
  const { inspections, verifyInspection, currentUser } = useApp();
  const inspection = inspections.find((i) => i.id === inspectionId) || inspections[0];

  const [decision, setDecision] = useState<'Correct' | 'False Alarm'>('Correct');
  const [remarks, setRemarks] = useState('');
  const [finalClassification, setFinalClassification] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  if (!inspection) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#E5EAF2]">
        <p className="text-sm font-semibold text-slate-700">Inspection record not found.</p>
        <button
          onClick={() => onNavigate('/inspections')}
          className="mt-3 px-4 py-2 text-xs bg-[#4169E1] text-white rounded-xl"
        >
          Back to Inspections History
        </button>
      </div>
    );
  }

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    verifyInspection(
      inspection.id,
      decision,
      finalClassification || undefined,
      remarks || undefined
    );
    setFeedbackSaved(true);
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5EAF2]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/inspections')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#172338]">
                Inspection Dossier #{inspection.id}
              </h2>
              <StatusBadge status={inspection.result} size="sm" />
            </div>
            <p className="text-xs text-slate-400">
              Conducted {inspection.timestamp} by {inspection.operatorName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={() => onNavigate('/inspection/live')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl transition-colors"
          >
            Open Live Station
          </button>
        </div>
      </div>

      {/* Main Grid: Left Image with Bounding Boxes (Section 8.0) | Right Details & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 6 cols: Optical Image & Detection Overlay */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5EAF2] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#172338]">Optical Inspection Frame</span>
              <span className="text-xs font-mono text-slate-400">
                Resolution: 1920x1080 Native
              </span>
            </div>

            {/* Image Viewer with Real Bounding Box Overlays */}
            <div className="relative rounded-xl overflow-hidden bg-[#0F172A] min-h-[380px] flex items-center justify-center">
              <img
                src={inspection.imageUrl}
                alt="Inspected target"
                className="w-full h-full object-contain select-none"
              />

              {/* Bounding Boxes */}
              {inspection.defects.map((defect: DefectItem) => (
                <div
                  key={defect.id}
                  className={`absolute rounded border-2 border-red-500 bg-red-500/15`}
                  style={{
                    left: `${defect.box.x}%`,
                    top: `${defect.box.y}%`,
                    width: `${defect.box.width}%`,
                    height: `${defect.box.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    {defect.type} ({defect.confidence.toFixed(1)}%)
                  </div>
                </div>
              ))}

              {/* Reticle grid watermark */}
              <div className="absolute top-2 left-2 bg-[#0F172A]/80 text-white px-2 py-1 rounded text-[10px] font-mono border border-slate-700">
                AI DETECT OVERLAY ACTIVE
              </div>
            </div>
          </div>

          {/* Multiple Defects Summary */}
          {inspection.defects.length > 0 && (
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700">
                Detected Defect Instances ({inspection.defects.length})
              </span>
              <div className="space-y-1.5">
                {inspection.defects.map((def) => (
                  <div
                    key={def.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-[#F8FAFD] text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{def.type}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">{def.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#4169E1] font-bold">
                        {def.confidence.toFixed(1)}%
                      </span>
                      <SeverityBadge severity={def.severity} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 6 cols: Metadata, AI Hypotheses, & Human Verification */}
        <div className="lg:col-span-6 space-y-5">
          {/* Metadata Dossier */}
          <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Inspection Telemetry & Metadata
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Product Specification</span>
                <span className="font-bold text-[#172338]">{inspection.productName}</span>
                <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                  ID: {inspection.productId}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Production Batch</span>
                <span className="font-bold text-[#172338]">{inspection.batchId}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Category: {inspection.productCategory}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Model Architecture</span>
                <span className="font-mono font-semibold text-[#7563E8]">{inspection.modelVersion}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">Edge Inference Engine</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFD] border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Assigned Inspector</span>
                <span className="font-semibold text-slate-800">{inspection.operatorName}</span>
                <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                  ID: {inspection.operatorId}
                </span>
              </div>
            </div>

            {/* Confidence vs Severity Separation */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="text-xs text-blue-900 font-medium block">Inference Confidence</span>
                <span className="text-2xl font-extrabold text-[#4169E1] font-mono">
                  {inspection.overallConfidence.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  AI classification certainty
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-700 font-medium block">Configured Severity</span>
                <div className="mt-1">
                  <SeverityBadge severity={inspection.overallSeverity} size="md" />
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Structural QC tolerance impact
                </span>
              </div>
            </div>

            {/* AI Recommendation */}
            {inspection.recommendation && (
              <div className="p-3.5 rounded-xl bg-[#F2EFFF]/40 border border-violet-100 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-[#7563E8] font-bold text-[11px]">
                  <Sparkles size={13} />
                  <span>AI Root Cause Hypothesis</span>
                </div>
                <p className="text-slate-700 text-[11px]">
                  <strong>Possible Cause:</strong> {inspection.recommendation.possibleCause}
                </p>
                <p className="text-slate-700 text-[11px]">
                  <strong>Action:</strong> {inspection.recommendation.suggestedAction}
                </p>
              </div>
            )}
          </div>

          {/* Section 8: Human Verification & Feedback Loop */}
          <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#4169E1]" />
                <h3 className="text-sm font-bold text-[#172338]">Human Verification Loop</h3>
              </div>
              {inspection.verification?.isVerified && (
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                  Verified by {inspection.verification.reviewer}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Was the AI model's automated detection correct? Your feedback preserves the original AI output while generating a traceable correction for model retraining.
            </p>

            <form onSubmit={handleSaveVerification} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Was this result correct?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision('Correct')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      decision === 'Correct'
                        ? 'border-[#15976A] bg-emerald-50 text-[#15976A]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle size={14} />
                    <span>Correct Prediction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('False Alarm')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      decision === 'False Alarm'
                        ? 'border-[#DC4545] bg-red-50 text-[#DC4545]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <AlertTriangle size={14} />
                    <span>False Alarm</span>
                  </button>
                </div>
              </div>

              {decision === 'False Alarm' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correct Classification
                  </label>
                  <input
                    type="text"
                    value={finalClassification}
                    onChange={(e) => setFinalClassification(e.target.value)}
                    placeholder="e.g. Superficial Oil Stain (Non-Defect)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inspector Remarks & Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record optical calibration or physical micrometric measurements..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {feedbackSaved ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle size={14} /> Verification recorded into audit trail!
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Original AI prediction will be preserved.
                  </span>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Submit Human Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
