import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  disabled?: boolean;
  placeholder?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  value, 
  onChange, 
  currency, 
  disabled = false,
  placeholder = "Enter amount" 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatNumber = (num: string): string => {
    // Remove any non-numeric characters except decimal point
    const cleaned = num.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    
    // Limit to reasonable amount of decimal places
    if (formatted.includes('.')) {
      const [whole, decimal] = formatted.split('.');
      if (decimal.length > 6) {
        onChange(whole + '.' + decimal.slice(0, 6));
        return;
      }
    }
    
    onChange(formatted);
  };

  const displayValue = value ? parseFloat(value).toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 6 
  }) : '';

  return (
    <div className="relative">
      <div className={`
        relative flex items-center px-4 py-4 
        bg-white/90 backdrop-blur-sm border border-gray-200/80 
        rounded-xl transition-all duration-200 ease-out
        ${isFocused ? 'border-blue-400 shadow-lg bg-white' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        hover:bg-white hover:border-blue-300 hover:shadow-md
      `}>
        <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          inputMode="decimal"
          value={isFocused ? value : displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-gray-900 placeholder-gray-400"
        />
        <span className="text-sm font-medium text-gray-500 ml-2 min-w-max">
          {currency}
        </span>
      </div>
    </div>
  );
};

export default AmountInput;