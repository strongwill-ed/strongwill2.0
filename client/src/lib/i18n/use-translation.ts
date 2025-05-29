import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { Language } from './translations';

export function useTranslation() {
  const { t: i18nT, i18n } = useI18nTranslation();

  // Get translation function with nested key support
  const t = (key: string, options?: any) => {
    return i18nT(key, options);
  };

  // Change language
  const changeLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
  };

  return {
    t,
    language: i18n.language as Language,
    changeLanguage,
    availableLanguages: ['en', 'de'] as Language[]
  };
}
