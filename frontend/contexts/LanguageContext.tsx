import React, { createContext, useContext, useState } from 'react';
import { Language, LanguageContextType } from '../types';
import { translations } from '../translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('fr');

  const t = (key: string) => {
    const translation = translations[lang][key as keyof typeof translations['fr']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
