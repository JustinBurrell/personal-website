import React, { useState, useEffect, useCallback } from 'react';
import {
  useAuth,
  adminGetGalleryRows,
  adminPostGalleryRow,
  adminPatchGalleryRow,
  adminDeleteGalleryRow,
  adminUploadFile,
  adminPostNested,
  adminPatchNested,
  adminDeleteNested,
} from '../../features/auth';
import { portfolioService } from '../../services/supabase';

function normalizeCategories(row) {
  const raw = row.categories ?? row.gallery_categories ?? row.galleryCategories ?? [];
  return Array.isArray(raw)
    ? raw.map((c) => ({
        id: c.id,
        categoryName: c.categoryName ?? c.category_name ?? '',
      }))
    : [];
}

export default function AdminSectionGallery({ data, onSave }) {
  const { getAccessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [rowEdits, setRowEdits] = useState({});
  const [categoryEdits, setCategoryEdits] = useState({});
  const [pendingNewCategories, setPendingNewCategories] = useState({});
  const [pendingCategoryDeletes, setPendingCategoryDeletes] = useState(new Set());
  const [pendingRowDeletes, setPendingRowDeletes] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const loadRows = useCallback(async () => {
    try {
      const list = await adminGetGalleryRows(getAccessToken);
      const arr = Array.isArray(list) ? list : [];
      setRows(arr.map((r) => ({ ...r, categories: normalizeCategories(r) })));
      setRowEdits({});
      setCategoryEdits({});
      setPendingNewCategories({});
      setPendingCategoryDeletes(new Set());
      setPendingRowDeletes(new Set());
    } catch {
      setRows([]);
    }
  }, [getAccessToken]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSaveAll = async () => {
    setError(null);
    setSaving(true);
    try {
      const displayRows = rows.filter((r) => !pendingRowDeletes.has(r.id));
      for (const id of pendingRowDeletes) {
        await adminDeleteGalleryRow(id, getAccessToken);
      }
      for (const id of pendingCategoryDeletes) {
        const row = displayRows.find((r) => normalizeCategories(r).some((c) => c.id === id));
        if (row) await adminDeleteNested('gallery', 'gallery', row.id, 'categories', id, getAccessToken);
      }
      for (let i = 0; i < displayRows.length; i++) {
        const row = displayRows[i];
        const edits = rowEdits[row.id] || {};
        const patch = {
          sortOrder: i,
          title: edits.title ?? row.title ?? '',
          description: edits.description ?? row.description ?? '',
          imageUrl: edits.imageUrl ?? row.imageUrl ?? row.image_url ?? '',
        };
        await adminPatchGalleryRow(row.id, patch, getAccessToken);
        const cats = normalizeCategories(row);
        for (const cat of cats) {
          if (pendingCategoryDeletes.has(cat.id)) continue;
          const ed = categoryEdits[cat.id];
          if (ed?.categoryName !== undefined && ed.categoryName !== (cat.categoryName ?? '')) {
            await adminPatchNested('gallery', 'gallery', row.id, 'categories', cat.id, { categoryName: ed.categoryName }, getAccessToken);
          }
        }
        for (const cat of pendingNewCategories[row.id] || []) {
          if (!cat.categoryName?.trim()) continue;
          await adminPostNested('gallery', 'gallery', row.id, 'categories', { categoryName: cat.categoryName.trim() }, getAccessToken);
        }
      }
      await portfolioService.clearCache();
      await onSave();
      await loadRows();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addRow = async () => {
    setError(null);
    setSaving(true);
    try {
      const created = await adminPostGalleryRow(
        { sortOrder: 0, title: 'New item', description: '', imageUrl: '' },
        getAccessToken
      );
      const withCats = { ...created, categories: [] };
      setRows((prev) => [withCats, ...prev]);
      await portfolioService.clearCache();
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, rowId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const { path: uploadedPath, url: uploadedUrl } = await adminUploadFile(
        file,
        { section: 'gallery', path: `gallery/${rowId}-${Date.now()}.${ext}` },
        getAccessToken
      );
      const url = uploadedUrl || uploadedPath;
      setRowEdits((prev) => ({ ...prev, [rowId]: { ...prev[rowId], imageUrl: url } }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleDragStart = (e, rowId) => {
    setDraggedId(rowId);
    e.dataTransfer.setData('text/plain', String(rowId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetRowId) => {
    e.preventDefault();
    const sourceId = Number(e.dataTransfer.getData('text/plain'));
    if (!sourceId || sourceId === targetRowId) {
      setDraggedId(null);
      return;
    }
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === sourceId);
      const targetIdx = prev.findIndex((r) => r.id === targetRowId);
      if (idx === -1 || targetIdx === -1) return prev;
      const next = [...prev];
      const [removed] = next.splice(idx, 1);
      next.splice(targetIdx, 0, removed);
      return next;
    });
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const addCategory = (galleryId) => {
    setPendingNewCategories((prev) => ({
      ...prev,
      [galleryId]: [...(prev[galleryId] || []), { categoryName: '' }],
    }));
  };

  const setNewCategoryName = (galleryId, index, value) => {
    setPendingNewCategories((prev) => {
      const list = [...(prev[galleryId] || [])];
      list[index] = { ...list[index], categoryName: value };
      return { ...prev, [galleryId]: list };
    });
  };

  const removeNewCategory = (galleryId, index) => {
    setPendingNewCategories((prev) => {
      const list = (prev[galleryId] || []).filter((_, i) => i !== index);
      return list.length ? { ...prev, [galleryId]: list } : (() => { const o = { ...prev }; delete o[galleryId]; return o; })();
    });
  };

  const displayRows = rows.filter((r) => !pendingRowDeletes.has(r.id));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Gallery</h1>
        <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Gallery items</h2>
          <p className="text-sm text-cream-600 mb-4">Drag items to reorder. Edit image, title, description, and tags. New items are added at the top.</p>
          <button
            type="button"
            onClick={addRow}
            disabled={saving}
            className="mb-4 text-sm text-cinnabar-600 hover:underline font-medium"
          >
            + Add gallery item
          </button>

          <ul className="space-y-4">
            {displayRows.map((row) => {
              const categories = normalizeCategories(row);
              const edit = rowEdits[row.id] || {};
              const title = edit.title ?? row.title ?? '';
              const description = edit.description ?? row.description ?? '';
              const imageUrl = edit.imageUrl ?? row.imageUrl ?? row.image_url ?? '';
              const imageDisplay = imageUrl
                ? (imageUrl.startsWith('http') ? imageUrl : portfolioService.getAssetUrl(imageUrl))
                : '';

              return (
                <li
                  key={row.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, row.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, row.id)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 bg-cream-100/80 rounded-xl border border-cream-300/80 space-y-4 ${draggedId === row.id ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-2 text-cream-500 text-sm mb-2">
                    <span className="cursor-grab active:cursor-grabbing" title="Drag to reorder">⋮⋮</span>
                    <span>Drag to reorder</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                    <div className="flex flex-col items-start gap-2">
                      <div className="w-full aspect-square max-w-[140px] rounded-lg overflow-hidden bg-cream-200 border border-cream-300">
                        {imageDisplay ? (
                          <img src={imageDisplay} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-cream-500 text-xs p-2 block">No image</span>
                        )}
                      </div>
                      <label className="cursor-pointer text-sm text-cinnabar-600 hover:underline">
                        Change image
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => handleImageUpload(e, row.id)}
                          disabled={saving}
                        />
                      </label>
                    </div>
                    <div className="min-w-0 space-y-3">
                      <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setRowEdits((p) => ({ ...p, [row.id]: { ...p[row.id], title: e.target.value } }))}
                        className="w-full px-3 py-2 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 text-sm"
                      />
                      <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setRowEdits((p) => ({ ...p, [row.id]: { ...p[row.id], description: e.target.value } }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 resize-y text-sm"
                      />
                      <div>
                        <label className="block text-xs font-medium text-cream-600 mb-1.5">Tags / categories</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => {
                            if (pendingCategoryDeletes.has(cat.id)) return null;
                            const name = categoryEdits[cat.id]?.categoryName ?? cat.categoryName ?? '';
                            return (
                              <span key={cat.id} className="inline-flex items-center gap-1 bg-white border border-cream-300 rounded-lg px-2 py-1">
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setCategoryEdits((p) => ({ ...p, [cat.id]: { categoryName: e.target.value } }))}
                                  className="w-28 px-1.5 py-0.5 text-sm border-0 rounded focus:ring-1 focus:ring-cinnabar-500/50"
                                  placeholder="Tag"
                                />
                                <button
                                  type="button"
                                  onClick={() => setPendingCategoryDeletes((p) => new Set(p).add(cat.id))}
                                  className="text-red-500 hover:underline text-xs"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                          {(pendingNewCategories[row.id] || []).map((cat, idx) => (
                            <span key={`new-${idx}`} className="inline-flex items-center gap-1 bg-cinnabar-50 border border-cinnabar-200 rounded-lg px-2 py-1">
                              <input
                                type="text"
                                value={cat.categoryName}
                                onChange={(e) => setNewCategoryName(row.id, idx, e.target.value)}
                                className="w-28 px-1.5 py-0.5 text-sm border-0 rounded focus:ring-1 focus:ring-cinnabar-500/50"
                                placeholder="New tag"
                              />
                              <button
                                type="button"
                                onClick={() => removeNewCategory(row.id, idx)}
                                className="text-red-500 hover:underline text-xs"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <button
                            type="button"
                            onClick={() => addCategory(row.id)}
                            className="text-sm text-cinnabar-600 hover:underline"
                          >
                            + Add tag
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingRowDeletes((p) => new Set(p).add(row.id))}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete this item
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="pt-2 pb-6 flex flex-col items-center text-center">
          {pendingRowDeletes.size > 0 && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full max-w-2xl">
              <strong>Marked for removal:</strong>{' '}
              {[...pendingRowDeletes]
                .map((id) => rows.find((r) => r.id === id)?.title || 'Item')
                .join(', ')}
              . Click Save to confirm.
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
          <p className="text-xs text-cream-500 mt-2">All edits and order are applied when you click Save.</p>
        </div>
      </div>
    </div>
  );
}
