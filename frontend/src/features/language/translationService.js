// Optimized translation service with better performance
const CACHE_VERSION = '1.2';
const MAX_CHARS_PER_REQUEST = 1500; // Increased for better batching
const MONTHLY_CHAR_LIMIT = 450000;
const STORAGE_KEY = 'translation_cache';
const BATCH_SIZE = 15; // Increased batch size for better performance

// Technology names that should NOT be translated (keep in English)
const NON_TRANSLATABLE_TECHNOLOGIES = new Set([
  // Programming Languages
  'Python', 'Java', 'JavaScript', 'C', 'C++', 'C#', 'Dart', 'TypeScript',
  
  // Frameworks & Libraries
  'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
  'ASP.NET', 'Flutter', 'Spring', 'Laravel', 'Symfony',
  
  // Databases
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
  'Git', 'GitHub', 'GitLab', 'CI/CD',
  
  // Tools & Platforms
  'Firebase', 'Maven', 'Gradle', 'npm', 'yarn', 'Webpack', 'Babel',
  'HTML', 'CSS', 'Sass', 'Less', 'Bootstrap', 'Tailwind',
  
  // Other Technologies
  'REST', 'GraphQL', 'API', 'JSON', 'XML', 'JWT', 'OAuth',
  'Linux', 'Unix', 'Windows', 'macOS', 'Ubuntu', 'CentOS'
]);

// Initialize cache from localStorage
let translationCache = new Map();
let monthlyCharCount = 0;
const currentMonth = new Date().getMonth();

// Define which fields should be translated (content fields)
const TRANSLATABLE_FIELDS = new Set([
  // Navigation and common UI elements
  'nav_home',
  'nav_about',
  'nav_experience',
  'nav_projects',
  'nav_education',
  'nav_awards',
  'nav_gallery',
  'nav_contact',
  'button_text',
  'label_text',
  'placeholder_text',
  'section_title',
  
  // Home section
  'title',
  'description',
  'attribute',
  'view_resume_button',
  'contact_me_button',
  'organizations_label',
  'name', // For organization names
  
  // About section
  'introduction',
  'journey_title',
  'skills_title',
  'interests_title',
  'interests',
  'skills',
  
  // Experience section
  'position',
  'company',
  'location',
  'responsibilities',
  'skills',
  'technologies',
  'view_timeline',
  'view_resume',
  'Skills',
  'Technologies',
  
  // Projects section
  'description',
  'highlights',
  'project_title',
  'technologies',
  
  // Awards section
  'title',
  'organization',
  'description',
  
  // Education section
  'name',
  'education_type',
  'school_type',
  'major',
  'description',
  'course',
  'organization',
  'role',
  'Schooling',
  'Certifications',
  'Programs',
  'Relevant Courses',
  'Organization Involvement',
  'Graduation',
  'GPA',
  'education',
  'relevantCourses',
  'organizationInvolvement',
  
  // Gallery section
  'title',
  'description',
  'categoryName',
  'moments_text',
  'gallery_title',
  
  // Contact section
  'contact_title',
  'contact_description',
  'first_name_label',
  'last_name_label',
  'email_label',
  'subject_label',
  'message_label',
  'send_message_button',
  'get_in_touch_text',
  'contact_blurb',
  'fill_all_fields',
  'first_name_required',
  'last_name_required',
  'email_required',
  'message_required',
  
  // Form placeholders
  'first_name_placeholder',
  'last_name_placeholder',
  'email_placeholder',
  'subject_placeholder',
  'message_placeholder',
  
  // General fields
  'content',
  'achievements',
  'button_text',
  'learn_more',
  'view_project',
  'close',
  
  // Quality attributes from home section
  'qualities',
  'attribute',
  'description'
]);

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

// Optimized batch translation function
const translateBatch = async (texts, targetLang) => {
  if (!texts.length) return [];
  
  const validTexts = texts.filter(text => 
    text && 
    typeof text === 'string' && 
    text.trim().length > 0 &&
    !text.startsWith('http') && 
    !text.startsWith('/') &&
    !/^\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}$/i.test(text) &&
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(text) // Skip emails
  );

  if (!validTexts.length) return texts;

  // Check cache for all texts first
  const cachedResults = [];
  const uncachedTexts = [];
  const uncachedIndices = [];

  validTexts.forEach((text, index) => {
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
      cachedResults[index] = translationCache.get(cacheKey);
    } else {
      uncachedTexts.push(text);
      uncachedIndices.push(index);
    }
  });

  // Translate uncached texts in optimized batches
  if (uncachedTexts.length > 0) {
    const batches = [];
    let currentBatch = [];
    let currentCharCount = 0;

    for (const text of uncachedTexts) {
      if (currentBatch.length >= BATCH_SIZE || currentCharCount + text.length > MAX_CHARS_PER_REQUEST) {
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
          currentBatch = [];
          currentCharCount = 0;
        }
      }
      currentBatch.push(text);
      currentCharCount += text.length;
    }
    
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    // Process batches with better error handling
    for (const batch of batches) {
      try {
        const batchText = batch.join('\n');
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: batchText,
            target: targetLang,
            source: 'en',
            format: 'text'
          })
        });

        if (!response.ok) {
          throw new Error(`Translation API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.data && result.data.translations) {
          const translations = result.data.translations[0].translatedText.split('\n');
          
          // Cache individual translations
          batch.forEach((text, index) => {
            const cacheKey = `${text}_${targetLang}`;
            const translation = translations[index] || text;
            translationCache.set(cacheKey, translation);
            monthlyCharCount += text.length;
          });
          
          // Update results
          batch.forEach((text, batchIndex) => {
            const originalIndex = uncachedIndices[uncachedTexts.indexOf(text)];
            cachedResults[originalIndex] = translations[batchIndex] || text;
          });
        }
      } catch (error) {
        console.error('Batch translation error:', error);
        // Fallback: use original text for failed batch
        batch.forEach((text) => {
          const originalIndex = uncachedIndices[uncachedTexts.indexOf(text)];
          cachedResults[originalIndex] = text;
        });
      }
    }

    // Save cache after successful translations
    if (monthlyCharCount > 0) {
      saveCache();
    }
  }

  return cachedResults;
};

const translateText = async (text, targetLang) => {
  if (!text) return text;
  if (targetLang === 'en') return text;
  if (typeof text !== 'string') return text;

  // Don't translate URLs or file paths
  if (text.startsWith('http') || text.startsWith('/')) {
    return text;
  }

  // Don't translate dates
  if (/^\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}$/i.test(text)) {
    return text;
  }

  // Don't translate technology names
  if (NON_TRANSLATABLE_TECHNOLOGIES.has(text)) {
    return text;
  }

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

const shouldTranslateValue = (key, value) => {
  const should = TRANSLATABLE_FIELDS.has(key) && typeof value === 'string';
  console.log('Should translate', key, '?', should);
  return should;
};

const translateObject = async (obj, targetLang) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLang)));
  }

  const result = { ...obj };

  for (const [key, value] of Object.entries(obj)) {
    console.log('Processing key:', key);
    
    if (shouldTranslateValue(key, value)) {
      // Directly translate the string value
      console.log('Translating string value for key:', key);
      result[key] = await translateText(value, targetLang);
    } else if (Array.isArray(value)) {
      // For arrays, translate each item if it's a string and the key is translatable
      console.log('Processing array for key:', key);
      if (key === 'education' || key === 'relevantCourses' || key === 'organizationInvolvement') {
        // Special handling for education-related arrays
        result[key] = await Promise.all(
          value.map(item => translateObject(item, targetLang))
        );
      } else if (key === 'skills' || key === 'technologies' || key === 'responsibilities') {
        // Special handling for skills, technologies, and responsibilities arrays - translate each string
        result[key] = await Promise.all(
          value.map(item => 
            typeof item === 'string' 
              ? translateText(item, targetLang)
              : translateObject(item, targetLang)
          )
        );
      } else {
        result[key] = await Promise.all(
          value.map(item => 
            typeof item === 'string' && TRANSLATABLE_FIELDS.has(key)
              ? translateText(item, targetLang)
              : translateObject(item, targetLang)
          )
        );
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively translate nested objects
      result[key] = await translateObject(value, targetLang);
    } else {
      result[key] = value;
    }
  }

  return result;
};

export { translateText, translateObject }; 