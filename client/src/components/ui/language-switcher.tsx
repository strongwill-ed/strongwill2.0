import { useTranslation } from "@/lib/i18n/use-translation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, changeLanguage, availableLanguages } = useTranslation();

  const languageNames = {
    en: "English",
    de: "Deutsch"
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Select value={language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {languageNames[lang as keyof typeof languageNames]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}