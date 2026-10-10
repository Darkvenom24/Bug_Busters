import React, { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { fetchBackendStats, BackendAnalyticsStats } from '../lib/inspectionApi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Flame,
  Layers,
  ExternalLink,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { SeverityBadge } from '../components/common/StatusBadge';

interface DefectAnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const DefectAnalyticsPage: React.FC<DefectAnalyticsPageProps> = ({ onNavigate }) => {
  const { alerts, batches } = useApp();

  // Defect breakdown
  const [defectDistribution, setDefectDistribution] = useState<Array<{ defect: string; count: number; fill: string }>>([]);

  // Load analytics stats from backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats: BackendAnalyticsStats = await fetchBackendStats();
        const breakdown = stats.defect_categories_breakdown || {};
        const colors = ['#DC4545', '#EA580C', '#D99020', '#4169E1', '#7563E8'];
        const entries = Object.entries(breakdown).map(([defect, count], idx) => ({
          defect,
          count: Number(count),
          fill: colors[idx % colors.length]
        }));
        setDefectDistribution(entries);
      } catch (e) {
        console.warn('Failed to fetch analytics stats:', e);
      }
    };
    loadStats();
  }, []);


  // Severity split
  // Keep static severity distribution for now or compute dynamically if needed
  const severityDistribution = [
    { name: 'CRITICAL', value: 42, color: '#DC4545' },
    { name: 'HIGH', value: 58, color: '#EA580C' },
    { name: 'MEDIUM', value: 36, color: '#D99020' },
    { name: 'LOW', value: 14, color: '#4169E1' },
  ];

  // Defects over time
  const defectsOverTime = [
    { time: '06:00', cracks: 4, solder: 2, inclusions: 1 },
    { time: '07:00', cracks: 7, solder: 3, inclusions: 2 },
    { time: '08:00', cracks: 9, solder: 5, inclusions: 3 },
    { time: '09:00', cracks: 14, solder: 8, inclusions: 4 },
    { time: '10:00', cracks: 18, solder: 11, inclusions: 5 },
    { time: '11:00', cracks: 16, solder: 13, inclusions: 6 },
  ];

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Defect Analytics & Root Cause Signatures
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pareto analysis, temporal defect clustering, and process risk escalation.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/alerts')}
          className="px-4 py-2 bg-[#DC4545] hover:bg-[#B02828] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <ShieldAlert size={14} />
          <span>Active Defect Alerts ({alerts.filter(a => a.status === 'unacknowledged').length})</span>
        </button>
      </div>

      {/* Section 13: QUALITY RISK Warning Banner */}
      <div className="rounded-2xl border border-red-300 bg-red-50/90 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs animate-in fade-in">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Flame size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-red-950 uppercase tracking-widest bg-red-200/80 px-2 py-0.5 rounded">
                QUALITY RISK
              </span>
              <span className="text-xs text-red-800 font-semibold">
                Critical Threshold Exceeded
              </span>
            </div>
            <p className="text-sm font-bold text-red-950 mt-1">
              Defect frequency has increased above the configured threshold.
            </p>
            <p className="text-xs text-red-800 mt-0.5">
              3 consecutive solder bridge incidents detected on SMD controller Line 2 (Batch BATCH-103). Surface crack frequency up 28% in Lot BATCH-102.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('/batches/BATCH-102')}
            className="px-3.5 py-1.5 bg-white text-red-900 border border-red-300 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            <span>Inspect Lot BATCH-102</span>
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => onNavigate('/alerts')}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Acknowledge Alerts
          </button>
        </div>
      </div>

      {/* Row: Defect Pareto Bar Chart & Severity Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Defect Pareto Distribution - 8 cols */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172338]">Pareto Defect Class Distribution</h3>
              <p className="text-xs text-slate-400">Total detected defect instances across all active lines</p>
            </div>
            <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded border border-red-200">
              170 Total Anomalies
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
                <XAxis dataKey="defect" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5EAF2',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" name="Frequency" radius={[6, 6, 0, 0]}>
                  {defectDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut - 4 cols */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172338]">Severity Breakdown</h3>
            <p className="text-xs text-slate-400">Impact level classification</p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Critical</span>
              <span className="text-xl font-extrabold text-red-600 font-mono">42</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC4545]" />
              <span className="text-slate-600 font-medium">Critical: 42</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
              <span className="text-slate-600 font-medium">High: 58</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D99020]" />
              <span className="text-slate-600 font-medium">Medium: 36</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1]" />
              <span className="text-slate-600 font-medium">Low: 14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Temporal Defects Over Time Line Chart */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#172338]">Defect Emergence Over Production Shift</h3>
          <p className="text-xs text-slate-400">Cumulative hourly incidents by defect family</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={defectsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5EAF2',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="cracks" name="Surface Cracks" stroke="#DC4545" strokeWidth={2.5} />
              <Line type="monotone" dataKey="solder" name="Solder Bridges" stroke="#EA580C" strokeWidth={2.5} />
              <Line type="monotone" dataKey="inclusions" name="Inclusions" stroke="#D99020" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
