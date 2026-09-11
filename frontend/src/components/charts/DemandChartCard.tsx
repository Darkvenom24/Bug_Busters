import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { aiService } from '../../services/aiService';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const DemandChartCard: React.FC<{ initialCrop?: string }> = ({
  initialCrop = 'Tomato',
}) => {
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const forecast = aiService.getDemandForecast(selectedCrop);

  const availableCrops = ['Tomato', 'Onion', 'Banana'];

  return (
    <Card className="space-y-4 border border-slate-200/80 dark:border-slate-800">
      {/* Header & Crop Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Demand Forecasting
            </h3>
            <Badge variant="success">Scikit-learn Model</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Regional agricultural demand projection for next 30–60 days
          </p>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {availableCrops.map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedCrop === crop
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Current Demand</span>
          <div className="text-lg font-extrabold text-slate-800 dark:text-white mt-0.5">
            {forecast.currentDemandTons.toLocaleString()} <span className="text-xs font-normal">Tonnes</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Predicted Demand</span>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {forecast.predictedDemandTons.toLocaleString()} <span className="text-xs font-normal">Tonnes</span>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">Projected Surge</span>
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5 flex items-center gap-1">
            +{forecast.percentChange}%
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="predictedColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Area
              type="monotone"
              dataKey="actual"
              name="Historical Orders (Tonnes)"
              stroke="#64748b"
              fillOpacity={1}
              fill="url(#actualColor)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              name="AI Forecast (Tonnes)"
              stroke="#10b981"
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#predictedColor)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight Box (PDF Page 6) */}
      <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 rounded-xl flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
            AI Advisory Insight ({selectedCrop}):
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
            {forecast.aiInsight}
          </p>
        </div>
      </div>
    </Card>
  );
};
