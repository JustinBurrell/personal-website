import React, { useState } from 'react';
import { useLanguage } from '../../features/language/LanguageContext';
import ReactCountryFlag from 'react-country-flag';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage, supportedLanguages, isLoading } = useLanguage();

  const currentLang = supportedLanguages.find(l => l.code === currentLanguage) || supportedLanguages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
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
        {isLoading && (
          <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              disabled={isLoading}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-50 hover:text-gray-900 transition-colors ${
                currentLanguage === lang.code ? 'bg-gray-50 text-gray-900' : ''
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
              />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 