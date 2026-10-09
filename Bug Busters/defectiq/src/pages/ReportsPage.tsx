import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Filter
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (path: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const { stats, batches, inspections, alerts } = useApp();

  const [reportType, setReportType] = useState<
    'Daily quality report' | 'Weekly quality report' | 'Monthly quality report' | 'Product report' | 'Batch report' | 'Defect report'
  >('Daily quality report');

  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'BATCH-102');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Actual downloadable CSV/Text report generation
      const csvContent =
        "data:text/csv;charset=utf-8," +
        ["Report Type,Date,Total Inspected,Passed,Rejected,Pass Rate",
         `"${reportType}","2026-10-09",${stats.todayInspected},${stats.passed},${stats.rejected},"${stats.passRate}%"`,
         "",
         "Inspection ID,Product ID,Batch ID,Result,Severity,Confidence",
         ...inspections.map(i => `${i.id},${i.productId},${i.batchId},${i.result},${i.overallSeverity},${i.overallConfidence}%`)
        ].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `DefectIQ_${reportType.replace(/\s+/g, '_')}_20261009.${format === 'excel' ? 'csv' : 'txt'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600);
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Quality Inspection Reports & Audits
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate certified manufacturing compliance documentation, lot certificates, and defect summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>{isExporting ? 'Exporting...' : 'Export CSV / Excel'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>Generate & Print PDF</span>
          </button>
        </div>
      </div>

      {/* Report Configuration Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-slate-700">Select Report Dossier:</span>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
        >
          <option value="Daily quality report">Daily Quality Report</option>
          <option value="Weekly quality report">Weekly Quality Report</option>
          <option value="Monthly quality report">Monthly Quality Report</option>
          <option value="Product report">Product Conformance Report</option>
          <option value="Batch report">Batch Lot Certificate</option>
          <option value="Defect report">Defect Root Cause Report</option>
        </select>

        {reportType === 'Batch report' && (
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-800 font-medium focus:outline-none"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} — {b.productName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Formal Report Preview Paper (Section 16.0) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 print:p-0 print:border-none">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-[#172338]">
                Defect<span className="text-[#4169E1]">IQ</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#7563E8] uppercase">
                AI QUALITY INTELLIGENCE
              </span>
            </div>
            <h1 className="text-lg font-black text-slate-900 mt-2 uppercase tracking-wide">
              {reportType}
            </h1>
            <p className="text-xs text-slate-500">
              Audit Report ID: RPT-20261009-QC • Plant Station Alpha-01
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-1">
            <p><strong>Reporting Period:</strong> 2026-10-09 (Full Shift Cycle)</p>
            <p><strong>Generated At:</strong> 2026-10-09 11:34:00 PST</p>
            <p><strong>Certified Auditor:</strong> System Auto-Sign (Marcus Vance, Lead QA)</p>
          </div>
        </div>

        {/* Section: KPI Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Total Inspected</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {stats.todayInspected.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-medium text-emerald-800 block">Conforming Passed</span>
            <span className="text-2xl font-black text-[#15976A] font-mono mt-1 block">
              {stats.passed.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <span className="text-[11px] font-medium text-red-800 block">Total Rejected</span>
            <span className="text-2xl font-black text-[#DC4545] font-mono mt-1 block">
              {stats.rejected.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] font-medium text-blue-800 block">Plant Pass Rate</span>
            <span className="text-2xl font-black text-[#4169E1] font-mono mt-1 block">
              {stats.passRate}%
            </span>
          </div>
        </div>

        {/* Section: Defect Distribution Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Defect Incidence Breakdown
          </h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3">Defect Category</th>
                  <th className="p-3">Detected Count</th>
                  <th className="p-3">Share of Rejections</th>
                  <th className="p-3">Severity Rating</th>
                  <th className="p-3">Process Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Surface Micro-Crack</td>
                  <td className="p-3 font-mono">68</td>
                  <td className="p-3 font-mono">42.0%</td>
                  <td className="p-3"><SeverityBadge severity="HIGH" size="sm" /></td>
                  <td className="p-3 text-slate-600">Hydraulic roll calibration check</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Solder Bridge</td>
                  <td className="p-3 font-mono">42</td>
                  <td className="p-3 font-mono">25.9%</td>
                  <td className="p-3"><SeverityBadge severity="CRITICAL" size="sm" /></td>
                  <td className="p-3 text-slate-600">SMD line stencil automated wipe</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Slag Inclusion</td>
                  <td className="p-3 font-mono">31</td>
                  <td className="p-3 font-mono">19.1%</td>
                  <td className="p-3"><SeverityBadge severity="MEDIUM" size="sm" /></td>
                  <td className="p-3 text-slate-600">Raw molten filtration inspection</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Blowhole / Porosity</td>
                  <td className="p-3 font-mono">18</td>
                  <td className="p-3 font-mono">11.1%</td>
                  <td className="p-3"><SeverityBadge severity="MEDIUM" size="sm" /></td>
                  <td className="p-3 text-slate-600">Mold degassing pressure adjustment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Critical Alert Log Snapshot */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider">
            Critical Alerts & Deviations Log
          </h3>
          <div className="space-y-1.5">
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{a.title}</span>
                  <span className="text-slate-500 ml-2">({a.message})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[10px]">{a.timestamp}</span>
                  <SeverityBadge severity={a.severity} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature & Sign-off footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>Digital Cryptographic Hash: SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f... verified</p>
            <p className="mt-0.5">DefectIQ Optical Intelligence System v3.4.2</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-400 pb-1 text-slate-700 font-mono text-[11px]">
              Marcus Vance
            </div>
            <span className="text-[10px] text-slate-500">Quality Assurance Director</span>
          </div>
        </div>
      </div>
    </div>
  );
};
