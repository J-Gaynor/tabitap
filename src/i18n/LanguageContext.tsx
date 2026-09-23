import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const STORAGE_KEY = 'isshoitta_language';

const getDefaultLanguage = (): Language => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ja' || saved === 'en') {
    return saved;
  }
  // Auto-detect browser/system language
  if (typeof navigator !== 'undefined') {
    const browserLang = (navigator.language || (navigator as { userLanguage?: string }).userLanguage || '').toLowerCase();
    if (browserLang.startsWith('ja')) {
      return 'ja';
    }
  }
  return 'en';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getDefaultLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
