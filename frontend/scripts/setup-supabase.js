#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Supabase Setup for Personal Website\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSupabase() {
  try {
    console.log('Please provide your Supabase credentials:\n');
    
    const supabaseUrl = await question('Supabase Project URL (e.g., https://your-project-id.supabase.co): ');
    const anonKey = await question('Supabase Anon Key (starts with eyJ...): ');
    const serviceKey = await question('Supabase Service Role Key (starts with eyJ...): ');
    
    const envContent = `# Supabase Configuration
REACT_APP_SUPABASE_URL=${supabaseUrl}
REACT_APP_SUPABASE_ANON_KEY=${anonKey}
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=${serviceKey}
`;
    
    const envPath = path.join(__dirname, '..', '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Environment variables saved to .env.local');
    console.log('\nNext steps:');
    console.log('1. Run the database schema: Copy supabase/supabase-schema.sql to your Supabase SQL Editor');
    console.log('2. Run the migration: npm run migrate-to-supabase');
    console.log('3. Start the development server: npm start');
    
  } catch (error) {
    console.error('❌ Error setting up Supabase:', error.message);
  } finally {
    rl.close();
  }
}

setupSupabase(); 