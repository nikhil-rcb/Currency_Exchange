import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Currency } from '../types/currency';
import { POPULAR_CURRENCIES, searchCurrencies } from '../data/currencies';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
  disabled?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  selectedCurrency, 
  onSelect, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCurrencies = searchQuery 
    ? searchCurrencies(searchQuery)
    : POPULAR_CURRENCIES;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-white/90 backdrop-blur-sm border border-gray-200/80 
          rounded-xl transition-all duration-200 ease-out
          hover:bg-white hover:border-blue-300 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-blue-400 shadow-lg' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedCurrency.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-900">{selectedCurrency.code}</div>
            <div className="text-sm text-gray-500 truncate">{selectedCurrency.name}</div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currencies..."
                className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredCurrencies.length > 0 ? (
              <>
                {!searchQuery && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50/50">
                    Popular Currencies
                  </div>
                )}
                {filteredCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleSelect(currency)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 text-left
                      hover:bg-blue-50 transition-colors duration-150
                      ${currency.code === selectedCurrency.code ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                    `}
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{currency.code}</div>
                      <div className="text-sm text-gray-500 truncate">{currency.name}</div>
                    </div>
                    <div className="text-xs text-gray-400">{currency.symbol}</div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No currencies found</p>
                <p className="text-xs mt-1">Try searching with a different term</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;