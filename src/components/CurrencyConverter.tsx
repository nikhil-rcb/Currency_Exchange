import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import CurrencySelector from './CurrencySelector';
import AmountInput from './AmountInput';
import ConversionResult from './ConversionResult';
import { useCurrencyRates, convertCurrency } from '../hooks/useCurrencyRates';
import { findCurrency, POPULAR_CURRENCIES } from '../data/currencies';
import { Currency } from '../types/currency';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(POPULAR_CURRENCIES[0]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(POPULAR_CURRENCIES[1]); // EUR

  const { rates, loading, error, lastUpdated, refetch } = useCurrencyRates(fromCurrency.code);

  const conversionResult = useMemo(() => {
    if (!rates || !amount || isNaN(parseFloat(amount))) {
      return { result: 0, rate: 0 };
    }

    const amountNum = parseFloat(amount);
    const result = convertCurrency(amountNum, fromCurrency.code, toCurrency.code, rates, fromCurrency.code);
    const rate = convertCurrency(1, fromCurrency.code, toCurrency.code, rates, fromCurrency.code);

    return { result, rate };
  }, [rates, amount, fromCurrency.code, toCurrency.code]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleRefresh = () => {
    refetch();
  };

  const quickAmounts = [1, 10, 100, 1000];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Currency Converter</h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Refresh rates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Amount input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <AmountInput
              value={amount}
              onChange={setAmount}
              currency={fromCurrency.code}
              disabled={loading}
            />
          </div>

          {/* Quick amount buttons */}
          <div className="flex space-x-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="flex-1 py-2 px-3 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                {quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* From currency */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <CurrencySelector
              selectedCurrency={fromCurrency}
              onSelect={setFromCurrency}
              disabled={loading}
            />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwapCurrencies}
            disabled={loading}
            className="p-3 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Swap currencies"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* To currency */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <CurrencySelector
              selectedCurrency={toCurrency}
              onSelect={setToCurrency}
              disabled={loading}
            />
          </div>
        </div>

        {/* Conversion result */}
        <ConversionResult
          amount={parseFloat(amount) || 0}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          result={conversionResult.result}
          rate={conversionResult.rate}
          lastUpdated={lastUpdated}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CurrencyConverter;