import { useCurrency, type Currency } from "@/lib/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

export function CurrencySwitcher() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();

  const currencyNames = {
    AUD: "AUD - Australian Dollar",
    EUR: "EUR - Euro", 
    USD: "USD - US Dollar"
  };

  return (
    <div className="flex items-center gap-2">
      <DollarSign className="h-4 w-4" />
      <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
        <SelectTrigger className="w-40">
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