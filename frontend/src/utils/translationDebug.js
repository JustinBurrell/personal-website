/**
 * Debug utilities for translation testing
 * These can be used in the browser console to test translation functionality
 */

// Test translation of specific fields
export const testExperienceTranslation = async (language = 'es') => {
  console.log(`Testing Experience translation to ${language}...`);
  
  try {
    // Sample experience data structure
    const sampleExperience = {
      position: "Full Stack Engineer",
      startDate: "January 2025",
      endDate: "Present",
      responsibilities: [
        "Developed and deployed four analytics metrics",
        "Refactored backend services and redesigned the database"
      ],
      skills: ["ASP.Net", "Docker", "C#", "SQL", "Flutter"],
      technologies: ["React", "Node.js", "MongoDB"]
    };

    // Import the translation function
    const { translateObject } = await import('../features/language/translationService');
    
    console.log('Original data:', sampleExperience);
    
    const translated = await translateObject(sampleExperience, language);
    
    console.log('Translated data:', translated);
    
    return {
      original: sampleExperience,
      translated: translated,
      success: true
    };
  } catch (error) {
    console.error('Translation test failed:', error);
    return {
      error: error.message,
      success: false
    };
  }
};

// Test specific field translation
export const testFieldTranslation = async (text, language = 'es') => {
  console.log(`Testing translation of "${text}" to ${language}...`);
  
  try {
    const { translateText } = await import('../features/language/translationService');
    
    const translated = await translateText(text, language);
    
    console.log(`Original: "${text}"`);
    console.log(`Translated: "${translated}"`);
    
    return {
      original: text,
      translated: translated,
      success: true
    };
  } catch (error) {
    console.error('Field translation test failed:', error);
    return {
      error: error.message,
      success: false
    };
  }
};

// Test skills array translation
export const testSkillsTranslation = async (skills = ["ASP.Net", "Docker", "C#"], language = 'es') => {
  console.log(`Testing skills translation to ${language}...`);
  
  try {
    const { translateObject } = await import('../features/language/translationService');
    
    const sampleData = { skills: skills };
    
    console.log('Original skills:', skills);
    
    const translated = await translateObject(sampleData, language);
    
    console.log('Translated skills:', translated.skills);
    
    return {
      original: skills,
      translated: translated.skills,
      success: true
    };
  } catch (error) {
    console.error('Skills translation test failed:', error);
    return {
      error: error.message,
      success: false
    };
  }
};

// Check if environment variables are loaded
export const checkTranslationConfig = () => {
  const config = {
    googleTranslateApiKey: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY ? 'Set' : 'Not Set',
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not Set',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'
  };
  
  console.log('Translation Configuration:', config);
  
  return config;
};

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.translationDebug = {
    testExperienceTranslation,
    testFieldTranslation,
    testSkillsTranslation,
    checkTranslationConfig
  };
} 