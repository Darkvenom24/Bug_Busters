import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { QualityGrade, BuyerRequirement } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (req: BuyerRequirement) => void;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [crop, setCrop] = useState('Tomato');
  const [quantityKg, setQuantityKg] = useState(300);
  const [maxPricePerKg, setMaxPricePerKg] = useState(32);
  const [deliveryDate, setDeliveryDate] = useState('Tomorrow');
  const [location, setLocation] = useState(user.location || 'Rajkot City Center');
  const [maxDistanceKm, setMaxDistanceKm] = useState(50);
  const [qualityRequirement, setQualityRequirement] = useState<QualityGrade>('Grade A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq: BuyerRequirement = {
      id: `req-${Date.now()}`,
      buyerId: user.id,
      buyerName: user.name,
      buyerType: 'Restaurant',
      crop,
      quantityKg: Number(quantityKg),
      maxPricePerKg: Number(maxPricePerKg),
      deliveryDate,
      location,
      maxDistanceKm: Number(maxDistanceKm),
      qualityRequirement,
      status: 'Open',
      createdAt: 'Just now'
    };

    addNotification({
      title: 'Bulk Requirement Posted',
      message: `Posted demand for ${quantityKg} kg ${crop}. AI matching engine initiated.`,
      type: 'demand',
      targetRole: 'buyer'
    });

    if (onCreated) onCreated(newReq);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📋 Post Bulk Procurement Requirement"
      subtitle="Define your crop specifications to get AI-matched farmer offers"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Required Crop *
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Tomato">Tomato (ટામેટા / टमाटर)</option>
              <option value="Onion">Onion (ડુંગળી / प्याज)</option>
              <option value="Spinach (Palak)">Spinach (પાલક / पालक)</option>
              <option value="Banana">Banana (કેળા / केला)</option>
              <option value="Potato">Potato (બટાકા / आलू)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quality Grade Needed *
            </label>
            <select
              value={qualityRequirement}
              onChange={(e) => setQualityRequirement(e.target.value as QualityGrade)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Grade A">Grade A (Premium Export Quality)</option>
              <option value="Grade B">Grade B (Standard Commercial)</option>
              <option value="Grade C">Grade C (Processing Quality)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Total Quantity Required (kg) *
            </label>
            <input
              type="number"
              min="50"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Maximum Target Price (₹/kg) *
            </label>
            <input
              type="number"
              min="5"
              value={maxPricePerKg}
              onChange={(e) => setMaxPricePerKg(Number(e.target.value))}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Required Delivery Schedule *
            </label>
            <input
              type="text"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              placeholder="e.g. Tomorrow Morning"
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Max Sourcing Distance (km)
            </label>
            <input
              type="number"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>FarmSetu AI will automatically scan active farmer and FPO listings to rank optimal supply matches.</span>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="gap-1.5">
            <ShoppingBag className="w-4 h-4" /> Broadcast Requirement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
