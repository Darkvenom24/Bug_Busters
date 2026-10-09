import React from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import {
  ArrowLeft,
  Boxes,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Calendar,
  Play
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate
}) => {
  const { products, batches, inspections } = useApp();
  const product = products.find((p) => p.id === productId) || products[0];

  const productInspections = inspections.filter((i) => i.productId === product.id);
  const productBatches = batches.filter((b) => b.productId === product.id);

  const passed = productInspections.filter((i) => i.result === 'PASS').length;
  const rejected = productInspections.filter((i) => i.result === 'FAIL').length;
  const manual = productInspections.filter((i) => i.result === 'MANUAL REVIEW').length;
  const total = productInspections.length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5EAF2]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/products')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4169E1] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {product.id}
              </span>
              <h2 className="text-lg font-bold text-[#172338]">{product.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Category: {product.category}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/inspection/live')}
          className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Play size={14} />
          <span>Launch Inspection Run</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Total Inspected</span>
          <span className="text-2xl font-extrabold text-[#172338] font-mono mt-1 block">
            {total}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Conformance Pass Rate</span>
          <span className="text-2xl font-extrabold text-[#15976A] font-mono mt-1 block">
            {passRate}%
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Rejection Count</span>
          <span className="text-2xl font-extrabold text-[#DC4545] font-mono mt-1 block">
            {rejected}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] text-xs">
          <span className="text-slate-400 block">Confidence Standard</span>
          <span className="text-2xl font-extrabold text-[#4169E1] font-mono mt-1 block">
            {product.confidenceThreshold}%
          </span>
        </div>
      </div>

      {/* Quality Rules & Product Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E5EAF2] space-y-3">
          <h3 className="text-sm font-bold text-[#172338]">Engineering Specification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
          <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
            <Calendar size={13} />
            <span>Catalog Registration Date: {product.createdAt}</span>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E5EAF2] space-y-3">
          <h3 className="text-sm font-bold text-[#172338]">Configured Quality Rules</h3>
          <div className="space-y-2">
            {product.qualityRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-xl border border-slate-200 bg-[#F8FAFD] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#4169E1]" />
                  <span className="font-semibold text-slate-800">{rule.defectType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Max Allowed: {rule.maxAllowedCount}
                  </span>
                  {rule.autoReject ? (
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                      Auto-Reject
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      Flag for Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Associated Inspection History */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#172338]">
            Product Inspection Dossiers ({productInspections.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Quality Result</th>
                <th className="py-3 px-4">Defect Summary</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productInspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-medium text-[#4169E1]">{insp.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{insp.batchId}</td>
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
