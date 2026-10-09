import React, { useState } from 'react';
import { useApp } from '../lib/store';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar, Filter, Download, TrendingUp, Layers, CheckCircle2, XCircle } from 'lucide-react';

interface QualityAnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const QualityAnalyticsPage: React.FC<QualityAnalyticsPageProps> = ({ onNavigate }) => {
  const { stats, batches } = useApp();
  const [range, setRange] = useState('7d');

  // Daily statistical process trend
  const dailyQualityTrends = [
    { day: 'Mon', inspected: 1100, passRate: 91.2, defectRate: 8.8 },
    { day: 'Tue', inspected: 1250, passRate: 89.5, defectRate: 10.5 },
    { day: 'Wed', inspected: 1320, passRate: 93.0, defectRate: 7.0 },
    { day: 'Thu', inspected: 1190, passRate: 88.4, defectRate: 11.6 },
    { day: 'Fri', inspected: 1420, passRate: 92.1, defectRate: 7.9 },
    { day: 'Sat', inspected: 1280, passRate: 87.8, defectRate: 12.2 },
    { day: 'Sun (Today)', inspected: 1248, passRate: 87.0, defectRate: 13.0 },
  ];

  // Shift performance comparison
  const shiftData = [
    { shift: 'Morning (06-14)', volume: 620, passRate: 92.4, rejected: 47 },
    { shift: 'Afternoon (14-22)', volume: 480, passRate: 88.2, rejected: 56 },
    { shift: 'Night (22-06)', volume: 148, passRate: 81.0, rejected: 28 },
  ];

  // Batch yield comparison
  const batchComparison = batches.map((b) => ({
    name: b.id,
    passed: b.passedQuantity,
    rejected: b.rejectedQuantity,
    score: b.qualityScore
  }));

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Quality Analytics & Process Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical process control (SPC), yield trends, shift metrics, and batch comparative telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-[#F8FAFD] border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setRange('24h')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                range === '24h' ? 'bg-white text-[#4169E1] shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setRange('7d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                range === '7d' ? 'bg-white text-[#4169E1] shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setRange('30d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                range === '30d' ? 'bg-white text-[#4169E1] shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={() => onNavigate('/reports')}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Primary Yield Trends Line Chart */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172338]">7-Day Process Conformance vs Defect Rate</h3>
            <p className="text-xs text-slate-400">Target Pass Rate threshold: &gt;90.0%</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Current Pass Rate: {stats.passRate}%
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyQualityTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis domain={[70, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5EAF2',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="passRate"
                name="Pass Rate %"
                stroke="#15976A"
                strokeWidth={3}
                dot={{ r: 4, fill: '#15976A' }}
              />
              <Line
                type="monotone"
                dataKey="defectRate"
                name="Defect Ratio %"
                stroke="#DC4545"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#DC4545' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row: Shift Comparison & Batch Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Shift Comparison - 6 cols */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#172338]">Shift Quality Comparison</h3>
            <p className="text-xs text-slate-400">Pass rate variance across 3-shift rotation</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
                <XAxis dataKey="shift" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5EAF2',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="passRate" name="Pass Rate (%)" fill="#4169E1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Batch Yield Comparison - 6 cols */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#172338]">Batch Lot Comparison</h3>
            <p className="text-xs text-slate-400">Comparative pass vs reject distribution</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchComparison} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5EAF2',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="passed" name="Passed" fill="#15976A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#DC4545" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
