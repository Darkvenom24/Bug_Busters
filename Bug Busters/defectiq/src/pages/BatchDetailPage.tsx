import React from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import {
  ArrowLeft,
  Layers,
  FileSpreadsheet,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Calendar,
  Clock,
  Boxes,
  PieChart as PieIcon,
  Eye
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface BatchDetailPageProps {
  batchId: string;
  onNavigate: (path: string) => void;
}

export const BatchDetailPage: React.FC<BatchDetailPageProps> = ({
  batchId,
  onNavigate
}) => {
  const { batches, inspections, setActiveBatchId, setActiveProductId } = useApp();
  const batch = batches.find((b) => b.id === batchId) || batches[0];

  const batchInspections = inspections.filter((i) => i.batchId === batch.id);
  const defectInstances = batchInspections.flatMap((i) => i.defects);

  const defectSummaryMap: Record<string, number> = {};
  defectInstances.forEach((d) => {
    defectSummaryMap[d.type] = (defectSummaryMap[d.type] || 0) + 1;
  });

  const chartData = [
    { name: 'Passed', value: batch.passedQuantity, color: '#15976A' },
    { name: 'Rejected', value: batch.rejectedQuantity, color: '#DC4545' },
  ];

  const progressPct = batch.quantity > 0 ? Math.round((batch.inspectedQuantity / batch.quantity) * 100) : 0;

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5EAF2]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/batches')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4169E1] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {batch.id}
              </span>
              <h2 className="text-lg font-bold text-[#172338]">{batch.productName}</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                {batch.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production Date: {batch.productionDate} | Shift: {batch.shift}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/reports')}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet size={14} />
            <span>Generate Lot Report</span>
          </button>

          <button
            onClick={() => {
              setActiveBatchId(batch.id);
              setActiveProductId(batch.productId);
              onNavigate('/inspection/live');
            }}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Play size={13} />
            <span>Inspect This Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Lot Quantity</span>
          <span className="text-2xl font-extrabold text-[#172338] font-mono mt-1 block">
            {batch.quantity.toLocaleString()}
          </span>
          <div className="mt-2 text-slate-500 flex items-center justify-between text-[11px]">
            <span>Progress: {progressPct}%</span>
            <span>{batch.inspectedQuantity} inspected</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Passed Quality Spec</span>
          <span className="text-2xl font-extrabold text-[#15976A] font-mono mt-1 block">
            {batch.passedQuantity.toLocaleString()}
          </span>
          <div className="mt-2 text-emerald-600 font-semibold text-[11px]">
            Pass Rate: {((batch.passedQuantity / (batch.inspectedQuantity || 1)) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Rejected Defective Units</span>
          <span className="text-2xl font-extrabold text-[#DC4545] font-mono mt-1 block">
            {batch.rejectedQuantity.toLocaleString()}
          </span>
          <div className="mt-2 text-red-600 font-semibold text-[11px]">
            Defect Ratio: {((batch.rejectedQuantity / (batch.inspectedQuantity || 1)) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Batch Quality Score</span>
          <span className="text-2xl font-extrabold text-[#7563E8] font-mono mt-1 block">
            {batch.qualityScore}%
          </span>
          <div className="mt-2 text-slate-400 text-[11px]">
            Target threshold: &gt;85.0%
          </div>
        </div>
      </div>

      {/* Progress & Repeated Defects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pass/Fail Donut - 5 cols */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E5EAF2] flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#172338] mb-2">Yield Distribution</h3>
          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400">Score</span>
              <span className="text-xl font-extrabold text-[#172338] font-mono">{batch.qualityScore}%</span>
            </div>
          </div>

          <div className="flex items-center justify-around pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-700 font-medium">Passed: {batch.passedQuantity}</span>
            <span className="text-red-700 font-medium">Rejected: {batch.rejectedQuantity}</span>
          </div>
        </div>

        {/* Repeated Defect Patterns - 7 cols */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E5EAF2] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172338]">Repeated Defect Signatures</h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Defect Events: {defectInstances.length}
            </span>
          </div>

          {Object.keys(defectSummaryMap).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(defectSummaryMap).map(([type, count]) => (
                <div
                  key={type}
                  className="p-3 rounded-xl border border-slate-200 bg-[#F8FAFD] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#DC4545]" />
                    <span className="font-semibold text-slate-800">{type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-800">{count} occurrences</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                      High Frequency
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
              No repeated defect anomalies recorded for this batch.
            </div>
          )}
        </div>
      </div>

      {/* Inspections associated with this batch */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172338]">
            Batch Inspections History ({batchInspections.length})
          </h3>
          <button
            onClick={() => onNavigate('/inspections')}
            className="text-xs font-semibold text-[#4169E1] hover:underline"
          >
            All Inspections →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Quality Result</th>
                <th className="py-3 px-4">Defect</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchInspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-medium text-[#4169E1]">{insp.id}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{insp.timestamp}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={insp.result} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {insp.defects.length > 0 ? insp.defects[0].type : 'None'}
                  </td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={insp.overallSeverity} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[#4169E1] font-semibold">
                    {insp.overallConfidence.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate(`/inspections/${insp.id}`)}
                      className="p-1.5 text-slate-400 hover:text-[#4169E1] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
