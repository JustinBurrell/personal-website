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
  // Get all portfolio data for a specific language
  async getPortfolioData(languageCode = 'en') {
    const cacheKey = `portfolio_${languageCode}`
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey)
    }

    try {
      const { data, error } = await supabase
        .from('portfolio_sections')
        .select('*')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('section_name')

      if (error) throw error

      // Transform data into the expected format
      const portfolioData = {
        home: null,
        about: null,
        awards: [],
        education: [],
        experience: [],
        gallery: [],
        projects: []
      }

      data.forEach(section => {
        if (section.section_name === 'home') {
          portfolioData.home = section.content
        } else if (section.section_name === 'about') {
          portfolioData.about = section.content
        } else if (section.section_name === 'awards') {
          portfolioData.awards.push(section.content)
        } else if (section.section_name === 'education') {
          portfolioData.education.push(section.content)
        } else if (section.section_name === 'experience') {
          portfolioData.experience.push(section.content)
        }
      })

      // Get gallery items
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('sort_order')

      if (galleryError) throw galleryError
      portfolioData.gallery = galleryData.map(item => ({
        title: item.title,
        imageUrl: item.image_url,
        description: item.description,
        category: item.categories
      }))

      // Get projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('sort_order')

      if (projectsError) throw projectsError
      portfolioData.projects = [{
        projectImageUrl: '/assets/images/projects/Projects About Background.jpg',
        description: 'Projects are an opportunity to sharpen my technical skills and showcase my creativity.',
        project: projectsData.map(project => ({
          title: project.title,
          date: project.date,
          description: project.description,
          technologies: project.technologies,
          githubUrl: project.github_url,
          liveUrl: project.live_url,
          imageUrl: project.image_url,
          highlights: project.highlights
        }))
      }]

      // Cache the result
      setCache(cacheKey, portfolioData)
      
      return portfolioData
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      throw error
    }
  },

  // Get specific section data
  async getSection(sectionName, languageCode = 'en') {
    const cacheKey = `section_${sectionName}_${languageCode}`
    
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey)
    }

    try {
      const { data, error } = await supabase
        .from('portfolio_sections')
        .select('*')
        .eq('section_name', sectionName)
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .single()

      if (error) throw error

      setCache(cacheKey, data.content)
      return data.content
    } catch (error) {
      console.error(`Error fetching section ${sectionName}:`, error)
      throw error
    }
  },

  // Get gallery items
  async getGalleryItems(languageCode = 'en') {
    const cacheKey = `gallery_${languageCode}`
    
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey)
    }

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error

      const galleryItems = data.map(item => ({
        title: item.title,
        imageUrl: item.image_url,
        description: item.description,
        category: item.categories
      }))

      setCache(cacheKey, galleryItems)
      return galleryItems
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      throw error
    }
  },

  // Get projects
  async getProjects(languageCode = 'en') {
    const cacheKey = `projects_${languageCode}`
    
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey)
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error

      const projects = data.map(project => ({
        title: project.title,
        date: project.date,
        description: project.description,
        technologies: project.technologies,
        githubUrl: project.github_url,
        liveUrl: project.live_url,
        imageUrl: project.image_url,
        highlights: project.highlights
      }))

      setCache(cacheKey, projects)
      return projects
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  },

  // Clear cache
  clearCache() {
    cache.clear()
  },

  // Clear specific cache entry
  clearCacheEntry(key) {
    cache.delete(key)
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