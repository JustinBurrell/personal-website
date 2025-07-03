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

// Image directories to migrate
const imageDirectories = [
  'assets/images/home',
  'assets/images/about',
  'assets/images/awards',
  'assets/images/education',
  'assets/images/experiences',
  'assets/images/gallery',
  'assets/images/projects',
  'assets/documents'
];

async function uploadFile(filePath, storagePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(storagePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`❌ Error uploading ${filePath}:`, error.message);
      return null;
    }

    console.log(`✅ Uploaded: ${storagePath}`);
    return data.path;
  } catch (error) {
    console.error(`❌ Error reading/uploading ${filePath}:`, error.message);
    return null;
  }
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Supabase Storage...\n');

  const publicDir = path.join(__dirname, '..', 'public');
  const uploadedFiles = [];

  for (const dir of imageDirectories) {
    const fullPath = path.join(publicDir, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }

    console.log(`📁 Processing directory: ${dir}`);
    
    const files = getAllFiles(fullPath);
    
    for (const file of files) {
      const relativePath = path.relative(publicDir, file);
      const storagePath = relativePath.replace(/\\/g, '/'); // Ensure forward slashes
      
      const uploadedPath = await uploadFile(file, storagePath);
      if (uploadedPath) {
        uploadedFiles.push({
          originalPath: relativePath,
          storagePath: uploadedPath,
          publicUrl: `${supabaseUrl}/storage/v1/object/public/assets/${relativePath}`
        });
      }
    }
  }

  // Save migration report
  const reportPath = path.join(__dirname, '..', 'image-migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(uploadedFiles, null, 2));
  
  console.log(`\n📊 Migration complete!`);
  console.log(`📄 Report saved to: ${reportPath}`);
  console.log(`📈 Total files uploaded: ${uploadedFiles.length}`);
  
  return uploadedFiles;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Only include image and document files
      const ext = path.extname(file).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const docExts = ['.pdf', '.doc', '.docx'];
      
      if (imageExts.includes(ext) || docExts.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateImages()
    .then(() => {
      console.log('\n🎉 Image migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Update your database records to use the new Supabase URLs');
      console.log('2. Test that all images load correctly');
      console.log('3. Consider removing images from the public folder to save space');
    })
    .catch(error => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateImages }; 