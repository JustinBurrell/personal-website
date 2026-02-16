import React, { useState, useEffect } from 'react';
import {
  useAuth,
  adminPatchSection,
  adminUploadFile,
  adminGetSectionItems,
  adminPostSectionItem,
  adminPatchSectionItem,
  adminDeleteSectionItem,
} from '../../features/auth';
import { portfolioService } from '../../services/supabase';

const AWARDS_BACKGROUND_PATH = 'images/awards/About Background.gif';

export default function AdminSectionAwards({ data, onSave }) {
  const { getAccessToken } = useAuth();
  const awardGroup = Array.isArray(data) ? data?.[0] : data;
  const [editForm, setEditForm] = useState({ description: '', awardImageUrl: '' });
  const [items, setItems] = useState([]);
  const [itemEdits, setItemEdits] = useState({});
  const [pendingNewItems, setPendingNewItems] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (awardGroup) {
      setEditForm({
        description: awardGroup.description ?? '',
        awardImageUrl: awardGroup.awardImageUrl ?? awardGroup.award_image_url ?? '',
      });
    }
  }, [awardGroup]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await adminGetSectionItems('awards', { itemType: 'items' }, getAccessToken);
        if (mounted) {
          setItems(Array.isArray(list) ? list : []);
          setItemEdits({});
          setPendingNewItems([]);
          setPendingDeletes(new Set());
        }
      } catch {
        if (mounted) setItems([]);
      }
    })();
    return () => { mounted = false; };
  }, [getAccessToken]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const path = AWARDS_BACKGROUND_PATH;
      const { path: uploadedPath } = await adminUploadFile(file, { section: 'awards', path }, getAccessToken);
      setEditForm((f) => ({ ...f, awardImageUrl: uploadedPath }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleSaveAllAwards = async () => {
    setError(null);
    setSaving(true);
    try {
      await adminPatchSection('awards', {
        description: editForm.description,
        awardImageUrl: editForm.awardImageUrl || undefined,
      }, getAccessToken);
      for (const id of pendingDeletes) {
        await adminDeleteSectionItem('awards', id, { itemType: 'items' }, getAccessToken);
      }
      for (const item of items) {
        if (pendingDeletes.has(item.id)) continue;
        const patch = itemEdits[item.id];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('awards', item.id, { itemType: 'items', ...patch }, getAccessToken);
        }
      }
      for (const row of pendingNewItems) {
        await adminPostSectionItem('awards', {
          itemType: 'items',
          title: row.title ?? '',
          organization: row.organization ?? '',
          date: row.date ?? '',
          description: row.description ?? '',
        }, getAccessToken);
      }
      await portfolioService.clearCache();
      await onSave();
      const list = await adminGetSectionItems('awards', { itemType: 'items' }, getAccessToken);
      setItems(Array.isArray(list) ? list : []);
      setItemEdits({});
      setPendingNewItems([]);
      setPendingDeletes(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const displayItems = items
    .filter((i) => !pendingDeletes.has(i.id))
    .map((i) => ({
      ...i,
      title: itemEdits[i.id]?.title ?? i.title ?? '',
      organization: itemEdits[i.id]?.organization ?? i.organization ?? '',
      date: itemEdits[i.id]?.date ?? i.date ?? '',
      description: itemEdits[i.id]?.description ?? i.description ?? '',
    }));

  const currentImageUrl = editForm.awardImageUrl || awardGroup?.awardImageUrl || awardGroup?.award_image_url;
  const imageDisplayUrl = currentImageUrl
    ? (currentImageUrl.startsWith('http') ? currentImageUrl : portfolioService.getAssetUrl(currentImageUrl))
    : portfolioService.getAssetUrl(AWARDS_BACKGROUND_PATH);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Awards</h1>
        <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Section description</h2>
          <p className="text-sm text-cream-600 mb-3">Intro text shown at the top of the Awards section.</p>
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2.5 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 focus:border-cinnabar-500 transition-shadow resize-y"
          />
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Background image</h2>
          <p className="text-sm text-cream-600 mb-3">Stored as &quot;About Background.gif&quot; in <code className="text-xs bg-cream-200 px-1 rounded">images/awards/</code>. Upload a new file to replace it.</p>
          <div className="mb-3">
            <img
              src={imageDisplayUrl}
              alt="Awards background"
              className="max-h-52 w-auto object-contain rounded-xl border border-cream-300 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <input
            type="file"
            accept=".jpeg,.jpg,.png,.webp,.gif,.pdf"
            onChange={handleImageUpload}
            disabled={saving}
            className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-cream-200 file:text-cream-800 file:text-sm"
          />
          <p className="text-xs text-cream-500 mt-1">Accepted: .jpeg, .jpg, .png, .webp, .gif, .pdf</p>
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Award entries</h2>
          <p className="text-sm text-cream-600 mb-4">Each award: title, organization, date, and description.</p>
          <ul className="space-y-4 mb-4">
            {displayItems.map((item) => (
              <li key={item.id} className="p-4 bg-cream-100/80 rounded-xl space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], title: e.target.value } }))}
                    className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  />
                  <input
                    type="text"
                    placeholder="Organization"
                    value={item.organization}
                    onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], organization: e.target.value } }))}
                    className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Date"
                  value={item.date}
                  onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], date: e.target.value } }))}
                  className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                />
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], description: e.target.value } }))}
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30 resize-y"
                />
                <button
                  type="button"
                  onClick={() => setPendingDeletes((prev) => new Set(prev).add(item.id))}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
            {pendingNewItems.map((row, i) => (
              <li key={`new-${i}`} className="p-4 bg-cinnabar-50/80 rounded-xl border border-cinnabar-200 space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={row.title ?? ''}
                    onChange={(e) => setPendingNewItems((prev) => prev.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)))}
                    className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Organization"
                    value={row.organization ?? ''}
                    onChange={(e) => setPendingNewItems((prev) => prev.map((r, j) => (j === i ? { ...r, organization: e.target.value } : r)))}
                    className="px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Date"
                  value={row.date ?? ''}
                  onChange={(e) => setPendingNewItems((prev) => prev.map((r, j) => (j === i ? { ...r, date: e.target.value } : r)))}
                  className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                />
                <textarea
                  placeholder="Description"
                  value={row.description ?? ''}
                  onChange={(e) => setPendingNewItems((prev) => prev.map((r, j) => (j === i ? { ...r, description: e.target.value } : r)))}
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white resize-y"
                />
                <button
                  type="button"
                  onClick={() => setPendingNewItems((prev) => prev.filter((_, j) => j !== i))}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPendingNewItems((prev) => [...prev, { title: '', organization: '', date: '', description: '' }])}
            className="text-sm text-cinnabar-600 hover:underline font-medium"
          >
            + Add award
          </button>
        </section>

        <div className="pt-2 pb-6 flex flex-col items-center text-center">
          {pendingDeletes.size > 0 && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full max-w-2xl">
              <strong>Marked for removal:</strong> {[...pendingDeletes].map((id) => items.find((i) => i.id === id)?.title || 'Award').join(', ')}. You must click Save changes to confirm.
            </p>
          )}
          <button
            type="button"
            onClick={handleSaveAllAwards}
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
