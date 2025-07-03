require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js')
const portfolioData = require('../src/data/portfolioData.js')

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
      .from('home')
      .upsert({
        language_code: 'en',
        imageUrl: portfolioData.home.imageUrl,
        title: portfolioData.home.title,
        description: portfolioData.home.description,
        resumeUrl: portfolioData.home.resumeUrl,
        linkedinUrl: portfolioData.home.linkedinUrl,
        githubUrl: portfolioData.home.githubUrl,
        email: portfolioData.home.email,
        organizations: portfolioData.home.organizations,
        qualities: portfolioData.home.qualities,
        is_active: true
      })

    // 2. Migrate About section
    console.log('Migrating About section...')
    await supabase
      .from('about')
      .upsert({
        language_code: 'en',
        imageUrl: portfolioData.about.imageUrl,
        introduction: portfolioData.about.introduction,
        skills: portfolioData.about.skills,
        interests: portfolioData.about.interests,
        is_active: true
      })

    // 3. Migrate Awards
    console.log('Migrating Awards...')
    for (let i = 0; i < portfolioData.awards.length; i++) {
      const award = portfolioData.awards[i]
      await supabase
        .from('awards')
        .upsert({
          language_code: 'en',
          awardImageUrl: award.awardImageUrl,
          description: award.description,
          award: award.award,
          is_active: true
        })
    }

    // 4. Migrate Education
    console.log('Migrating Education...')
    for (let i = 0; i < portfolioData.education.length; i++) {
      const education = portfolioData.education[i]
      await supabase
        .from('education')
        .upsert({
          language_code: 'en',
          educationImageUrl: education.educationImageUrl,
          description: education.description,
          education: education.education,
          is_active: true
        })
    }

    // 5. Migrate Experience
    console.log('Migrating Experience...')
    for (let i = 0; i < portfolioData.experience.length; i++) {
      const experience = portfolioData.experience[i]
      await supabase
        .from('experience')
        .upsert({
          language_code: 'en',
          experienceImageUrl: experience.experienceImageUrl,
          description: experience.description,
          professionalexperience: experience.professionalexperience,
          leadershipexperience: experience.leadershipexperience,
          is_active: true
        })
    }

    // 6. Migrate Gallery items
    console.log('Migrating Gallery items...')
    for (let i = 0; i < portfolioData.gallery.length; i++) {
      const item = portfolioData.gallery[i]
      await supabase
        .from('gallery')
        .upsert({
          language_code: 'en',
          title: item.title,
          imageUrl: item.imageUrl,
          description: item.description,
          category: item.category || [],
          sort_order: i,
          is_active: true
        })
    }

    // 7. Migrate Projects
    console.log('Migrating Projects...')
    for (let i = 0; i < portfolioData.projects.length; i++) {
      const projectSection = portfolioData.projects[i]
      await supabase
        .from('projects')
        .upsert({
          language_code: 'en',
          projectImageUrl: projectSection.projectImageUrl,
          description: projectSection.description,
          project: projectSection.project,
          is_active: true
        })
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

module.exports = { migrateToSupabase } 