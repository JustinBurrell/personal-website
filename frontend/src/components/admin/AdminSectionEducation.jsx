import React, { useState, useEffect, useCallback } from 'react';
import {
  useAuth,
  adminPatchSection,
  adminUploadFile,
  adminGetSectionItems,
  adminPostSectionItem,
  adminPatchSectionItem,
  adminDeleteSectionItem,
  adminGetNested,
  adminPostNested,
  adminPatchNested,
  adminDeleteNested,
} from '../../features/auth';
import { portfolioService } from '../../services/supabase';

const EDUCATION_BACKGROUND_PATH = 'assets/images/education/Education Background Photo.jpg';

const EDUCATION_TYPES = [
  { value: 'School', label: 'Schooling' },
  { value: 'Certificate', label: 'Certifications' },
  { value: 'Program', label: 'Programs' },
];

function sanitizeFilename(name) {
  return (name || 'image').replace(/[/\\?*:|"]/g, '-').trim() || 'image';
}

export default function AdminSectionEducation({ data, onSave }) {
  const { getAccessToken } = useAuth();
  const educationRow = Array.isArray(data) ? data?.[0] : data;
  const [editForm, setEditForm] = useState({ description: '', educationImageUrl: '' });
  const [items, setItems] = useState([]);
  const [itemEdits, setItemEdits] = useState({});
  const [pendingNewItems, setPendingNewItems] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState(new Set());
  const [courseEdits, setCourseEdits] = useState({});
  const [pendingNewCourses, setPendingNewCourses] = useState({});
  const [pendingCourseDeletes, setPendingCourseDeletes] = useState({});
  const [involvementEdits, setInvolvementEdits] = useState({});
  const [pendingNewInvolvement, setPendingNewInvolvement] = useState({});
  const [pendingInvolvementDeletes, setPendingInvolvementDeletes] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (educationRow) {
      setEditForm({
        description: educationRow.description ?? '',
        educationImageUrl: educationRow.educationImageUrl ?? educationRow.education_image_url ?? '',
      });
    }
  }, [educationRow]);

  const loadItemsWithNested = useCallback(async () => {
    try {
      const list = await adminGetSectionItems('education', { itemType: 'items' }, getAccessToken);
      const itemsList = Array.isArray(list) ? list : [];
      const withNested = await Promise.all(
        itemsList.map(async (item) => {
          const [courses, involvement] = await Promise.all([
            adminGetNested('education', 'education_items', item.id, 'courses', getAccessToken),
            adminGetNested('education', 'education_items', item.id, 'involvement', getAccessToken),
          ]);
          return {
            ...item,
            courses: Array.isArray(courses) ? courses : [],
            involvement: Array.isArray(involvement) ? involvement : [],
          };
        })
      );
      setItems(withNested);
      setItemEdits({});
      setPendingNewItems([]);
      setPendingDeletes(new Set());
      setCourseEdits({});
      setPendingNewCourses({});
      setPendingCourseDeletes({});
      setInvolvementEdits({});
      setPendingNewInvolvement({});
      setPendingInvolvementDeletes({});
    } catch {
      setItems([]);
    }
  }, [getAccessToken]);

  useEffect(() => {
    loadItemsWithNested();
  }, [loadItemsWithNested]);

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const path = EDUCATION_BACKGROUND_PATH;
      const { path: uploadedPath, url: uploadedUrl } = await adminUploadFile(file, { section: 'education', path }, getAccessToken);
      setEditForm((f) => ({ ...f, educationImageUrl: uploadedUrl || uploadedPath }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleSaveAll = async () => {
    setError(null);

    const missingCompletionDate = [];
    for (const item of items) {
      if (pendingDeletes.has(item.id)) continue;
      const completion = itemEdits[item.id]?.completiondate ?? itemEdits[item.id]?.completionDate ?? item.completiondate ?? item.completionDate ?? '';
      if (!String(completion).trim()) missingCompletionDate.push(item.name || 'Unnamed entry');
    }
    for (const row of pendingNewItems) {
      const completion = row.completiondate ?? row.completionDate ?? '';
      if (!String(completion).trim()) missingCompletionDate.push(row.name || 'New entry');
    }
    if (missingCompletionDate.length > 0) {
      setError(`Completion date is required for each entry. Missing for: ${missingCompletionDate.join(', ')}`);
      return;
    }

    setSaving(true);
    try {
      await adminPatchSection('education', {
        description: editForm.description,
        educationImageUrl: editForm.educationImageUrl || undefined,
      }, getAccessToken);

      for (const id of pendingDeletes) {
        await adminDeleteSectionItem('education', id, { itemType: 'items' }, getAccessToken);
      }

      for (const item of items) {
        if (pendingDeletes.has(item.id)) continue;
        const patch = itemEdits[item.id];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('education', item.id, { itemType: 'items', ...patch }, getAccessToken);
        }
        const courseDels = pendingCourseDeletes[item.id];
        if (courseDels?.size) {
          for (const cid of courseDels) {
            await adminDeleteNested('education', 'education_items', item.id, 'courses', cid, getAccessToken);
          }
        }
        const courseP = courseEdits[item.id];
        if (courseP) {
          for (const [cid, cpatch] of Object.entries(courseP)) {
            if (cpatch && Object.keys(cpatch).length) {
              await adminPatchNested('education', 'education_items', item.id, 'courses', cid, cpatch, getAccessToken);
            }
          }
        }
        const newCourses = pendingNewCourses[item.id] || [];
        for (const c of newCourses) {
          if ((c.course ?? '').trim()) {
            await adminPostNested('education', 'education_items', item.id, 'courses', { course: c.course?.trim() || '', courseUrl: c.courseUrl?.trim() || '' }, getAccessToken);
          }
        }
        const invDels = pendingInvolvementDeletes[item.id];
        if (invDels?.size) {
          for (const iid of invDels) {
            await adminDeleteNested('education', 'education_items', item.id, 'involvement', iid, getAccessToken);
          }
        }
        const invP = involvementEdits[item.id];
        if (invP) {
          for (const [iid, ipatch] of Object.entries(invP)) {
            if (ipatch && Object.keys(ipatch).length) {
              await adminPatchNested('education', 'education_items', item.id, 'involvement', iid, ipatch, getAccessToken);
            }
          }
        }
        const newInv = pendingNewInvolvement[item.id] || [];
        for (const i of newInv) {
          if ((i.organization ?? '').trim()) {
            await adminPostNested('education', 'education_items', item.id, 'involvement', { organization: i.organization?.trim() || '', role: i.role?.trim() || '' }, getAccessToken);
          }
        }
      }

      for (const row of pendingNewItems) {
        let imagePath = row.educationimageurl ?? row.educationImageUrl ?? '';
        let educationImageUrlValue = imagePath;
        if (imagePath && !imagePath.startsWith('http')) {
          if (imagePath.startsWith('assets/images/education/')) educationImageUrlValue = imagePath;
          else if (imagePath.startsWith('images/education/')) educationImageUrlValue = `assets/${imagePath}`;
          else educationImageUrlValue = `assets/images/education/${imagePath.replace(/^education\/?/, '')}`;
        }
        const created = await adminPostSectionItem('education', {
          itemType: 'items',
          name: row.name ?? '',
          nameUrl: row.nameurl ?? row.nameUrl ?? '',
          educationType: row.educationType ?? row.educationtype ?? row.education_type ?? 'School',
          schoolType: row.schooltype ?? row.schoolType ?? '',
          major: row.major ?? '',
          completionDate: row.completiondate ?? row.completionDate ?? '',
          description: row.description ?? '',
          gpa: row.gpa ?? '',
          educationImageUrl: educationImageUrlValue || undefined,
        }, getAccessToken);
        const newId = created?.id;
        if (newId) {
          for (const c of (row.courses || [])) {
            if ((c.course ?? '').trim()) {
              await adminPostNested('education', 'education_items', newId, 'courses', { course: c.course?.trim() || '', courseUrl: c.courseUrl?.trim() || '' }, getAccessToken);
            }
          }
          for (const i of (row.involvement || [])) {
            if ((i.organization ?? '').trim()) {
              await adminPostNested('education', 'education_items', newId, 'involvement', { organization: i.organization?.trim() || '', role: i.role?.trim() || '' }, getAccessToken);
            }
          }
        }
      }

      await portfolioService.clearCache();
      await onSave();
      await loadItemsWithNested();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addNewItem = (file, fileName, educationType = 'School') => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const base = fileName ? sanitizeFilename(fileName) : `education-${Date.now()}`;
    setSaving(true);
    const storagePath = `assets/images/education/${base}.${ext}`;
    adminUploadFile(file, { section: 'education', path: storagePath }, getAccessToken)
      .then(({ path: uploadedPath, url: uploadedUrl }) => {
        const imageUrl = uploadedUrl || (uploadedPath.startsWith('assets/') ? uploadedPath : uploadedPath.startsWith('images/') ? `assets/${uploadedPath}` : `assets/images/${uploadedPath}`);
        setPendingNewItems((prev) => [...prev, {
          name: fileName || base,
          nameurl: '',
          educationType,
          educationtype: educationType,
          schooltype: '',
          major: '',
          completiondate: '',
          description: '',
          gpa: '',
          educationimageurl: imageUrl,
          educationImageUrl: imageUrl,
          courses: [],
          involvement: [],
        }]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false));
  };

  const displayItems = items.filter((i) => !pendingDeletes.has(i.id));
  const getItemType = (i) => i.educationType ?? i.educationtype ?? i.education_type;
  const byType = (type) => [...displayItems.filter((i) => getItemType(i) === type), ...pendingNewItems.filter((i) => getItemType(i) === type)];
  const sectionBackgroundPath = editForm.educationImageUrl || educationRow?.educationImageUrl || educationRow?.education_image_url || EDUCATION_BACKGROUND_PATH;
  const backgroundDisplayUrl = sectionBackgroundPath.startsWith('http') ? sectionBackgroundPath : portfolioService.getAssetUrl(sectionBackgroundPath);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Education</h1>
        <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Section description</h2>
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2.5 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 resize-y"
          />
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Background image</h2>
          <p className="text-sm text-cream-600 mb-3">Stored in <code className="text-xs bg-cream-200 px-1 rounded">assets → images → education</code>.</p>
          <div className="mb-3">
            <img src={backgroundDisplayUrl} alt="Education background" className="max-h-52 w-auto object-contain rounded-xl border border-cream-300" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <input type="file" accept=".jpeg,.jpg,.png,.webp,.gif,.pdf" onChange={handleBackgroundUpload} disabled={saving} className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-cream-200 file:text-cream-800 file:text-sm" />
          <p className="text-xs text-cream-500 mt-1">Accepted: .jpeg, .jpg, .png, .webp, .gif, .pdf</p>
        </section>

        {EDUCATION_TYPES.map(({ value, label }) => (
          <section key={value} className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
            <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">{label}</h2>
            <ul className="space-y-6">
              {byType(value).map((item) => {
                const isNew = !item.id;
                const id = item.id || `new-${pendingNewItems.indexOf(item)}`;
                const name = itemEdits[id]?.name ?? item.name ?? '';
                const nameurl = itemEdits[id]?.nameurl ?? itemEdits[id]?.nameUrl ?? item.nameurl ?? item.nameUrl ?? '';
                const educationtype = itemEdits[id]?.educationtype ?? itemEdits[id]?.educationType ?? item.educationtype ?? item.educationType ?? value;
                const schooltype = itemEdits[id]?.schooltype ?? itemEdits[id]?.schoolType ?? item.schooltype ?? item.schoolType ?? '';
                const major = itemEdits[id]?.major ?? item.major ?? '';
                const completiondate = itemEdits[id]?.completiondate ?? itemEdits[id]?.completionDate ?? item.completiondate ?? item.completionDate ?? '';
                const description = itemEdits[id]?.description ?? item.description ?? '';
                const gpa = itemEdits[id]?.gpa ?? item.gpa ?? '';
                const imgUrl = itemEdits[id]?.educationimageurl ?? itemEdits[id]?.educationImageUrl ?? item.educationimageurl ?? item.educationImageUrl ?? '';
                const courses = isNew ? [] : (item.courses || []).filter((c) => !(pendingCourseDeletes[item.id] || new Set()).has(c.id));
                const courseEd = courseEdits[item.id] || {};
                const newCourses = isNew ? (item.courses || []) : (pendingNewCourses[item.id] || []);
                const involvements = isNew ? [] : (item.involvement || []).filter((i) => !(pendingInvolvementDeletes[item.id] || new Set()).has(i.id));
                const invEd = involvementEdits[item.id] || {};
                const newInv = isNew ? (item.involvement || []) : (pendingNewInvolvement[item.id] || []);

                const setItemField = (field, v) => {
                  if (isNew) {
                    setPendingNewItems((prev) => prev.map((p) => (p === item ? { ...p, [field]: v } : p)));
                  } else {
                    setItemEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: v } }));
                  }
                };

                const imgDisplayUrl = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : portfolioService.getAssetUrl(imgUrl)) : null;

                return (
                  <li key={id} className={`p-4 rounded-xl ${isNew ? 'bg-cinnabar-50/80 border border-cinnabar-200' : 'bg-cream-100/80'}`}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <select value={educationtype} onChange={(e) => { setItemField('educationtype', e.target.value); setItemField('educationType', e.target.value); }} className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white">
                          {EDUCATION_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input type="text" placeholder="Name (e.g. Lehigh University)" value={name} onChange={(e) => setItemField('name', e.target.value)} className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                        <input type="url" placeholder="URL" value={nameurl} onChange={(e) => setItemField('nameurl', e.target.value)} className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input type="text" placeholder="School type" value={schooltype} onChange={(e) => setItemField('schooltype', e.target.value)} className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                        <input type="text" placeholder="Major" value={major} onChange={(e) => setItemField('major', e.target.value)} className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                      </div>
                      <input type="text" placeholder="Completion date (required)" value={completiondate} onChange={(e) => setItemField('completiondate', e.target.value)} className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                      <textarea placeholder="Description" value={description} onChange={(e) => setItemField('description', e.target.value)} rows={2} className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white resize-y" />
                      <input type="text" placeholder="GPA" value={gpa} onChange={(e) => setItemField('gpa', e.target.value)} className="w-full max-w-[120px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />

                      {imgDisplayUrl && (
                        <div>
                          <p className="text-xs text-cream-600 mb-1">Image (link: {imgUrl})</p>
                          <img src={imgDisplayUrl} alt={name} className="max-h-32 w-auto object-contain rounded-lg border border-cream-300" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}
                      {!isNew && (
                        <div>
                          <label className="block text-xs text-cream-600 mb-1">Replace image (upload to <code className="bg-cream-200 px-1 rounded">assets → images → education</code> with chosen name)</label>
                          <input
                            type="file"
                            accept=".jpeg,.jpg,.png,.webp,.gif,.pdf"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg';
                              const base = sanitizeFilename(name) || 'image';
                              const path = `assets/images/education/${base}.${ext}`;
                              setSaving(true);
                              adminUploadFile(f, { section: 'education', path }, getAccessToken)
                                .then(({ path: uploadedPath, url: uploadedUrl }) => {
                                  const imageUrl = uploadedUrl || (uploadedPath.startsWith('assets/') ? uploadedPath : uploadedPath.startsWith('images/') ? `assets/${uploadedPath}` : `assets/images/${uploadedPath}`);
                                  setItemEdits((prev) => ({ ...prev, [id]: { ...prev[id], educationimageurl: imageUrl, educationImageUrl: imageUrl } }));
                                })
                                .catch((err) => setError(err.message))
                                .finally(() => setSaving(false));
                              e.target.value = '';
                            }}
                            disabled={saving}
                            className="text-sm"
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-cream-700 mb-2">Relevant courses</h4>
                        <ul className="space-y-1 mb-2">
                          {courses.map((c) => (
                            <li key={c.id} className="flex items-center gap-2">
                              <input type="text" placeholder="Course" value={courseEd[c.id]?.course ?? c.course ?? ''} onChange={(e) => setCourseEdits((p) => ({ ...p, [item.id]: { ...p[item.id], [c.id]: { ...p[item.id]?.[c.id], course: e.target.value } } }))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <input type="url" placeholder="URL" value={courseEd[c.id]?.courseurl ?? courseEd[c.id]?.courseUrl ?? c.courseurl ?? c.courseUrl ?? ''} onChange={(e) => setCourseEdits((p) => ({ ...p, [item.id]: { ...p[item.id], [c.id]: { ...p[item.id]?.[c.id], courseUrl: e.target.value } } }))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <button type="button" onClick={() => setPendingCourseDeletes((p) => ({ ...p, [item.id]: new Set(p[item.id] || []).add(c.id) }))} className="text-red-600 hover:underline text-xs">Remove</button>
                            </li>
                          ))}
                          {(newCourses || []).map((c, idx) => (
                            <li key={isNew ? `nc-${idx}` : c.id} className="flex items-center gap-2">
                              <input type="text" placeholder="Course" value={c.course ?? ''} onChange={(e) => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, courses: (x.courses || []).map((co, i) => (i === idx ? { ...co, course: e.target.value } : co)) } : x))) : setPendingNewCourses((p) => ({ ...p, [item.id]: (p[item.id] || []).map((x, i) => (i === idx ? { ...x, course: e.target.value } : x)) })))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <input type="url" placeholder="URL" value={c.courseUrl ?? ''} onChange={(e) => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, courses: (x.courses || []).map((co, i) => (i === idx ? { ...co, courseUrl: e.target.value } : co)) } : x))) : setPendingNewCourses((p) => ({ ...p, [item.id]: (p[item.id] || []).map((x, i) => (i === idx ? { ...x, courseUrl: e.target.value } : x)) })))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <button type="button" onClick={() => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, courses: (x.courses || []).filter((_, i) => i !== idx) } : x))) : setPendingNewCourses((p) => ({ ...p, [item.id]: (p[item.id] || []).filter((_, i) => i !== idx) })))} className="text-red-600 hover:underline text-xs">Remove</button>
                            </li>
                          ))}
                        </ul>
                        <button type="button" onClick={() => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, courses: [...(x.courses || []), { course: '', courseUrl: '' }] } : x))) : setPendingNewCourses((p) => ({ ...p, [item.id]: [...(p[item.id] || []), { course: '', courseUrl: '' }] })))} className="text-xs text-cinnabar-600 hover:underline">+ Add course</button>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-cream-700 mb-2">Organization involvement</h4>
                        <ul className="space-y-1 mb-2">
                          {involvements.map((inv) => (
                            <li key={inv.id} className="flex items-center gap-2">
                              <input type="text" placeholder="Organization" value={invEd[inv.id]?.organization ?? inv.organization ?? ''} onChange={(e) => setInvolvementEdits((p) => ({ ...p, [item.id]: { ...p[item.id], [inv.id]: { ...p[item.id]?.[inv.id], organization: e.target.value } } }))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <input type="text" placeholder="Role" value={invEd[inv.id]?.role ?? inv.role ?? ''} onChange={(e) => setInvolvementEdits((p) => ({ ...p, [item.id]: { ...p[item.id], [inv.id]: { ...p[item.id]?.[inv.id], role: e.target.value } } }))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <button type="button" onClick={() => setPendingInvolvementDeletes((p) => ({ ...p, [item.id]: new Set(p[item.id] || []).add(inv.id) }))} className="text-red-600 hover:underline text-xs">Remove</button>
                            </li>
                          ))}
                          {(newInv || []).map((inv, idx) => (
                            <li key={isNew ? `ni-${idx}` : inv.id} className="flex items-center gap-2">
                              <input type="text" placeholder="Organization" value={inv.organization ?? ''} onChange={(e) => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, involvement: (x.involvement || []).map((io, i) => (i === idx ? { ...io, organization: e.target.value } : io)) } : x))) : setPendingNewInvolvement((p) => ({ ...p, [item.id]: (p[item.id] || []).map((x, i) => (i === idx ? { ...x, organization: e.target.value } : x)) })))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <input type="text" placeholder="Role" value={inv.role ?? ''} onChange={(e) => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, involvement: (x.involvement || []).map((io, i) => (i === idx ? { ...io, role: e.target.value } : io)) } : x))) : setPendingNewInvolvement((p) => ({ ...p, [item.id]: (p[item.id] || []).map((x, i) => (i === idx ? { ...x, role: e.target.value } : x)) })))} className="flex-1 px-2 py-1 border rounded text-sm bg-white" />
                              <button type="button" onClick={() => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, involvement: (x.involvement || []).filter((_, i) => i !== idx) } : x))) : setPendingNewInvolvement((p) => ({ ...p, [item.id]: (p[item.id] || []).filter((_, i) => i !== idx) })))} className="text-red-600 hover:underline text-xs">Remove</button>
                            </li>
                          ))}
                        </ul>
                        <button type="button" onClick={() => (isNew ? setPendingNewItems((p) => p.map((x) => (x === item ? { ...x, involvement: [...(x.involvement || []), { organization: '', role: '' }] } : x))) : setPendingNewInvolvement((p) => ({ ...p, [item.id]: [...(p[item.id] || []), { organization: '', role: '' }] })))} className="text-xs text-cinnabar-600 hover:underline">+ Add involvement</button>
                      </div>

                      <button type="button" onClick={() => (isNew ? setPendingNewItems((prev) => prev.filter((x) => x !== item)) : setPendingDeletes((prev) => new Set(prev).add(item.id)))} className="text-red-600 hover:underline text-sm">Remove this entry</button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 p-4 bg-cream-100/80 rounded-xl border border-cream-300 border-dashed">
              <p className="text-sm text-cream-700 mb-2">Add new entry to <strong>{label}</strong> (saved as type &quot;{value}&quot;). Name and image are required.</p>
              <NewItemForm onAdd={(file, fileName) => addNewItem(file, fileName, value)} disabled={saving} typeLabel={label} />
            </div>
          </section>
        ))}

        <div className="pt-2 pb-6 flex flex-col items-center text-center">
          {pendingDeletes.size > 0 && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full max-w-3xl">
              <strong>Marked for removal:</strong> {[...pendingDeletes].map((id) => items.find((i) => i.id === id)?.name || 'Entry').join(', ')}. You must click Save changes to confirm.
            </p>
          )}
          <button type="button" onClick={handleSaveAll} disabled={saving} className="w-full sm:w-auto min-w-[200px] px-6 py-3 bg-cinnabar-500 text-white rounded-xl font-display font-semibold hover:bg-cinnabar-600 disabled:opacity-50 shadow-md hover:shadow-lg transition-all">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <p className="text-xs text-cream-500 mt-2">All edits are applied when you click Save.</p>
        </div>
      </div>
    </div>
  );
}

function NewItemForm({ onAdd, disabled, typeLabel }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !name.trim()) return;
    const base = fileName.trim() ? sanitizeFilename(fileName) : sanitizeFilename(name) || 'education';
    onAdd(file, base);
    setName('');
    setFile(null);
    setFileName('');
  };

  const canSubmit = Boolean(file && name.trim());

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <input type="text" placeholder="Name (required)" value={name} onChange={(e) => setName(e.target.value)} className="px-2.5 py-1.5 border rounded-lg text-sm" required />
      <input type="text" placeholder="Image filename (no extension)" value={fileName} onChange={(e) => setFileName(e.target.value)} className="px-2.5 py-1.5 border rounded-lg text-sm w-40" title="Used as filename in assets/images/education/" />
      <input type="file" accept=".jpeg,.jpg,.png,.webp,.gif,.pdf" required onChange={(e) => setFile(e.target.files?.[0])} className="text-sm" />
      <button type="submit" disabled={disabled || !canSubmit} className="px-3 py-1.5 bg-cinnabar-500 text-white rounded-lg text-sm hover:bg-cinnabar-600 disabled:opacity-50">Add to {typeLabel}</button>
    </form>
  );
}
