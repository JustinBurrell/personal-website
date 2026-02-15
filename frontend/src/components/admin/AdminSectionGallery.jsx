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

const MONTH_ORDER = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

function parseDateKey(dateStr) {
  if (!dateStr) return 0;
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const month = MONTH_ORDER.indexOf(parts[0].toLowerCase());
  const year = parseInt(parts[parts.length - 1], 10) || 0;
  return year * 100 + (month >= 0 ? month : 0);
}

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
          fullDescription: edits.fullDescription ?? row.fullDescription ?? row.full_description ?? '',
          date: edits.date ?? row.date ?? '',
          showInCarousel: edits.showInCarousel ?? row.showInCarousel ?? row.show_in_carousel ?? false,
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

  const displayRows = rows
    .filter((r) => !pendingRowDeletes.has(r.id))
    .sort((a, b) => {
      const dateA = parseDateKey(rowEdits[a.id]?.date ?? a.date ?? '');
      const dateB = parseDateKey(rowEdits[b.id]?.date ?? b.date ?? '');
      return dateB - dateA;
    });

  const carouselCount = displayRows.filter((r) => {
    const edit = rowEdits[r.id];
    return edit?.showInCarousel ?? r.showInCarousel ?? r.show_in_carousel ?? false;
  }).length;

  const toggleCarousel = (rowId) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    const edit = rowEdits[rowId];
    const current = edit?.showInCarousel ?? row.showInCarousel ?? row.show_in_carousel ?? false;
    if (!current && carouselCount >= 5) {
      setError('Maximum 5 items can be shown in the carousel.');
      return;
    }
    setError(null);
    setRowEdits((p) => ({ ...p, [rowId]: { ...p[rowId], showInCarousel: !current } }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Gallery</h1>
        <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-display font-semibold text-cream-800 text-lg">Gallery items</h2>
            <span className="font-mono text-xs text-cream-400 tracking-wide">
              Carousel: {carouselCount}/5
            </span>
          </div>
          <p className="text-sm text-cream-600 mb-4">Items are sorted by date (newest first). Star items to show in the home carousel (max 5).</p>
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
              const fullDescription = edit.fullDescription ?? row.fullDescription ?? row.full_description ?? '';
              const date = edit.date ?? row.date ?? '';
              const isStarred = edit.showInCarousel ?? row.showInCarousel ?? row.show_in_carousel ?? false;
              const imageUrl = edit.imageUrl ?? row.imageUrl ?? row.image_url ?? '';
              const imageDisplay = imageUrl
                ? (imageUrl.startsWith('http') ? imageUrl : portfolioService.getAssetUrl(imageUrl))
                : '';

              return (
                <li
                  key={row.id}
                  className="p-4 bg-cream-100/80 rounded-xl border border-cream-300/80 space-y-4"
                >
                  <div className="flex items-center gap-2 text-cream-500 text-sm mb-2">
                    {date && (
                      <span className="font-mono text-xs text-cream-400 tracking-wide">{date}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleCarousel(row.id)}
                      title={isStarred ? 'Remove from carousel' : 'Show in carousel'}
                      className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isStarred
                          ? 'bg-cinnabar-50 text-cinnabar-600 border border-cinnabar-200'
                          : 'bg-cream-200/60 text-cream-400 border border-cream-300/60 hover:text-cinnabar-500 hover:border-cinnabar-200'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      {isStarred ? 'In carousel' : 'Add to carousel'}
                    </button>
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
                      <input
                        type="text"
                        placeholder="e.g. February 2026"
                        value={date}
                        onChange={(e) => setRowEdits((p) => ({ ...p, [row.id]: { ...p[row.id], date: e.target.value } }))}
                        className="w-full px-3 py-2 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 text-sm"
                      />
                      <textarea
                        placeholder="Description (shown on card)"
                        value={description}
                        onChange={(e) => setRowEdits((p) => ({ ...p, [row.id]: { ...p[row.id], description: e.target.value } }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 resize-y text-sm"
                      />
                      <div>
                        <label className="block text-xs font-medium text-cream-600 mb-1.5">Full description (shown on detail view)</label>
                        <textarea
                          placeholder="Longer description shown when clicking into the gallery item..."
                          value={fullDescription}
                          onChange={(e) => setRowEdits((p) => ({ ...p, [row.id]: { ...p[row.id], fullDescription: e.target.value } }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 resize-y text-sm"
                        />
                      </div>
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
