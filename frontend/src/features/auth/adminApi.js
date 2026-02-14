const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Call admin API with Bearer token.
 * @param {string} path - e.g. '/api/admin/sections/home'
 * @param {{ method?: string, body?: object, headers?: Record<string,string> }} options
 * @param {() => Promise<string|null>} getAccessToken
 */
export async function adminFetch(path, options = {}, getAccessToken) {
  const token = getAccessToken ? await getAccessToken() : null;
  if (!token) throw new Error('Not authenticated');

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers = { Authorization: `Bearer ${token}`, ...options.headers };
  if (options.body != null) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { ...options, headers, credentials: 'include' });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || res.statusText || `Request failed ${res.status}`);
  }
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export async function adminPatchSection(section, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}`, { method: 'PATCH', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminUploadFile(file, { section = 'misc', path, experienceType } = {}, getAccessToken) {
  const token = getAccessToken ? await getAccessToken() : null;
  if (!token) throw new Error('Not authenticated');

  const form = new FormData();
  form.append('file', file);
  form.append('section', section);
  if (path) form.append('path', path);
  if (experienceType) form.append('experienceType', experienceType);

  const url = `${API_BASE}/api/admin/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    credentials: 'include',
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || res.statusText || 'Upload failed');
  }
  return res.json();
}

export async function adminGetSectionItems(section, { itemType, parentId } = {}, getAccessToken) {
  const q = new URLSearchParams();
  if (itemType) q.set('itemType', itemType);
  if (parentId != null) q.set('parentId', parentId);
  const query = q.toString();
  return adminFetch(`/api/admin/sections/${section}/items${query ? `?${query}` : ''}`, {}, getAccessToken);
}

export async function adminPostSectionItem(section, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/items`, { method: 'POST', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminPatchSectionItem(section, itemId, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/items/${itemId}`, { method: 'PATCH', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminDeleteSectionItem(section, itemId, { itemType } = {}, getAccessToken) {
  const q = itemType ? `?itemType=${encodeURIComponent(itemType)}` : '';
  return adminFetch(`/api/admin/sections/${section}/items/${itemId}${q}`, { method: 'DELETE' }, getAccessToken);
}

export async function adminPatchSectionRow(section, rowId, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/rows/${rowId}`, { method: 'PATCH', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminGetGalleryRows(getAccessToken) {
  return adminFetch('/api/admin/sections/gallery/rows', {}, getAccessToken);
}

export async function adminPostGalleryRow(body, getAccessToken) {
  return adminFetch('/api/admin/sections/gallery/rows', { method: 'POST', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminPatchGalleryRow(rowId, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/gallery/rows/${rowId}`, { method: 'PATCH', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminDeleteGalleryRow(rowId, getAccessToken) {
  return adminFetch(`/api/admin/sections/gallery/rows/${rowId}`, { method: 'DELETE' }, getAccessToken);
}

export async function adminGetNested(section, parentTable, parentId, nestedType, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/nested/${parentTable}/${parentId}/${nestedType}`, {}, getAccessToken);
}

export async function adminPostNested(section, parentTable, parentId, nestedType, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/nested/${parentTable}/${parentId}/${nestedType}`, { method: 'POST', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminPatchNested(section, parentTable, parentId, nestedType, id, body, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/nested/${parentTable}/${parentId}/${nestedType}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, getAccessToken);
}

export async function adminDeleteNested(section, parentTable, parentId, nestedType, id, getAccessToken) {
  return adminFetch(`/api/admin/sections/${section}/nested/${parentTable}/${parentId}/${nestedType}/${id}`, { method: 'DELETE' }, getAccessToken);
}

/** List files in storage under prefix (e.g. "images/home"). Returns { files: [{ name, path, url }] }. */
export async function adminListStorageFiles(prefix, getAccessToken) {
  const q = prefix != null ? `?prefix=${encodeURIComponent(prefix)}` : '';
  return adminFetch(`/api/admin/storage/list${q}`, {}, getAccessToken);
}

/** List contact form emails (first_name, last_name, subject, message, created_at). */
export async function adminGetEmails(getAccessToken) {
  return adminFetch('/api/admin/emails', {}, getAccessToken);
}

/** Delete one email by id (uuid). */
export async function adminDeleteEmail(id, getAccessToken) {
  return adminFetch(`/api/admin/emails/${id}`, { method: 'DELETE' }, getAccessToken);
}
