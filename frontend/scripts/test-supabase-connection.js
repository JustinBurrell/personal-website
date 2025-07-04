// Test Supabase connection and fetch first row from education table
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_active', true)
      .eq('language_code', 'en')
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      process.exit(1);
    }
    if (!data || data.length === 0) {
      console.log('No data found in education table.');
    } else {
      console.log('Supabase connection successful. First row:', data[0]);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

testConnection(); 