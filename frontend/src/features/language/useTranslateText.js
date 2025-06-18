import { useState, useEffect } from 'react';
import { translateText } from './translationService';
import { useLanguage } from './LanguageContext';

export const useTranslateText = (text) => {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const translate = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      try {
        const result = await translateText(text, currentLanguage);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback to original text
      }
    };

    translate();
  }, [text, currentLanguage]);

  return translatedText;
}; 