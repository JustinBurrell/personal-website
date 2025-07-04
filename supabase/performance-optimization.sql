-- Performance Optimization for Portfolio Database
-- Add indexes for faster queries

-- Indexes for main tables
CREATE INDEX IF NOT EXISTS idx_home_language_active ON home(language_code, is_active);
CREATE INDEX IF NOT EXISTS idx_about_language_active ON about(language_code, is_active);
CREATE INDEX IF NOT EXISTS idx_awards_language_active ON awards(language_code, is_active);
CREATE INDEX IF NOT EXISTS idx_education_language_active ON education(language_code, is_active);
CREATE INDEX IF NOT EXISTS idx_experience_language_active ON experience(language_code, is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_language_active ON gallery(language_code, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_language_active ON projects(language_code, is_active);

-- Indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_home_organizations_home_id ON home_organizations(home_id);
CREATE INDEX IF NOT EXISTS idx_home_qualities_home_id ON home_qualities(home_id);
CREATE INDEX IF NOT EXISTS idx_about_skills_about_id ON about_skills(about_id);
CREATE INDEX IF NOT EXISTS idx_about_interests_about_id ON about_interests(about_id);
CREATE INDEX IF NOT EXISTS idx_awards_items_awards_id ON awards_items(awards_id);
CREATE INDEX IF NOT EXISTS idx_education_items_education_id ON education_items(education_id);
CREATE INDEX IF NOT EXISTS idx_education_courses_edu_item_id ON education_relevant_courses(education_item_id);
CREATE INDEX IF NOT EXISTS idx_education_orgs_edu_item_id ON education_organization_involvement(education_item_id);
CREATE INDEX IF NOT EXISTS idx_exp_professional_exp_id ON experience_professional(experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_prof_positions_prof_id ON experience_professional_positions(professional_id);
CREATE INDEX IF NOT EXISTS idx_exp_leadership_exp_id ON experience_leadership(experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_lead_positions_lead_id ON experience_leadership_positions(leadership_id);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_gallery_id ON gallery_categories(gallery_id);
CREATE INDEX IF NOT EXISTS idx_project_items_projects_id ON project_items(projects_id);
CREATE INDEX IF NOT EXISTS idx_project_tech_proj_item_id ON project_technologies(project_item_id);
CREATE INDEX IF NOT EXISTS idx_project_highlights_proj_item_id ON project_highlights(project_item_id);

-- Create a materialized view for faster data access
CREATE MATERIALIZED VIEW IF NOT EXISTS portfolio_data_view AS
SELECT 
  'home' as section,
  h.id,
  h.language_code,
  h.is_active,
  jsonb_build_object(
    'imageUrl', h.imageUrl,
    'title', h.title,
    'description', h.description,
    'resumeUrl', h.resumeUrl,
    'linkedinUrl', h.linkedinUrl,
    'githubUrl', h.githubUrl,
    'email', h.email,
    'organizations', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'name', ho.name,
          'orgUrl', ho.orgUrl,
          'orgColor', ho.orgColor,
          'orgPortfolioUrl', ho.orgPortfolioUrl
        )
      ) FILTER (WHERE ho.id IS NOT NULL), 
      '[]'::jsonb
    ),
    'qualities', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'attribute', hq.attribute,
          'description', hq.description
        )
      ) FILTER (WHERE hq.id IS NOT NULL), 
      '[]'::jsonb
    )
  ) as content
FROM home h
LEFT JOIN home_organizations ho ON h.id = ho.home_id
LEFT JOIN home_qualities hq ON h.id = hq.home_id
WHERE h.language_code = 'en' AND h.is_active = true
GROUP BY h.id, h.language_code, h.is_active

UNION ALL

SELECT 
  'about' as section,
  a.id,
  a.language_code,
  a.is_active,
  jsonb_build_object(
    'imageUrl', a.imageUrl,
    'introduction', a.introduction,
    'skills', COALESCE(
      jsonb_agg(DISTINCT abs.skill) FILTER (WHERE abs.skill IS NOT NULL), 
      '[]'::jsonb
    ),
    'interests', COALESCE(
      jsonb_agg(DISTINCT abi.interest) FILTER (WHERE abi.interest IS NOT NULL), 
      '[]'::jsonb
    )
  ) as content
FROM about a
LEFT JOIN about_skills abs ON a.id = abs.about_id
LEFT JOIN about_interests abi ON a.id = abi.about_id
WHERE a.language_code = 'en' AND a.is_active = true
GROUP BY a.id, a.language_code, a.is_active

UNION ALL

SELECT 
  'awards' as section,
  aw.id,
  aw.language_code,
  aw.is_active,
  jsonb_build_object(
    'awardImageUrl', aw.awardImageUrl,
    'description', aw.description,
    'award', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'title', awi.title,
          'organization', awi.organization,
          'date', awi.date,
          'description', awi.description
        )
      ) FILTER (WHERE awi.id IS NOT NULL), 
      '[]'::jsonb
    )
  ) as content
FROM awards aw
LEFT JOIN awards_items awi ON aw.id = awi.awards_id
WHERE aw.language_code = 'en' AND aw.is_active = true
GROUP BY aw.id, aw.language_code, aw.is_active;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_portfolio_data_view_section ON portfolio_data_view(section);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_portfolio_data_view()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW portfolio_data_view;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-refresh materialized view when data changes
CREATE OR REPLACE FUNCTION trigger_refresh_portfolio_view()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM refresh_portfolio_data_view();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all main tables
CREATE TRIGGER refresh_portfolio_view_home
  AFTER INSERT OR UPDATE OR DELETE ON home
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_refresh_portfolio_view();

CREATE TRIGGER refresh_portfolio_view_about
  AFTER INSERT OR UPDATE OR DELETE ON about
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_refresh_portfolio_view();

CREATE TRIGGER refresh_portfolio_view_awards
  AFTER INSERT OR UPDATE OR DELETE ON awards
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_refresh_portfolio_view();

-- Initial refresh
SELECT refresh_portfolio_data_view(); 