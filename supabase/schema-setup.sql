-- Drop all portfolio tables (except portfolio_sections)
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

-- HOME
CREATE TABLE home (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  imageUrl VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  resumeUrl VARCHAR(500) NOT NULL,
  linkedinUrl VARCHAR(500) NOT NULL,
  githubUrl VARCHAR(500) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE home_organizations (
  id SERIAL PRIMARY KEY,
  home_id INTEGER REFERENCES home(id) ON DELETE CASCADE,
  name VARCHAR(255),
  orgUrl VARCHAR(500),
  orgColor VARCHAR(50),
  orgPortfolioUrl VARCHAR(500)
);

CREATE TABLE home_qualities (
  id SERIAL PRIMARY KEY,
  home_id INTEGER REFERENCES home(id) ON DELETE CASCADE,
  attribute VARCHAR(255),
  description TEXT
);

-- ABOUT
CREATE TABLE about (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  imageUrl VARCHAR(500) NOT NULL,
  introduction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE about_skills (
  id SERIAL PRIMARY KEY,
  about_id INTEGER REFERENCES about(id) ON DELETE CASCADE,
  skill VARCHAR(100)
);

CREATE TABLE about_interests (
  id SERIAL PRIMARY KEY,
  about_id INTEGER REFERENCES about(id) ON DELETE CASCADE,
  interest VARCHAR(100)
);

-- AWARDS
CREATE TABLE awards (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  awardImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE awards_items (
  id SERIAL PRIMARY KEY,
  awards_id INTEGER REFERENCES awards(id) ON DELETE CASCADE,
  title VARCHAR(255),
  organization VARCHAR(255),
  date VARCHAR(50),
  description TEXT
);

-- EDUCATION
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  educationImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE education_items (
  id SERIAL PRIMARY KEY,
  education_id INTEGER REFERENCES education(id) ON DELETE CASCADE,
  name VARCHAR(255),
  nameUrl VARCHAR(500),
  education_type VARCHAR(100),
  school_type VARCHAR(100),
  major VARCHAR(100),
  completionDate VARCHAR(50),
  description TEXT,
  gpa VARCHAR(10),
  educationImageUrl VARCHAR(500)
);

CREATE TABLE education_relevant_courses (
  id SERIAL PRIMARY KEY,
  education_item_id INTEGER REFERENCES education_items(id) ON DELETE CASCADE,
  course VARCHAR(255),
  courseUrl VARCHAR(500)
);

CREATE TABLE education_organization_involvement (
  id SERIAL PRIMARY KEY,
  education_item_id INTEGER REFERENCES education_items(id) ON DELETE CASCADE,
  organization VARCHAR(255),
  role VARCHAR(255)
);

-- EXPERIENCE
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  experienceImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE experience_professional (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experience(id) ON DELETE CASCADE,
  company VARCHAR(255),
  companyUrl VARCHAR(500),
  location VARCHAR(255)
);

CREATE TABLE experience_professional_positions (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES experience_professional(id) ON DELETE CASCADE,
  position VARCHAR(255),
  startDate VARCHAR(50),
  endDate VARCHAR(50),
  responsibilities JSONB,
  skills JSONB,
  images JSONB
);

CREATE TABLE experience_leadership (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experience(id) ON DELETE CASCADE,
  company VARCHAR(255),
  companyUrl VARCHAR(500),
  location VARCHAR(255)
);

CREATE TABLE experience_leadership_positions (
  id SERIAL PRIMARY KEY,
  leadership_id INTEGER REFERENCES experience_leadership(id) ON DELETE CASCADE,
  position VARCHAR(255),
  startDate VARCHAR(50),
  endDate VARCHAR(50),
  responsibilities JSONB,
  skills JSONB,
  images JSONB
);

-- GALLERY
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  title VARCHAR(255) NOT NULL,
  imageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gallery_categories (
  id SERIAL PRIMARY KEY,
  gallery_id INTEGER REFERENCES gallery(id) ON DELETE CASCADE,
  categoryName VARCHAR(255)
);

-- PROJECTS
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  language_code VARCHAR(10) DEFAULT 'en',
  projectImageUrl VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_items (
  id SERIAL PRIMARY KEY,
  projects_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255),
  date VARCHAR(50),
  description TEXT,
  githubUrl VARCHAR(500),
  liveUrl VARCHAR(500),
  imageUrl VARCHAR(500)
);

CREATE TABLE project_technologies (
  id SERIAL PRIMARY KEY,
  project_item_id INTEGER REFERENCES project_items(id) ON DELETE CASCADE,
  technology VARCHAR(100)
);

CREATE TABLE project_highlights (
  id SERIAL PRIMARY KEY,
  project_item_id INTEGER REFERENCES project_items(id) ON DELETE CASCADE,
  highlight TEXT
);