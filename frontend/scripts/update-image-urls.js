#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Environment variables not set. Please run setup-supabase first.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateImageUrls() {
  console.log('🔄 Updating database with Supabase Storage URLs...\n');

  try {
    // Load migration report
    const reportPath = path.join(__dirname, '..', 'image-migration-report.json');
    if (!fs.existsSync(reportPath)) {
      console.error('❌ Migration report not found. Please run migrate-images first.');
      process.exit(1);
    }

    const migrationReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Create a mapping from old paths to new URLs
    const urlMapping = {};
    migrationReport.forEach(file => {
      urlMapping[file.originalPath] = file.publicUrl;
    });

    console.log(`📊 Found ${Object.keys(urlMapping).length} files to update\n`);

    // Update portfolio_sections (JSONB content)
    console.log('📝 Updating portfolio_sections...');
    const { data: sections, error: sectionsError } = await supabase
      .from('portfolio_sections')
      .select('*');

    if (sectionsError) {
      console.error('❌ Error fetching sections:', sectionsError);
      return;
    }

    for (const section of sections) {
      const updatedContent = updateJsonContent(section.content, urlMapping);
      
      if (JSON.stringify(updatedContent) !== JSON.stringify(section.content)) {
        const { error } = await supabase
          .from('portfolio_sections')
          .update({ content: updatedContent })
          .eq('id', section.id);

        if (error) {
          console.error(`❌ Error updating section ${section.id}:`, error);
        } else {
          console.log(`✅ Updated section: ${section.section_name}`);
        }
      }
    }

    // Update gallery_items
    console.log('\n📝 Updating gallery_items...');
    const { data: galleryItems, error: galleryError } = await supabase
      .from('gallery_items')
      .select('*');

    if (galleryError) {
      console.error('❌ Error fetching gallery items:', galleryError);
      return;
    }

    for (const item of galleryItems) {
      const newImageUrl = urlMapping[item.image_url] || item.image_url;
      
      if (newImageUrl !== item.image_url) {
        const { error } = await supabase
          .from('gallery_items')
          .update({ image_url: newImageUrl })
          .eq('id', item.id);

        if (error) {
          console.error(`❌ Error updating gallery item ${item.id}:`, error);
        } else {
          console.log(`✅ Updated gallery item: ${item.title}`);
        }
      }
    }

    // Update projects
    console.log('\n📝 Updating projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
      return;
    }

    for (const project of projects) {
      const newImageUrl = urlMapping[project.image_url] || project.image_url;
      
      if (newImageUrl !== project.image_url) {
        const { error } = await supabase
          .from('projects')
          .update({ image_url: newImageUrl })
          .eq('id', project.id);

        if (error) {
          console.error(`❌ Error updating project ${project.id}:`, error);
        } else {
          console.log(`✅ Updated project: ${project.title}`);
        }
      }
    }

    console.log('\n🎉 Database update completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Test your website to ensure all images load correctly');
    console.log('2. Consider removing images from the public folder to save space');
    console.log('3. Update your deployment process to exclude the public/images folder');

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

function updateJsonContent(content, urlMapping) {
  if (typeof content !== 'object' || content === null) {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(item => updateJsonContent(item, urlMapping));
  }

  const updated = {};
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'string' && (key.includes('image') || key.includes('url'))) {
      // Check if this looks like a local path that should be updated
      if (value.startsWith('/assets/') || value.startsWith('assets/')) {
        const normalizedPath = value.startsWith('/') ? value.slice(1) : value;
        updated[key] = urlMapping[normalizedPath] || value;
      } else {
        updated[key] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      updated[key] = updateJsonContent(value, urlMapping);
    } else {
      updated[key] = value;
    }
  }

  return updated;
}

// Run update if this script is executed directly
if (require.main === module) {
  updateImageUrls()
    .then(() => {
      console.log('\n✅ Image URL update completed!');
    })
    .catch(error => {
      console.error('❌ Update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateImageUrls }; 