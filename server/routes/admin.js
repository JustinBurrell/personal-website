import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireAdmin } from '../middleware/requireAuth.js';
import { updateSectionRow, updateSectionRowById, getTableForSection, camelToSnakeKeys } from '../lib/supabaseAdmin.js';
import { getSectionParentId, SECTION_ITEMS_CONFIG, NESTED_ITEMS_CONFIG } from '../lib/sectionConfig.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

/** Get value from payload for DB column name (payload has snake_case keys; dbColumn is camelCase from config). */
function payloadValueForDbColumn(payload, dbColumn) {
  if (payload[dbColumn] !== undefined) return payload[dbColumn];
  const normalized = (dbColumn || '').replace(/_/g, '').toLowerCase();
  const snakeKey = Object.keys(payload).find((k) => k.replace(/_/g, '').toLowerCase() === normalized);
  return snakeKey !== undefined ? payload[snakeKey] : undefined;
}

/** Ensure image URL is stored as full Supabase public URL so it always displays. If already full URL, return as-is; if path only, prepend SUPABASE_URL base. */
function ensureFullStorageUrl(value) {
  if (value == null || typeof value !== 'string') return value;
  const s = value.trim();
  if (!s) return s;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  const path = s.startsWith('assets/') ? s : `assets/${s}`;
  const base = process.env.SUPABASE_URL || '';
  if (!base) return s;
  const pathEncoded = path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/assets/${pathEncoded}`;
}

/** Return storage path for removal (bucket "assets" object key). Handles full URL or path. Decodes URL-encoded segments so the key matches storage. */
function storagePathForRemoval(value) {
  if (value == null || typeof value !== 'string') return null;
  const s = value.trim();
  const match = s.match(/\/storage\/v1\/object\/public\/assets\/(.+)$/);
  if (match) {
    let after = match[1];
    try {
      after = decodeURIComponent(after);
    } catch (_) {
      // keep as-is if decoding fails
    }
    return after.startsWith('assets/') ? after : `assets/${after}`;
  }
  return s.startsWith('assets/') ? s : `assets/${s}`;
}

export const adminRouter = Router();

// All admin routes require auth and admin
adminRouter.use(requireAuth, requireAdmin);

/** GET /api/admin/emails — list contact form emails (first name, last name, subject, message, date/time). */
adminRouter.get('/emails', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { data, error } = await supabase
      .from('emails')
      .select('id, first_name, last_name, email, subject, message, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Admin GET emails error:', err);
    res.status(500).json({ error: err.message || 'Failed' });
  }
});

/** DELETE /api/admin/emails/:id — delete one email by id (uuid). */
adminRouter.delete('/emails/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { id } = req.params;
    const { error } = await supabase.from('emails').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Admin DELETE email error:', err);
    res.status(500).json({ error: err.message || 'Failed' });
  }
});

adminRouter.get('/sections', (req, res) => {
  res.json({
    sections: ['home', 'about', 'awards', 'education', 'experience', 'gallery', 'projects'],
  });
});

/**
 * Gallery: list all gallery rows (each row is an item). Must be before /sections/:section/items.
 */
adminRouter.get('/sections/gallery/rows', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { data, error } = await supabase.from('gallery').select('*, gallery_categories(*)').eq('languageCode', 'en').eq('isActive', true).order('sortOrder', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Admin GET gallery rows error:', err);
    res.status(500).json({ error: err.message || 'Failed' });
  }
});

adminRouter.post('/sections/gallery/rows', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const payload = {
      title: '',
      description: '',
      imageUrl: '',
      sortOrder: 0,
      ...req.body,
      languageCode: 'en',
      isActive: true,
    };
    const { data, error } = await supabase.from('gallery').insert(payload).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Admin POST gallery row error:', err);
    res.status(500).json({ error: err.message || 'Create failed' });
  }
});

adminRouter.patch('/sections/gallery/rows/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const updated = await updateSectionRowById(supabase, 'gallery', req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Admin PATCH gallery row error:', err);
    res.status(500).json({ error: err.message || 'Update failed' });
  }
});

adminRouter.delete('/sections/gallery/rows/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { data: row, error: fetchErr } = await supabase.from('gallery').select('id, imageUrl, image_url').eq('id', req.params.id).single();
    if (!fetchErr && row) {
      const url = row.imageUrl ?? row.image_url;
      const path = storagePathForRemoval(url);
      if (path) {
        const { error: storageErr } = await supabase.storage.from('assets').remove([path]);
        if (storageErr) console.error('Gallery storage delete (non-fatal):', storageErr.message);
      }
    }
    const { error } = await supabase.from('gallery').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Admin DELETE gallery row error:', err);
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

/**
 * PATCH /api/admin/sections/:section
 * Body: partial section row (camelCase ok). Updates the first main row for languageCode 'en'.
 */
adminRouter.patch('/sections/:section', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { section } = req.params;
    if (!getTableForSection(section)) return res.status(400).json({ error: `Unknown section: ${section}` });
    const body = { ...req.body };
    ['educationImageUrl', 'imageUrl', 'awardImageUrl', 'experienceImageUrl', 'education_image_url', 'image_url', 'award_image_url', 'experience_image_url'].forEach((k) => {
      if (body[k] && typeof body[k] === 'string') body[k] = ensureFullStorageUrl(body[k]);
    });
    const updated = await updateSectionRow(supabase, section, body);
    res.json(updated);
  } catch (err) {
    console.error('Admin PATCH section error:', err);
    res.status(err.message?.includes('not found') ? 404 : 500).json({ error: err.message || 'Update failed' });
  }
});

/**
 * PATCH /api/admin/sections/:section/rows/:id
 * Update a specific main row by id (education, gallery, awards when multiple rows).
 */
adminRouter.patch('/sections/:section/rows/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const table = getTableForSection(req.params.section);
    if (!table) return res.status(400).json({ error: 'Unknown section' });
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const body = { ...req.body };
    ['educationImageUrl', 'imageUrl', 'awardImageUrl', 'experienceImageUrl', 'education_image_url', 'image_url', 'award_image_url', 'experience_image_url'].forEach((k) => {
      if (body[k] && typeof body[k] === 'string') body[k] = ensureFullStorageUrl(body[k]);
    });
    const updated = await updateSectionRowById(supabase, table, id, body);
    res.json(updated);
  } catch (err) {
    console.error('Admin PATCH row error:', err);
    res.status(500).json({ error: err.message || 'Update failed' });
  }
});

/**
 * GET /api/admin/sections/:section/items?itemType=skills
 * List child items. itemType required for about (skills|interests), home (organizations|qualities), experience (professional|leadership).
 */
adminRouter.get('/sections/:section/items', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { section } = req.params;
    const itemType = req.query.itemType || (SECTION_ITEMS_CONFIG[section]?.children?.items ? 'items' : Object.keys(SECTION_ITEMS_CONFIG[section]?.children || {})[0]);
    const config = SECTION_ITEMS_CONFIG[section];
    if (!config?.children?.[itemType]) return res.status(400).json({ error: `Unknown section or itemType: ${section}/${itemType}` });
    const { table, fk } = config.children[itemType];
    const parentId = req.query.parentId ? parseInt(req.query.parentId, 10) : await getSectionParentId(supabase, section);
    const select = section === 'projects' && itemType === 'items'
      ? '*, project_technologies(*), project_highlights(*)'
      : '*';
    const { data, error } = await supabase.from(table).select(select).eq(fk, parentId).order('id');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Admin GET items error:', err);
    res.status(500).json({ error: err.message || 'Failed' });
  }
});

/**
 * POST /api/admin/sections/:section/items
 * Body: item fields (camelCase) + optional itemType (about: skills|interests, home: organizations|qualities, experience: professional|leadership), optional education_id for education.
 */
adminRouter.post('/sections/:section/items', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { section } = req.params;
    const itemType = req.body.itemType || (SECTION_ITEMS_CONFIG[section]?.children?.items ? 'items' : Object.keys(SECTION_ITEMS_CONFIG[section]?.children || {})[0]);
    const config = SECTION_ITEMS_CONFIG[section];
    if (!config?.children?.[itemType]) return res.status(400).json({ error: `Unknown section or itemType: ${section}/${itemType}` });
    const { table, fk, fields } = config.children[itemType];
    let parentId = req.body.education_id ?? req.body.parentId;
    if (parentId == null) parentId = await getSectionParentId(supabase, section);
    const body = { ...req.body };
    delete body.itemType;
    delete body.education_id;
    delete body.parentId;
    const payload = camelToSnakeKeys(body);
    const insert = { [fk]: parentId };
    const imageFields = ['educationImageUrl', 'imageUrl', 'imageurl', 'awardImageUrl'];
    for (const f of fields) {
      let val = payloadValueForDbColumn(payload, f);
      if (val !== undefined && imageFields.includes(f) && typeof val === 'string') val = ensureFullStorageUrl(val);
      if (val !== undefined) insert[f] = val;
    }
    if (section === 'education' && itemType === 'items') {
      insert.educationType = insert.educationType ?? payload.education_type ?? body.educationType ?? body.education_type ?? 'School';
    }
    const { data, error } = await supabase.from(table).insert(insert).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Admin POST item error:', err);
    res.status(500).json({ error: err.message || 'Create failed' });
  }
});

/**
 * PATCH /api/admin/sections/:section/items/:id
 */
adminRouter.patch('/sections/:section/items/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { section, id } = req.params;
    const itemType = req.body.itemType || (SECTION_ITEMS_CONFIG[section]?.children?.items ? 'items' : Object.keys(SECTION_ITEMS_CONFIG[section]?.children || {})[0]);
    const config = SECTION_ITEMS_CONFIG[section];
    if (!config?.children?.[itemType]) return res.status(400).json({ error: 'Unknown section or itemType' });
    const { table, fields } = config.children[itemType];
    const body = { ...req.body };
    delete body.itemType;
    const payload = camelToSnakeKeys(body);
    const update = {};
    const imageFields = ['educationImageUrl', 'imageUrl', 'imageurl', 'awardImageUrl'];
    for (const f of fields) {
      let val = body[f] ?? payloadValueForDbColumn(payload, f);
      if (val !== undefined && imageFields.includes(f) && typeof val === 'string') val = ensureFullStorageUrl(val);
      if (val !== undefined) update[f] = val;
    }
    if (Object.keys(update).length === 0) return res.status(400).json({ error: 'No fields to update' });
    if (section === 'education' && itemType === 'items' && (body.educationType ?? body.education_type) !== undefined) {
      update.educationType = body.educationType ?? body.education_type ?? update.educationType;
    }
    const { data, error } = await supabase.from(table).update(update).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Admin PATCH item error:', err);
    res.status(500).json({ error: err.message || 'Update failed' });
  }
});

/**
 * DELETE /api/admin/sections/:section/items/:id
 * If the item has an image field (educationImageUrl, imageUrl, awardImageUrl), deletes that file from storage first.
 */
adminRouter.delete('/sections/:section/items/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { section, id } = req.params;
    const itemType = req.query.itemType || (SECTION_ITEMS_CONFIG[section]?.children?.items ? 'items' : Object.keys(SECTION_ITEMS_CONFIG[section]?.children || {})[0]);
    const config = SECTION_ITEMS_CONFIG[section];
    if (!config?.children?.[itemType]) return res.status(400).json({ error: 'Unknown section or itemType' });
    const { table, fields } = config.children[itemType];
    const imageField = ['educationImageUrl', 'imageUrl', 'imageurl', 'awardImageUrl'].find((f) => fields.includes(f));
    if (imageField) {
      const { data: row, error: fetchErr } = await supabase.from(table).select('id, educationImageUrl, education_image_url, imageUrl, image_url, imageurl, awardImageUrl, award_image_url').eq('id', id).single();
      if (!fetchErr && row) {
        const url = row.educationImageUrl ?? row.education_image_url ?? row.imageUrl ?? row.image_url ?? row.imageurl ?? row.awardImageUrl ?? row.award_image_url;
        const path = storagePathForRemoval(url);
        if (path) {
          const { error: storageErr } = await supabase.storage.from('assets').remove([path]);
          if (storageErr) console.error('Storage delete (non-fatal):', storageErr.message);
        }
      }
    }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Admin DELETE item error:', err);
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

/**
 * GET/POST/DELETE nested items (e.g. gallery_categories for a gallery row, positions for experience_professional).
 * GET /api/admin/sections/:section/nested/:parentTable/:parentId/:nestedType
 * POST body: nested item fields. DELETE /nested/:parentTable/:parentId/:nestedType/:id
 */
adminRouter.get('/sections/:section/nested/:parentTable/:parentId/:nestedType', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { parentTable, parentId, nestedType } = req.params;
    const config = NESTED_ITEMS_CONFIG[parentTable]?.[nestedType];
    if (!config) return res.status(400).json({ error: 'Unknown nested type' });
    const fk = config.fk;
    const { data, error } = await supabase.from(config.table).select('*').eq(fk, parentId);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Admin GET nested error:', err);
    res.status(500).json({ error: err.message || 'Failed' });
  }
});

function toDbPayload(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/_/g, '').toLowerCase(), v])
  );
}

adminRouter.post('/sections/:section/nested/:parentTable/:parentId/:nestedType', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { parentTable, parentId, nestedType } = req.params;
    const config = NESTED_ITEMS_CONFIG[parentTable]?.[nestedType];
    if (!config) return res.status(400).json({ error: 'Unknown nested type' });
    const body = req.body || {};
    const payload = toDbPayload(camelToSnakeKeys(body));
    const insert = { [config.fk]: parentId };
    for (const f of config.fields) {
      const val = body[f] ?? payload[f] ?? payload[f.replace(/_/g, '')];
      if (val !== undefined) insert[f] = val;
    }
    const { data, error } = await supabase.from(config.table).insert(insert).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Admin POST nested error:', err);
    res.status(500).json({ error: err.message || 'Create failed' });
  }
});

adminRouter.patch('/sections/:section/nested/:parentTable/:parentId/:nestedType/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { parentTable, nestedType, id } = req.params;
    const config = NESTED_ITEMS_CONFIG[parentTable]?.[nestedType];
    if (!config) return res.status(400).json({ error: 'Unknown nested type' });
    const body = req.body || {};
    const payload = toDbPayload(camelToSnakeKeys(body));
    const update = {};
    for (const f of config.fields) {
      const val = body[f] ?? payload[f] ?? payload[f.replace(/_/g, '')];
      if (val !== undefined) update[f] = val;
    }
    if (Object.keys(update).length === 0) return res.status(400).json({ error: 'No fields to update' });
    const { data, error } = await supabase.from(config.table).update(update).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Admin PATCH nested error:', err);
    res.status(500).json({ error: err.message || 'Update failed' });
  }
});

adminRouter.delete('/sections/:section/nested/:parentTable/:parentId/:nestedType/:id', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });
    const { parentTable, nestedType, id } = req.params;
    const config = NESTED_ITEMS_CONFIG[parentTable]?.[nestedType];
    if (!config) return res.status(400).json({ error: 'Unknown nested type' });
    const { error } = await supabase.from(config.table).delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Admin DELETE nested error:', err);
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

/**
 * GET /api/admin/storage/list?prefix=images/home
 * List files in the assets bucket under the given prefix. Returns { files: [{ name, path, url }] }.
 */
adminRouter.get('/storage/list', async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Storage not configured' });
    let prefix = (req.query.prefix || '').replace(/^\/+|\/+/g, '/').replace(/\.\./g, '').trim();
    if (prefix && !prefix.startsWith('assets/')) prefix = `assets/${prefix}`;
    if (!prefix) prefix = 'assets';
    const { data: list, error } = await supabase.storage.from('assets').list(prefix || 'assets', { limit: 200 });
    if (error) throw error;
    const baseUrl = process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/assets` : '';
    const pathPrefix = prefix ? `${prefix}/` : '';
    const files = (list || [])
      .filter((item) => item.name && item.metadata != null)
      .map((item) => {
        const path = pathPrefix + item.name;
        const pathEncoded = path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
        return { name: item.name, path, url: baseUrl ? `${baseUrl}/${pathEncoded}` : '' };
      });
    res.json({ files });
  } catch (err) {
    console.error('Admin storage list error:', err);
    res.status(500).json({ error: err.message || 'List failed' });
  }
});

/**
 * POST /api/admin/upload
 * Multipart: file (required), section, path (optional). path = storage path e.g. "home/hero.png"
 * Returns { path, url }.
 */
adminRouter.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Storage not configured' });

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const section = (req.body.section || 'misc').replace(/[^a-z0-9_-]/gi, '');
    const experienceType = (req.body.experienceType || '').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
    let customPath = req.body.path?.replace(/^\/+|\/+/g, '/').replace(/\.\./g, '');
    const ext = req.file.originalname?.split('.').pop() || 'bin';
    const safeName = `${Date.now()}.${ext}`;
    // All uploads go inside the assets folder in the bucket. Path = assets/images/... so we never create a top-level "images" folder.
    const assetsPrefix = 'assets/';
    if (section === 'education') {
      const basename = customPath
        ? customPath.replace(/^assets\/images\/education\/?/, '').replace(/^images\/education\/?/, '').replace(/^education\/?/, '') || safeName
        : safeName;
      customPath = `${assetsPrefix}images/education/${basename}`;
    } else if (section === 'gallery') {
      const basename = customPath
        ? customPath.replace(/^assets\/images\/gallery\/?/, '').replace(/^images\/gallery\/?/, '').replace(/^gallery\/?/, '') || safeName
        : safeName;
      customPath = `${assetsPrefix}images/gallery/${basename}`;
    } else if (section === 'experience') {
      if (experienceType === 'professional' || experienceType === 'leadership') {
        customPath = `${assetsPrefix}images/experiences/${experienceType}/${safeName}`;
      } else {
        const basename = customPath
          ? customPath.replace(/^assets\/images\/home\/?/, '').replace(/^images\/home\/?/, '').replace(/^home\/?/, '') || safeName
          : safeName;
        customPath = `${assetsPrefix}images/home/${basename}`;
      }
    } else if (section === 'projects') {
      const basename = customPath
        ? customPath.replace(/^assets\/images\/projects\/?/, '').replace(/^images\/projects\/?/, '').replace(/^projects\/?/, '') || safeName
        : safeName;
      customPath = `${assetsPrefix}images/projects/${basename}`;
    } else {
      customPath = customPath ? (customPath.startsWith('assets/') ? customPath : `${assetsPrefix}${customPath}`) : `${assetsPrefix}${section}/${safeName}`;
    }
    const path = customPath || `${assetsPrefix}${section}/${safeName}`;

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) throw error;

    const pathEncoded = data.path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${pathEncoded}`;
    res.json({ path: data.path, url });
  } catch (err) {
    console.error('Admin upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});
