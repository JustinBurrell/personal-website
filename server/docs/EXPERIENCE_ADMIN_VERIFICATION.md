# Experience Admin – Update Flow Verification

This doc traces how every part of the Experience admin (section, companies, positions) maps to the API and Supabase schema so we can confirm updates work as intended.

## Schema (Supabase)

- **experience** (one row): `id`, `languageCode`, `experienceImageUrl`, `description`, `isActive`, `createdAt`
- **experience_professional** (companies): `id`, `experienceId`, `company`, `companyUrl`, `location`
- **experience_leadership** (companies): `id`, `experienceId`, `company`, `companyUrl`, `location`
- **experience_professional_positions**: `id`, `professionalId`, `position`, `startDate`, `endDate`, `responsibilities` (jsonb), `skills` (jsonb), `images` (jsonb)
- **experience_leadership_positions**: `id`, `leadershipId`, `position`, `startDate`, `endDate`, `responsibilities`, `skills`, `images`

All column names are **camelCase** in the schema.

---

## 1. Main section row (description + hero image)

| Step | What happens |
|------|----------------|
| Frontend | `adminPatchSection('experience', { description, experienceImageUrl })` |
| Request | `PATCH /api/admin/sections/experience` with body `{ description, experienceImageUrl }` |
| Server | Normalizes image URL via `ensureFullStorageUrl`, then `updateSectionRow(supabase, 'experience', body)`. Body is passed **as-is** (camelCase). |
| Supabase | `from('experience').update({ description, experienceImageUrl }).eq('id', row.id)` |
| Schema match | ✅ `experience.description`, `experience.experienceImageUrl` exist and are camelCase |

**Conclusion:** Section description and experience hero image updates are correct.

---

## 2. Companies (professional / leadership)

### GET (list)

- **Request:** `GET /api/admin/sections/experience/items?itemType=professional` (or `leadership`).
- **Config:** `table: experience_professional`, `fk: experienceId`, `fields: ['company', 'companyUrl', 'location']`.
- **Query:** `from('experience_professional').select('*').eq('experienceId', parentId)`.
- **Schema:** ✅ `experienceId`, `company`, `companyUrl`, `location` are camelCase.

### POST (add company)

- **Body:** `{ itemType: 'professional', company, companyUrl, location }`.
- **Server:** Builds `insert = { experienceId: parentId }`, then for each `f` in `fields` sets `insert[f] = body[f] ?? payloadValueForDbColumn(payload, f)`.
- **Result:** `insert` has camelCase keys (`company`, `companyUrl`, `location`). ✅

### PATCH (edit company)

- **Body:** `{ itemType: 'professional', company, companyUrl, location }` (only changed fields).
- **Server:** `update[f] = body[f] ?? payloadValueForDbColumn(payload, f)` for each field → camelCase `update` object.
- **Supabase:** `from('experience_professional').update(update).eq('id', id)`. ✅

### DELETE (remove company)

- **Request:** `DELETE /api/admin/sections/experience/items/:id?itemType=professional`.
- **Server:** Deletes row by `id`. No image column on company row. ✅

**Conclusion:** Company CRUD matches schema and uses camelCase throughout.

---

## 3. Positions (nested under each company)

### GET (list positions)

- **Request:** `GET /api/admin/sections/experience/nested/experience_professional/:companyId/positions`.
- **Config:** `table: experience_professional_positions`, `fk: professionalId`, `fields: ['position', 'startDate', 'endDate', 'responsibilities', 'skills', 'images']`.
- **Query:** `from('experience_professional_positions').select('*').eq('professionalId', companyId)`.
- **Schema:** ✅ All columns camelCase.

### POST (add position)

- **Body:** `{ position, startDate, endDate, responsibilities, skills, images }` (camelCase from frontend).
- **Server:** `insert = { professionalId: parentId }`, then `val = body[f] ?? payload[f] ?? payload[f.replace(/_/g, '')]` so camelCase from `body` is used first.
- **Result:** Insert has `professionalId`, `position`, `startDate`, `endDate`, `responsibilities`, `skills`, `images` in camelCase. ✅

### PATCH (edit position – e.g. end date)

- **Body:** e.g. `{ endDate: '2024' }` (only changed fields, camelCase).
- **Server:** `val = body[f] ?? payload[f] ?? payload[f.replace(/_/g, '')]` so `body['endDate']` is used first → `update = { endDate: '2024' }`.
- **Supabase:** `from('experience_professional_positions').update(update).eq('id', id)`.
- **Schema:** ✅ `endDate` (and all other position fields) are camelCase.

### DELETE (remove position)

- **Request:** `DELETE .../nested/experience_professional/:companyId/positions/:positionId`.
- **Server:** Deletes row by `id`. ✅

**Conclusion:** Position CRUD uses camelCase; PATCH and POST both prefer `req.body[f]` first so partial updates (e.g. only end date) work.

---

## Summary table

| Operation | Route | Body/query keys | Schema columns | Status |
|-----------|--------|------------------|----------------|--------|
| Section update | PATCH /sections/experience | description, experienceImageUrl | camelCase | ✅ |
| List companies | GET .../items?itemType=professional | eq(experienceId) | experienceId | ✅ |
| Add company | POST .../items | company, companyUrl, location | camelCase | ✅ |
| Edit company | PATCH .../items/:id | body[f] first, then payload | camelCase | ✅ |
| List positions | GET .../nested/.../positions | eq(professionalId) | professionalId | ✅ |
| Add position | POST .../nested/.../positions | body[f] first | camelCase | ✅ |
| Edit position | PATCH .../nested/.../positions/:id | body[f] first | camelCase | ✅ |

**How we know it’s correct**

1. **Schema** – All experience tables use camelCase column names; no lowercase conversion is applied on the server.
2. **Section** – Body is passed through unchanged to `updateSectionRow` → Supabase gets camelCase.
3. **Items (companies)** – `update` and `insert` are built from `config.fields` (camelCase) and `body[f] ?? payloadValueForDbColumn(...)` so keys stay camelCase.
4. **Nested (positions)** – `update` and `insert` use `body[f]` first, then normalized payload; keys in `config.fields` are camelCase, so Supabase always receives camelCase and matches the schema.

No part of the Experience admin converts column names to lowercase, so every update path matches the Supabase schema.
