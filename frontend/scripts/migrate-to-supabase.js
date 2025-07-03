import { createClient } from '@supabase/supabase-js'
import portfolioData from '../src/data/portfolioData.js'

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Migration script
async function migrateToSupabase() {
  console.log('Starting migration to Supabase...')

  try {
    // 1. Migrate Home section
    console.log('Migrating Home section...')
    await supabase
      .from('portfolio_sections')
      .upsert({
        section_name: 'home',
        language_code: 'en',
        content: portfolioData.home,
        is_active: true
      })

    // 2. Migrate About section
    console.log('Migrating About section...')
    await supabase
      .from('portfolio_sections')
      .upsert({
        section_name: 'about',
        language_code: 'en',
        content: portfolioData.about,
        is_active: true
      })

    // 3. Migrate Awards
    console.log('Migrating Awards...')
    for (let i = 0; i < portfolioData.awards.length; i++) {
      await supabase
        .from('portfolio_sections')
        .upsert({
          section_name: 'awards',
          language_code: 'en',
          content: portfolioData.awards[i],
          is_active: true
        })
    }

    // 4. Migrate Education
    console.log('Migrating Education...')
    for (let i = 0; i < portfolioData.education.length; i++) {
      await supabase
        .from('portfolio_sections')
        .upsert({
          section_name: 'education',
          language_code: 'en',
          content: portfolioData.education[i],
          is_active: true
        })
    }

    // 5. Migrate Experience
    console.log('Migrating Experience...')
    for (let i = 0; i < portfolioData.experience.length; i++) {
      await supabase
        .from('portfolio_sections')
        .upsert({
          section_name: 'experience',
          language_code: 'en',
          content: portfolioData.experience[i],
          is_active: true
        })
    }

    // 6. Migrate Gallery items
    console.log('Migrating Gallery items...')
    for (let i = 0; i < portfolioData.gallery.length; i++) {
      const item = portfolioData.gallery[i]
      await supabase
        .from('gallery_items')
        .upsert({
          title: item.title,
          description: item.description,
          image_url: item.imageUrl,
          categories: item.category,
          language_code: 'en',
          sort_order: i,
          is_active: true
        })
    }

    // 7. Migrate Projects
    console.log('Migrating Projects...')
    if (portfolioData.projects.length > 0) {
      const projects = portfolioData.projects[0].project
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i]
        await supabase
          .from('projects')
          .upsert({
            title: project.title,
            date: project.date,
            description: project.description,
            technologies: project.technologies,
            github_url: project.githubUrl,
            live_url: project.liveUrl,
            image_url: project.imageUrl,
            highlights: project.highlights,
            language_code: 'en',
            sort_order: i,
            is_active: true
          })
      }
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToSupabase()
}

export default migrateToSupabase 