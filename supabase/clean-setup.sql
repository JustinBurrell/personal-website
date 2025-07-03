-- Clean Setup Script - Run this in Supabase SQL Editor
-- This will create the correct schema without trying to drop non-existent tables

-- Step 1: Drop existing storage policies (if they exist)
DROP POLICY IF EXISTS "Public read access for assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;

-- Step 2: Create tables that match your portfolio data structure

-- Home section table
CREATE TABLE IF NOT EXISTS home (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  imageUrl VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  resumeUrl VARCHAR(500) NOT NULL,
  linkedinUrl VARCHAR(500) NOT NULL,
  githubUrl VARCHAR(500) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organizations JSONB NOT NULL DEFAULT '[]',
  qualities JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About section table
CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  imageUrl VARCHAR(500) NOT NULL,
  introduction TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]',
  interests JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Awards table
CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  awardImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  award JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  educationImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  education JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  experienceImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  professionalexperience JSONB NOT NULL DEFAULT '[]',
  leadershipexperience JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  title VARCHAR(255) NOT NULL,
  imageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  projectImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  project JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio assets table (for tracking images and files)
CREATE TABLE IF NOT EXISTS portfolio_assets (
  id SERIAL PRIMARY KEY,
  asset_type VARCHAR(50) NOT NULL, -- 'image', 'document', 'video'
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  section_name VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_home_language ON home(language_code);
CREATE INDEX IF NOT EXISTS idx_home_active ON home(is_active);
CREATE INDEX IF NOT EXISTS idx_about_language ON about(language_code);
CREATE INDEX IF NOT EXISTS idx_about_active ON about(is_active);
CREATE INDEX IF NOT EXISTS idx_awards_language ON awards(language_code);
CREATE INDEX IF NOT EXISTS idx_awards_active ON awards(is_active);
CREATE INDEX IF NOT EXISTS idx_education_language ON education(language_code);
CREATE INDEX IF NOT EXISTS idx_education_active ON education(is_active);
CREATE INDEX IF NOT EXISTS idx_experience_language ON experience(language_code);
CREATE INDEX IF NOT EXISTS idx_experience_active ON experience(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_language ON gallery(language_code);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language_code);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);

-- Step 4: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 5: Create triggers for updated_at
CREATE TRIGGER update_home_updated_at 
  BEFORE UPDATE ON home 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_updated_at 
  BEFORE UPDATE ON about 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_awards_updated_at 
  BEFORE UPDATE ON awards 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at 
  BEFORE UPDATE ON education 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at 
  BEFORE UPDATE ON experience 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at 
  BEFORE UPDATE ON gallery 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Enable Row Level Security (RLS)
ALTER TABLE home ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;

-- Step 7: Create policies for public read access
CREATE POLICY "Public read access for home" ON home
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for about" ON about
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for awards" ON awards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for education" ON education
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for experience" ON experience
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for gallery" ON gallery
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for projects" ON projects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for portfolio_assets" ON portfolio_assets
  FOR SELECT USING (is_active = true);

-- Step 8: Create policies for authenticated users (for admin dashboard)
CREATE POLICY "Authenticated users can manage home" ON home
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage about" ON about
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage awards" ON awards
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage education" ON education
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage experience" ON experience
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage gallery" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage portfolio_assets" ON portfolio_assets
  FOR ALL USING (auth.role() = 'authenticated');

-- Step 9: Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Step 10: Create storage policies
CREATE POLICY "Public read access for assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated'); 