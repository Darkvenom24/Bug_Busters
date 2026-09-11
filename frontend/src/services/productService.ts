import { Produce } from '../types';
import { INITIAL_PRODUCE } from './mockData';

const PRODUCE_KEY = 'farmsetu_produce_items';

export const productService = {
  getAll(): Produce[] {
    const saved = localStorage.getItem(PRODUCE_KEY);
    if (!saved) {
      localStorage.setItem(PRODUCE_KEY, JSON.stringify(INITIAL_PRODUCE));
      return INITIAL_PRODUCE;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PRODUCE;
    }
  },

  getById(id: string): Produce | undefined {
    return this.getAll().find(p => p.id === id);
  },

  getByFarmer(farmerId: string): Produce[] {
    return this.getAll().filter(p => p.farmerId === farmerId);
  },

  add(produce: Omit<Produce, 'id'>): Produce {
    const all = this.getAll();
    const newProduce: Produce = {
      ...produce,
      id: `prod-${Date.now()}`
    };
    all.unshift(newProduce);
    localStorage.setItem(PRODUCE_KEY, JSON.stringify(all));
    return newProduce;
  },

  delete(id: string): void {
    const all = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(PRODUCE_KEY, JSON.stringify(all));
  },

  reset(): void {
    localStorage.setItem(PRODUCE_KEY, JSON.stringify(INITIAL_PRODUCE));
  }
};
