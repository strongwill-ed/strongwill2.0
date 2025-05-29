import { useCurrency, type Currency } from "@/lib/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

export function CurrencySwitcher() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();

  const currencyNames = {
    AUD: "AUD",
    EUR: "EUR", 
    USD: "USD"
  };

  return (
    <div className="flex items-center gap-1">
      <DollarSign className="h-4 w-4" />
      <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((curr) => (
            <SelectItem key={curr} value={curr}>
              {currencyNames[curr as keyof typeof currencyNames]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}