require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js')
const portfolioData = require('../src/data/portfolioData.js')

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Migration script
async function migrateToSupabase() {
  console.log('Truncating all portfolio tables...')
  let { error: truncateError } = await supabase.rpc('truncate_portfolio_tables');
  if (truncateError) {
    console.error('Error truncating tables:', truncateError)
    // Stop migration if truncation fails
    return;
  }

  console.log('Starting normalized migration to Supabase...')

  // --- HOME ---
  console.log('Migrating Home section...')
  let { data: homeRows, error: homeError } = await supabase
    .from('home')
    .insert({
      language_code: 'en',
      imageurl: portfolioData.home.imageUrl,
      title: portfolioData.home.title,
      description: portfolioData.home.description,
      resumeurl: portfolioData.home.resumeUrl,
      linkedinurl: portfolioData.home.linkedinUrl,
      githuburl: portfolioData.home.githubUrl,
      email: portfolioData.home.email,
      is_active: true
    })
    .select('id')
  if (homeError) return console.error('Home insert error:', homeError)
  const homeId = homeRows[0].id

  for (const org of portfolioData.home.organizations) {
    let { error } = await supabase.from('home_organizations').insert({
      home_id: homeId,
      name: org.name,
      orgurl: org.orgUrl,
      orgcolor: org.orgColor,
      orgportfoliourl: org.orgPortfolioUrl
    })
    if (error) console.error('Home org insert error:', error)
  }
  for (const qual of portfolioData.home.qualities) {
    let { error } = await supabase.from('home_qualities').insert({
      home_id: homeId,
      ...qual
    })
    if (error) console.error('Home quality insert error:', error)
  }

  // --- ABOUT ---
  console.log('Migrating About section...')
  let { data: aboutRows, error: aboutError } = await supabase
    .from('about')
    .insert({
      language_code: 'en',
      imageurl: portfolioData.about.imageUrl,
      introduction: portfolioData.about.introduction,
      is_active: true
    })
    .select('id')
  if (aboutError) return console.error('About insert error:', aboutError)
  const aboutId = aboutRows[0].id

  for (const skill of portfolioData.about.skills) {
    let { error } = await supabase.from('about_skills').insert({
      about_id: aboutId,
      skill
    })
    if (error) console.error('About skill insert error:', error)
  }
  for (const interest of portfolioData.about.interests) {
    let { error } = await supabase.from('about_interests').insert({
      about_id: aboutId,
      interest
    })
    if (error) console.error('About interest insert error:', error)
  }

  // --- AWARDS ---
  console.log('Migrating Awards section...')
  for (const awardSection of portfolioData.awards) {
    let { data: awardsRows, error: awardsError } = await supabase
      .from('awards')
      .insert({
        language_code: 'en',
        awardimageurl: awardSection.awardImageUrl,
        description: awardSection.description,
        is_active: true
      })
      .select('id')
    if (awardsError) return console.error('Awards insert error:', awardsError)
    const awardsId = awardsRows[0].id
    for (const item of awardSection.award) {
      let { error } = await supabase.from('awards_items').insert({
        awards_id: awardsId,
        ...item
      })
      if (error) console.error('Awards item insert error:', error)
    }
  }

  // --- EDUCATION ---
  console.log('Migrating Education section...')
  for (const educationSection of portfolioData.education) {
    let { data: educationRows, error: educationError } = await supabase
      .from('education')
      .insert({
        language_code: 'en',
        educationimageurl: educationSection.educationImageUrl,
        description: educationSection.description,
        is_active: true
      })
      .select('id')
    if (educationError) return console.error('Education insert error:', educationError)
    const educationId = educationRows[0].id
    for (const item of educationSection.education) {
      let { data: eduItemRows, error: eduItemError } = await supabase.from('education_items').insert({
        education_id: educationId,
        name: item.name,
        nameurl: item.nameUrl,
        education_type: item.education_type,
        school_type: item.school_type,
        major: item.major,
        completiondate: item.completionDate,
        description: item.description,
        gpa: item.gpa,
        educationimageurl: item.educationImageUrl
      }).select('id')
      if (eduItemError) { console.error('Education item insert error:', eduItemError); continue; }
      const eduItemId = eduItemRows[0].id
      if (item.relevantCourses) for (const course of item.relevantCourses) {
        let { error } = await supabase.from('education_relevant_courses').insert({
          education_item_id: eduItemId,
          course: course.course,
          courseurl: course.courseUrl
        })
        if (error) console.error('Education course insert error:', error)
      }
      if (item.organizationInvolvement) for (const org of item.organizationInvolvement) {
        let { error } = await supabase.from('education_organization_involvement').insert({
          education_item_id: eduItemId,
          organization: org.organization,
          role: org.role
        })
        if (error) console.error('Education org insert error:', error)
      }
    }
  }

  // --- EXPERIENCE ---
  console.log('Migrating Experience section...')
  for (const experienceSection of portfolioData.experience) {
    let { data: expRows, error: expError } = await supabase
      .from('experience')
      .insert({
        language_code: 'en',
        experienceimageurl: experienceSection.experienceImageUrl,
        description: experienceSection.description,
        is_active: true
      })
      .select('id')
    if (expError) return console.error('Experience insert error:', expError)
    const experienceId = expRows[0].id
    // Professional Experience
    for (const prof of experienceSection.professionalexperience) {
      let { data: profRows, error: profError } = await supabase.from('experience_professional').insert({
        experience_id: experienceId,
        company: prof.company,
        companyurl: prof.companyUrl,
        location: prof.location
      }).select('id')
      if (profError) { console.error('Professional exp insert error:', profError); continue; }
      const profId = profRows[0].id
      for (const pos of prof.positions) {
        let { error } = await supabase.from('experience_professional_positions').insert({
          professional_id: profId,
          position: pos.position,
          startdate: pos.startDate,
          enddate: pos.endDate,
          responsibilities: pos.responsibilities,
          skills: pos.skills,
          images: pos.images || []
        })
        if (error) console.error('Professional position insert error:', error)
      }
    }
    // Leadership Experience
    for (const lead of experienceSection.leadershipexperience) {
      let { data: leadRows, error: leadError } = await supabase.from('experience_leadership').insert({
        experience_id: experienceId,
        company: lead.company,
        companyurl: lead.companyUrl,
        location: lead.location
      }).select('id')
      if (leadError) { console.error('Leadership exp insert error:', leadError); continue; }
      const leadId = leadRows[0].id
      for (const pos of lead.positions) {
        let { error } = await supabase.from('experience_leadership_positions').insert({
          leadership_id: leadId,
          position: pos.position,
          startdate: pos.startDate,
          enddate: pos.endDate,
          responsibilities: pos.responsibilities,
          skills: pos.skills,
          images: pos.images || []
        })
        if (error) console.error('Leadership position insert error:', error)
      }
    }
  }

  // --- GALLERY ---
  console.log('Migrating Gallery section...')
  for (let i = 0; i < portfolioData.gallery.length; i++) {
    const item = portfolioData.gallery[i]
    let { data: galleryRows, error: galleryError } = await supabase.from('gallery').insert({
      language_code: 'en',
      title: item.title,
      imageurl: item.imageUrl,
      description: item.description,
      sort_order: i,
      is_active: true
    }).select('id')
    if (galleryError) { console.error('Gallery insert error:', galleryError); continue; }
    const galleryId = galleryRows[0].id
    if (item.category) for (const cat of item.category) {
      let { error } = await supabase.from('gallery_categories').insert({
        gallery_id: galleryId,
        categoryname: cat.categoryName
      })
      if (error) console.error('Gallery category insert error:', error)
    }
  }

  // --- PROJECTS ---
  console.log('Migrating Projects section...')
  for (const projectSection of portfolioData.projects) {
    let { data: projectsRows, error: projectsError } = await supabase.from('projects').insert({
      language_code: 'en',
      projectimageurl: projectSection.projectImageUrl,
      description: projectSection.description,
      is_active: true
    }).select('id')
    if (projectsError) { console.error('Projects insert error:', projectsError); continue; }
    const projectsId = projectsRows[0].id
    for (const proj of projectSection.project) {
      let { data: projItemRows, error: projItemError } = await supabase.from('project_items').insert({
        projects_id: projectsId,
        title: proj.title,
        date: proj.date,
        description: proj.description,
        githuburl: proj.githubUrl,
        liveurl: proj.liveUrl,
        imageurl: proj.imageUrl
      }).select('id')
      if (projItemError) { console.error('Project item insert error:', projItemError); continue; }
      const projItemId = projItemRows[0].id
      if (proj.technologies) for (const tech of proj.technologies) {
        let { error } = await supabase.from('project_technologies').insert({
          project_item_id: projItemId,
          technology: tech
        })
        if (error) console.error('Project technology insert error:', error)
      }
      if (proj.highlights) for (const highlight of proj.highlights) {
        let { error } = await supabase.from('project_highlights').insert({
          project_item_id: projItemId,
          highlight
        })
        if (error) console.error('Project highlight insert error:', error)
      }
    }
  }

  console.log('Migration completed successfully!')
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToSupabase()
}

module.exports = { migrateToSupabase } 