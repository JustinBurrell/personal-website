import React, { createContext, useState, useContext, useEffect } from 'react';
import { translateObject } from './translationService';
import portfolioData from '../../data/portfolioData.ts';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', countryCode: 'US' },
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'it', name: 'Italiano', countryCode: 'IT' },
  { code: 'pt', name: 'Português', countryCode: 'PT' },
  { code: 'zh', name: '中文', countryCode: 'CN' },
  { code: 'ja', name: '日本語', countryCode: 'JP' },
  { code: 'ko', name: '한국어', countryCode: 'KR' },
  { code: 'ru', name: 'Русский', countryCode: 'RU' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translatedData, setTranslatedData] = useState(portfolioData);
  const [isLoading, setIsLoading] = useState(false);

  // Detect browser language on mount
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      return SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang) 
        ? browserLang 
        : 'en';
    };

    setCurrentLanguage(detectBrowserLanguage());
  }, []);

  // Update translations when language changes
  useEffect(() => {
    const updateTranslations = async () => {
      console.log('Language changed to:', currentLanguage);
      
      if (currentLanguage === 'en') {
        console.log('Setting English data');
        setTranslatedData(portfolioData);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Starting translation to', currentLanguage);
        console.log('Original home title:', portfolioData.home.title);
        
        const translated = await translateObject(portfolioData, currentLanguage);
        
        console.log('Translation complete');
        console.log('Translated home title:', translated.home.title);
        
        setTranslatedData(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedData(portfolioData); // Fallback to English
      }
      setIsLoading(false);
    };

    updateTranslations();
  }, [currentLanguage]);

  const changeLanguage = (langCode) => {
    console.log('Changing language to:', langCode);
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === langCode)) {
      setCurrentLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage,
      changeLanguage,
      translatedData,
      isLoading,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 