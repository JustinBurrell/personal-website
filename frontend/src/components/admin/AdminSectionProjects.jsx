import React, { useState, useEffect, useCallback } from 'react';
import {
  useAuth,
  adminPatchSection,
  adminUploadFile,
  adminGetSectionItems,
  adminPostSectionItem,
  adminPatchSectionItem,
  adminDeleteSectionItem,
  adminPostNested,
  adminPatchNested,
  adminDeleteNested,
} from '../../features/auth';
import { portfolioService } from '../../services/supabase';

function normTechs(item) {
  const raw = item.project_technologies ?? item.projectTechnologies ?? [];
  return Array.isArray(raw) ? raw.map((t) => ({ id: t.id, technology: t.technology ?? '' })) : [];
}
function normHighlights(item) {
  const raw = item.project_highlights ?? item.projectHighlights ?? [];
  return Array.isArray(raw) ? raw.map((h) => ({ id: h.id, highlight: h.highlight ?? '' })) : [];
}

const parseProjectDate = (d) => {
  if (!d || typeof d !== 'string') return new Date(0);
  return new Date(d.trim()) || new Date(0);
};
const sortByRecency = (items) =>
  [...(items || [])].sort((a, b) => parseProjectDate(b.date) - parseProjectDate(a.date));

export default function AdminSectionProjects({ data, onSave }) {
  const { getAccessToken } = useAuth();
  const projectsRow = Array.isArray(data) ? data?.[0] : data;
  const [editForm, setEditForm] = useState({ description: '', projectImageUrl: '' });
  const [items, setItems] = useState([]);
  const [itemEdits, setItemEdits] = useState({});
  const [highlightEdits, setHighlightEdits] = useState({});
  const [techEdits, setTechEdits] = useState({});
  const [pendingNewHighlights, setPendingNewHighlights] = useState({});
  const [pendingNewTechs, setPendingNewTechs] = useState({});
  const [pendingHighlightDeletes, setPendingHighlightDeletes] = useState(new Set());
  const [pendingTechDeletes, setPendingTechDeletes] = useState(new Set());
  const [pendingNewItems, setPendingNewItems] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectsRow) {
      setEditForm({
        description: projectsRow.description ?? '',
        projectImageUrl: projectsRow.projectImageUrl ?? projectsRow.project_image_url ?? '',
      });
    }
  }, [projectsRow]);

  const loadItems = useCallback(async () => {
    try {
      const list = await adminGetSectionItems('projects', { itemType: 'items' }, getAccessToken);
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    }
  }, [getAccessToken]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSaveAll = async () => {
    setError(null);
    setSaving(true);
    try {
      await adminPatchSection('projects', {
        description: editForm.description,
        projectImageUrl: editForm.projectImageUrl || undefined,
      }, getAccessToken);
      for (const id of pendingDeletes) {
        await adminDeleteSectionItem('projects', id, { itemType: 'items' }, getAccessToken);
      }
      const displayItems = sortByRecency(items.filter((i) => !pendingDeletes.has(i.id)));
      for (const id of pendingHighlightDeletes) {
        const item = displayItems.find((i) => normHighlights(i).some((h) => h.id === id));
        if (item) await adminDeleteNested('projects', 'project_items', item.id, 'highlights', id, getAccessToken);
      }
      for (const id of pendingTechDeletes) {
        const item = displayItems.find((i) => normTechs(i).some((t) => t.id === id));
        if (item) await adminDeleteNested('projects', 'project_items', item.id, 'technologies', id, getAccessToken);
      }
      for (const item of displayItems) {
        const patch = itemEdits[item.id];
        const payload = {
          title: patch?.title ?? item.title ?? '',
          date: patch?.date ?? item.date ?? '',
          description: patch?.description ?? item.description ?? '',
          imageUrl: patch?.imageUrl ?? item.imageUrl ?? item.image_url ?? '',
          githubUrl: patch?.githubUrl ?? item.githubUrl ?? item.github_url ?? '',
          liveUrl: patch?.liveUrl ?? item.liveUrl ?? item.live_url ?? '',
        };
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('projects', item.id, payload, getAccessToken);
        }
        const techs = normTechs(item);
        const highlights = normHighlights(item);
        for (const t of techs) {
          if (pendingTechDeletes.has(t.id)) continue;
          const ed = techEdits[t.id];
          if (ed?.technology !== undefined && ed.technology !== (t.technology ?? '')) {
            await adminPatchNested('projects', 'project_items', item.id, 'technologies', t.id, { technology: ed.technology }, getAccessToken);
          }
        }
        for (const h of highlights) {
          if (pendingHighlightDeletes.has(h.id)) continue;
          const ed = highlightEdits[h.id];
          if (ed?.highlight !== undefined && ed.highlight !== (h.highlight ?? '')) {
            await adminPatchNested('projects', 'project_items', item.id, 'highlights', h.id, { highlight: ed.highlight }, getAccessToken);
          }
        }
        for (const t of pendingNewTechs[item.id] || []) {
          if (!t.technology?.trim()) continue;
          await adminPostNested('projects', 'project_items', item.id, 'technologies', { technology: t.technology.trim() }, getAccessToken);
        }
        for (const h of pendingNewHighlights[item.id] || []) {
          if (!h.highlight?.trim()) continue;
          await adminPostNested('projects', 'project_items', item.id, 'highlights', { highlight: h.highlight.trim() }, getAccessToken);
        }
      }
      for (const row of pendingNewItems) {
        const created = await adminPostSectionItem('projects', {
          itemType: 'items',
          title: row.title ?? 'New Project',
          date: row.date ?? '',
          description: row.description ?? '',
          imageUrl: row.imageUrl ?? '',
          githubUrl: row.githubUrl ?? '',
          liveUrl: row.liveUrl ?? '',
        }, getAccessToken);
        for (const t of row.technologies || []) {
          if (t?.technology?.trim()) await adminPostNested('projects', 'project_items', created.id, 'technologies', { technology: t.technology.trim() }, getAccessToken);
        }
        for (const h of row.highlights || []) {
          if (h?.highlight?.trim()) await adminPostNested('projects', 'project_items', created.id, 'highlights', { highlight: h.highlight.trim() }, getAccessToken);
        }
      }
      await portfolioService.clearCache();
      await onSave();
      await loadItems();
      setItemEdits({});
      setHighlightEdits({});
      setTechEdits({});
      setPendingNewHighlights({});
      setPendingNewTechs({});
      setPendingHighlightDeletes(new Set());
      setPendingTechDeletes(new Set());
      setPendingNewItems([]);
      setPendingDeletes(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSectionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const { path: uploadedPath, url: uploadedUrl } = await adminUploadFile(file, { section: 'projects' }, getAccessToken);
      setEditForm((f) => ({ ...f, projectImageUrl: uploadedUrl || uploadedPath }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleItemImageUpload = async (e, itemId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const { path: uploadedPath, url: uploadedUrl } = await adminUploadFile(file, { section: 'projects', path: `projects/${itemId}-${Date.now()}.${ext}` }, getAccessToken);
      const url = uploadedUrl || uploadedPath;
      setItemEdits((p) => ({ ...p, [itemId]: { ...p[itemId], imageUrl: url } }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const displayItems = sortByRecency(
    items
      .filter((i) => !pendingDeletes.has(i.id))
      .map((i) => ({
        ...i,
        title: itemEdits[i.id]?.title ?? i.title ?? '',
        date: itemEdits[i.id]?.date ?? i.date ?? '',
        description: itemEdits[i.id]?.description ?? i.description ?? '',
        imageUrl: itemEdits[i.id]?.imageUrl ?? i.imageUrl ?? i.image_url ?? '',
        githubUrl: itemEdits[i.id]?.githubUrl ?? i.githubUrl ?? i.github_url ?? '',
        liveUrl: itemEdits[i.id]?.liveUrl ?? i.liveUrl ?? i.live_url ?? '',
      }))
  );

  const sectionImageUrl = editForm.projectImageUrl || projectsRow?.projectImageUrl || projectsRow?.project_image_url;
  const sectionImageDisplay = sectionImageUrl
    ? (sectionImageUrl.startsWith('http') ? sectionImageUrl : portfolioService.getAssetUrl(sectionImageUrl))
    : '';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Projects</h1>
        <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Section description</h2>
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2.5 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 resize-y"
          />
          <div className="mt-4">
            <p className="text-sm text-cream-600 mb-2">Section hero image</p>
            {sectionImageDisplay && (
              <img src={sectionImageDisplay} alt="" className="max-h-40 w-auto rounded-xl border border-cream-300 mb-2" />
            )}
            <label className="cursor-pointer text-sm text-cinnabar-600 hover:underline">
              Change image
              <input type="file" accept="image/*" className="sr-only" onChange={handleSectionImageUpload} disabled={saving} />
            </label>
          </div>
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Project entries</h2>
          <p className="text-sm text-cream-600 mb-4">Shown in order of recency (most recent first). Edit image, date, description, key features, technologies, and links.</p>

          <ul className="space-y-4 mb-4">
            {displayItems.map((item) => {
              const techs = normTechs(item);
              const highlights = normHighlights(item);
              return (
                <li key={item.id} className="p-4 bg-cream-100/80 rounded-xl border border-cream-300/80 space-y-3">
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    <div>
                      <div className="aspect-video max-w-[120px] rounded-lg overflow-hidden bg-cream-200 border border-cream-300">
                        {item.imageUrl ? (
                          <img src={item.imageUrl.startsWith('http') ? item.imageUrl : portfolioService.getAssetUrl(item.imageUrl)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-cream-500 text-xs p-2 block">No image</span>
                        )}
                      </div>
                      <label className="cursor-pointer text-xs text-cinnabar-600 hover:underline mt-1 block">
                        Change image
                        <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleItemImageUpload(e, item.id)} disabled={saving} />
                      </label>
                    </div>
                    <div className="min-w-0 space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => setItemEdits((p) => ({ ...p, [item.id]: { ...p[item.id], title: e.target.value } }))}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={item.date}
                        onChange={(e) => setItemEdits((p) => ({ ...p, [item.id]: { ...p[item.id], date: e.target.value } }))}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => setItemEdits((p) => ({ ...p, [item.id]: { ...p[item.id], description: e.target.value } }))}
                        rows={2}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white resize-y focus:ring-2 focus:ring-cinnabar-500/30"
                      />
                      <input
                        type="url"
                        placeholder="GitHub URL"
                        value={item.githubUrl}
                        onChange={(e) => setItemEdits((p) => ({ ...p, [item.id]: { ...p[item.id], githubUrl: e.target.value } }))}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                      />
                      <input
                        type="url"
                        placeholder="Live URL"
                        value={item.liveUrl}
                        onChange={(e) => setItemEdits((p) => ({ ...p, [item.id]: { ...p[item.id], liveUrl: e.target.value } }))}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-cream-600 mb-1">Key features</label>
                      <ul className="space-y-1">
                        {highlights.map((h) => {
                          if (pendingHighlightDeletes.has(h.id)) return null;
                          const val = highlightEdits[h.id]?.highlight ?? h.highlight ?? '';
                          return (
                            <li key={h.id} className="flex gap-1">
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => setHighlightEdits((p) => ({ ...p, [h.id]: { highlight: e.target.value } }))}
                                className="flex-1 px-2 py-1 border border-cream-300 rounded text-sm bg-white"
                                placeholder="Feature"
                              />
                              <button type="button" onClick={() => setPendingHighlightDeletes((p) => new Set(p).add(h.id))} className="text-red-500 text-xs">×</button>
                            </li>
                          );
                        })}
                        {(pendingNewHighlights[item.id] || []).map((h, idx) => (
                          <li key={`n-${idx}`} className="flex gap-1">
                            <input
                              type="text"
                              value={h.highlight}
                              onChange={(e) => setPendingNewHighlights((p) => ({
                                ...p,
                                [item.id]: (p[item.id] || []).map((x, i) => (i === idx ? { ...x, highlight: e.target.value } : x)),
                              }))}
                              className="flex-1 px-2 py-1 border border-cream-300 rounded text-sm bg-white"
                              placeholder="New feature"
                            />
                            <button type="button" onClick={() => setPendingNewHighlights((p) => ({ ...p, [item.id]: (p[item.id] || []).filter((_, i) => i !== idx) }))} className="text-red-500 text-xs">×</button>
                          </li>
                        ))}
                        <button type="button" onClick={() => setPendingNewHighlights((p) => ({ ...p, [item.id]: [...(p[item.id] || []), { highlight: '' }] }))} className="text-sm text-cinnabar-600 hover:underline">+ Add feature</button>
                      </ul>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-cream-600 mb-1">Technologies</label>
                      <ul className="space-y-1">
                        {techs.map((t) => {
                          if (pendingTechDeletes.has(t.id)) return null;
                          const val = techEdits[t.id]?.technology ?? t.technology ?? '';
                          return (
                            <li key={t.id} className="flex gap-1">
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => setTechEdits((p) => ({ ...p, [t.id]: { technology: e.target.value } }))}
                                className="flex-1 px-2 py-1 border border-cream-300 rounded text-sm bg-white"
                                placeholder="Tech"
                              />
                              <button type="button" onClick={() => setPendingTechDeletes((p) => new Set(p).add(t.id))} className="text-red-500 text-xs">×</button>
                            </li>
                          );
                        })}
                        {(pendingNewTechs[item.id] || []).map((t, idx) => (
                          <li key={`n-${idx}`} className="flex gap-1">
                            <input
                              type="text"
                              value={t.technology}
                              onChange={(e) => setPendingNewTechs((p) => ({
                                ...p,
                                [item.id]: (p[item.id] || []).map((x, i) => (i === idx ? { ...x, technology: e.target.value } : x)),
                              }))}
                              className="flex-1 px-2 py-1 border border-cream-300 rounded text-sm bg-white"
                              placeholder="New tech"
                            />
                            <button type="button" onClick={() => setPendingNewTechs((p) => ({ ...p, [item.id]: (p[item.id] || []).filter((_, i) => i !== idx) }))} className="text-red-500 text-xs">×</button>
                          </li>
                        ))}
                        <button type="button" onClick={() => setPendingNewTechs((p) => ({ ...p, [item.id]: [...(p[item.id] || []), { technology: '' }] }))} className="text-sm text-cinnabar-600 hover:underline">+ Add tech</button>
                      </ul>
                    </div>
                  </div>
                  <button type="button" onClick={() => setPendingDeletes((p) => new Set(p).add(item.id))} className="text-sm text-red-600 hover:underline">Remove project</button>
                </li>
              );
            })}
            {pendingNewItems.map((row, i) => (
              <li key={`new-${i}`} className="p-4 bg-cinnabar-50/80 rounded-xl border border-cinnabar-200 space-y-3">
                <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                  <div>
                    <div className="aspect-video max-w-[120px] rounded-lg overflow-hidden bg-cream-200 border border-cream-300">
                      <span className="text-cream-500 text-xs p-2 block">No image</span>
                    </div>
                    <p className="text-xs text-cream-500 mt-1">Upload after save</p>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={row.title ?? ''}
                      onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                      className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Date"
                      value={row.date ?? ''}
                      onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))}
                      className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                    />
                    <textarea
                      placeholder="Description"
                      value={row.description ?? ''}
                      onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                      rows={2}
                      className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white resize-y"
                    />
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      value={row.githubUrl ?? ''}
                      onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, githubUrl: e.target.value } : x)))}
                      className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                    />
                    <input
                      type="url"
                      placeholder="Live URL"
                      value={row.liveUrl ?? ''}
                      onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, liveUrl: e.target.value } : x)))}
                      className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-cream-600 mb-1">Key features</label>
                    {(row.highlights || []).map((h, idx) => (
                      <div key={idx} className="flex gap-1 mb-1">
                        <input
                          type="text"
                          value={h.highlight ?? ''}
                          onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, highlights: (x.highlights || []).map((hh, k) => (k === idx ? { ...hh, highlight: e.target.value } : hh)) } : x)))}
                          className="flex-1 px-2 py-1 border border-cream-300 rounded text-sm bg-white"
                          placeholder="Feature"
                        />
                        <button type="button" onClick={() => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, highlights: (x.highlights || []).filter((_, k) => k !== idx) } : x)))} className="text-red-500 text-xs">×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, highlights: [...(x.highlights || []), { highlight: '' }] } : x)))} className="text-sm text-cinnabar-600 hover:underline">+ Add feature</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream-600 mb-1">Technologies</label>
                    {(row.technologies || []).map((t, idx) => (
                      <div key={idx} className="flex gap-1 mb-1">
                        <input
                          type="text"
                          value={t.technology ?? ''}
                          onChange={(e) => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, technologies: (x.technologies || []).map((tt, k) => (k === idx ? { ...tt, technology: e.target.value } : tt)) } : x)))}
                          className="flex-1 px-2 py-1 border border-cream-300 rounded text-sm bg-white"
                          placeholder="Tech"
                        />
                        <button type="button" onClick={() => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, technologies: (x.technologies || []).filter((_, k) => k !== idx) } : x)))} className="text-red-500 text-xs">×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setPendingNewItems((p) => p.map((x, j) => (j === i ? { ...x, technologies: [...(x.technologies || []), { technology: '' }] } : x)))} className="text-sm text-cinnabar-600 hover:underline">+ Add tech</button>
                  </div>
                </div>
                <button type="button" onClick={() => setPendingNewItems((p) => p.filter((_, j) => j !== i))} className="text-sm text-red-600 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPendingNewItems((p) => [...p, { title: '', date: '', description: '', githubUrl: '', liveUrl: '', imageUrl: '', technologies: [], highlights: [] }])}
            className="text-sm text-cinnabar-600 hover:underline font-medium"
          >
            + Add project
          </button>
        </section>

        <div className="pt-2 pb-6 flex flex-col items-center text-center">
          {pendingDeletes.size > 0 && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full max-w-2xl">
              <strong>Marked for removal:</strong> {[...pendingDeletes].map((id) => items.find((i) => i.id === id)?.title || 'Project').join(', ')}. Click Save to confirm.
            </p>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="w-full sm:w-auto min-w-[200px] px-6 py-3 bg-cinnabar-500 text-white rounded-xl font-display font-semibold hover:bg-cinnabar-600 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <p className="text-xs text-cream-500 mt-2">All edits above are applied when you click Save.</p>
        </div>
      </div>
    </div>
  );
}
