import { useState, useEffect, createContext, useContext } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

export function createTranslationFunction(language: Language) {
  return function t(key: string, params?: Record<string, string>): string {
    try {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if translation not found
          let fallback: any = translations.en;
          for (const fk of keys) {
            if (fallback && typeof fallback === 'object' && fk in fallback) {
              fallback = fallback[fk];
            } else {
              return key; // Return key if no translation found
            }
          }
          value = fallback;
          break;
        }
      }
      
      if (typeof value === 'string') {
        // Replace parameters in the translation
        if (params) {
          return Object.entries(params).reduce(
            (str, [param, replacement]) => str.replace(`{{${param}}}`, replacement),
            value
          );
        }
        return value;
      }
      
      return key; // Return key if value is not a string
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };
}

export function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0];
  return Object.keys(translations).includes(browserLang) ? browserLang as Language : 'en';
}

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem('strongwill-language');
    return (stored && Object.keys(translations).includes(stored)) ? stored as Language : detectBrowserLanguage();
  } catch {
    return detectBrowserLanguage();
  }
}

export function setStoredLanguage(language: Language): void {
  try {
    localStorage.setItem('strongwill-language', language);
  } catch (error) {
    console.warn('Failed to store language preference:', error);
  }
}