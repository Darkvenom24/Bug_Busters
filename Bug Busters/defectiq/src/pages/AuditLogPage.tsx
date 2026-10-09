import React, { useState } from 'react';
import { useApp } from '../lib/store';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Shield,
  RotateCcw
} from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = auditLogs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      log.userName.toLowerCase().includes(q) ||
      log.record.toLowerCase().includes(q) ||
      log.reason.toLowerCase().includes(q);

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Security & Compliance Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronological ledger of operator decisions, scrap diverts, model verifications, and parameter adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono rounded">
            {auditLogs.length} Logged Entries
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by operator, record ID, or action reason..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700 font-medium"
        >
          <option value="ALL">All Actions</option>
          <option value="Inspection Decision">Inspection Decision</option>
          <option value="Product Removal">Product Removal</option>
          <option value="Result Correction">Result Correction</option>
          <option value="Settings Changed">Settings Changed</option>
          <option value="Login">Login</option>
          <option value="Batch Created">Batch Created</option>
        </select>
      </div>

      {/* Audit Log Table (Section 21.0) */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Operator / User</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Target Record</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{log.id}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {log.date} {log.time}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{log.userName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'Product Removal'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : log.action === 'Result Correction'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : log.action === 'Inspection Decision'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#4169E1] font-medium">{log.record}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
