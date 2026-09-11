import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { QualityGrade } from '../../types';
import { aiService } from '../../services/aiService';
import { formatCurrency } from '../../utils/cn';
import { Coins, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const PriceAdviceCard: React.FC<{ crop?: string }> = ({ crop = 'Tomato' }) => {
  const [selectedCrop, setSelectedCrop] = useState(crop);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [distanceKm, setDistanceKm] = useState(25);
  const [isOrganic, setIsOrganic] = useState(false);

  const priceAdvice = aiService.calculatePriceRecommendation(
    selectedCrop,
    qualityGrade,
    distanceKm,
    isOrganic
  );

  return (
    <Card className="space-y-4 border border-slate-200/80 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg">
            <Coins className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Price Recommendation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fair advisory price based on market factors & logistics
            </p>
          </div>
        </div>
        <Badge variant="warning">ML Regression</Badge>
      </div>

      {/* Suggested Price Highlight */}
      <div className="bg-gradient-to-br from-amber-50 to-emerald-50/50 dark:from-slate-800 dark:to-emerald-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-700 text-center">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Recommended Price Range ({selectedCrop})
        </span>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {formatCurrency(priceAdvice.recommendedMin)} – {formatCurrency(priceAdvice.recommendedMax)}
          <span className="text-sm font-semibold text-slate-500"> / kg</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Current Mandi Benchmark: ₹{priceAdvice.marketReferencePrice}/kg • Confidence: {priceAdvice.confidenceScore}%
        </p>
      </div>

      {/* Factors Simulator (Sliders & Controls) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Simulation Factors:
          </span>
        </div>

        {/* Quality Grade selector */}
        <div className="grid grid-cols-3 gap-2">
          {(['Grade A', 'Grade B', 'Grade C'] as QualityGrade[]).map((g) => (
            <button
              key={g}
              onClick={() => setQualityGrade(g)}
              className={`py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all ${
                qualityGrade === g
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Distance Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Logistics Distance</span>
            <span className="font-bold text-slate-800 dark:text-white">{distanceKm} km (₹{priceAdvice.logisticsPerKg}/kg)</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Organic Toggle */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-700 dark:text-slate-300 font-medium">Certified Organic Produce</span>
          <button
            onClick={() => setIsOrganic(!isOrganic)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              isOrganic ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                isOrganic ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Advisory Formula Notice */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 border border-slate-200/60 dark:border-slate-700/60">
        <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold block text-slate-800 dark:text-slate-200">Advisory Guarantee:</span>
          {priceAdvice.factorsSummary}
        </div>
      </div>
    </Card>
  );
};
