import { getTableForSection } from './supabaseAdmin.js';

/**
 * Get the main parent row id for a section (first row with languageCode 'en', isActive true).
 * For sections with multiple rows (e.g. education), index can be used.
 */
export async function getSectionParentId(supabase, section, index = 0) {
  const table = getTableForSection(section);
  if (!table) throw new Error(`Unknown section: ${section}`);
  const { data: rows, error } = await supabase
    .from(table)
    .select('id')
    .eq('languageCode', 'en')
    .eq('isActive', true)
    .order('id');
  if (error || !rows?.length) throw new Error(`Section ${section} parent not found`);
  const row = rows[index];
  if (!row) throw new Error(`Section ${section} row index ${index} not found`);
  return row.id;
}

/**
 * Config for section child tables.
 * Home (and other tables) use camelCase in Supabase (homeId, orgUrl, orgColor, etc.).
 */
export const SECTION_ITEMS_CONFIG = {
  home: {
    parentTable: 'home',
    children: {
      organizations: { table: 'home_organizations', fk: 'homeId', fields: ['name', 'orgUrl', 'orgColor', 'orgPortfolioUrl'] },
      qualities: { table: 'home_qualities', fk: 'homeId', fields: ['attribute', 'description'] },
    },
  },
  about: {
    parentTable: 'about',
    children: {
      skills: { table: 'about_skills', fk: 'aboutId', fields: ['skill'] },
      interests: { table: 'about_interests', fk: 'aboutId', fields: ['interest'] },
    },
  },
  awards: {
    parentTable: 'awards',
    children: {
      items: { table: 'awards_items', fk: 'awardsId', fields: ['title', 'organization', 'date', 'description'] },
    },
  },
  education: {
    parentTable: 'education',
    children: {
      items: {
        table: 'education_items',
        fk: 'educationId',
        fields: ['name', 'nameUrl', 'educationType', 'schoolType', 'major', 'completionDate', 'description', 'gpa', 'educationImageUrl'],
      },
    },
  },
  experience: {
    parentTable: 'experience',
    children: {
      professional: { table: 'experience_professional', fk: 'experienceId', fields: ['company', 'companyUrl', 'location'] },
      leadership: { table: 'experience_leadership', fk: 'experienceId', fields: ['company', 'companyUrl', 'location'] },
    },
  },
  gallery: {
    parentTable: 'gallery',
    children: {}, // gallery rows are the "items"; categories are nested. Handled separately.
  },
  projects: {
    parentTable: 'projects',
    children: {
      items: { table: 'project_items', fk: 'projectsId', fields: ['title', 'date', 'description', 'githubUrl', 'liveUrl', 'imageUrl'] },
    },
  },
};

/** Nested child tables (child of a child). Column names lowercase to match PostgreSQL. */
export const NESTED_ITEMS_CONFIG = {
  education_items: {
    courses: { table: 'education_relevant_courses', fk: 'educationItemId', fields: ['course', 'courseurl'] },
    involvement: { table: 'education_organization_involvement', fk: 'educationItemId', fields: ['organization', 'role'] },
  },
  experience_professional: {
    positions: {
      table: 'experience_professional_positions',
      fk: 'professionalId',
      fields: ['position', 'startDate', 'endDate', 'responsibilities', 'skills', 'images'],
    },
  },
  experience_leadership: {
    positions: {
      table: 'experience_leadership_positions',
      fk: 'leadershipId',
      fields: ['position', 'startDate', 'endDate', 'responsibilities', 'skills', 'images'],
    },
  },
  project_items: {
    technologies: { table: 'project_technologies', fk: 'projectItemId', fields: ['technology'] },
    highlights: { table: 'project_highlights', fk: 'projectItemId', fields: ['highlight'] },
  },
  gallery: {
    categories: { table: 'gallery_categories', fk: 'galleryId', fields: ['categoryName'] },
  },
};
