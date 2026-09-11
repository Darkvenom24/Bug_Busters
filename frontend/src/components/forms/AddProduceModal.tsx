import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { QualityGrade } from '../../types';
import { productService } from '../../services/productService';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Sparkles, Check, UploadCloud } from 'lucide-react';

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { crop?: string; quantityKg?: number };
  onSuccess?: () => void;
}

export const AddProduceModal: React.FC<AddProduceModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<'Vegetable' | 'Fruit' | 'Grain' | 'Pulse' | 'Spice'>('Vegetable');
  const [quantityKg, setQuantityKg] = useState(500);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [pricePerKg, setPricePerKg] = useState(31);
  const [availableDate, setAvailableDate] = useState('Tomorrow');
  const [location, setLocation] = useState(user.location || 'Rajkot, Gujarat');
  const [organic, setOrganic] = useState(false);
  const [description, setDescription] = useState('');

  // Update when initialData from voice assistant changes
  useEffect(() => {
    if (initialData?.crop) setCrop(initialData.crop);
    if (initialData?.quantityKg) setQuantityKg(initialData.quantityKg);
  }, [initialData]);

  // Fetch recommended price
  const priceAdvice = aiService.calculatePriceRecommendation(crop, qualityGrade, 25, organic);

  const applyRecommendedPrice = () => {
    setPricePerKg(priceAdvice.recommendedMin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default crop images
    const cropImages: Record<string, string> = {
      'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
      'Spinach (Palak)': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
      'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
      'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    };

    productService.add({
      farmerId: user.id,
      farmerName: user.name,
      crop,
      variety: variety || 'Standard Mandi Hybrid',
      category,
      quantityKg: Number(quantityKg),
      qualityGrade,
      pricePerKg: Number(pricePerKg),
      suggestedPriceRange: [priceAdvice.recommendedMin, priceAdvice.recommendedMax],
      availableDate,
      location,
      coordinates: [22.3039, 70.8022],
      organic,
      freshnessPriority: crop.includes('Spinach') ? 'Very High' : crop.includes('Tomato') ? 'High' : 'Medium',
      image: cropImages[crop] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      description: description || `Fresh harvested ${crop} direct from farm.`
    });

    addNotification({
      title: 'Produce Listed Successfully',
      message: `${quantityKg} kg of ${crop} listed at ₹${pricePerKg}/kg. Live on marketplace.`,
      type: 'order',
      targetRole: 'farmer'
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🌱 List New Farm Produce"
      subtitle="Add your harvested crop to FarmSetu direct marketplace"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Crop *
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
              <option value="Green Chilli">Green Chilli (મરચાં / हरी मिर्च)</option>
            </select>
          </div>

          {/* Variety */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Variety / Seed Type
            </label>
            <input
              type="text"
              placeholder="e.g. Hybrid Vaishali, Desi"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Total Quantity (kg) *
            </label>
            <input
              type="number"
              min="10"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quality Grade *
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Grade A">Grade A (Premium)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Grade C">Grade C (Commercial)</option>
            </select>
          </div>

          {/* Price per Kg */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Price (₹/kg) *
            </label>
            <input
              type="number"
              min="1"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(Number(e.target.value))}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* AI Price Recommendation Banner */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              AI Recommended Fair Price: <strong>₹{priceAdvice.recommendedMin} – ₹{priceAdvice.recommendedMax}/kg</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={applyRecommendedPrice}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-2.5 py-1 rounded-lg transition-colors"
          >
            Apply Suggested Rate
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Availability Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Availability Timing *
            </label>
            <input
              type="text"
              placeholder="e.g. Tomorrow, Ready for Dispatch"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Farm Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Organic Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="organicCheck"
            checked={organic}
            onChange={(e) => setOrganic(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <label htmlFor="organicCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            Certified Organic produce (Zero synthetic pesticide / Jaivik Bharat)
          </label>
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="sm">
            Publish Produce to Marketplace
          </Button>
        </div>
      </form>
    </Modal>
  );
};
