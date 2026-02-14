import { createClient } from '@supabase/supabase-js'
import indexedDBCache from '../utils/indexedDBCache'

// Utility: Convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function camelCaseKeysDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map(camelCaseKeysDeep);
  } else if (isObject(obj)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = camelCaseKeysDeep(value);
      return acc;
    }, {});
  }
  return obj;
}

// Initialize Supabase client
// These will be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Enhanced cache for storing fetched data (in-memory for speed)
const cache = new Map()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Cache cleanup function
const cleanupCache = () => {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key)
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000)

// Helper function to check if in-memory cache is valid
const isCacheValid = (key) => {
  const cached = cache.get(key)
  if (!cached) return false
  return Date.now() - cached.timestamp < CACHE_DURATION
}

// Helper function to set cache (both in-memory and IndexedDB)
const setCache = async (key, data) => {
  // Set in-memory cache for instant access
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
  
  // Set IndexedDB cache for persistence
  try {
    await indexedDBCache.set(key, data, CACHE_DURATION)
  } catch (error) {
    console.warn('Failed to set IndexedDB cache:', error)
  }
}

// Helper function to get cache (check both in-memory and IndexedDB)
const getCache = async (key) => {
  // First check in-memory cache (fastest)
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  // Fall back to IndexedDB cache
  try {
    const indexedData = await indexedDBCache.get(key)
    if (indexedData) {
      // Restore to in-memory cache for faster subsequent access
      cache.set(key, {
        data: indexedData,
        timestamp: Date.now()
      })
      return indexedData
    }
  } catch (error) {
    console.warn('Failed to get IndexedDB cache:', error)
  }
  
  return null
}

// Portfolio data service
export const portfolioService = {
  // Get critical data first (home and about) for instant initial render
  // NOTE: Currently using parallel loading instead, but keeping for backwards compatibility
  async getCriticalData(languageCode = 'en') {
    const cacheKey = `critical_${languageCode}`
    
    // Check cache first
    const cachedData = await getCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      // Load only critical sections first (home and about)
      const [homeData, aboutData] = await Promise.all([
        this.getHomeData('en'),
        this.getAboutData('en')
      ])

      const criticalData = {
        home: homeData,
        about: aboutData
      }

      // Cache the result
      await setCache(cacheKey, criticalData)
      
      return criticalData
    } catch (error) {
      console.error('Error fetching critical data:', error)
      throw error
    }
  },

  // Get all portfolio data - optimized with better caching
  async getPortfolioData(languageCode = 'en') {
    const cacheKey = `portfolio_${languageCode}`
    
    // Check cache first (both in-memory and IndexedDB)
    const cachedData = await getCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      // Use Promise.all for parallel execution - this is actually fast!
      const [
        homeData,
        aboutData,
        awardsData,
        educationData,
        experienceData,
        galleryData,
        projectsData
      ] = await Promise.all([
        this.getHomeData('en'),
        this.getAboutData('en'),
        this.getAwardsData('en'),
        this.getEducationData('en'),
        this.getExperienceData('en'),
        this.getGalleryData('en'),
        this.getProjectsData('en')
      ])

      const portfolioData = {
        home: homeData,
        about: aboutData,
        awards: awardsData,
        education: educationData,
        experience: experienceData,
        gallery: galleryData,
        projects: projectsData
      }

      // Cache the result (both in-memory and IndexedDB)
      await setCache(cacheKey, portfolioData)
      
      return portfolioData
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      throw error
    }
  },

  // Optimized single query method - loads all data in parallel
  async getPortfolioDataOptimized(languageCode = 'en') {
    const cacheKey = `portfolio_optimized_${languageCode}`
    
    // Check cache first (both in-memory and IndexedDB)
    const cachedData = await getCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      // Load all data in parallel for fastest overall load time
      // This ensures all pages are ready quickly
      const [
        homeData,
        aboutData,
        awardsData,
        educationData,
        experienceData,
        galleryData,
        projectsData
      ] = await Promise.all([
        this.getHomeData('en'),
        this.getAboutData('en'),
        this.getAwardsData('en'),
        this.getEducationData('en'),
        this.getExperienceData('en'),
        this.getGalleryData('en'),
        this.getProjectsData('en')
      ])

      const completeData = {
        home: homeData,
        about: aboutData,
        awards: awardsData,
        education: educationData,
        experience: experienceData,
        gallery: galleryData,
        projects: projectsData
      }

      // Cache the complete result
      await setCache(cacheKey, completeData)
      
      return completeData
    } catch (error) {
      console.error('Error fetching optimized portfolio data:', error)
      // Fallback to original method
      return this.getPortfolioData(languageCode)
    }
  },

  // Get home data - always fetch English data
  async getHomeData(languageCode = 'en') {
    try {
      const { data: homeData, error: homeError } = await supabase
        .from('home')
        .select(`
          *,
          home_organizations(*),
          home_qualities(*)
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)
        .single()

      if (homeError) throw homeError

      return camelCaseKeysDeep({
        ...homeData,
        organizations: homeData.home_organizations.map(org => ({
          name: org.name,
          orgUrl: org.orgUrl,
          orgColor: org.orgColor,
          orgPortfolioUrl: org.orgPortfolioUrl
        })),
        qualities: homeData.home_qualities.map(qual => ({
          attribute: qual.attribute,
          description: qual.description
        }))
      })
    } catch (error) {
      console.error('Error fetching home data:', error)
      throw error
    }
  },

  // Get about data - always fetch English data
  async getAboutData(languageCode = 'en') {
    try {
      const { data: aboutData, error: aboutError } = await supabase
        .from('about')
        .select(`
          *,
          about_skills(*),
          about_interests(*)
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)
        .single()

      if (aboutError) throw aboutError

      return camelCaseKeysDeep({
        ...aboutData,
        skills: aboutData.about_skills.map(skill => skill.skill),
        interests: aboutData.about_interests.map(interest => interest.interest)
      })
    } catch (error) {
      console.error('Error fetching about data:', error)
      throw error
    }
  },

  // Get awards data - always fetch English data
  async getAwardsData(languageCode = 'en') {
    try {
      const { data: awardsData, error: awardsError } = await supabase
        .from('awards')
        .select(`
          *,
          awards_items(*)
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)

      if (awardsError) throw awardsError

      return camelCaseKeysDeep(awardsData.map(award => ({
        ...award,
        award: award.awards_items.map(item => ({
          title: item.title,
          organization: item.organization,
          date: item.date,
          description: item.description
        }))
      })))
    } catch (error) {
      console.error('Error fetching awards data:', error)
      throw error
    }
  },

  // Get education data - always fetch English data
  async getEducationData(languageCode = 'en') {
    try {
      const { data: educationData, error: educationError } = await supabase
        .from('education')
        .select(`
          *,
          education_items(
            *,
            education_relevant_courses(*),
            education_organization_involvement(*)
          )
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)

      if (educationError) throw educationError

      // Process education data (camelCase section row so educationImageUrl / education_image_url works on public page)
      const mappedData = educationData.map(edu => {
        const sectionRow = camelCaseKeysDeep({ ...edu, education: undefined });
        const sectionImageUrl = edu.education_image_url ?? edu.educationImageUrl ?? edu.educationimageurl ?? sectionRow.educationImageUrl ?? sectionRow.educationimageurl;
        return {
          ...sectionRow,
          educationImageUrl: sectionImageUrl ?? sectionRow.educationImageUrl,
          education: (edu.education_items || []).map(item => ({
            name: item.name,
            nameUrl: item.nameUrl,
            educationType: item.educationType,
            schoolType: item.schoolType,
            major: item.major,
            completionDate: item.completionDate,
            description: item.description,
            gpa: item.gpa,
            educationImageUrl: item.educationImageUrl ?? item.education_image_url,
            relevantCourses: (item.education_relevant_courses || []).map(course => ({
              course: course.course,
              courseUrl: course.courseUrl
            })),
            organizationInvolvement: (item.education_organization_involvement || []).map(org => ({
              organization: org.organization,
              role: org.role
            }))
          }))
        };
      });

      return mappedData;
    } catch (error) {
      console.error('Error fetching education data:', error)
      throw error
    }
  },

  // Get experience data - always fetch English data
  async getExperienceData(languageCode = 'en') {
    try {
      const { data: experienceData, error: experienceError } = await supabase
        .from('experience')
        .select(`
          *,
          experience_professional(
            *,
            experience_professional_positions(*)
          ),
          experience_leadership(
            *,
            experience_leadership_positions(*)
          )
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)

      if (experienceError) throw experienceError

      return camelCaseKeysDeep(experienceData.map(exp => ({
        ...exp,
        professionalexperience: exp.experience_professional.map(prof => ({
          company: prof.company,
          companyUrl: prof.companyUrl,
          location: prof.location,
          positions: prof.experience_professional_positions.map(pos => ({
            position: pos.position,
            startDate: pos.startDate,
            endDate: pos.endDate,
            responsibilities: pos.responsibilities,
            skills: pos.skills,
            images: pos.images
          }))
        })),
        leadershipexperience: exp.experience_leadership.map(lead => ({
          company: lead.company,
          companyUrl: lead.companyUrl,
          location: lead.location,
          positions: lead.experience_leadership_positions.map(pos => ({
            position: pos.position,
            startDate: pos.startDate,
            endDate: pos.endDate,
            responsibilities: pos.responsibilities,
            skills: pos.skills,
            images: pos.images
          }))
        }))
      })))
    } catch (error) {
      console.error('Error fetching experience data:', error)
      throw error
    }
  },

  // Get gallery data - always fetch English data
  async getGalleryData(languageCode = 'en') {
    try {
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select(`
          *,
          gallery_categories(*)
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)
        .order('sortOrder')

      if (galleryError) throw galleryError

      return camelCaseKeysDeep(galleryData.map(item => ({
        ...item,
        category: item.gallery_categories.map(cat => ({
          categoryName: cat.categoryName
        }))
      })))
    } catch (error) {
      console.error('Error fetching gallery data:', error)
      throw error
    }
  },

  // Get projects data - always fetch English data
  async getProjectsData(languageCode = 'en') {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_items(
            *,
            project_technologies(*),
            project_highlights(*)
          )
        `)
        .eq('languageCode', 'en') // Always fetch English data
        .eq('isActive', true)

      if (projectsError) throw projectsError

      return camelCaseKeysDeep(projectsData.map(proj => ({
        ...proj,
        project: proj.project_items.map(item => ({
          title: item.title,
          date: item.date,
          description: item.description,
          technologies: item.project_technologies.map(tech => tech.technology),
          githubUrl: item.githubUrl,
          liveUrl: item.liveUrl,
          imageUrl: item.imageUrl,
          highlights: item.project_highlights.map(highlight => highlight.highlight)
        }))
      })))
    } catch (error) {
      console.error('Error fetching projects data:', error)
      throw error
    }
  },

  // Get specific section data
  async getSection(sectionName, languageCode = 'en') {
    try {
      switch (sectionName) {
        case 'home':
          return await this.getHomeData(languageCode);
        case 'about':
          return await this.getAboutData(languageCode);
        case 'awards':
          return await this.getAwardsData(languageCode);
        case 'education':
          return await this.getEducationData(languageCode);
        case 'experience':
          return await this.getExperienceData(languageCode);
        case 'gallery':
          return await this.getGalleryData(languageCode);
        case 'projects':
          return await this.getProjectsData(languageCode);
        default:
          throw new Error(`Unknown section: ${sectionName}`);
      }
    } catch (error) {
      console.error(`Error fetching ${sectionName} data:`, error);
      throw error;
    }
  },

  // Clear all cache
  async clearCache() {
    cache.clear()
    try {
      await indexedDBCache.clear()
    } catch (error) {
      console.warn('Failed to clear IndexedDB cache:', error)
    }
  },

  // Clear specific cache entry
  async clearCacheEntry(key) {
    cache.delete(key)
    try {
      await indexedDBCache.delete(key)
    } catch (error) {
      console.warn('Failed to clear IndexedDB cache entry:', error)
    }
  },

  // Get asset URL from Supabase Storage (bucket = assets). Object keys are under "assets/" folder (e.g. assets/images/gallery/...). If already a full URL, return as-is.
  getAssetUrl(filePath) {
    if (!filePath) return '';
    if (typeof filePath === 'string' && filePath.startsWith('http')) return filePath;
    const path = (filePath || '').replace(/^\/+/, '');
    return `${supabaseUrl}/storage/v1/object/public/assets/${path}`;
  },

  // Upload asset to Supabase Storage
  async uploadAsset(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error uploading asset:', error)
      throw error
    }
  },

  // Delete asset from Supabase Storage
  async deleteAsset(path) {
    try {
      const { error } = await supabase.storage
        .from('assets')
        .remove([path])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting asset:', error)
      throw error
    }
  },

  // Submit contact form email to Supabase
  async submitEmail(emailData) {
    try {
      console.log('🔄 Submitting email to Supabase table "emails"...');
      console.log('📧 Email data:', emailData);
      
      const { data, error } = await supabase
        .from('emails')
        .insert([{
          first_name: emailData.firstName,
          last_name: emailData.lastName,
          email: emailData.email,
          subject: emailData.subject,
          message: emailData.message,
          ip_address: emailData.ipAddress,
          user_agent: emailData.userAgent,
          status: 'pending'
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Email successfully saved to Supabase:', data);
      return data;
    } catch (error) {
      console.error('❌ Error submitting email to Supabase:', error);
      
      // Check if it's a table not found error
      if (error.message && error.message.includes('relation "emails" does not exist')) {
        console.error('❌ The "emails" table does not exist in your Supabase database!');
        console.error('💡 Please run the SQL from supabase/emails-table.sql in your Supabase dashboard');
      }
      
      throw error;
    }
  },

  // Update email status after EmailJS response
  async updateEmailStatus(emailId, status, emailjsResponse = null) {
    try {
      const { data, error } = await supabase
        .from('emails')
        .update({
          status: status,
          emailjs_response: emailjsResponse,
          updated_at: new Date().toISOString()
        })
        .eq('id', emailId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating email status:', error)
      throw error
    }
  },

  // Get all emails (for admin purposes)
  async getEmails(limit = 100, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching emails:', error)
      throw error
    }
  }
}

// Asset service for managing images and files
export const assetService = {
  // Get asset URL (path or full URL; if full URL return as-is)
  getAssetUrl(filePath) {
    if (!filePath) return '';
    if (typeof filePath === 'string' && filePath.startsWith('http')) return filePath;
    const path = filePath.startsWith('assets/') ? filePath.slice(7) : (filePath || '');
    return `${supabaseUrl}/storage/v1/object/public/assets/${path}`;
  },

  // Upload asset
  async uploadAsset(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(path, file)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error uploading asset:', error)
      throw error
    }
  },

  // Delete asset
  async deleteAsset(path) {
    try {
      const { error } = await supabase.storage
        .from('assets')
        .remove([path])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting asset:', error)
      throw error
    }
  }
}

export default supabase 