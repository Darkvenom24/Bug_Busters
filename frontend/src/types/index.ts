export type UserRole = 'farmer' | 'fpo' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  location: string;
  verified: boolean;
  avatar?: string;
  rating?: number;
  totalOrders?: number;
}

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export interface Produce {
  id: string;
  farmerId: string;
  farmerName: string;
  fpoId?: string;
  fpoName?: string;
  crop: string;
  variety?: string;
  category: 'Vegetable' | 'Fruit' | 'Grain' | 'Pulse' | 'Spice';
  quantityKg: number;
  qualityGrade: QualityGrade;
  pricePerKg: number;
  suggestedPriceRange?: [number, number];
  availableDate: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  harvestDate?: string;
  organic: boolean;
  freshnessPriority: 'Very High' | 'High' | 'Medium' | 'Low';
  image: string;
  description?: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: 'Restaurant' | 'Hotel' | 'Retailer' | 'Supermarket' | 'Food Processor' | 'Consumer';
  crop: string;
  quantityKg: number;
  maxPricePerKg: number;
  deliveryDate: string;
  location: string;
  maxDistanceKm: number;
  qualityRequirement: QualityGrade;
  status: 'Open' | 'Matched' | 'Fulfilled';
  createdAt: string;
}

export interface MatchRecommendation {
  farmerId: string;
  produceId: string;
  farmerName: string;
  crop: string;
  location: string;
  distanceKm: number;
  matchScore: number; // e.g. 92%
  pricePerKg: number;
  availableKg: number;
  qualityGrade: QualityGrade;
  reliabilityRating: number;
  breakdown: {
    distanceScore: number;
    priceScore: number;
    quantityScore: number;
    qualityScore: number;
    reliabilityScore: number;
  };
}

export type OrderStatus =
  | 'Order Placed'
  | 'Farmer/FPO Confirmed'
  | 'Produce Prepared'
  | 'Pickup'
  | 'In Transit'
  | 'Delivered'
  | 'Payment / Completion';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  produceId: string;
  crop: string;
  quantityKg: number;
  pricePerKg: number;
  totalPrice: number;
  status: OrderStatus;
  statusStep: number; // 1 to 6
  createdAt: string;
  eta: string;
  pickupLocation: string;
  deliveryLocation: string;
  transitProgress: number; // 0 to 100%
  vehicleId?: string;
  rating?: {
    stars: number;
    comment: string;
  };
}

export interface DemandPrediction {
  crop: string;
  location: string;
  currentDemandTons: number;
  predictedDemandTons: number;
  percentChange: number;
  period: string;
  aiInsight: string;
  chartData: Array<{ month: string; actual: number; predicted: number }>;
}

export interface PriceRecommendation {
  crop: string;
  marketReferencePrice: number;
  recommendedMin: number;
  recommendedMax: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  supplyLevel: 'High' | 'Medium' | 'Low';
  qualityFactor: string;
  logisticsPerKg: number;
  confidenceScore: number;
  factorsSummary: string;
}

export interface RouteStop {
  id: string;
  name: string;
  role: 'farm' | 'fpo_hub' | 'buyer';
  location: string;
  coordinates: [number, number];
  crop: string;
  quantityKg: number;
  freshnessPriority: string;
  estimatedArrival: string;
  completed: boolean;
}

export interface OptimizedRoute {
  id: string;
  vehicleId: string;
  driverName: string;
  capacityKg: number;
  loadedKg: number;
  stops: RouteStop[];
  totalDistanceKm: number;
  totalTimeHours: number;
  costSavedPercent: number;
  status: 'Planning' | 'Dispatched' | 'En Route' | 'Completed';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'demand' | 'price' | 'logistics' | 'system';
  targetRole?: UserRole;
  time: string;
  read: boolean;
}
