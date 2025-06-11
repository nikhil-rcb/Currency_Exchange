import React from 'react';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { Currency } from '../types/currency';

interface ConversionResultProps {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  result: number;
  rate: number;
  lastUpdated: Date | null;
  loading?: boolean;
}

const ConversionResult: React.FC<ConversionResultProps> = ({
  amount,
  fromCurrency,
  toCurrency,
  result,
  rate,
  lastUpdated,
  loading = false
}) => {
  const formatCurrency = (value: number, currency: Currency): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  const formatRate = (rate: number): string => {
    return rate < 0.01 
      ? rate.toFixed(6)
      : rate.toFixed(4);
  };

  const formatLastUpdated = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-2xl border border-blue-100/50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-2xl border border-blue-100/50 transition-all duration-300 hover:shadow-lg">
      <div className="space-y-4">
        {/* Main conversion result */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">
            {formatCurrency(amount, fromCurrency)} equals
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(result, toCurrency)}
          </div>
        </div>

        {/* Exchange rate info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Exchange Rate</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-900">Live</span>
            </div>
          </div>
          
          <div className="text-lg font-semibold text-gray-900">
            1 {fromCurrency.code} = {formatRate(rate)} {toCurrency.code}
          </div>
          
          <div className="text-sm text-gray-500">
            1 {toCurrency.code} = {formatRate(1/rate)} {fromCurrency.code}
          </div>
        </div>

        {/* Last updated info */}
        {lastUpdated && (
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Updated {formatLastUpdated(lastUpdated)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionResult;