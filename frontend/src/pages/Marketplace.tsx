import React, { useState } from 'react';
import { Produce } from '../types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ProduceCard } from '../components/cards/ProduceCard';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/cn';
import { Search, Filter, Sparkles, CheckCircle2, ShoppingCart } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [produceList, setProduceList] = useState<Produce[]>(productService.getAll());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'qty_desc'>('price_asc');

  // Order Placement Modal state
  const [selectedProduce, setSelectedProduce] = useState<Produce | null>(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState(100);
  const [deliveryLocation, setDeliveryLocation] = useState(user.location || 'Rajkot Central');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = ['All', 'Vegetable', 'Fruit', 'Grain', 'Pulse', 'Spice'];

  // Filter & Sort Logic
  const filteredProduce = produceList
    .filter(p => {
      const matchSearch = p.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchGrade = selectedGrade === 'All' || p.qualityGrade === selectedGrade;
      const matchOrganic = !organicOnly || p.organic;
      return matchSearch && matchCategory && matchGrade && matchOrganic;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price_desc') return b.pricePerKg - a.pricePerKg;
      return b.quantityKg - a.quantityKg;
    });

  const handleOpenOrder = (produce: Produce) => {
    setSelectedProduce(produce);
    setOrderQuantityKg(Math.min(produce.quantityKg, 100));
    setOrderSuccess(false);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduce) return;

    const totalPrice = orderQuantityKg * selectedProduce.pricePerKg;

    const newOrder = orderService.create({
      buyerId: user.id,
      buyerName: user.name,
      farmerId: selectedProduce.farmerId,
      farmerName: selectedProduce.farmerName,
      produceId: selectedProduce.id,
      crop: selectedProduce.crop,
      quantityKg: orderQuantityKg,
      pricePerKg: selectedProduce.pricePerKg,
      totalPrice,
      eta: 'Tomorrow Morning',
      pickupLocation: selectedProduce.location,
      deliveryLocation,
      vehicleId: 'GJ-03-BX-4921 (Mahindra Bolero Maxi Truck)'
    });

    addNotification({
      title: `Order Placed: #${newOrder.id}`,
      message: `Ordered ${orderQuantityKg} kg of ${selectedProduce.crop} directly from ${selectedProduce.farmerName}.`,
      type: 'order',
      targetRole: 'buyer'
    });

    setOrderSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Direct Digital Marketplace
            </h1>
            <Badge variant="success">Fewer Middlemen • Fairer Prices</Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified agricultural produce direct from farmers & FPOs across Gujarat and Western India.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by crop name (Tomato, Onion...), farmer, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Quality Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            >
              <option value="All">All Quality Grades</option>
              <option value="Grade A">Grade A (Export / Supermarket)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Grade C">Grade C (Processing)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="qty_desc">Quantity: Largest Stock First</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Organic Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Only 100% Organic Certified
            </span>
          </label>
        </div>
      </div>

      {/* Produce Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Showing {filteredProduce.length} available produce listings
          </span>
        </div>

        {filteredProduce.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No produce found matching your filter criteria.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedGrade('All');
                setOrganicOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProduce.map((p) => (
              <ProduceCard
                key={p.id}
                produce={p}
                onOrderClick={handleOpenOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Direct Order Modal */}
      {selectedProduce && (
        <Modal
          isOpen={!!selectedProduce}
          onClose={() => setSelectedProduce(null)}
          title={`🛒 Place Direct Order: ${selectedProduce.crop}`}
          subtitle={`Direct transaction with ${selectedProduce.farmerName} (${selectedProduce.location})`}
          maxWidth="md"
        >
          {orderSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Order Confirmed!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your direct farm order has been dispatched into the digital fulfillment lifecycle. You can track pickup and transit in real-time.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Button variant="primary" size="sm" onClick={() => setSelectedProduce(null)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                <img
                  src={selectedProduce.image}
                  alt={selectedProduce.crop}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedProduce.crop}</h4>
                  <p className="text-xs text-slate-500">Quality: {selectedProduce.qualityGrade} • Available: {selectedProduce.quantityKg} kg</p>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(selectedProduce.pricePerKg)} / kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Order (kg) *
                </label>
                <input
                  type="number"
                  min="10"
                  max={selectedProduce.quantityKg}
                  value={orderQuantityKg}
                  onChange={(e) => setOrderQuantityKg(Number(e.target.value))}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Max available: {selectedProduce.quantityKg} kg
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Destination Address *
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Price Calculation Box */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Produce Subtotal ({orderQuantityKg} kg × ₹{selectedProduce.pricePerKg})</span>
                  <span className="font-semibold">{formatCurrency(orderQuantityKg * selectedProduce.pricePerKg)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>AI Optimized Logistics & QC</span>
                  <span className="text-emerald-600 font-semibold">Included</span>
                </div>
                <div className="pt-1.5 border-t border-emerald-200 dark:border-emerald-800 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(orderQuantityKg * selectedProduce.pricePerKg)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedProduce(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                  <ShoppingCart className="w-4 h-4" /> Confirm & Place Order
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
