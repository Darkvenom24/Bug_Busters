import { OptimizedRoute, RouteStop } from '../types';
import { INITIAL_OPTIMIZED_ROUTE } from './mockData';

const ROUTE_STORAGE_KEY = 'farmsetu_routes';

export const logisticsService = {
  getCurrentRoute(): OptimizedRoute {
    const saved = localStorage.getItem(ROUTE_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(INITIAL_OPTIMIZED_ROUTE));
      return INITIAL_OPTIMIZED_ROUTE;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_OPTIMIZED_ROUTE;
    }
  },

  completeStop(stopId: string): OptimizedRoute {
    const route = this.getCurrentRoute();
    const updatedStops = route.stops.map(s => {
      if (s.id === stopId) {
        return { ...s, completed: true };
      }
      return s;
    });
    const allCompleted = updatedStops.every(s => s.completed);
    const updatedRoute: OptimizedRoute = {
      ...route,
      stops: updatedStops,
      status: allCompleted ? 'Completed' : 'En Route',
    };
    localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(updatedRoute));
    return updatedRoute;
  },

  optimizeNewRoute(stops: Omit<RouteStop, 'id' | 'completed'>[]): OptimizedRoute {
    // Sort stops freshness priority: Very High -> High -> Medium -> Low, grouping hubs and buyers
    const priorityWeight: Record<string, number> = {
      'Very High': 1,
      'High': 2,
      'Medium': 3,
      'Low': 4,
      'Inspection & QC': 5,
      'En Route': 6,
      'Delivered': 7
    };

    const sortedStops: RouteStop[] = stops
      .sort((a, b) => (priorityWeight[a.freshnessPriority] || 99) - (priorityWeight[b.freshnessPriority] || 99))
      .map((s, idx) => ({
        ...s,
        id: `stop-${idx + 1}`,
        completed: false
      }));

    const totalQty = sortedStops.reduce((sum, s) => sum + (s.role === 'farm' ? s.quantityKg : 0), 0);
    const capacityKg = Math.max(1500, Math.ceil(totalQty * 1.2));
    const distanceKm = Number((32 + stops.length * 4.2).toFixed(1));
    const costSavedPercent = Number((24 + Math.random() * 8).toFixed(1));

    const newRoute: OptimizedRoute = {
      id: `ROUTE-OPT-${Math.floor(100 + Math.random() * 900)}`,
      vehicleId: 'GJ-03-BX-4921',
      driverName: 'Suresh Parmar (+91 98251 34912)',
      capacityKg,
      loadedKg: totalQty,
      stops: sortedStops,
      totalDistanceKm: distanceKm,
      totalTimeHours: Number((distanceKm / 28).toFixed(1)),
      costSavedPercent,
      status: 'En Route',
    };

    localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(newRoute));
    return newRoute;
  },

  reset(): void {
    localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(INITIAL_OPTIMIZED_ROUTE));
  }
};
