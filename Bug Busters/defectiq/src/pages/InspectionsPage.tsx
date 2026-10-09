import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  RotateCcw,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Layers,
  Sparkles
} from 'lucide-react';

interface InspectionsPageProps {
  onNavigate: (path: string) => void;
}

export const InspectionsPage: React.FC<InspectionsPageProps> = ({ onNavigate }) => {
  const { inspections, products, batches } = useApp();

  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setProductFilter('ALL');
    setBatchFilter('ALL');
    setResultFilter('ALL');
    setSeverityFilter('ALL');
    setCurrentPage(1);
  };

  // Filter logic
  const filtered = inspections.filter((insp) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      insp.id.toLowerCase().includes(q) ||
      insp.productId.toLowerCase().includes(q) ||
      insp.batchId.toLowerCase().includes(q) ||
      insp.operatorName.toLowerCase().includes(q);

    const matchesProduct = productFilter === 'ALL' || insp.productId === productFilter;
    const matchesBatch = batchFilter === 'ALL' || insp.batchId === batchFilter;
    const matchesResult = resultFilter === 'ALL' || insp.result === resultFilter;
    const matchesSeverity = severityFilter === 'ALL' || insp.overallSeverity === severityFilter;

    return matchesSearch && matchesProduct && matchesBatch && matchesResult && matchesSeverity;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Inspection History & Traceability
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete historical records with AI predictions, operator decisions, and defect telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/reports')}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export Inspection Log</span>
          </button>
          <button
            onClick={() => onNavigate('/inspection/live')}
            className="px-4 py-2 text-xs font-bold bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl shadow-xs transition-colors"
          >
            Live Inspection Line
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Section 9.0) */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search Product, Batch, ID..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
            />
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={productFilter}
              onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            >
              <option value="ALL">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.id} - {p.name.slice(0, 20)}...</option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div>
            <select
              value={batchFilter}
              onChange={(e) => { setBatchFilter(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.id}</option>
              ))}
            </select>
          </div>

          {/* Result Filter */}
          <div>
            <select
              value={resultFilter}
              onChange={(e) => { setResultFilter(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            >
              <option value="ALL">All Results</option>
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
              <option value="MANUAL REVIEW">MANUAL REVIEW</option>
              <option value="INSPECTION ERROR">INSPECTION ERROR</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
              <option value="NONE">NONE</option>
            </select>
          </div>
        </div>

        {/* Clear Filters helper */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Found <strong>{filtered.length}</strong> matching records</span>
          <button
            onClick={handleClearFilters}
            className="text-slate-400 hover:text-slate-700 font-medium flex items-center gap-1"
          >
            <RotateCcw size={12} /> Clear all filters
          </button>
        </div>
      </div>

      {/* Main Inspections Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Product ID</th>
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Inspection Time</th>
                <th className="py-3.5 px-4">Quality Result</th>
                <th className="py-3.5 px-4">Detected Defect</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? (
                paginated.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-[#172338]">{insp.productId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{insp.id}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-medium">{insp.batchId}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{insp.timestamp}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={insp.result} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      {insp.defects.length > 0 ? (
                        <span className="font-semibold text-slate-800">
                          {insp.defects[0].type}
                          {insp.defects.length > 1 && (
                            <span className="ml-1 text-[10px] text-slate-400 font-normal">
                              (+{insp.defects.length - 1} more)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-emerald-700">None (Passed)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={insp.overallSeverity} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#4169E1]">
                      {insp.overallConfidence.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{insp.operatorName}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate(`/inspections/${insp.id}`)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#4169E1] hover:text-[#2546B8] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>View Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No inspection records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t border-[#E5EAF2] bg-[#F8FAFD] flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
