import React, { useState } from 'react';
import { Modal } from './Modal';
import { SeverityBadge } from './StatusBadge';
import { Inspection } from '../../types';
import { AlertTriangle, Trash2, ArrowRight } from 'lucide-react';

interface RemoveProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection | null;
  onConfirm: (reason: string) => void;
}

export const RemoveProductModal: React.FC<RemoveProductModalProps> = ({
  isOpen,
  onClose,
  inspection,
  onConfirm
}) => {
  const [reason, setReason] = useState<string>('Exceeds critical structural tolerance. Manual rejection triggered by operator.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!inspection) return null;

  const defectSummary = inspection.defects.length > 0 
    ? inspection.defects.map(d => `${d.type} (${d.location})`).join(', ')
    : 'Quality violation detected';

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(reason);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Product?"
      subtitle="Conveyor divert & defect registration"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Warning banner */}
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200/80 p-3.5 text-sm text-red-900">
          <AlertTriangle className="text-[#DC4545] shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-red-950">Confirm Defective Unit Removal</p>
            <p className="text-xs text-red-800 mt-1">
              This unit will be permanently marked as <strong>REJECTED</strong>, removed from the production lot, and recorded in the inspection traceability register.
            </p>
          </div>
        </div>

        {/* Product specifics */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Product ID</span>
            <span className="font-mono font-semibold text-[#172338]">{inspection.productId}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Inspection Record</span>
            <span className="font-mono text-slate-700">{inspection.id}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Detected Defect</span>
            <span className="font-semibold text-[#DC4545] text-right">{defectSummary}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 font-medium">Assessed Severity</span>
            <SeverityBadge severity={inspection.overallSeverity} size="sm" />
          </div>
        </div>

        {/* Reason field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Rejection Reason & Divert Remarks
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC4545]/30 focus:border-[#DC4545]"
            placeholder="Specify reason for scrapping or secondary rework..."
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#DC4545] hover:bg-[#B02828] rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Diverting Conveyor...</span>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Confirm Removal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
