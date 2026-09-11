import React, { useState } from 'react';
import { logisticsService } from '../services/logisticsService';
import { InteractiveMap } from '../components/common/InteractiveMap';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Truck,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Leaf,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const LogisticsView: React.FC = () => {
  const [route, setRoute] = useState(logisticsService.getCurrentRoute());

  const handleCompleteStop = (stopId: string) => {
    const updated = logisticsService.completeStop(stopId);
    setRoute(updated);
  };

  const handleResetRoute = () => {
    logisticsService.reset();
    setRoute(logisticsService.getCurrentRoute());
  };

  const freshnessMatrix = [
    { crop: 'Spinach (Palak)', shelfLife: '1–2 Days', priority: 'Very High (1st Priority)', reason: 'High water content; rapid wilting requires immediate morning dispatch' },
    { crop: 'Tomato (Hybrid)', shelfLife: '5–7 Days', priority: 'High Priority', reason: 'Perishable skin; bruising risk in mixed transit; morning temperature control' },
    { crop: 'Banana (G9)', shelfLife: '4–6 Days', priority: 'High Priority', reason: 'Ethylene sensitivity; separate ventilation' },
    { crop: 'Onion (Red Cured)', shelfLife: '30–45 Days', priority: 'Medium Priority', reason: 'Dry skin; stable ambient temperature buffer' },
    { crop: 'Potato (Table)', shelfLife: '60+ Days', priority: 'Lower Priority', reason: 'Bulk load stabilizer; bottom stacking' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              AI Route Optimization & Freshness Dispatch
            </h1>
            <Badge variant="success">Google OR-Tools VRP Solver</Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Minimizing empty vehicle runs, multi-farm pickup hops, and food wastage via freshness-aware sequencing.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetRoute}
          className="gap-1.5 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Route Simulation
        </Button>
      </div>

      {/* Main Interactive Map & Route Visualizer */}
      <InteractiveMap
        route={route}
        onCompleteStop={handleCompleteStop}
      />

      {/* Before vs After Optimization Comparison (PDF Page 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              ❌ Before AI Optimization (Individual Trips)
            </h3>
            <Badge variant="warning">High Wastage</Badge>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs font-mono text-slate-600 dark:text-slate-300">
            <div>Farm A ──────────────────→ Buyer 1 (Empty Return)</div>
            <div>Farm B ──────────────────→ Buyer 2 (Empty Return)</div>
            <div>Farm C ──────────────────→ Buyer 3 (Empty Return)</div>
          </div>

          <ul className="text-xs text-rose-600 dark:text-rose-400 space-y-1">
            <li>• 3 separate vehicles with 30-40% empty capacity</li>
            <li>• 112 km combined transit mileage</li>
            <li>• High logistics overhead (~₹8.50/kg) charged to farmers</li>
          </ul>
        </Card>

        <Card className="p-6 border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-950">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
              ✅ After FarmSetu OR-Tools Optimization
            </h3>
            <Badge variant="success">28.4% Cost Saved</Badge>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl space-y-2 text-xs font-mono text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <div>Farm A (Tomato) ──→ Farm B (Spinach) ──→ Collection Hub</div>
            <div className="pl-4">└──→ Direct Multi-Buyer Drop-off (1 Single Optimized Trip)</div>
          </div>

          <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
            <li>• 1 single commercial vehicle with 92% capacity utilization</li>
            <li>• 46.8 km total distance (Saved 65.2 km and 38kg CO₂)</li>
            <li>• Logistics cost slashed to ~₹2.80/kg</li>
          </ul>
        </Card>
      </div>

      {/* Freshness-Aware Priority Scheduling Matrix (PDF Page 9) */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Freshness-Aware Priority Scheduling (PDF Page 9)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The logistics engine orders pickup and drop-off sequences strictly factoring crop decay risk.
            </p>
          </div>
          <Badge variant="success">Spoilage Prevention</Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Agricultural Crop</th>
                <th className="p-3">Ambient Shelf Life</th>
                <th className="p-3">Freshness Priority</th>
                <th className="p-3">Route Scheduling Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {freshnessMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{item.crop}</td>
                  <td className="p-3 text-slate-500">{item.shelfLife}</td>
                  <td className="p-3">
                    <Badge variant={item.priority.includes('Very High') ? 'warning' : item.priority.includes('High') ? 'info' : 'default'}>
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
