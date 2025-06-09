// Cache for storing translations to avoid unnecessary API calls
const CACHE_VERSION = '1.0';
const MAX_CHARS_PER_REQUEST = 1000; // Limit characters per request
const MONTHLY_CHAR_LIMIT = 450000; // Set monthly limit (90% of free tier)
const STORAGE_KEY = 'translation_cache';

// Initialize cache from localStorage
let translationCache = new Map();
let monthlyCharCount = 0;
const currentMonth = new Date().getMonth();

// Load cache from localStorage
const loadCache = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { cache, version, charCount, month } = JSON.parse(saved);
      if (version === CACHE_VERSION && month === currentMonth) {
        translationCache = new Map(cache);
        monthlyCharCount = charCount;
      } else if (month !== currentMonth) {
        // Reset monthly count for new month
        monthlyCharCount = 0;
        saveCache();
      }
    }
  } catch (error) {
    console.warn('Failed to load translation cache:', error);
  }
};

// Save cache to localStorage
const saveCache = () => {
  try {
    const data = {
      cache: Array.from(translationCache.entries()),
      version: CACHE_VERSION,
      charCount: monthlyCharCount,
      month: currentMonth
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save translation cache:', error);
  }
};

// Load cache on initialization
loadCache();

// Batch texts for translation to minimize API calls
const batchTexts = (texts, maxChars = MAX_CHARS_PER_REQUEST) => {
  const batches = [];
  let currentBatch = [];
  let currentLength = 0;

  for (const text of texts) {
    const textLength = text.length;
    if (currentLength + textLength > maxChars) {
      batches.push(currentBatch);
      currentBatch = [text];
      currentLength = textLength;
    } else {
      currentBatch.push(text);
      currentLength += textLength;
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

const translateText = async (text, targetLang) => {
  if (!text) return text;
  if (targetLang === 'en') return text;

  // Check cache first
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // Check monthly character limit
  if (monthlyCharCount + text.length > MONTHLY_CHAR_LIMIT) {
    console.warn('Monthly character limit reached, returning original text');
    return text;
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

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    
    // Update character count and cache
    monthlyCharCount += text.length;
    translationCache.set(cacheKey, translatedText);
    saveCache();
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
};

const translateBatch = async (texts, targetLang) => {
  if (!texts.length) return [];
  if (targetLang === 'en') return texts;

  const batches = batchTexts(texts);
  const results = [];

  for (const batch of batches) {
    const uncachedTexts = batch.filter(text => {
      const cacheKey = `${text}_${targetLang}`;
      if (translationCache.has(cacheKey)) {
        results.push(translationCache.get(cacheKey));
        return false;
      }
      return true;
    });

    if (uncachedTexts.length === 0) continue;

    // Check monthly character limit
    const batchLength = uncachedTexts.reduce((sum, text) => sum + text.length, 0);
    if (monthlyCharCount + batchLength > MONTHLY_CHAR_LIMIT) {
      console.warn('Monthly character limit reached, returning original texts');
      results.push(...uncachedTexts);
      continue;
    }

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: uncachedTexts,
          target: targetLang,
          source: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translations = data.data.translations.map(t => t.translatedText);
      
      // Update character count and cache
      monthlyCharCount += batchLength;
      uncachedTexts.forEach((text, i) => {
        const cacheKey = `${text}_${targetLang}`;
        translationCache.set(cacheKey, translations[i]);
      });
      saveCache();
      
      results.push(...translations);
    } catch (error) {
      console.error('Batch translation error:', error);
      results.push(...uncachedTexts); // Fallback to original texts
    }
  }

  return results;
};

const translateObject = async (obj, targetLang) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? await translateText(obj, targetLang) : obj;
  }

  if (Array.isArray(obj)) {
    const stringItems = obj.filter(item => typeof item === 'string');
    const translatedStrings = await translateBatch(stringItems, targetLang);
    let stringIndex = 0;
    
    return obj.map(item => {
      if (typeof item === 'string') {
        return translatedStrings[stringIndex++];
      }
      return translateObject(item, targetLang);
    });
  }

  const entries = Object.entries(obj);
  const stringValues = entries
    .filter(([_, value]) => typeof value === 'string')
    .map(([_, value]) => value);
  
  const translatedStrings = await translateBatch(stringValues, targetLang);
  let stringIndex = 0;

  const translated = {};
  for (const [key, value] of entries) {
    if (typeof value === 'string') {
      translated[key] = translatedStrings[stringIndex++];
    } else {
      translated[key] = await translateObject(value, targetLang);
    }
  }

  return translated;
};

export { translateText, translateObject, translateBatch }; 