import React from 'react';
import { QualityStatus, Severity } from '../../types';
import { CheckCircle2, XCircle, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: QualityStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  switch (status) {
    case 'PASS':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-[#15976A]/30 bg-[#15976A]/10 text-[#0F6F4E] ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 size={iconSize} className="text-[#15976A] shrink-0" />}
          <span>PASS</span>
        </span>
      );

    case 'FAIL':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-[#DC4545]/30 bg-[#DC4545]/10 text-[#B02828] ${sizeClasses}`}
        >
          {showIcon && <XCircle size={iconSize} className="text-[#DC4545] shrink-0" />}
          <span>FAIL</span>
        </span>
      );

    case 'MANUAL REVIEW':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-[#D99020]/30 bg-[#D99020]/10 text-[#A66708] ${sizeClasses}`}
        >
          {showIcon && <AlertTriangle size={iconSize} className="text-[#D99020] shrink-0" />}
          <span>MANUAL REVIEW</span>
        </span>
      );

    case 'INSPECTION ERROR':
      return (
        <span
          className={`inline-flex items-center rounded-md border border-[#4285D4]/30 bg-[#4285D4]/10 text-[#2B63A8] ${sizeClasses}`}
        >
          {showIcon && <AlertOctagon size={iconSize} className="text-[#4285D4] shrink-0" />}
          <span>INSPECTION ERROR</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded-md border border-slate-200 bg-slate-100 text-slate-700 ${sizeClasses}`}
        >
          {showIcon && <HelpCircle size={iconSize} className="text-slate-400 shrink-0" />}
          <span>{status}</span>
        </span>
      );
  }
};

export const SeverityBadge: React.FC<{ severity: Severity; size?: 'sm' | 'md' }> = ({
  severity,
  size = 'md'
}) => {
  const base = size === 'sm' ? 'text-[11px] px-2 py-0.5 font-medium' : 'text-xs px-2.5 py-1 font-semibold';
  
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center rounded-md bg-red-100 text-red-800 border border-red-200 ${base}`}>
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center rounded-md bg-orange-100 text-orange-800 border border-orange-200 ${base}`}>
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center rounded-md bg-amber-100 text-amber-800 border border-amber-200 ${base}`}>
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center rounded-md bg-blue-100 text-blue-800 border border-blue-200 ${base}`}>
          LOW
        </span>
      );
    case 'NONE':
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 ${base}`}>
          NONE
        </span>
      );
  }
};
