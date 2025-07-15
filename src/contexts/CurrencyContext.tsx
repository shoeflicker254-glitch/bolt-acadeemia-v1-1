import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: 'USD' | 'KES';
  setCurrency: (currency: 'USD' | 'KES') => void;
  convertPrice: (kesPrice: number) => number;
  formatPrice: (kesPrice: number) => string;
  exchangeRate: number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<'USD' | 'KES'>('KES');
  const [exchangeRate, setExchangeRate] = useState(130); // Default fallback rate: 1 USD = 130 KES
  const [loading, setLoading] = useState(false);

  // Fetch exchange rate from ExchangeRate-API (free service)
  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates && data.rates.KES) {
        setExchangeRate(data.rates.KES);
        localStorage.setItem('exchangeRate', data.rates.KES.toString());
        localStorage.setItem('exchangeRateTimestamp', Date.now().toString());
        console.log(`Exchange rate updated: 1 USD = ${data.rates.KES} KES`);
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Try to use cached rate
      const cachedRate = localStorage.getItem('exchangeRate');
      if (cachedRate) {
        setExchangeRate(parseFloat(cachedRate));
        console.log(`Using cached exchange rate: 1 USD = ${cachedRate} KES`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if we need to fetch new exchange rate (cache for 1 hour)
  const shouldFetchRate = () => {
    const timestamp = localStorage.getItem('exchangeRateTimestamp');
    if (!timestamp) return true;
    
    const oneHour = 60 * 60 * 1000;
    return Date.now() - parseInt(timestamp) > oneHour;
  };

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('preferredCurrency') as 'USD' | 'KES';
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    // Load cached exchange rate or fetch new one
    const cachedRate = localStorage.getItem('exchangeRate');
    if (cachedRate && !shouldFetchRate()) {
      setExchangeRate(parseFloat(cachedRate));
    } else {
      fetchExchangeRate();
    }

    // Set up periodic rate updates (every hour)
    const interval = setInterval(() => {
      if (shouldFetchRate()) {
        fetchExchangeRate();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  const handleSetCurrency = (newCurrency: 'USD' | 'KES') => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
    console.log(`Currency changed to: ${newCurrency}`);
  };

  const convertPrice = (kesPrice: number): number => {
    if (currency === 'KES') {
      return kesPrice;
    }
    return Math.round((kesPrice / exchangeRate) * 100) / 100; // Round to 2 decimal places
  };

  const formatPrice = (kesPrice: number): string => {
    const convertedPrice = convertPrice(kesPrice);
    
    if (currency === 'USD') {
      return `$${convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    return `KES ${convertedPrice.toLocaleString()}`;
  };

  const value = {
    currency,
    setCurrency: handleSetCurrency,
    convertPrice,
    formatPrice,
    exchangeRate,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};