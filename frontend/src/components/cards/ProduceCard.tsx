import React from 'react';
import { Produce } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/cn';
import { MapPin, Calendar, CheckCircle, Sparkles, Scale } from 'lucide-react';

interface ProduceCardProps {
  produce: Produce;
  onOrderClick?: (produce: Produce) => void;
  showAdminActions?: boolean;
  onDeleteClick?: (id: string) => void;
}

export const ProduceCard: React.FC<ProduceCardProps> = ({
  produce,
  onOrderClick,
  showAdminActions,
  onDeleteClick,
}) => {
  return (
    <Card hoverEffect className="flex flex-col h-full overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800">
      {/* Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={produce.image}
          alt={produce.crop}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={produce.qualityGrade === 'Grade A' ? 'success' : 'warning'}>
            {produce.qualityGrade}
          </Badge>
          {produce.organic && (
            <Badge variant="purple" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 100% Organic
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {produce.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {produce.crop}
            </h3>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(produce.pricePerKg)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400"> / kg</span>
            </div>
          </div>
          {produce.variety && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Variety: {produce.variety}
            </p>
          )}

          {/* Details */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Available Stock: <strong>{produce.quantityKg.toLocaleString()} kg</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{produce.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Available: {produce.availableDate}</span>
            </div>
          </div>

          {produce.fpoName && (
            <div className="mt-3 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-amber-600" />
              FPO Certified: {produce.fpoName}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Seller: <span className="font-semibold text-slate-700 dark:text-slate-300">{produce.farmerName}</span>
          </div>

          {showAdminActions ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteClick && onDeleteClick(produce.id)}
            >
              Remove
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOrderClick && onOrderClick(produce)}
            >
              Order Direct
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
