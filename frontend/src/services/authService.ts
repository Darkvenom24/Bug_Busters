import { User, UserRole } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  farmer: {
    id: 'farmer-1',
    name: 'Ramesh Patel',
    phone: '+91 98250 12345',
    email: 'ramesh.farmer@farmsetu.in',
    role: 'farmer',
    location: 'Rajkot, Gujarat',
    verified: true,
    rating: 4.9,
    totalOrders: 48,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
  },
  fpo: {
    id: 'fpo-1',
    name: 'Saurashtra Kisan Producer Co.',
    phone: '+91 99040 56789',
    email: 'contact@saurashtrakisan.org',
    role: 'fpo',
    location: 'Aji GIDC Agri Hub, Rajkot',
    verified: true,
    rating: 4.8,
    totalOrders: 142,
    avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200&auto=format&fit=crop&q=80'
  },
  buyer: {
    id: 'buyer-1',
    name: 'GreenLeaf Grand Restaurant & Banquets',
    phone: '+91 97120 78901',
    email: 'procurement@greenleaf.com',
    role: 'buyer',
    location: '150ft Ring Road, Rajkot',
    verified: true,
    rating: 4.7,
    totalOrders: 65,
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'
  },
  admin: {
    id: 'admin-1',
    name: 'Dr. Alok Verma (AgriTech Officer)',
    phone: '+91 94280 99999',
    email: 'alok.verma@doca.gov.in',
    role: 'admin',
    location: 'Dept. of Consumer Affairs, New Delhi',
    verified: true,
    rating: 5.0,
    totalOrders: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  }
};

const STORAGE_KEY = 'farmsetu_current_user';

export const authService = {
  getCurrentUser(): User {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEMO_USERS.farmer;
  },

  switchRole(role: UserRole): User {
    const user = DEMO_USERS[role];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('farmsetu:role_changed', { detail: user }));
    return user;
  },

  login(role: UserRole): User {
    return this.switchRole(role);
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
