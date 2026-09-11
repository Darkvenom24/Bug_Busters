import React, { useState } from 'react';
import { Order } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ORDER_LIFECYCLE_STEPS } from '../../services/orderService';
import { formatCurrency } from '../../utils/cn';
import { CheckCircle2, Clock, Truck, Star, MapPin, ChevronRight } from 'lucide-react';

interface OrderTrackingCardProps {
  order: Order;
  onAdvanceStatus?: (id: string) => void;
  onRate?: (id: string, stars: number, comment: string) => void;
}

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({
  order,
  onAdvanceStatus,
  onRate,
}) => {
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  const getStatusVariant = (step: number) => {
    if (step >= 5) return 'success';
    if (step >= 3) return 'info';
    return 'warning';
  };

  return (
    <Card className="space-y-4 border border-slate-200/80 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Order #{order.id}
            </h3>
            <Badge variant={getStatusVariant(order.statusStep)}>
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Placed on {order.createdAt}
          </p>
        </div>

        <div className="text-right">
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(order.totalPrice)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {order.quantityKg} kg {order.crop} @ ₹{order.pricePerKg}/kg
          </div>
        </div>
      </div>

      {/* Stepper Progress Visualizer (PDF Page 9) */}
      <div className="py-2">
        <div className="grid grid-cols-6 gap-1 relative">
          {ORDER_LIFECYCLE_STEPS.slice(0, 6).map((stepName, index) => {
            const isCompleted = index <= order.statusStep;
            const isCurrent = index === order.statusStep;

            return (
              <div key={stepName} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  } ${isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 animate-pulse' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium leading-tight line-clamp-2 ${
                    isCompleted
                      ? 'text-slate-800 dark:text-slate-200 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${order.transitProgress}%` }}
          />
        </div>
      </div>

      {/* Logistics & Route Details */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Origin (Farm/FPO)</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{order.farmerName}</span>
            <p className="text-[11px] text-slate-500">{order.pickupLocation}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination (Buyer)</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{order.buyerName}</span>
            <p className="text-[11px] text-slate-500">{order.deliveryLocation}</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>ETA: <strong>{order.eta}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Rating button if completed */}
          {order.statusStep >= 5 && !order.rating && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="text-xs gap-1"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" /> Rate Order
            </Button>
          )}

          {/* Advance Step simulation button */}
          {order.statusStep < 6 && onAdvanceStatus && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAdvanceStatus(order.id)}
              className="text-xs gap-1 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Simulate Next Stage <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Rating Form if user toggled */}
      {showRatingForm && (
        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Rate Produce & Delivery:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className={`text-sm ${star <= ratingStars ? 'text-amber-500' : 'text-slate-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Add quality or delivery feedback..."
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="harvest"
              onClick={() => {
                if (onRate) onRate(order.id, ratingStars, ratingComment);
                setShowRatingForm(false);
              }}
              className="text-xs"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      )}

      {/* Show existing rating */}
      {order.rating && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            {'★'.repeat(order.rating.stars)}
            <span className="text-slate-700 dark:text-slate-300 ml-1 font-normal italic">
              "{order.rating.comment}"
            </span>
          </div>
          <Badge variant="success">Verified Feedback</Badge>
        </div>
      )}
    </Card>
  );
};
