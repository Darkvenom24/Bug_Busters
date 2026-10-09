import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Eye,
  Check,
  ShieldAlert,
  Boxes,
  Layers
} from 'lucide-react';

interface AlertsPageProps {
  onNavigate: (path: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const { alerts, acknowledgeAlert } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = alerts.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.message.toLowerCase().includes(q) ||
      (a.productId && a.productId.toLowerCase().includes(q)) ||
      (a.batchId && a.batchId.toLowerCase().includes(q));

    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const unacknowledgedCount = alerts.filter((a) => a.status === 'unacknowledged').length;

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#172338] tracking-tight">
              Quality Alerts Center
            </h2>
            {unacknowledgedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                {unacknowledgedCount} unacknowledged
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time critical defect warnings, process drift alarms, and manual review triggers.
          </p>
        </div>

        <button
          onClick={() => {
            alerts
              .filter((a) => a.status === 'unacknowledged')
              .forEach((a) => acknowledgeAlert(a.id));
          }}
          disabled={unacknowledgedCount === 0}
          className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Check size={14} />
          <span>Acknowledge All Unread</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by alert text, product, batch..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] py-2 px-3 text-slate-700"
        >
          <option value="ALL">All Statuses</option>
          <option value="unacknowledged">Unacknowledged Only</option>
          <option value="acknowledged">Acknowledged Only</option>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${
                alert.status === 'unacknowledged'
                  ? 'bg-white border-red-200/80 shadow-xs'
                  : 'bg-[#F8FAFD] border-[#E5EAF2] opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{alert.id}</span>
                    <span className="font-bold text-sm text-[#172338]">{alert.title}</span>
                    <SeverityBadge severity={alert.severity} size="sm" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">
                      {alert.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    {alert.productId && <span>Product: <strong className="text-slate-600 font-mono">{alert.productId}</strong></span>}
                    {alert.batchId && <span>Batch: <strong className="text-slate-600 font-mono">{alert.batchId}</strong></span>}
                    {alert.inspectionId && (
                      <button
                        onClick={() => onNavigate(`/inspections/${alert.inspectionId}`)}
                        className="text-[#4169E1] hover:underline font-mono"
                      >
                        Inspection #{alert.inspectionId} →
                      </button>
                    )}
                    <span>Timestamp: {alert.timestamp}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {alert.status === 'unacknowledged' ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check size={13} />
                      <span>Acknowledge</span>
                    </button>
                  ) : (
                    <div className="text-right text-[11px]">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                        <CheckCircle size={12} /> Acknowledged
                      </span>
                      <span className="text-slate-400 block text-[10px]">
                        by {alert.acknowledgedBy} at {alert.acknowledgedAt?.slice(11)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E5EAF2] text-slate-400 text-xs">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-slate-600">You're all caught up</p>
            <p className="text-slate-400 mt-1">No alerts matching current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
