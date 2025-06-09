import React, { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';

const languages = [
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

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [browserLanguage, setBrowserLanguage] = useState('en');

  useEffect(() => {
    // Detect browser language on mount
    const detectBrowserLanguage = () => {
      const lang = navigator.language.split('-')[0];
      const supportedLang = languages.find(l => l.code === lang);
      return supportedLang ? lang : 'en';
    };

    const detected = detectBrowserLanguage();
    setBrowserLanguage(detected);
    onLanguageChange(detected);
  }, [onLanguageChange]);

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Select language"
      >
        <ReactCountryFlag
          countryCode={currentLang.countryCode}
          svg
          style={{
            width: '1.5em',
            height: '1.5em',
          }}
          title={currentLang.name}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentLanguage === lang.code ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
              />
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 