-- Fix Migration Issues Script
-- Run this in Supabase SQL Editor

-- Step 1: Temporarily disable RLS to allow data insertion
ALTER TABLE home DISABLE ROW LEVEL SECURITY;
ALTER TABLE about DISABLE ROW LEVEL SECURITY;
ALTER TABLE awards DISABLE ROW LEVEL SECURITY;
ALTER TABLE education DISABLE ROW LEVEL SECURITY;
ALTER TABLE experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets DISABLE ROW LEVEL SECURITY;

-- Step 2: Check if storage bucket is public
SELECT 
  id,
  name,
  public,
  'Current bucket status' as status
FROM storage.buckets 
WHERE id = 'assets';

-- Step 3: Make storage bucket public if it's not
UPDATE storage.buckets 
SET public = true 
WHERE id = 'assets';

-- Step 4: Create proper storage policies for public access
DROP POLICY IF EXISTS "Public read access for assets" ON storage.objects;

CREATE POLICY "Public read access for assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

-- Step 5: Check current table row counts
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
ORDER BY table_name;

-- Step 6: Re-enable RLS with proper policies
ALTER TABLE home ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop and recreate policies to allow public read access
DROP POLICY IF EXISTS "Public read access for home" ON home;
DROP POLICY IF EXISTS "Public read access for about" ON about;
DROP POLICY IF EXISTS "Public read access for awards" ON awards;
DROP POLICY IF EXISTS "Public read access for education" ON education;
DROP POLICY IF EXISTS "Public read access for experience" ON experience;
DROP POLICY IF EXISTS "Public read access for gallery" ON gallery;
DROP POLICY IF EXISTS "Public read access for projects" ON projects;

CREATE POLICY "Public read access for home" ON home
  FOR SELECT USING (true);

CREATE POLICY "Public read access for about" ON about
  FOR SELECT USING (true);

CREATE POLICY "Public read access for awards" ON awards
  FOR SELECT USING (true);

CREATE POLICY "Public read access for education" ON education
  FOR SELECT USING (true);

CREATE POLICY "Public read access for experience" ON experience
  FOR SELECT USING (true);

CREATE POLICY "Public read access for gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Public read access for projects" ON projects
  FOR SELECT USING (true); 