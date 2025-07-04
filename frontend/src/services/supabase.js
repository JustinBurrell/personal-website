import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// These will be environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cache for storing fetched data
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (key) => {
  const cached = cache.get(key)
  if (!cached) return false
  return Date.now() - cached.timestamp < CACHE_DURATION
}

// Helper function to set cache
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Helper function to get cache
const getCache = (key) => {
  const cached = cache.get(key)
  return cached ? cached.data : null
}

// Portfolio data service
export const portfolioService = {
  // Get all portfolio data - optimized with better caching
  async getPortfolioData(languageCode = 'en') {
    const cacheKey = `portfolio_${languageCode}`
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey)
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

      // Cache the result for 10 minutes instead of 5
      setCache(cacheKey, portfolioData)
      
      return portfolioData
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      throw error
    }
  },

  // Optimized single query method (fallback if materialized view exists)
  async getPortfolioDataOptimized(languageCode = 'en') {
    const cacheKey = `portfolio_optimized_${languageCode}`
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey)
    }

    try {
      // Try materialized view first
      const { data, error } = await supabase
        .from('portfolio_data_view')
        .select('section, content')
        .eq('language_code', 'en')
        .eq('is_active', true)

      if (error || !data || data.length === 0) {
        // Fallback to original method if materialized view doesn't work
        console.log('Materialized view not available, using original method')
        return this.getPortfolioData(languageCode)
      }

      // Transform data to match expected structure
      const portfolioData = {}
      data.forEach(item => {
        portfolioData[item.section] = item.content
      })

      // Cache the result
      setCache(cacheKey, portfolioData)
      
      return portfolioData
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)
        .single()

      if (homeError) throw homeError

      return {
        imageUrl: homeData.imageUrl,
        title: homeData.title,
        description: homeData.description,
        resumeUrl: homeData.resumeUrl,
        linkedinUrl: homeData.linkedinUrl,
        githubUrl: homeData.githubUrl,
        email: homeData.email,
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
      }
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)
        .single()

      if (aboutError) throw aboutError

      return {
        imageUrl: aboutData.imageUrl,
        introduction: aboutData.introduction,
        skills: aboutData.about_skills.map(skill => skill.skill),
        interests: aboutData.about_interests.map(interest => interest.interest)
      }
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)

      if (awardsError) throw awardsError

      return awardsData.map(award => ({
        awardImageUrl: award.awardImageUrl,
        description: award.description,
        award: award.awards_items.map(item => ({
          title: item.title,
          organization: item.organization,
          date: item.date,
          description: item.description
        }))
      }))
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)

      if (educationError) throw educationError

      return educationData.map(edu => ({
        educationImageUrl: edu.educationImageUrl,
        description: edu.description,
        education: edu.education_items.map(item => ({
          name: item.name,
          nameUrl: item.nameUrl,
          education_type: item.education_type,
          school_type: item.school_type,
          major: item.major,
          completionDate: item.completionDate,
          description: item.description,
          gpa: item.gpa,
          educationImageUrl: item.educationImageUrl,
          relevantCourses: item.education_relevant_courses.map(course => ({
            course: course.course,
            courseUrl: course.courseUrl
          })),
          organizationInvolvement: item.education_organization_involvement.map(org => ({
            organization: org.organization,
            role: org.role
          }))
        }))
      }))
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)

      if (experienceError) throw experienceError

      return experienceData.map(exp => ({
        experienceImageUrl: exp.experienceImageUrl,
        description: exp.description,
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
      }))
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)
        .order('sort_order')

      if (galleryError) throw galleryError

      return galleryData.map(item => ({
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description,
        category: item.gallery_categories.map(cat => ({
          categoryName: cat.categoryName
        }))
      }))
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
        .eq('language_code', 'en') // Always fetch English data
        .eq('is_active', true)

      if (projectsError) throw projectsError

      return projectsData.map(proj => ({
        projectImageUrl: proj.projectImageUrl,
        description: proj.description,
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
      }))
    } catch (error) {
      console.error('Error fetching projects data:', error)
      throw error
    }
  },

  // Clear all cache
  clearCache() {
    cache.clear()
  },

  // Clear specific cache entry
  clearCacheEntry(key) {
    cache.delete(key)
  },

  // Get asset URL from Supabase Storage
  getAssetUrl(filePath) {
    return `${supabaseUrl}/storage/v1/object/public/assets/${filePath}`
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
  }
}

// Asset service for managing images and files
export const assetService = {
  // Get asset URL
  getAssetUrl(filePath) {
    return `${supabaseUrl}/storage/v1/object/public/assets/${filePath}`
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