import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { ProduceCard } from '../../components/cards/ProduceCard';
import { OrderTrackingCard } from '../../components/cards/OrderTrackingCard';
import { DemandChartCard } from '../../components/charts/DemandChartCard';
import { PriceAdviceCard } from '../../components/cards/PriceAdviceCard';
import { AddProduceModal } from '../../components/forms/AddProduceModal';
import { VoiceAssistantModal } from '../../components/common/VoiceAssistantModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/cn';
import {
  PlusCircle,
  Mic,
  Package,
  TrendingUp,
  Coins,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [produceList, setProduceList] = useState(productService.getByFarmer(user.id));
  const [orders, setOrders] = useState(orderService.getByFarmer(user.id));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [parsedVoiceData, setParsedVoiceData] = useState<{ crop: string; quantityKg: number } | undefined>();

  const refreshData = () => {
    setProduceList(productService.getByFarmer(user.id));
    setOrders(orderService.getByFarmer(user.id));
  };

  const handleAdvanceOrder = (orderId: string) => {
    orderService.advanceStatus(orderId);
    setOrders(orderService.getByFarmer(user.id));
  };

  const handleDeleteProduce = (produceId: string) => {
    productService.delete(produceId);
    setProduceList(productService.getByFarmer(user.id));
  };

  const totalStockKg = produceList.reduce((acc, p) => acc + p.quantityKg, 0);
  const totalEarnings = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const activeOrdersCount = orders.filter(o => o.statusStep < 5).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                Verified Mandi Farmer
              </Badge>
              <span className="text-xs text-emerald-200">ID: {user.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Namaste, {user.name} (કિસાન પોર્ટલ)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
              Location: {user.location} • Direct Mandi Hub • Rating: ⭐ {user.rating} / 5.0
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="harvest"
              size="sm"
              onClick={() => setIsVoiceModalOpen(true)}
              className="gap-1.5 shadow-md"
            >
              <Mic className="w-4 h-4" /> AI Voice Assistant
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setParsedVoiceData(undefined);
                setIsAddModalOpen(true);
              }}
              className="gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> List Produce
            </Button>
          </div>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-700/50">
          <div>
            <span className="text-xs text-emerald-200/80">Active Listings</span>
            <div className="text-2xl font-black text-white">{produceList.length}</div>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80">Available Stock</span>
            <div className="text-2xl font-black text-white">{totalStockKg.toLocaleString()} kg</div>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80">Total Direct Revenue</span>
            <div className="text-2xl font-black text-emerald-300">{formatCurrency(totalEarnings)}</div>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80">Active Buyer Orders</span>
            <div className="text-2xl font-black text-amber-300">{activeOrdersCount}</div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Section: Demand Forecasting & Price Recommendations (PDF Pages 5-6) */}
      <div id="insights" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemandChartCard initialCrop="Tomato" />
        <PriceAdviceCard crop="Tomato" />
      </div>

      {/* Produce Listings Section */}
      <div id="produce" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              My Active Produce Listings
            </h2>
            <p className="text-xs text-slate-500">Produce currently visible to buyers on FarmSetu marketplace</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setParsedVoiceData(undefined);
              setIsAddModalOpen(true);
            }}
            className="gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Produce
          </Button>
        </div>

        {produceList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">No active produce listed yet.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 text-xs"
            >
              List First Crop
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produceList.map((p) => (
              <ProduceCard
                key={p.id}
                produce={p}
                showAdminActions
                onDeleteClick={handleDeleteProduce}
              />
            ))}
          </div>
        )}
      </div>

      {/* Active Buyer Orders & Digital Lifecycle Tracking */}
      <div id="orders" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Incoming Buyer Orders & Deliveries
            </h2>
            <p className="text-xs text-slate-500">Track stage-by-stage order lifecycle from preparation to delivery</p>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshData} className="gap-1 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">No orders received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderTrackingCard
                key={o.id}
                order={o}
                onAdvanceStatus={handleAdvanceOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddProduceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialData={parsedVoiceData}
        onSuccess={refreshData}
      />

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onProduceParsed={(data) => {
          setParsedVoiceData(data);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
};
