import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import currency from "currency.js";

type CurrencyCode = "USD" | "MXN" | "EUR" | "GBP" | "CAD";

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

const currencies: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  MXN: { code: "MXN", symbol: "$", name: "Mexican Peso", rate: 17.5 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  CAD: { code: "CAD", symbol: "$", name: "Canadian Dollar", rate: 1.35 },
};

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInCents: number) => string;
  convertPrice: (amountInCents: number, fromCurrency?: CurrencyCode) => number;
  currencies: typeof currencies;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem("currency");
    return (saved as CurrencyCode) || "USD";
  });

  useEffect(() => {
    localStorage.setItem("currency", currentCurrency);
  }, [currentCurrency]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrentCurrency(code);
  };

  const convertPrice = (amountInCents: number, fromCurrency: CurrencyCode = "USD"): number => {
    const amountInDollars = amountInCents / 100;
    const fromRate = currencies[fromCurrency].rate;
    const toRate = currencies[currentCurrency].rate;
    
    // Convert to USD first, then to target currency
    const usdAmount = amountInDollars / fromRate;
    return usdAmount * toRate;
  };

  const formatPrice = (amountInCents: number): string => {
    const convertedAmount = convertPrice(amountInCents);
    const config = currencies[currentCurrency];
    
    return currency(convertedAmount, {
      symbol: config.symbol,
      precision: currentCurrency === "MXN" ? 2 : 2,
    }).format();
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        formatPrice,
        convertPrice,
        currencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
