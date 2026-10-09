import React from 'react';
import { Inspection, Product, Batch } from '../../types';
import { StatusBadge, SeverityBadge } from '../common/StatusBadge';
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  AlertOctagon,
  Wrench,
  Sparkles,
  Layers
} from 'lucide-react';

interface ProductInfoPanelProps {
  inspection: Inspection | null;
  product: Product | undefined;
  batch: Batch | undefined;
  isInspecting: boolean;
  isPaused: boolean;
  onStartInspection: () => void;
  onPauseInspection: () => void;
  onResumeInspection: () => void;
  onRetryInspection: () => void;
  onOpenRemoveModal: () => void;
  onSendManualReview: () => void;
  onAcceptProduct: () => void;
  onViewDetails: (inspectionId: string) => void;
}

export const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({
  inspection,
  product,
  batch,
  isInspecting,
  isPaused,
  onStartInspection,
  onPauseInspection,
  onResumeInspection,
  onRetryInspection,
  onOpenRemoveModal,
  onSendManualReview,
  onAcceptProduct,
  onViewDetails
}) => {
  if (!inspection) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-[#E5EAF2] text-center text-slate-500">
        <Layers size={40} className="text-slate-300 mb-3" />
        <h3 className="text-sm font-semibold text-slate-800">No Active Inspection</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Select product parameters and press Start Inspection to initiate real-time AI optical evaluation.
        </p>
        <button
          onClick={onStartInspection}
          className="mt-4 px-4 py-2 bg-[#4169E1] text-white rounded-xl text-xs font-semibold hover:bg-[#3457C2] transition-colors flex items-center gap-2"
        >
          <Play size={14} /> Start Inspection Run
        </button>
      </div>
    );
  }

  const isPass = inspection.result === 'PASS';
  const isFail = inspection.result === 'FAIL';
  const isManualReview = inspection.result === 'MANUAL REVIEW';
  const isError = inspection.result === 'INSPECTION ERROR';

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Dynamic Workflow Status Banner */}
        {isPass && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 size={20} className="text-[#15976A] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900 tracking-tight">PRODUCT PASSED</p>
              <p className="text-xs text-emerald-700 mt-0.5">No visible defect detected within nominal tolerance.</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Conveyor clearance confirmed. Continuing automated cycle...
              </p>
            </div>
          </div>
        )}

        {isFail && (
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 flex items-start gap-3 animate-in fade-in">
            <AlertOctagon size={20} className="text-[#DC4545] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-950 tracking-tight">QUALITY VIOLATION DETECTED</p>
              <p className="text-xs text-red-800 mt-0.5">
                Defect exceeds configured quality threshold. Operator action required.
              </p>
              {inspection.operatorDecision && (
                <p className="text-[11px] font-semibold text-red-700 mt-1">
                  Current Decision: {inspection.operatorDecision}
                </p>
              )}
            </div>
          </div>
        )}

        {isManualReview && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-start gap-3 animate-in fade-in">
            <AlertTriangle size={20} className="text-[#D99020] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-950 tracking-tight">MANUAL REVIEW REQUIRED</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Model confidence ({inspection.overallConfidence}%) below auto-pass threshold. Human verification required.
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 flex items-start gap-3 animate-in fade-in">
            <AlertOctagon size={20} className="text-[#4285D4] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-950 tracking-tight">INSPECTION ERROR</p>
              <p className="text-xs text-blue-800 mt-0.5">
                Optical feed frame did not meet clarity or trigger criteria.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Product Information */}
        <div className="rounded-xl border border-slate-200/90 bg-[#F8FAFD] p-3.5 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Product Information
            </span>
            <button
              onClick={() => onViewDetails(inspection.id)}
              className="text-[11px] font-semibold text-[#4169E1] hover:underline inline-flex items-center gap-1"
            >
              <span>Audit Record</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Product ID</span>
              <span className="font-mono font-semibold text-[#172338]">{inspection.productId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Category</span>
              <span className="text-slate-700 truncate block font-medium">
                {product?.category || inspection.productCategory}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Batch ID</span>
              <span className="font-mono font-semibold text-[#172338]">{inspection.batchId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Inspection ID</span>
              <span className="font-mono text-slate-700 font-medium">{inspection.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Timestamp</span>
              <span className="text-slate-600 font-mono text-[11px]">{inspection.timestamp}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Operator</span>
              <span className="text-slate-700 font-medium">{inspection.operatorName}</span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Result (Confidence & Severity strictly separated) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              AI Inference Result
            </span>
            <StatusBadge status={inspection.result} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Confidence Box */}
            <div className="rounded-lg bg-[#EDF3FF] border border-blue-100 p-2.5">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                Model Confidence
              </span>
              <span className="text-xl font-extrabold text-[#4169E1] font-mono leading-tight">
                {inspection.overallConfidence.toFixed(1)}%
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Certainty in visual classification
              </span>
            </div>

            {/* Severity Box */}
            <div className="rounded-lg bg-[#F8FAFD] border border-slate-200 p-2.5">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                Defect Severity
              </span>
              <div className="mt-1">
                <SeverityBadge severity={inspection.overallSeverity} size="md" />
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Impact per QC specification rules
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 text-xs text-slate-600">
            <span>Detected Defects Count:</span>
            <span className="font-mono font-bold text-[#172338] px-2 py-0.5 rounded bg-slate-100">
              {inspection.defects.length}
            </span>
          </div>
        </div>

        {/* Section 3: Defect Details Cards */}
        {inspection.defects.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Defect Breakdown
            </span>

            {inspection.defects.map((defect) => (
              <div
                key={defect.id}
                className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172338]">{defect.type}</span>
                  <SeverityBadge severity={defect.severity} size="sm" />
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Location: <strong className="text-slate-700">{defect.location}</strong></span>
                  <span className="font-mono font-semibold text-[#4169E1]">
                    {defect.confidence.toFixed(1)}%
                  </span>
                </div>
                {defect.description && (
                  <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                    "{defect.description}"
                  </p>
                )}
                <div className="text-[10px] text-slate-400 font-mono">
                  Coordinates: X={defect.box.x}%, Y={defect.box.y}%, W={defect.box.width}%, H={defect.box.height}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section 4: AI Recommendations (Formulated as hypotheses) */}
        {inspection.recommendation && (
          <div className="rounded-xl border border-violet-100 bg-[#F2EFFF]/40 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#7563E8] font-bold text-[11px] uppercase tracking-wider">
              <Sparkles size={13} />
              <span>AI Engineering Hypothesis</span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] font-semibold block">Possible Explanation:</span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {inspection.recommendation.possibleCause}
              </p>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] font-semibold block">Recommended Process Check:</span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {inspection.recommendation.processCheck}
              </p>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] font-semibold block">Suggested Next Action:</span>
              <p className="text-slate-700 text-[11px] font-medium">
                {inspection.recommendation.suggestedAction}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="p-3 sm:p-4 border-t border-[#E5EAF2] bg-[#F8FAFD] space-y-2">
        {/* If Defect is present, offer operator decision buttons */}
        {isFail && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenRemoveModal}
              className="px-3 py-2 bg-[#DC4545] hover:bg-[#B02828] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Remove Product</span>
            </button>
            <button
              onClick={onSendManualReview}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle size={13} />
              <span>Manual Review</span>
            </button>
          </div>
        )}

        {/* Primary Operational Controls */}
        <div className="flex items-center gap-2">
          {!isInspecting ? (
            <button
              onClick={onStartInspection}
              className="flex-1 px-4 py-2.5 bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play size={14} />
              <span>Start Inspection</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={onResumeInspection}
              className="flex-1 px-4 py-2.5 bg-[#15976A] hover:bg-[#0F6F4E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play size={14} />
              <span>Resume Detection</span>
            </button>
          ) : (
            <button
              onClick={onPauseInspection}
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Pause size={14} />
              <span>Pause Detection</span>
            </button>
          )}

          <button
            onClick={onRetryInspection}
            title="Retry Frame Inspection"
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors shrink-0"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
