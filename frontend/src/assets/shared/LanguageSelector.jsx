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
        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-cream-500 hover:text-cinnabar-500 hover:bg-cream-200 transition-colors ${
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
          <span className="animate-spin h-4 w-4 border-2 border-cream-400 rounded-full border-t-transparent" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-1 w-48 bg-cream-50 rounded-xl border border-cream-300 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50"
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
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-display text-cream-600 text-left hover:bg-cream-100 hover:text-cinnabar-500 transition-colors ${
                currentLanguage === lang.code ? 'bg-cream-100 text-cinnabar-500' : ''
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
