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

// Test About skills specifically (technology names that should NOT be translated)
export const testAboutSkillsTranslation = async (language = 'es') => {
  console.log(`Testing About skills translation to ${language}...`);
  
  try {
    const { translateObject } = await import('../features/language/translationService');
    
    const aboutSkills = [
      "Python", "Java", "JavaScript", "SQL", "C", "HTML", "CSS", 
      "React", "Maven", "Flutter", "ASP.NET", "Firebase", 
      "Docker", "Git", "Kubernetes", "Dart", "Google Cloud"
    ];
    
    const sampleAboutData = { skills: aboutSkills };
    
    console.log('Original About skills:', aboutSkills);
    
    const translated = await translateObject(sampleAboutData, language);
    
    console.log('Translated About skills:', translated.skills);
    
    // Check if any technology names were incorrectly translated
    const incorrectlyTranslated = aboutSkills.filter((skill, index) => 
      skill !== translated.skills[index]
    );
    
    if (incorrectlyTranslated.length > 0) {
      console.warn('⚠️ Technology names that were incorrectly translated:', incorrectlyTranslated);
    } else {
      console.log('✅ All technology names correctly preserved!');
    }
    
    return {
      original: aboutSkills,
      translated: translated.skills,
      incorrectlyTranslated,
      success: true
    };
  } catch (error) {
    console.error('About skills translation test failed:', error);
    return {
      error: error.message,
      success: false
    };
  }
};

// Check if environment variables are loaded
export const checkTranslationConfig = () => {
  const config = {
    googleTranslateApiKey: import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY ? 'Set' : 'Not Set',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not Set',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'
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
    testAboutSkillsTranslation,
    checkTranslationConfig
  };
} 