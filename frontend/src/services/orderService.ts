import { Order, OrderStatus } from '../types';
import { INITIAL_ORDERS } from './mockData';

const ORDER_STORAGE_KEY = 'farmsetu_orders';

export const ORDER_LIFECYCLE_STEPS: OrderStatus[] = [
  'Order Placed',
  'Farmer/FPO Confirmed',
  'Produce Prepared',
  'Pickup',
  'In Transit',
  'Delivered',
  'Payment / Completion',
];

export const orderService = {
  getAll(): Order[] {
    const saved = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  getById(id: string): Order | undefined {
    return this.getAll().find(o => o.id === id);
  },

  getByFarmer(farmerId: string): Order[] {
    return this.getAll().filter(o => o.farmerId === farmerId);
  },

  getByBuyer(buyerId: string): Order[] {
    return this.getAll().filter(o => o.buyerId === buyerId);
  },

  create(orderData: Omit<Order, 'id' | 'status' | 'statusStep' | 'createdAt' | 'transitProgress'>): Order {
    const all = this.getAll();
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Order Placed',
      statusStep: 1,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      transitProgress: 10,
    };
    all.unshift(newOrder);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(all));
    return newOrder;
  },

  advanceStatus(id: string): Order | undefined {
    const all = this.getAll();
    const orderIndex = all.findIndex(o => o.id === id);
    if (orderIndex === -1) return undefined;

    const order = all[orderIndex];
    if (order.statusStep < ORDER_LIFECYCLE_STEPS.length - 1) {
      order.statusStep += 1;
      order.status = ORDER_LIFECYCLE_STEPS[order.statusStep];
      order.transitProgress = Math.min(100, Math.round((order.statusStep / (ORDER_LIFECYCLE_STEPS.length - 1)) * 100));
    }
    all[orderIndex] = order;
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(all));
    return order;
  },

  rateOrder(id: string, stars: number, comment: string): Order | undefined {
    const all = this.getAll();
    const orderIndex = all.findIndex(o => o.id === id);
    if (orderIndex === -1) return undefined;

    all[orderIndex].rating = { stars, comment };
    all[orderIndex].status = 'Payment / Completion';
    all[orderIndex].statusStep = 6;
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(all));
    return all[orderIndex];
  },

  reset(): void {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  }
};
