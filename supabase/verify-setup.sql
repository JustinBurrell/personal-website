-- Comprehensive Verification Query - Run this in Supabase SQL Editor

-- Check if all tables exist
SELECT 
  expected_tables.table_name,
  CASE 
    WHEN actual_tables.table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM (
  SELECT unnest(ARRAY['home', 'about', 'awards', 'education', 'experience', 'gallery', 'projects', 'portfolio_assets']) as table_name
) expected_tables
LEFT JOIN information_schema.tables actual_tables 
  ON expected_tables.table_name = actual_tables.table_name 
  AND actual_tables.table_schema = 'public'
ORDER BY expected_tables.table_name;

-- Check table row counts
SELECT 
  'home' as table_name,
  COUNT(*) as row_count
FROM home
UNION ALL
SELECT 
  'about' as table_name,
  COUNT(*) as row_count
FROM about
UNION ALL
SELECT 
  'awards' as table_name,
  COUNT(*) as row_count
FROM awards
UNION ALL
SELECT 
  'education' as table_name,
  COUNT(*) as row_count
FROM education
UNION ALL
SELECT 
  'experience' as table_name,
  COUNT(*) as row_count
FROM experience
UNION ALL
SELECT 
  'gallery' as table_name,
  COUNT(*) as row_count
FROM gallery
UNION ALL
SELECT 
  'projects' as table_name,
  COUNT(*) as row_count
FROM projects
UNION ALL
SELECT 
  'portfolio_assets' as table_name,
  COUNT(*) as row_count
FROM portfolio_assets
ORDER BY table_name;

-- Check if storage bucket exists
SELECT 
  id,
  name,
  public,
  '✅ EXISTS' as status
FROM storage.buckets 
WHERE id = 'assets';

-- Check if RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('home', 'about', 'awards', 'education', 'experience', 'gallery', 'projects', 'portfolio_assets')
ORDER BY tablename; 