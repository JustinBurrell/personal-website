#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

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

    // Update all section tables with image URLs
    const tablesToUpdate = ['home', 'about', 'awards', 'education', 'experience', 'gallery', 'projects'];
    
    for (const tableName of tablesToUpdate) {
      console.log(`📝 Updating ${tableName}...`);
      const { data: records, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) {
        console.error(`❌ Error fetching ${tableName}:`, error);
        continue;
      }

      for (const record of records) {
        const updatedRecord = updateJsonContent(record, urlMapping);
        
        if (JSON.stringify(updatedRecord) !== JSON.stringify(record)) {
          const { error: updateError } = await supabase
            .from(tableName)
            .update(updatedRecord)
            .eq('id', record.id);

          if (updateError) {
            console.error(`❌ Error updating ${tableName} record ${record.id}:`, updateError);
          } else {
            console.log(`✅ Updated ${tableName} record: ${record.id}`);
          }
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