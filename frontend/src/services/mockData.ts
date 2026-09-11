import { Produce, BuyerRequirement, Order, DemandPrediction, PriceRecommendation, OptimizedRoute, NotificationItem } from '../types';

export const INITIAL_PRODUCE: Produce[] = [
  {
    id: 'prod-101',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    crop: 'Tomato',
    variety: 'Hybrid Vaishali',
    category: 'Vegetable',
    quantityKg: 500,
    qualityGrade: 'Grade A',
    pricePerKg: 31,
    suggestedPriceRange: [30, 33],
    availableDate: 'Tomorrow',
    location: 'Rajkot, Gujarat',
    coordinates: [22.3039, 70.8022],
    organic: true,
    freshnessPriority: 'High',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly harvested vine-ripened Grade A hybrid tomatoes with firm skin and long shelf-life.'
  },
  {
    id: 'prod-102',
    farmerId: 'farmer-2',
    farmerName: 'Kishorebhai Vala',
    crop: 'Onion',
    variety: 'Nasik Red',
    category: 'Vegetable',
    quantityKg: 2400,
    qualityGrade: 'Grade A',
    pricePerKg: 28,
    suggestedPriceRange: [27, 30],
    availableDate: 'Ready for Dispatch',
    location: 'Ahmedabad, Gujarat',
    coordinates: [23.0225, 72.5714],
    organic: false,
    freshnessPriority: 'Medium',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Cured medium-large red onions, dry skin with zero sprouting. Ideal for bulk restaurant storage.'
  },
  {
    id: 'prod-103',
    farmerId: 'farmer-3',
    farmerName: 'Savita Devi',
    crop: 'Spinach (Palak)',
    variety: 'All Green Desi',
    category: 'Vegetable',
    quantityKg: 350,
    qualityGrade: 'Grade A',
    pricePerKg: 22,
    suggestedPriceRange: [20, 24],
    availableDate: 'Harvesting Today at 4 PM',
    location: 'Gondal, Gujarat',
    coordinates: [21.9619, 70.7923],
    organic: true,
    freshnessPriority: 'Very High',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    description: 'Tender dark green leaves, organically grown without synthetic pesticides. Requires rapid cold logistics.'
  },
  {
    id: 'prod-104',
    farmerId: 'farmer-4',
    farmerName: 'Bhavesh Chudasama',
    fpoId: 'fpo-1',
    fpoName: 'Saurashtra Kisan Producer Co.',
    crop: 'Banana',
    variety: 'Grand Naine (G9)',
    category: 'Fruit',
    quantityKg: 1800,
    qualityGrade: 'Grade A',
    pricePerKg: 19,
    suggestedPriceRange: [18, 21],
    availableDate: 'Next 2 Days',
    location: 'Anand, Gujarat',
    coordinates: [22.5645, 72.9289],
    organic: false,
    freshnessPriority: 'High',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    description: 'Uniform calibrated export-standard bananas, mature green stage ready for controlled ripening.'
  },
  {
    id: 'prod-105',
    farmerId: 'farmer-5',
    farmerName: 'Devjibhai Bharwad',
    crop: 'Potato',
    variety: 'Kufri Pukhraj',
    category: 'Vegetable',
    quantityKg: 4000,
    qualityGrade: 'Grade B',
    pricePerKg: 16,
    suggestedPriceRange: [15, 18],
    availableDate: 'Immediate Stock',
    location: 'Deesa, Banaskantha',
    coordinates: [24.2586, 72.1818],
    organic: false,
    freshnessPriority: 'Low',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'High dry-matter table potatoes, washed and graded. Excellent shelf stability.'
  },
  {
    id: 'prod-106',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    crop: 'Green Chilli',
    variety: 'G-4 Spicy',
    category: 'Spice',
    quantityKg: 300,
    qualityGrade: 'Grade A',
    pricePerKg: 48,
    suggestedPriceRange: [45, 52],
    availableDate: 'Tomorrow',
    location: 'Rajkot, Gujarat',
    coordinates: [22.3039, 70.8022],
    organic: true,
    freshnessPriority: 'High',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh dark green pungent chillies, handpicked for minimal damage.'
  }
];

export const INITIAL_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'req-201',
    buyerId: 'buyer-1',
    buyerName: 'GreenLeaf Grand Restaurant & Banquets',
    buyerType: 'Restaurant',
    crop: 'Tomato',
    quantityKg: 300,
    maxPricePerKg: 32,
    deliveryDate: 'Tomorrow Morning',
    location: 'Rajkot City Center',
    maxDistanceKm: 50,
    qualityRequirement: 'Grade A',
    status: 'Matched',
    createdAt: '2026-09-11 08:30 AM'
  },
  {
    id: 'req-202',
    buyerId: 'buyer-2',
    buyerName: 'FreshBazaar Supermarket Chain',
    buyerType: 'Supermarket',
    crop: 'Onion',
    quantityKg: 1500,
    maxPricePerKg: 30,
    deliveryDate: 'Within 3 Days',
    location: 'Ahmedabad Warehouse Hub',
    maxDistanceKm: 120,
    qualityRequirement: 'Grade A',
    status: 'Open',
    createdAt: '2026-09-11 09:15 AM'
  },
  {
    id: 'req-203',
    buyerId: 'buyer-3',
    buyerName: 'Aahar Agro Food Processors',
    buyerType: 'Food Processor',
    crop: 'Banana',
    quantityKg: 2500,
    maxPricePerKg: 20,
    deliveryDate: 'Sep 15, 2026',
    location: 'Vadodara Industrial Zone',
    maxDistanceKm: 90,
    qualityRequirement: 'Grade A',
    status: 'Open',
    createdAt: '2026-09-10 04:00 PM'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    buyerId: 'buyer-1',
    buyerName: 'GreenLeaf Grand Restaurant',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    produceId: 'prod-101',
    crop: 'Tomato',
    quantityKg: 300,
    pricePerKg: 31,
    totalPrice: 9300,
    status: 'In Transit',
    statusStep: 4,
    createdAt: '2026-09-11 07:45 AM',
    eta: 'Today, 02:30 PM (Est. 42 mins)',
    pickupLocation: 'Farm 14, Bedipara, Rajkot',
    deliveryLocation: 'Ring Road Branch, Rajkot',
    transitProgress: 68,
    vehicleId: 'GJ-03-BX-4921 (Mahindra Bolero Maxi Truck)'
  },
  {
    id: 'ORD-8819',
    buyerId: 'buyer-2',
    buyerName: 'FreshBazaar Supermarket',
    farmerId: 'farmer-2',
    farmerName: 'Kishorebhai Vala',
    produceId: 'prod-102',
    crop: 'Onion',
    quantityKg: 1000,
    pricePerKg: 28,
    totalPrice: 28000,
    status: 'Payment / Completion',
    statusStep: 6,
    createdAt: '2026-09-10 11:20 AM',
    eta: 'Delivered',
    pickupLocation: 'Sanand Taluka, Ahmedabad',
    deliveryLocation: 'Sarkhej Warehouse, Ahmedabad',
    transitProgress: 100,
    vehicleId: 'GJ-01-CZ-8820',
    rating: {
      stars: 5,
      comment: 'Superb dry quality onions. Exactly matches Grade A specification!'
    }
  },
  {
    id: 'ORD-8822',
    buyerId: 'buyer-4',
    buyerName: 'Hotel Royal Palace',
    farmerId: 'farmer-3',
    farmerName: 'Savita Devi',
    produceId: 'prod-103',
    crop: 'Spinach (Palak)',
    quantityKg: 120,
    pricePerKg: 22,
    totalPrice: 2640,
    status: 'Produce Prepared',
    statusStep: 2,
    createdAt: '2026-09-11 10:15 AM',
    eta: 'Today, 05:00 PM',
    pickupLocation: 'Gondal Highway Farm',
    deliveryLocation: 'Kalawad Road, Rajkot',
    transitProgress: 25,
    vehicleId: 'GJ-03-AX-1142'
  }
];

export const DEMAND_FORECASTS: Record<string, DemandPrediction> = {
  'Tomato': {
    crop: 'Tomato',
    location: 'Rajkot / Saurashtra Region',
    currentDemandTons: 1200,
    predictedDemandTons: 1650,
    percentChange: 37.5,
    period: 'Next 30 Days',
    aiInsight: 'Festival and marriage season surge upcoming. High institutional catering demand will keep prices elevated. Plan harvest staggering.',
    chartData: [
      { month: 'Jun', actual: 950, predicted: 940 },
      { month: 'Jul', actual: 1050, predicted: 1080 },
      { month: 'Aug', actual: 1180, predicted: 1200 },
      { month: 'Sep (Now)', actual: 1200, predicted: 1250 },
      { month: 'Oct (AI)', actual: 0, predicted: 1550 },
      { month: 'Nov (AI)', actual: 0, predicted: 1650 }
    ]
  },
  'Onion': {
    crop: 'Onion',
    location: 'Ahmedabad / North Gujarat',
    currentDemandTons: 1800,
    predictedDemandTons: 2400,
    percentChange: 33.3,
    period: 'Next 30 Days',
    aiInsight: 'Onion demand is expected to increase by ~33%. Bulk buyers and retailers are securing winter stock. Recommend holding cured stock for target range ₹29-₹32/kg.',
    chartData: [
      { month: 'Jun', actual: 1600, predicted: 1580 },
      { month: 'Jul', actual: 1690, predicted: 1710 },
      { month: 'Aug', actual: 1750, predicted: 1780 },
      { month: 'Sep (Now)', actual: 1800, predicted: 1820 },
      { month: 'Oct (AI)', actual: 0, predicted: 2150 },
      { month: 'Nov (AI)', actual: 0, predicted: 2400 }
    ]
  },
  'Banana': {
    crop: 'Banana',
    location: 'Anand / Central Gujarat',
    currentDemandTons: 850,
    predictedDemandTons: 980,
    percentChange: 15.2,
    period: 'Next 30 Days',
    aiInsight: 'Steady growth in consumer snacking and juice factory requirements. Quality Grade A fruit fetching 12% premium.',
    chartData: [
      { month: 'Jun', actual: 780, predicted: 770 },
      { month: 'Jul', actual: 810, predicted: 800 },
      { month: 'Aug', actual: 840, predicted: 830 },
      { month: 'Sep (Now)', actual: 850, predicted: 860 },
      { month: 'Oct (AI)', actual: 0, predicted: 920 },
      { month: 'Nov (AI)', actual: 0, predicted: 980 }
    ]
  }
};

export const PRICE_RECOMMENDATIONS: Record<string, PriceRecommendation> = {
  'Tomato': {
    crop: 'Tomato',
    marketReferencePrice: 28,
    recommendedMin: 30,
    recommendedMax: 33,
    demandLevel: 'High',
    supplyLevel: 'Medium',
    qualityFactor: 'Grade A (+₹2.50)',
    logisticsPerKg: 2.80,
    confidenceScore: 94,
    factorsSummary: 'Market Reference: ₹28/kg + High Demand + Grade A + Local Transit (15km) yields recommended ₹30–₹33/kg.'
  },
  'Onion': {
    crop: 'Onion',
    marketReferencePrice: 26,
    recommendedMin: 28,
    recommendedMax: 31,
    demandLevel: 'High',
    supplyLevel: 'Medium',
    qualityFactor: 'Grade A Cured (+₹2.00)',
    logisticsPerKg: 1.90,
    confidenceScore: 92,
    factorsSummary: 'Mandi Base ₹26/kg adjusted for +33% predicted demand and low storage decay risk.'
  },
  'Spinach (Palak)': {
    crop: 'Spinach (Palak)',
    marketReferencePrice: 19,
    recommendedMin: 22,
    recommendedMax: 25,
    demandLevel: 'High',
    supplyLevel: 'Low',
    qualityFactor: 'Organic Grade A (+₹3.00)',
    logisticsPerKg: 3.20,
    confidenceScore: 89,
    factorsSummary: 'Extreme perishability and organic certification command prompt premium dispatch.'
  }
};

export const INITIAL_OPTIMIZED_ROUTE: OptimizedRoute = {
  id: 'ROUTE-OPT-401',
  vehicleId: 'GJ-03-BX-4921',
  driverName: 'Suresh Parmar (+91 98251 34912)',
  capacityKg: 1500,
  loadedKg: 1150,
  totalDistanceKm: 46.8,
  totalTimeHours: 1.8,
  costSavedPercent: 28.4,
  status: 'En Route',
  stops: [
    {
      id: 'stop-1',
      name: 'Farm A — Ramesh Patel',
      role: 'farm',
      location: 'Bedi, Rajkot Rural',
      coordinates: [22.3451, 70.8241],
      crop: 'Tomato',
      quantityKg: 300,
      freshnessPriority: 'High',
      estimatedArrival: '09:00 AM',
      completed: true
    },
    {
      id: 'stop-2',
      name: 'Farm B — Savita Devi',
      role: 'farm',
      location: 'Gondal Road Outskirts',
      coordinates: [22.2541, 70.7812],
      crop: 'Spinach',
      quantityKg: 200,
      freshnessPriority: 'Very High (1st Priority)',
      estimatedArrival: '09:45 AM',
      completed: true
    },
    {
      id: 'stop-3',
      name: 'FPO Saurashtra Central Collection Hub',
      role: 'fpo_hub',
      location: 'Aji GIDC Agri Hub, Rajkot',
      coordinates: [22.2821, 70.8152],
      crop: 'Aggregated Produce Sort & Batch',
      quantityKg: 650,
      freshnessPriority: 'Inspection & QC',
      estimatedArrival: '10:30 AM',
      completed: true
    },
    {
      id: 'stop-4',
      name: 'GreenLeaf Grand Restaurant',
      role: 'buyer',
      location: '150ft Ring Road, Rajkot',
      coordinates: [22.2982, 70.7712],
      crop: 'Tomato (300kg)',
      quantityKg: 300,
      freshnessPriority: 'Delivered',
      estimatedArrival: '11:45 AM',
      completed: false
    },
    {
      id: 'stop-5',
      name: 'Hotel Royal Palace Banquets',
      role: 'buyer',
      location: 'Kalawad Road, Rajkot',
      coordinates: [22.2891, 70.7601],
      crop: 'Spinach (120kg) + Veg (230kg)',
      quantityKg: 350,
      freshnessPriority: 'En Route',
      estimatedArrival: '12:30 PM',
      completed: false
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New High-Value Buyer Requirement',
    message: 'GreenLeaf Grand Restaurant posted a requirement for 300 kg Tomato at ₹32/kg. You have a 92% match!',
    type: 'demand',
    targetRole: 'farmer',
    time: '15 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'AI Price Advisory Alert',
    message: 'Tomato price benchmark increased to ₹30–₹33/kg. Recommended to update listing price.',
    type: 'price',
    targetRole: 'farmer',
    time: '1 hour ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Order Confirmed: #ORD-8821',
    message: 'Buyer has accepted delivery schedule. Driver Suresh Parmar dispatched for pickup.',
    type: 'order',
    targetRole: 'farmer',
    time: '2 hours ago',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Route Optimization Complete',
    message: 'Trip #ROUTE-OPT-401 combined 3 farm pickups saving 28.4% transport emission and cost.',
    type: 'logistics',
    targetRole: 'fpo',
    time: '3 hours ago',
    read: true
  }
];
