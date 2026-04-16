import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, TranslationKeys, LANGUAGE_LABELS } from './types';
import { getTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  labels: typeof LANGUAGE_LABELS;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>('pt-PT');

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, labels: LANGUAGE_LABELS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
