import { useState, useEffect, useCallback } from 'react';
import { ExchangeRates } from '../types/currency';

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest';

interface UseCurrencyRatesReturn {
  rates: ExchangeRates | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

export const useCurrencyRates = (baseCurrency: string = 'USD'): UseCurrencyRatesReturn => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${EXCHANGE_API_URL}/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.status}`);
      }
      
      const data = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date(data.date));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  const refetch = useCallback(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return { rates, loading, error, lastUpdated, refetch };
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates,
  baseCurrency: string = 'USD'
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  let convertedAmount = amount;
  
  // If converting from base currency
  if (fromCurrency === baseCurrency) {
    convertedAmount = amount * (rates[toCurrency] || 1);
  }
  // If converting to base currency
  else if (toCurrency === baseCurrency) {
    convertedAmount = amount / (rates[fromCurrency] || 1);
  }
  // If converting between non-base currencies
  else {
    // Convert to base currency first, then to target currency
    const toBase = amount / (rates[fromCurrency] || 1);
    convertedAmount = toBase * (rates[toCurrency] || 1);
  }
  
  return convertedAmount;
};