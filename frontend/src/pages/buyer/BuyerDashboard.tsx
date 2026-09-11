import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { BuyerRequirement, MatchRecommendation, Order } from '../../types';
import { INITIAL_REQUIREMENTS } from '../../services/mockData';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { aiService } from '../../services/aiService';
import { OrderTrackingCard } from '../../components/cards/OrderTrackingCard';
import { PostRequirementModal } from '../../components/forms/PostRequirementModal';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/cn';
import {
  Store,
  PlusCircle,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  TrendingUp,
  Percent,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [requirements, setRequirements] = useState<BuyerRequirement[]>(INITIAL_REQUIREMENTS);
  const [selectedReq, setSelectedReq] = useState<BuyerRequirement>(INITIAL_REQUIREMENTS[0]);
  const [orders, setOrders] = useState<Order[]>(orderService.getByBuyer(user.id));
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Compute AI Matches for the currently selected requirement
  const produceList = productService.getAll();
  const matches = aiService.calculateMatches(selectedReq, produceList);

  const handleAdvanceOrder = (id: string) => {
    orderService.advanceStatus(id);
    setOrders(orderService.getByBuyer(user.id));
  };

  const handleRateOrder = (id: string, stars: number, comment: string) => {
    orderService.rateOrder(id, stars, comment);
    setOrders(orderService.getByBuyer(user.id));
  };

  const handleAcceptMatch = (match: MatchRecommendation) => {
    const qtyToOrder = Math.min(match.availableKg, selectedReq.quantityKg);
    const totalPrice = qtyToOrder * match.pricePerKg;

    const newOrder = orderService.create({
      buyerId: user.id,
      buyerName: user.name,
      farmerId: match.farmerId,
      farmerName: match.farmerName,
      produceId: match.produceId,
      crop: match.crop,
      quantityKg: qtyToOrder,
      pricePerKg: match.pricePerKg,
      totalPrice,
      eta: selectedReq.deliveryDate || 'Tomorrow Morning',
      pickupLocation: match.location,
      deliveryLocation: selectedReq.location,
      vehicleId: 'GJ-03-BX-4921 (Mahindra Bolero Maxi Truck)'
    });

    addNotification({
      title: 'Smart Match Order Confirmed',
      message: `Confirmed direct procurement of ${qtyToOrder} kg ${match.crop} from ${match.farmerName} (${match.matchScore}% Match).`,
      type: 'order',
      targetRole: 'buyer'
    });

    setOrders(orderService.getByBuyer(user.id));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="info" className="bg-blue-500/20 text-blue-300 border-blue-400/40">
                Direct Buyer Desk (Institutional / Consumer)
              </Badge>
              <span className="text-xs text-blue-200">Tier: Verified Enterprise</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
              Delivery Hub: {user.location} • Zero-Brokerage Direct Contract Sourcing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="harvest"
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
              className="gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> Post Requirement
            </Button>
            <Link to="/marketplace">
              <Button variant="outline" size="sm" className="gap-1.5 text-white border-blue-400 hover:bg-white/10">
                <Store className="w-4 h-4" /> Marketplace
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-800/60">
          <div>
            <span className="text-xs text-blue-200/80">Active Requirements</span>
            <div className="text-2xl font-black text-white">{requirements.length}</div>
          </div>
          <div>
            <span className="text-xs text-blue-200/80">Direct Orders Active</span>
            <div className="text-2xl font-black text-white">{orders.length}</div>
          </div>
          <div>
            <span className="text-xs text-blue-200/80">Middleman Costs Saved</span>
            <div className="text-2xl font-black text-emerald-400">₹42,800</div>
          </div>
          <div>
            <span className="text-xs text-blue-200/80">Average AI Match Score</span>
            <div className="text-2xl font-black text-amber-400">89.4%</div>
          </div>
        </div>
      </div>

      {/* AI Smart Farmer-Buyer Matching Engine (PDF Page 7) */}
      <div id="matching" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Smart Farmer-Buyer Matching Engine
              </h2>
              <Badge variant="warning">Weighted Multi-Factor Algorithm</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates: Distance (25%), Price (30%), Quantity (20%), Quality Grade (15%), Farmer Reliability (10%)
            </p>
          </div>

          {/* Active Requirement Selector Tabs */}
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {requirements.map(req => (
              <button
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedReq.id === req.id
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {req.crop} ({req.quantityKg} kg)
              </button>
            ))}
          </div>
        </div>

        {/* Selected Requirement Specification Box */}
        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-800/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-blue-950 dark:text-blue-200 block text-sm">
              Current Requirement: {selectedReq.crop} — {selectedReq.quantityKg} kg ({selectedReq.qualityRequirement})
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Max Price: <strong>₹{selectedReq.maxPricePerKg}/kg</strong> • Needed: <strong>{selectedReq.deliveryDate}</strong> • Max Distance: <strong>{selectedReq.maxDistanceKm} km</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {matches.length} Compatible Farmer Matches Found
            </span>
          </div>
        </div>

        {/* Ranked Matches List (PDF Page 7: Farmer A 92%, Farmer B 86%, Farmer C 79%) */}
        <div className="space-y-3">
          {matches.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No current farmers match this specific crop requirement. Post a new requirement or check marketplace.</p>
          ) : (
            matches.map((m) => (
              <div
                key={m.produceId}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4 hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {/* Match Score Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col items-center justify-center shadow-md">
                    <span className="text-lg font-black leading-none">{m.matchScore}%</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-200">Match</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.farmerName}</h4>
                      <Badge variant={m.qualityGrade === 'Grade A' ? 'success' : 'warning'}>
                        {m.qualityGrade}
                      </Badge>
                      <span className="text-xs text-amber-500 font-bold">★ {m.reliabilityRating}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Location: {m.location} • Distance: <strong>{m.distanceKm} km</strong> • Stock: <strong>{m.availableKg} kg</strong>
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mt-1">
                      <span>Dist Score: {m.breakdown.distanceScore}</span>
                      <span>•</span>
                      <span>Price Score: {m.breakdown.priceScore}</span>
                      <span>•</span>
                      <span>Qty Score: {m.breakdown.quantityScore}</span>
                      <span>•</span>
                      <span>Reliability: {m.breakdown.reliabilityScore}</span>
                    </div>
                  </div>
                </div>

                {/* Offer Price & Order Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(m.pricePerKg)}
                      <span className="text-xs font-normal text-slate-500"> / kg</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Total: {formatCurrency(Math.min(m.availableKg, selectedReq.quantityKg) * m.pricePerKg)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAcceptMatch(m)}
                    className="gap-1 text-xs"
                  >
                    Accept Offer <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Buyer Orders & GPS Tracking */}
      <div id="orders" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Active Orders & Real-Time Tracking
            </h2>
            <p className="text-xs text-slate-500">Live digital lifecycle from harvest confirmation to doorstep delivery</p>
          </div>
          <Link to="/logistics">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <MapPin className="w-3.5 h-3.5" /> View Fleet Map
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">No active procurement orders right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderTrackingCard
                key={o.id}
                order={o}
                onAdvanceStatus={handleAdvanceOrder}
                onRate={handleRateOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Requirement Modal */}
      <PostRequirementModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onCreated={(newReq) => {
          setRequirements([newReq, ...requirements]);
          setSelectedReq(newReq);
        }}
      />
    </div>
  );
};
