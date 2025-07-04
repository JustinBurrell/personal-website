-- Simplified Portfolio Schema
-- This approach uses fewer tables and is more API-friendly

-- Drop existing tables
DROP TABLE IF EXISTS home_qualities CASCADE;
DROP TABLE IF EXISTS home_organizations CASCADE;
DROP TABLE IF EXISTS about_skills CASCADE;
DROP TABLE IF EXISTS about_interests CASCADE;
DROP TABLE IF EXISTS awards_items CASCADE;
DROP TABLE IF EXISTS education_relevant_courses CASCADE;
DROP TABLE IF EXISTS education_organization_involvement CASCADE;
DROP TABLE IF EXISTS education_items CASCADE;
DROP TABLE IF EXISTS experience_professional_positions CASCADE;
DROP TABLE IF EXISTS experience_professional CASCADE;
DROP TABLE IF EXISTS experience_leadership_positions CASCADE;
DROP TABLE IF EXISTS experience_leadership CASCADE;
DROP TABLE IF EXISTS gallery_categories CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS project_highlights CASCADE;
DROP TABLE IF EXISTS project_technologies CASCADE;
DROP TABLE IF EXISTS project_items CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS about CASCADE;
DROP TABLE IF EXISTS home CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS experience CASCADE;

-- Simplified schema with JSONB for complex nested data
CREATE TABLE portfolio_sections (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(50) NOT NULL,
  language_code VARCHAR(10) DEFAULT 'en',
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name, language_code)
);

-- Create indexes for better performance
CREATE INDEX idx_portfolio_sections_section_name ON portfolio_sections(section_name);
CREATE INDEX idx_portfolio_sections_language ON portfolio_sections(language_code);
CREATE INDEX idx_portfolio_sections_active ON portfolio_sections(is_active);
CREATE INDEX idx_portfolio_sections_content ON portfolio_sections USING GIN(content);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_sections_updated_at 
    BEFORE UPDATE ON portfolio_sections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data structure (you can populate this with your actual data)
INSERT INTO portfolio_sections (section_name, language_code, content) VALUES
('home', 'en', '{
  "imageUrl": "/assets/images/home/FLOC Headshot.jpeg",
  "title": "Hi, I''m Justin Burrell.",
  "description": "With a passion for technology and a knack for problem-solving, I aim to leverage my technical skills, consulting experience, and leadership background to drive innovation and create scalable solutions that make a positive impact.",
  "resumeUrl": "/assets/documents/Justin Burrell Resume.pdf",
  "linkedinUrl": "https://www.linkedin.com/in/thejustinburrell/",
  "githubUrl": "https://github.com/JustinBurrell",
  "email": "justinburrell715@gmail.com",
  "organizations": [
    {
      "name": "Kappa Alpha Psi Fraternity, Inc.",
      "orgUrl": "https://www.kappaalphapsi1911.com/",
      "orgColor": "crimson"
    }
  ],
  "qualities": [
    {
      "attribute": "Aspiring Software Engineer and Tech Consultant",
      "description": "Inspired by advancement in Artificial Intelligence and Software, I wish to pursue a tech career where I can lead and assist others in creating innovative products and services."
    }
  ]
}'),
('about', 'en', '{
  "imageUrl": "/assets/images/about/About Background Photo.jpg",
  "introduction": "Growing up in the Bronx, NY, I was always interested in technology...",
  "skills": ["Python", "Java", "JavaScript", "SQL", "C", "HTML", "CSS", "React"],
  "interests": ["New York Knicks", "Cooking", "Travel", "Hip Hop", "Software Engineering"]
}');

-- Create a view for easy access to all sections
CREATE VIEW portfolio_data AS
SELECT 
  language_code,
  jsonb_object_agg(section_name, content) as data
FROM portfolio_sections 
WHERE is_active = true
GROUP BY language_code;