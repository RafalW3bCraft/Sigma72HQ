import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const FALLBACK_LANGUAGE: Language = 'en';

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return FALLBACK_LANGUAGE;
  }

  try {
    const stored = window.localStorage.getItem('language');
    return stored === 'en' || stored === 'ru' ? stored : FALLBACK_LANGUAGE;
  } catch (error) {
    console.warn('[LanguageContext] Unable to read language from localStorage.', error);
    return FALLBACK_LANGUAGE;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem('language', language);
    } catch (error) {
      console.warn('[LanguageContext] Unable to persist language to localStorage.', error);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
