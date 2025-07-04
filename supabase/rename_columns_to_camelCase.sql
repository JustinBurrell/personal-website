-- SQL to rename all columns in your Supabase tables from snake_case to camelCase (with double quotes for new names)

-- about
ALTER TABLE about RENAME COLUMN language_code TO "languageCode";
ALTER TABLE about RENAME COLUMN imageurl TO "imageUrl";
ALTER TABLE about RENAME COLUMN is_active TO "isActive";
ALTER TABLE about RENAME COLUMN created_at TO "createdAt";

-- about_interests
ALTER TABLE about_interests RENAME COLUMN about_id TO "aboutId";

-- about_skills
ALTER TABLE about_skills RENAME COLUMN about_id TO "aboutId";

-- awards
ALTER TABLE awards RENAME COLUMN language_code TO "languageCode";
ALTER TABLE awards RENAME COLUMN awardimageurl TO "awardImageUrl";
ALTER TABLE awards RENAME COLUMN is_active TO "isActive";
ALTER TABLE awards RENAME COLUMN created_at TO "createdAt";

-- awards_items
ALTER TABLE awards_items RENAME COLUMN awards_id TO "awardsId";

-- education
ALTER TABLE education RENAME COLUMN language_code TO "languageCode";
ALTER TABLE education RENAME COLUMN educationimageurl TO "educationImageUrl";
ALTER TABLE education RENAME COLUMN is_active TO "isActive";
ALTER TABLE education RENAME COLUMN created_at TO "createdAt";

-- education_items
ALTER TABLE education_items RENAME COLUMN education_id TO "educationId";
ALTER TABLE education_items RENAME COLUMN nameurl TO "nameUrl";
ALTER TABLE education_items RENAME COLUMN education_type TO "educationType";
ALTER TABLE education_items RENAME COLUMN school_type TO "schoolType";
ALTER TABLE education_items RENAME COLUMN completiondate TO "completionDate";
ALTER TABLE education_items RENAME COLUMN educationimageurl TO "educationImageUrl";

-- education_organization_involvement
ALTER TABLE education_organization_involvement RENAME COLUMN education_item_id TO "educationItemId";

-- education_relevant_courses
ALTER TABLE education_relevant_courses RENAME COLUMN education_item_id TO "educationItemId";
ALTER TABLE education_relevant_courses RENAME COLUMN courseurl TO "courseUrl";

-- experience
ALTER TABLE experience RENAME COLUMN language_code TO "languageCode";
ALTER TABLE experience RENAME COLUMN experienceimageurl TO "experienceImageUrl";
ALTER TABLE experience RENAME COLUMN is_active TO "isActive";
ALTER TABLE experience RENAME COLUMN created_at TO "createdAt";

-- experience_leadership
ALTER TABLE experience_leadership RENAME COLUMN experience_id TO "experienceId";
ALTER TABLE experience_leadership RENAME COLUMN companyurl TO "companyUrl";

-- experience_leadership_positions
ALTER TABLE experience_leadership_positions RENAME COLUMN leadership_id TO "leadershipId";
ALTER TABLE experience_leadership_positions RENAME COLUMN startdate TO "startDate";
ALTER TABLE experience_leadership_positions RENAME COLUMN enddate TO "endDate";

-- experience_professional
ALTER TABLE experience_professional RENAME COLUMN experience_id TO "experienceId";
ALTER TABLE experience_professional RENAME COLUMN companyurl TO "companyUrl";

-- experience_professional_positions
ALTER TABLE experience_professional_positions RENAME COLUMN professional_id TO "professionalId";
ALTER TABLE experience_professional_positions RENAME COLUMN startdate TO "startDate";
ALTER TABLE experience_professional_positions RENAME COLUMN enddate TO "endDate";

-- gallery
ALTER TABLE gallery RENAME COLUMN language_code TO "languageCode";
ALTER TABLE gallery RENAME COLUMN imageurl TO "imageUrl";
ALTER TABLE gallery RENAME COLUMN sort_order TO "sortOrder";
ALTER TABLE gallery RENAME COLUMN is_active TO "isActive";
ALTER TABLE gallery RENAME COLUMN created_at TO "createdAt";

-- gallery_categories
ALTER TABLE gallery_categories RENAME COLUMN gallery_id TO "galleryId";
ALTER TABLE gallery_categories RENAME COLUMN categoryname TO "categoryName";

-- home
ALTER TABLE home RENAME COLUMN language_code TO "languageCode";
ALTER TABLE home RENAME COLUMN imageurl TO "imageUrl";
ALTER TABLE home RENAME COLUMN resumeurl TO "resumeUrl";
ALTER TABLE home RENAME COLUMN linkedinurl TO "linkedinUrl";
ALTER TABLE home RENAME COLUMN githuburl TO "githubUrl";
ALTER TABLE home RENAME COLUMN is_active TO "isActive";
ALTER TABLE home RENAME COLUMN created_at TO "createdAt";

-- home_organizations
ALTER TABLE home_organizations RENAME COLUMN home_id TO "homeId";
ALTER TABLE home_organizations RENAME COLUMN orgurl TO "orgUrl";
ALTER TABLE home_organizations RENAME COLUMN orgcolor TO "orgColor";
ALTER TABLE home_organizations RENAME COLUMN orgportfoliourl TO "orgPortfolioUrl";

-- home_qualities
ALTER TABLE home_qualities RENAME COLUMN home_id TO "homeId";

-- portfolio_sections
ALTER TABLE portfolio_sections RENAME COLUMN section_name TO "sectionName";
ALTER TABLE portfolio_sections RENAME COLUMN display_name TO "displayName";
ALTER TABLE portfolio_sections RENAME COLUMN is_enabled TO "isEnabled";
ALTER TABLE portfolio_sections RENAME COLUMN sort_order TO "sortOrder";
ALTER TABLE portfolio_sections RENAME COLUMN created_at TO "createdAt";
ALTER TABLE portfolio_sections RENAME COLUMN updated_at TO "updatedAt";

-- project_highlights
ALTER TABLE project_highlights RENAME COLUMN project_item_id TO "projectItemId";

-- project_items
ALTER TABLE project_items RENAME COLUMN projects_id TO "projectsId";
ALTER TABLE project_items RENAME COLUMN githuburl TO "githubUrl";
ALTER TABLE project_items RENAME COLUMN liveurl TO "liveUrl";
ALTER TABLE project_items RENAME COLUMN imageurl TO "imageUrl";

-- project_technologies
ALTER TABLE project_technologies RENAME COLUMN project_item_id TO "projectItemId";

-- projects
ALTER TABLE projects RENAME COLUMN language_code TO "languageCode";
ALTER TABLE projects RENAME COLUMN projectimageurl TO "projectImageUrl";
ALTER TABLE projects RENAME COLUMN is_active TO "isActive";
ALTER TABLE projects RENAME COLUMN created_at TO "createdAt"; 