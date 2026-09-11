import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DemandChartCard } from '../../components/charts/DemandChartCard';
import { formatCurrency } from '../../utils/cn';
import {
  Layers,
  Users,
  Package,
  TrendingUp,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemberFarmer {
  id: string;
  name: string;
  village: string;
  crop: string;
  quantityKg: number;
  quality: string;
  aggregated: boolean;
}

export const FPODashboard: React.FC = () => {
  const { user } = useAuth();

  // FPO Member Farmers Data matching PDF Page 3 example (Farmer A, B, C)
  const [farmers, setFarmers] = useState<MemberFarmer[]>([
    { id: 'f-1', name: 'Farmer A (Ramesh Patel)', village: 'Bedi, Rajkot', crop: 'Tomato', quantityKg: 200, quality: 'Grade A', aggregated: true },
    { id: 'f-2', name: 'Farmer B (Kishore Vala)', village: 'Lodhika, Rajkot', crop: 'Tomato', quantityKg: 300, quality: 'Grade A', aggregated: true },
    { id: 'f-3', name: 'Farmer C (Savita Devi)', village: 'Gondal, Rajkot', crop: 'Tomato', quantityKg: 500, quality: 'Grade A', aggregated: true },
    { id: 'f-4', name: 'Farmer D (Devjibhai)', village: 'Deesa, Banaskantha', crop: 'Potato', quantityKg: 2500, quality: 'Grade B', aggregated: false },
    { id: 'f-5', name: 'Farmer E (Bhavesh C.)', village: 'Anand Hub', crop: 'Banana', quantityKg: 1800, quality: 'Grade A', aggregated: false },
  ]);

  const [aggregationSuccess, setAggregationSuccess] = useState(false);

  const aggregatedTomatoes = farmers
    .filter(f => f.crop === 'Tomato' && f.aggregated)
    .reduce((sum, f) => sum + f.quantityKg, 0);

  const toggleAggregate = (id: string) => {
    setFarmers(prev => prev.map(f => f.id === id ? { ...f, aggregated: !f.aggregated } : f));
  };

  const handleCreateBulkLot = () => {
    setAggregationSuccess(true);
    setTimeout(() => setAggregationSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                Registered FPO Federation
              </Badge>
              <span className="text-xs text-emerald-200">Registration: FPO-GJ-2024-881</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
              Central Collection & QC Hub: {user.location} • 140+ Smallholder Farmer Members
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/logistics">
              <Button variant="harvest" size="sm" className="gap-1.5 shadow-md">
                <Truck className="w-4 h-4" /> Cluster Route Optimizer
              </Button>
            </Link>
          </div>
        </div>

        {/* FPO KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-700/50">
          <div>
            <span className="text-xs text-emerald-200/80">Active Member Farmers</span>
            <div className="text-2xl font-black text-white">142</div>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80">Total Aggregated Produce</span>
            <div className="text-2xl font-black text-white">6,800 kg</div>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80">Bulk Institutional Orders</span>
            <div className="text-2xl font-black text-emerald-300">18 Fulfilled</div>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80">Logistics Efficiency Gain</span>
            <div className="text-2xl font-black text-amber-300">+28.4%</div>
          </div>
        </div>
      </div>

      {/* Bulk Produce Aggregation Workflow (PDF Page 3 Diagram) */}
      <div id="aggregation" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                FPO Smart Produce Aggregation Engine
              </h2>
              <Badge variant="purple">PDF Specification Example</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Combine smallholder harvests into unified bulk commercial lots to supply supermarket and restaurant chains.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateBulkLot}
            className="gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Create Bulk Batch ({aggregatedTomatoes} kg)
          </Button>
        </div>

        {aggregationSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span><strong>Bulk Lot #LOT-TOMATO-1000 Created!</strong> 1,000 kg Tomato aggregated and matched to Bulk Buyer requirement.</span>
            </div>
            <Link to="/logistics">
              <Button size="sm" variant="secondary" className="text-xs">
                View Optimized Pickup Route →
              </Button>
            </Link>
          </div>
        )}

        {/* Visual Aggregation Diagram (PDF Page 3) */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
          <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-500">
            Current Active Tomato Aggregation Pipeline
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {farmers.filter(f => f.crop === 'Tomato').map((f) => (
              <div
                key={f.id}
                onClick={() => toggleAggregate(f.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  f.aggregated
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.name}</span>
                  <input
                    type="checkbox"
                    checked={f.aggregated}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
                <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                  {f.quantityKg} kg
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                  <span>{f.village}</span>
                  <Badge variant="success" className="text-[10px]">{f.quality}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center pt-2">
            <div className="text-slate-400 text-sm font-bold">↓ Aggregated into Single Commercial Consignment ↓</div>
            <div className="mt-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">Total Aggregated Consignment</span>
              <div className="text-2xl font-black">{aggregatedTomatoes.toLocaleString()} kg Tomato</div>
              <span className="text-[11px] text-emerald-100">Dispatched directly to: Bulk Buyer (Restaurant & Supermarket Consortia)</span>
            </div>
          </div>
        </div>

        {/* Member Farmers Table */}
        <div id="farmers" className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Member Farmers & Micro-Lots
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Village / Cluster</th>
                  <th className="p-3">Crop Harvested</th>
                  <th className="p-3">Available Qty</th>
                  <th className="p-3">Quality Grade</th>
                  <th className="p-3">Aggregation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {farmers.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{f.name}</td>
                    <td className="p-3 text-slate-500">{f.village}</td>
                    <td className="p-3 font-semibold text-emerald-600">{f.crop}</td>
                    <td className="p-3 font-bold">{f.quantityKg.toLocaleString()} kg</td>
                    <td className="p-3">
                      <Badge variant={f.quality === 'Grade A' ? 'success' : 'warning'}>{f.quality}</Badge>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        f.aggregated
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {f.aggregated ? 'Aggregated ✓' : 'Individual Micro-lot'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Regional Demand Intelligence */}
      <DemandChartCard initialCrop="Tomato" />
    </div>
  );
};
