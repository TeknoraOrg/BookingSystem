import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect, 
  ReactNode 
} from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from '../locales/en.json';
import deTranslations from '../locales/de.json';

// Define supported languages
export type Language = 'en' | 'de';

// Define context type
interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

// Create the LanguageContext
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      de: { translation: deTranslations }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes values
    }
  });

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or browser settings
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('bookme-language') as Language;
    
    // If user has explicitly chosen a language, use that
    if (savedLanguage) return savedLanguage;
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'de' ? 'de' : 'en';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  // Change language function
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('bookme-language', lang);
  };

  // Sync language on mount and when it changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

// Export i18n instance for direct use if needed
export { i18n };