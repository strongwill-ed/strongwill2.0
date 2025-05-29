import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'AUD' | 'EUR' | 'USD';

interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to AUD (base currency)
}

const currencyConfigs: Record<Currency, CurrencyConfig> = {
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.61 }, // Approximate rate
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.66 } // Approximate rate
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (audPrice: number) => number;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('AUD');

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('strongwill-currency', newCurrency);
  };

  const convertPrice = (audPrice: number): number => {
    return audPrice * currencyConfigs[currency].rate;
  };

  const formatPrice = (audPrice: number): string => {
    const convertedPrice = convertPrice(audPrice);
    const config = currencyConfigs[currency];
    return `${config.symbol}${convertedPrice.toFixed(2)}`;
  };

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('strongwill-currency') as Currency;
    if (savedCurrency && currencyConfigs[savedCurrency]) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    availableCurrencies: Object.keys(currencyConfigs) as Currency[]
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}