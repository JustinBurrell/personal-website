// Cache for storing translations to avoid unnecessary API calls
const translationCache = new Map();

const translateText = async (text, targetLang) => {
  if (!text) return text;
  if (targetLang === 'en') return text;

  // Check cache first
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'en'
      })
    });

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    
    // Store in cache
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
};

const translateObject = async (obj, targetLang) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? await translateText(obj, targetLang) : obj;
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLang)));
  }

  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    translated[key] = await translateObject(value, targetLang);
  }

  return translated;
};

export { translateText, translateObject }; 