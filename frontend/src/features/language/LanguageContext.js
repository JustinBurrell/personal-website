import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { translateObject } from './translationService';
import { usePortfolioData } from '../../hooks/usePortfolioData';

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

// Translation cache
const translationCache = new Map();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translatedData, setTranslatedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: portfolioData, loading: dataLoading, error } = usePortfolioData('en'); // Always fetch English

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

  // Memoized changeLanguage function
  const changeLanguage = useCallback((langCode) => {
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === langCode)) {
      setCurrentLanguage(langCode);
    }
  }, []);

  // Update translations when language changes or data loads
  useEffect(() => {
    const updateTranslations = async () => {
      if (!portfolioData) return;
      
      // Check cache first
      const cacheKey = `translation_${currentLanguage}`;
      if (translationCache.has(cacheKey)) {
        setTranslatedData(translationCache.get(cacheKey));
        return;
      }
      
      if (currentLanguage === 'en') {
        setTranslatedData(portfolioData);
        translationCache.set(cacheKey, portfolioData);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateObject(portfolioData, currentLanguage);
        
        // Cache the result
        translationCache.set(cacheKey, translated);
        setTranslatedData(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedData(portfolioData); // Fallback to English
        translationCache.set(cacheKey, portfolioData);
      }
      setIsLoading(false);
    };

    updateTranslations();
  }, [currentLanguage, portfolioData]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    translatedData,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES
  }), [currentLanguage, changeLanguage, translatedData, isLoading]);

  return (
    <LanguageContext.Provider value={contextValue}>
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