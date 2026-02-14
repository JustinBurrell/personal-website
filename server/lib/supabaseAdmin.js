/**
 * Convert camelCase keys to snake_case (one level, for DB columns)
 */
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function camelToSnakeKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnakeKeys);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [toSnakeCase(k), camelToSnakeKeys(v)])
  );
}

/** Convert payload keys to PostgreSQL column names (lowercase, no underscores). */
function toDbKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toDbKeys);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/_/g, '').toLowerCase(), toDbKeys(v)])
  );
}

const SECTION_TABLE = {
  home: 'home',
  about: 'about',
  awards: 'awards',
  education: 'education',
  experience: 'experience',
  gallery: 'gallery',
  projects: 'projects',
};

export function getTableForSection(section) {
  return SECTION_TABLE[section] || null;
}

/** One-level lowercase of object keys so Supabase/Postgres see columns as stored (lowercase). */
export function keysToLowerCase(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [typeof k === 'string' ? k.toLowerCase() : k, v])
  );
}

/**
 * Update the main row for a section (e.g. home, about).
 * Section is expected to have a single active row for languageCode 'en'.
 * Passes body through as-is so camelCase column names (experienceImageUrl, etc.) match schema.
 */
export async function updateSectionRow(supabase, section, body) {
  const table = getTableForSection(section);
  if (!table) throw new Error(`Unknown section: ${section}`);

  const { data: row, error: fetchError } = await supabase
    .from(table)
    .select('id')
    .eq('languageCode', 'en')
    .eq('isActive', true)
    .limit(1)
    .single();

  if (fetchError || !row) {
    throw new Error(`Section ${section} row not found`);
  }

  const payload = body && typeof body === 'object' ? body : {};
  const { data: updated, error: updateError } = await supabase
    .from(table)
    .update(payload)
    .eq('id', row.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return updated;
}

/**
 * Update a specific row by id (for sections with multiple rows, e.g. education, gallery).
 * Passes body through as-is so camelCase column names match schema.
 */
export async function updateSectionRowById(supabase, table, rowId, body) {
  const payload = body && typeof body === 'object' ? body : {};
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', rowId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
