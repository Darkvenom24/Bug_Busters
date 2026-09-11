import React, { useState } from 'react';
import { OptimizedRoute } from '../../types';
import { Truck, CheckCircle2, AlertTriangle, Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Badge } from './Badge';

interface InteractiveMapProps {
  route: OptimizedRoute;
  onCompleteStop?: (stopId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ route, onCompleteStop }) => {
  const [activeStopId, setActiveStopId] = useState<string>(route.stops[0]?.id || '');
  const activeStop = route.stops.find(s => s.id === activeStopId) || route.stops[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Route Header Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Route ID: {route.id}
                <Badge variant="success">Google OR-Tools Optimized</Badge>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vehicle: {route.vehicleId} • Driver: {route.driverName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Distance</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{route.totalDistanceKm} km</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Cost & CO₂ Saved</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{route.costSavedPercent}%</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Vehicle Load</div>
            <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {route.loadedKg} / {route.capacityKg} kg ({Math.round((route.loadedKg / route.capacityKg) * 100)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Visual Canvas Diagram of Optimized Multi-Stop Route */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 overflow-hidden shadow-inner min-h-[280px]">
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Live GPS Fleet Sim Active
        </div>

        {/* Route Graph Nodes and Connection Lines */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-3 items-center justify-between py-6">
          {route.stops.map((stop, index) => {
            const isSelected = stop.id === activeStopId;
            const isCompleted = stop.completed;

            return (
              <div
                key={stop.id}
                onClick={() => setActiveStopId(stop.id)}
                className={`cursor-pointer rounded-2xl p-3.5 transition-all duration-200 border text-left relative ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500'
                }`}
              >
                {/* Connecting arrow connector for desktop */}
                {index < route.stops.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-500">
                    →
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    stop.role === 'farm'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : stop.role === 'fpo_hub'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {stop.role === 'farm' ? `Farm #${index + 1}` : stop.role === 'fpo_hub' ? 'Aggregator Hub' : 'Buyer Stop'}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-slate-400">{stop.estimatedArrival}</span>
                  )}
                </div>

                <h4 className="font-semibold text-xs text-white line-clamp-1">{stop.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{stop.crop}</p>

                <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{stop.quantityKg} kg</span>
                  <span className={`text-[10px] font-semibold ${
                    stop.freshnessPriority.includes('Very High')
                      ? 'text-rose-400 font-bold'
                      : 'text-amber-300'
                  }`}>
                    {stop.freshnessPriority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Route Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Farm Pickup</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> FPO Aggregation Hub</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Direct Buyer Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Freshness-Aware Priority Scheduling Enabled
          </div>
        </div>
      </div>

      {/* Selected Stop Details & Interactive Action */}
      {activeStop && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeStop.name}</h4>
                <Badge variant={activeStop.completed ? 'success' : 'warning'}>
                  {activeStop.completed ? 'Completed' : 'Pending Action'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Location: {activeStop.location} • Cargo: {activeStop.crop} ({activeStop.quantityKg} kg)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!activeStop.completed && onCompleteStop && (
              <button
                onClick={() => onCompleteStop(activeStop.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Mark Stop as Handled ✓
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" /> Est. ETA: {activeStop.estimatedArrival}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
