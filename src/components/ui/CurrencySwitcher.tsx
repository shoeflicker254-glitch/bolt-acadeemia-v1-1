import React from 'react';
import { DollarSign, Globe } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CurrencySwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { currency, setCurrency, exchangeRate, loading } = useCurrency();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center text-sm text-gray-600">
          <Globe size={16} className="mr-1" />
          <span>Currency:</span>
        </div>
      )}
      
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setCurrency('KES')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
            currency === 'KES'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          KES
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
            currency === 'USD'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign size={14} className="inline mr-1" />
          USD
        </button>
      </div>
      
      {currency === 'USD' && (
        <div className="text-xs text-gray-500">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <span>1 USD = {exchangeRate.toFixed(2)} KES</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;