-- Portfolio Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE IF NOT EXISTS portfolio_sections (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(50) NOT NULL,
  language_code VARCHAR(10) DEFAULT 'en',
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name, language_code)
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  categories JSONB DEFAULT '[]',
  language_code VARCHAR(10) DEFAULT 'en',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  technologies JSONB DEFAULT '[]',
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  highlights JSONB DEFAULT '[]',
  date VARCHAR(50),
  language_code VARCHAR(10) DEFAULT 'en',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  company_url VARCHAR(500),
  location VARCHAR(255),
  experience_type VARCHAR(50) NOT NULL, -- 'professional' or 'leadership'
  language_code VARCHAR(10) DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_positions (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
  position VARCHAR(255) NOT NULL,
  start_date VARCHAR(50),
  end_date VARCHAR(50),
  responsibilities JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_language ON portfolio_sections(language_code);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_active ON portfolio_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_items_language ON gallery_items(language_code);
CREATE INDEX IF NOT EXISTS idx_gallery_items_active ON gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language_code);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_experiences_type ON experiences(experience_type);
CREATE INDEX IF NOT EXISTS idx_experiences_language ON experiences(language_code);
CREATE INDEX IF NOT EXISTS idx_experience_positions_experience_id ON experience_positions(experience_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_portfolio_sections_updated_at 
  BEFORE UPDATE ON portfolio_sections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at 
  BEFORE UPDATE ON gallery_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at 
  BEFORE UPDATE ON experiences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_positions_updated_at 
  BEFORE UPDATE ON experience_positions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for portfolio_sections" ON portfolio_sections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for gallery_items" ON gallery_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for projects" ON projects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for experiences" ON experiences
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for experience_positions" ON experience_positions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for portfolio_assets" ON portfolio_assets
  FOR SELECT USING (is_active = true);

-- Create policies for authenticated users (for admin dashboard)
CREATE POLICY "Authenticated users can manage portfolio_sections" ON portfolio_sections
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage gallery_items" ON gallery_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage experiences" ON experiences
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage experience_positions" ON experience_positions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage portfolio_assets" ON portfolio_assets
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public read access for assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated'); 