import React, { useState, useEffect, useCallback } from 'react';
import {
  useAuth,
  adminPatchSection,
  adminUploadFile,
  adminListStorageFiles,
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

const EXPERIENCE_IMAGE_PREFIX = 'images/home';

function ensureArray(v) {
  return Array.isArray(v) ? v : typeof v === 'string' ? (v ? [v] : []) : [];
}

const parseExperienceDate = (d) => {
  if (!d || typeof d !== 'string') return new Date(0);
  return new Date(d.trim()) || new Date(0);
};

const sortExperiencesByRecency = (companies) => {
  if (!companies || !Array.isArray(companies)) return [];
  return [...companies]
    .map((company) => ({
      ...company,
      positions: [...(company.positions || [])].sort(
        (a, b) => parseExperienceDate(b.startDate ?? b.start_date) - parseExperienceDate(a.startDate ?? a.start_date)
      ),
    }))
    .sort((a, b) => {
      const aLatest =
        a.positions?.length > 0
          ? parseExperienceDate(a.positions[0].startDate ?? a.positions[0].start_date)
          : new Date(0);
      const bLatest =
        b.positions?.length > 0
          ? parseExperienceDate(b.positions[0].startDate ?? b.positions[0].start_date)
          : new Date(0);
      return bLatest - aLatest;
    });
};

/** Stable component so inputs don't remount on parent state change (no focus loss). */
function CompanyCard({ company, type, ctx }) {
  const isExpanded = ctx.expandedCompany === `${type}-${company.id}`;
  const positions = company.positions || [];
  const newPositionsKey = `${type}-${company.id}`;
  const newPositions = ctx.pendingNewPositions[newPositionsKey] || [];
  const posDeletes = ctx.pendingPositionDeletes[`${type}-${company.id}`] || new Set();
  const companyEditKey = `${type}-${company.id}`;
  const companyPatch = ctx.companyEdits[companyEditKey] || {};
  const companyName = companyPatch.company ?? company.company ?? '';
  const companyUrl = companyPatch.companyUrl ?? company.companyUrl ?? '';
  const companyLocation = companyPatch.location ?? company.location ?? '';

  return (
    <li className="bg-cream-100/80 rounded-xl border border-cream-300/80 overflow-hidden">
      <button
        type="button"
        onClick={() => ctx.setExpandedCompany(isExpanded ? null : `${type}-${company.id}`)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-cream-200/60"
      >
        <span className="font-display font-semibold text-cream-800">{companyName || 'Unnamed company'}</span>
        <span className="text-cream-500 text-sm">{companyLocation || 'No location'}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-cream-300/80 space-y-4">
          <div className="grid gap-2">
            <input
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => ctx.setCompanyEdits((p) => ({ ...p, [companyEditKey]: { ...p[companyEditKey], company: e.target.value } }))}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30"
            />
            <input
              type="url"
              placeholder="Company URL"
              value={companyUrl}
              onChange={(e) => ctx.setCompanyEdits((p) => ({ ...p, [companyEditKey]: { ...p[companyEditKey], companyUrl: e.target.value } }))}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30"
            />
            <input
              type="text"
              placeholder="Location"
              value={companyLocation}
              onChange={(e) => ctx.setCompanyEdits((p) => ({ ...p, [companyEditKey]: { ...p[companyEditKey], location: e.target.value } }))}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30"
            />
          </div>

          <div>
            <h4 className="font-display font-medium text-cream-800 text-sm mb-2">Positions</h4>
            <ul className="space-y-3">
              {positions.map((pos) => {
                if (posDeletes.has(pos.id)) return null;
                const disp = ctx.getPositionDisplay(company, pos, type);
                return (
                  <li key={pos.id} className="p-3 bg-white/80 rounded-lg border border-cream-300/60 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        placeholder="Position title"
                        value={disp.position}
                        onChange={(e) => ctx.setPositionEdit(company.id, pos.id, null, type, 'position', e.target.value)}
                        className="flex-1 min-w-[160px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Start"
                        value={disp.startDate}
                        onChange={(e) => ctx.setPositionEdit(company.id, pos.id, null, type, 'startDate', e.target.value)}
                        className="w-24 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                      />
                      <input
                        type="text"
                        placeholder="End"
                        value={disp.endDate}
                        onChange={(e) => ctx.setPositionEdit(company.id, pos.id, null, type, 'endDate', e.target.value)}
                        className="w-24 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                      />
                      <button type="button" onClick={() => ctx.markPositionDelete(company.id, pos.id, type)} className="text-red-600 hover:underline text-sm">Remove position</button>
                    </div>
                    <div>
                      <label className="text-xs text-cream-600">Bullets (one per line)</label>
                      <textarea
                        value={disp.responsibilities.join('\n')}
                        onChange={(e) => ctx.setPositionEdit(company.id, pos.id, null, type, 'responsibilities', e.target.value.split('\n').filter(Boolean))}
                        rows={3}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-cream-600">Skills (comma or one per line)</label>
                      <textarea
                        value={Array.isArray(disp.skills) ? disp.skills.join(', ') : disp.skills}
                        onChange={(e) => ctx.setPositionEdit(company.id, pos.id, null, type, 'skills', e.target.value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean))}
                        rows={2}
                        className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-cream-600">Images</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {disp.images.map((img, i) => (
                          <span key={i} className="relative inline-block">
                            <img src={img.startsWith('http') ? img : portfolioService.getAssetUrl(img)} alt="" className="w-14 h-14 object-cover rounded border border-cream-300" />
                            <button type="button" onClick={() => ctx.removePositionImage(company.id, pos.id, null, type, i)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none">×</button>
                          </span>
                        ))}
                        <label className="cursor-pointer px-2 py-1 border border-cream-300 rounded text-sm bg-cream-100 hover:bg-cream-200 text-cream-700">
                          Add image (upload)
                          <input type="file" accept=".jpeg,.jpg,.png,.webp,.gif,.pdf" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const { url: u } = await adminUploadFile(file, { section: 'experience', experienceType: type }, ctx.getAccessToken); if (u) ctx.addPositionImage(company.id, pos.id, null, type, u); } catch (_) {} e.target.value = ''; }} />
                        </label>
                      </div>
                    </div>
                  </li>
                );
              })}
              {newPositions.map((newPos, idx) => {
                const k = `${type}-${company.id}-new-${newPos._idx}`;
                const ed = ctx.positionEdits[k] || {};
                const posD = { position: ed.position ?? newPos.position ?? '', startDate: ed.startDate ?? newPos.startDate ?? '', endDate: ed.endDate ?? newPos.endDate ?? '', responsibilities: ensureArray(ed.responsibilities ?? newPos.responsibilities), skills: ensureArray(ed.skills ?? newPos.skills), images: ensureArray(ed.images ?? newPos.images) };
                return (
                  <li key={`new-${newPos._idx}`} className="p-3 bg-cinnabar-50/80 rounded-lg border border-cinnabar-200 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <input type="text" placeholder="Position title" value={posD.position} onChange={(e) => ctx.setPositionEdit(company.id, null, newPos._idx, type, 'position', e.target.value)} className="flex-1 min-w-[160px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                      <input type="text" placeholder="Start" value={posD.startDate} onChange={(e) => ctx.setPositionEdit(company.id, null, newPos._idx, type, 'startDate', e.target.value)} className="w-24 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                      <input type="text" placeholder="End" value={posD.endDate} onChange={(e) => ctx.setPositionEdit(company.id, null, newPos._idx, type, 'endDate', e.target.value)} className="w-24 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" />
                      <button type="button" onClick={() => ctx.removeNewPosition(company.id, idx, type)} className="text-red-600 hover:underline text-sm">Remove</button>
                    </div>
                    <textarea value={posD.responsibilities.join('\n')} onChange={(e) => ctx.setPositionEdit(company.id, null, newPos._idx, type, 'responsibilities', e.target.value.split('\n').filter(Boolean))} rows={2} className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" placeholder="Bullets" />
                    <textarea value={posD.skills.join(', ')} onChange={(e) => ctx.setPositionEdit(company.id, null, newPos._idx, type, 'skills', e.target.value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean))} rows={1} className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white" placeholder="Skills" />
                    <div className="flex flex-wrap gap-2">
                      {posD.images.map((img, i) => (
                        <span key={i} className="relative">
                          <img src={img.startsWith('http') ? img : portfolioService.getAssetUrl(img)} alt="" className="w-14 h-14 object-cover rounded border" />
                          <button type="button" onClick={() => ctx.removePositionImage(company.id, null, newPos._idx, type, i)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs">×</button>
                        </span>
                      ))}
                      <label className="cursor-pointer px-2 py-1 border border-cream-300 rounded text-sm bg-cream-100 hover:bg-cream-200 text-cream-700">Add image (upload)<input type="file" accept=".jpeg,.jpg,.png,.webp,.gif,.pdf" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const { url: u } = await adminUploadFile(file, { section: 'experience', experienceType: type }, ctx.getAccessToken); if (u) ctx.addPositionImage(company.id, null, newPos._idx, type, u); } catch (_) {} e.target.value = ''; }} /></label>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={() => ctx.addNewPosition(company.id, type)} className="mt-2 text-sm text-cinnabar-600 hover:underline font-medium">+ Add position</button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-cream-300/60">
            <button type="button" onClick={() => ctx.setPendingCompanyDeletes((p) => new Set(p).add(company.id))} className="text-sm text-red-600 hover:underline">Delete company</button>
            {type === 'professional' && (
              <button type="button" onClick={() => ctx.moveCompanyTo(company, 'professional', 'leadership')} className="text-sm text-cream-600 hover:underline">Move to Leadership</button>
            )}
            {type === 'leadership' && (
              <button type="button" onClick={() => ctx.moveCompanyTo(company, 'leadership', 'professional')} className="text-sm text-cream-600 hover:underline">Move to Professional</button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function AdminSectionExperience({ data, onSave }) {
  const { getAccessToken } = useAuth();
  const experienceRow = Array.isArray(data) ? data?.[0] : data;
  const [editForm, setEditForm] = useState({ description: '', experienceImageUrl: '' });
  const [homeImages, setHomeImages] = useState([]);
  const [professional, setProfessional] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [companyEdits, setCompanyEdits] = useState({});
  const [positionEdits, setPositionEdits] = useState({});
  const [pendingNewPositions, setPendingNewPositions] = useState({});
  const [pendingPositionDeletes, setPendingPositionDeletes] = useState({});
  const [pendingCompanyDeletes, setPendingCompanyDeletes] = useState(new Set());
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (experienceRow) {
      setEditForm({
        description: experienceRow.description ?? '',
        experienceImageUrl: experienceRow.experienceImageUrl ?? experienceRow.experience_image_url ?? '',
      });
    }
  }, [experienceRow]);

  const loadHomeImages = useCallback(async () => {
    try {
      const { files } = await adminListStorageFiles(EXPERIENCE_IMAGE_PREFIX, getAccessToken);
      setHomeImages(Array.isArray(files) ? files : []);
    } catch {
      setHomeImages([]);
    }
  }, [getAccessToken]);

  const loadCompaniesWithPositions = useCallback(async (type) => {
    try {
      const list = await adminGetSectionItems('experience', { itemType: type }, getAccessToken);
      const companies = Array.isArray(list) ? list : [];
      const withPositions = await Promise.all(
        companies.map(async (c) => {
          const parentTable = type === 'professional' ? 'experience_professional' : 'experience_leadership';
          const positions = await adminGetNested('experience', parentTable, c.id, 'positions', getAccessToken);
          return { ...c, positions: Array.isArray(positions) ? positions : [] };
        })
      );
      return withPositions;
    } catch {
      return [];
    }
  }, [getAccessToken]);

  const loadAll = useCallback(async () => {
    const [pro, lead] = await Promise.all([
      loadCompaniesWithPositions('professional'),
      loadCompaniesWithPositions('leadership'),
    ]);
    setProfessional(sortExperiencesByRecency(pro));
    setLeadership(sortExperiencesByRecency(lead));
    setCompanyEdits({});
    setPositionEdits({});
    setPendingNewPositions({});
    setPendingPositionDeletes({});
    setPendingCompanyDeletes(new Set());
  }, [loadCompaniesWithPositions]);

  useEffect(() => {
    loadHomeImages();
  }, [loadHomeImages]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const parentTable = (type) => (type === 'professional' ? 'experience_professional' : 'experience_leadership');

  const handleSectionImageSelect = (pathOrUrl) => {
    setEditForm((f) => ({ ...f, experienceImageUrl: pathOrUrl || '' }));
  };

  const handleSectionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const { path: uploadedPath, url: uploadedUrl } = await adminUploadFile(file, { section: 'experience' }, getAccessToken);
      setEditForm((f) => ({ ...f, experienceImageUrl: uploadedUrl || uploadedPath }));
      await loadHomeImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const getPositionDisplay = (company, pos, type) => {
    const key = `${type}-${company.id}-${pos.id ?? `new-${pos._idx}`}`;
    const edits = positionEdits[key] || {};
    return {
      position: edits.position ?? pos.position ?? '',
      startDate: edits.startDate ?? pos.startDate ?? pos.start_date ?? '',
      endDate: edits.endDate ?? pos.endDate ?? pos.end_date ?? '',
      responsibilities: ensureArray(edits.responsibilities ?? pos.responsibilities ?? []),
      skills: ensureArray(edits.skills ?? pos.skills ?? []),
      images: ensureArray(edits.images ?? pos.images ?? []),
    };
  };

  const setPositionEdit = (companyId, posId, _idx, type, field, value) => {
    const key = `${type}-${companyId}-${posId ?? `new-${_idx}`}`;
    setPositionEdits((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const addNewPosition = (companyId, type) => {
    const key = `${type}-${companyId}`;
    setPendingNewPositions((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { _idx: Date.now(), position: '', startDate: '', endDate: '', responsibilities: [], skills: [], images: [] }],
    }));
  };

  const removeNewPosition = (companyId, idx, type) => {
    const key = `${type}-${companyId}`;
    setPendingNewPositions((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== idx),
    }));
  };

  const markPositionDelete = (companyId, positionId, type) => {
    setPendingPositionDeletes((prev) => {
      const key = `${type}-${companyId}`;
      const set = new Set(prev[key] || []);
      set.add(positionId);
      return { ...prev, [key]: set };
    });
  };

  const addPositionImage = (companyId, posId, _idx, type, urlOrPath) => {
    const key = `${type}-${companyId}-${posId ?? `new-${_idx}`}`;
    const current = positionEdits[key];
    const images = ensureArray(current?.images);
    if (!urlOrPath) return;
    setPositionEdits((prev) => ({ ...prev, [key]: { ...prev[key], images: [...images, urlOrPath] } }));
  };

  const removePositionImage = (companyId, posId, _idx, type, imgIndex) => {
    const key = `${type}-${companyId}-${posId ?? `new-${_idx}`}`;
    const current = positionEdits[key];
    const images = ensureArray(current?.images ?? getPositionDisplay({ id: companyId }, posId ? { images: [] } : {}, type).images);
    const next = images.filter((_, i) => i !== imgIndex);
    setPositionEdits((prev) => ({ ...prev, [key]: { ...prev[key], images: next } }));
  };

  const handleSaveAll = async () => {
    setError(null);
    setSaving(true);
    try {
      await adminPatchSection('experience', {
        description: editForm.description,
        experienceImageUrl: editForm.experienceImageUrl || undefined,
      }, getAccessToken);

      for (const id of pendingCompanyDeletes) {
        const inPro = professional.some((c) => c.id === id);
        await adminDeleteSectionItem('experience', id, { itemType: inPro ? 'professional' : 'leadership' }, getAccessToken);
      }

      for (const company of professional) {
        if (pendingCompanyDeletes.has(company.id)) continue;
        const patch = companyEdits[`professional-${company.id}`];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('experience', company.id, { itemType: 'professional', ...patch }, getAccessToken);
        }
        const pTable = 'experience_professional';
        const posDeletes = pendingPositionDeletes[`professional-${company.id}`];
        if (posDeletes?.size) {
          for (const pid of posDeletes) {
            await adminDeleteNested('experience', pTable, company.id, 'positions', pid, getAccessToken);
          }
        }
        for (const pos of company.positions || []) {
          if (posDeletes?.has(pos.id)) continue;
          const key = `professional-${company.id}-${pos.id}`;
          const patchPos = positionEdits[key];
          if (patchPos && Object.keys(patchPos).length) {
            const fullState = getPositionDisplay(company, pos, 'professional');
            await adminPatchNested('experience', pTable, company.id, 'positions', pos.id, fullState, getAccessToken);
          }
        }
        for (const newPos of pendingNewPositions[`professional-${company.id}`] || []) {
          const newKey = `professional-${company.id}-new-${newPos._idx}`;
          const ed = positionEdits[newKey] || {};
          const payload = {
            position: ed.position ?? newPos.position ?? 'Position',
            startDate: ed.startDate ?? newPos.startDate ?? '',
            endDate: ed.endDate ?? newPos.endDate ?? '',
            responsibilities: ensureArray(ed.responsibilities ?? newPos.responsibilities ?? []),
            skills: ensureArray(ed.skills ?? newPos.skills ?? []),
            images: ensureArray(ed.images ?? newPos.images ?? []),
          };
          await adminPostNested('experience', pTable, company.id, 'positions', payload, getAccessToken);
        }
      }

      for (const company of leadership) {
        if (pendingCompanyDeletes.has(company.id)) continue;
        const patch = companyEdits[`leadership-${company.id}`];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('experience', company.id, { itemType: 'leadership', ...patch }, getAccessToken);
        }
        const lTable = 'experience_leadership';
        const posDeletes = pendingPositionDeletes[`leadership-${company.id}`];
        if (posDeletes?.size) {
          for (const pid of posDeletes) {
            await adminDeleteNested('experience', lTable, company.id, 'positions', pid, getAccessToken);
          }
        }
        for (const pos of company.positions || []) {
          if (posDeletes?.has(pos.id)) continue;
          const key = `leadership-${company.id}-${pos.id}`;
          const patchPos = positionEdits[key];
          if (patchPos && Object.keys(patchPos).length) {
            const fullState = getPositionDisplay(company, pos, 'leadership');
            await adminPatchNested('experience', lTable, company.id, 'positions', pos.id, fullState, getAccessToken);
          }
        }
        for (const newPos of pendingNewPositions[`leadership-${company.id}`] || []) {
          const newKey = `leadership-${company.id}-new-${newPos._idx}`;
          const ed = positionEdits[newKey] || {};
          const payload = {
            position: ed.position ?? newPos.position ?? 'Position',
            startDate: ed.startDate ?? newPos.startDate ?? '',
            endDate: ed.endDate ?? newPos.endDate ?? '',
            responsibilities: ensureArray(ed.responsibilities ?? newPos.responsibilities ?? []),
            skills: ensureArray(ed.skills ?? newPos.skills ?? []),
            images: ensureArray(ed.images ?? newPos.images ?? []),
          };
          await adminPostNested('experience', lTable, company.id, 'positions', payload, getAccessToken);
        }
      }

      await portfolioService.clearCache();
      await onSave();
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addCompany = async (type) => {
    setError(null);
    setSaving(true);
    try {
      await adminPostSectionItem('experience', {
        itemType: type,
        company: 'New Company',
        companyUrl: '',
        location: '',
      }, getAccessToken);
      await loadAll();
      await portfolioService.clearCache();
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const moveCompanyTo = (company, fromType, toType) => {
    if (fromType === toType) return;
    setPendingCompanyDeletes((prev) => new Set(prev).add(company.id));
    const parentTableFrom = parentTable(fromType);
    const parentTableTo = parentTable(toType);
    (async () => {
      setSaving(true);
      setError(null);
      try {
        const editKey = `${fromType}-${company.id}`;
        const edits = companyEdits[editKey] || {};
        const created = await adminPostSectionItem('experience', {
          itemType: toType,
          company: edits.company ?? company.company ?? '',
          companyUrl: edits.companyUrl ?? company.companyUrl ?? '',
          location: edits.location ?? company.location ?? '',
        }, getAccessToken);
        await adminDeleteSectionItem('experience', company.id, { itemType: fromType }, getAccessToken);
        for (const pos of company.positions || []) {
          await adminPostNested('experience', parentTableTo, created.id, 'positions', {
            position: pos.position ?? '',
            startDate: pos.startDate ?? pos.start_date ?? '',
            endDate: pos.endDate ?? pos.end_date ?? '',
            responsibilities: pos.responsibilities ?? [],
            skills: pos.skills ?? [],
            images: pos.images ?? [],
          }, getAccessToken);
        }
        await loadAll();
        await portfolioService.clearCache();
        onSave();
        setPendingCompanyDeletes((prev) => { const s = new Set(prev); s.delete(company.id); return s; });
      } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
    })();
  };

  const displayProfessional = professional.filter((c) => !pendingCompanyDeletes.has(c.id));
  const displayLeadership = leadership.filter((c) => !pendingCompanyDeletes.has(c.id));
  const currentSectionImageUrl = editForm.experienceImageUrl || experienceRow?.experienceImageUrl || experienceRow?.experience_image_url;
  const sectionImageDisplayUrl = currentSectionImageUrl
    ? (currentSectionImageUrl.startsWith('http') ? currentSectionImageUrl : portfolioService.getAssetUrl(currentSectionImageUrl))
    : '';

  const companyCardCtx = {
    expandedCompany,
    setExpandedCompany,
    companyEdits,
    setCompanyEdits,
    positionEdits,
    setPositionEdit,
    getPositionDisplay,
    pendingNewPositions,
    addNewPosition,
    removeNewPosition,
    pendingPositionDeletes,
    markPositionDelete,
    addPositionImage,
    removePositionImage,
    homeImages,
    getAccessToken,
    setPendingCompanyDeletes,
    moveCompanyTo,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Experience</h1>
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
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Section image</h2>
          <p className="text-sm text-cream-600 mb-3">Pick from existing images in <code className="text-xs bg-cream-200 px-1 rounded">assets/images/home</code> or upload a new one.</p>
          {sectionImageDisplayUrl && (
            <div className="mb-3">
              <img src={sectionImageDisplayUrl} alt="Experience section" className="max-h-52 w-auto object-contain rounded-xl border border-cream-300" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            <select
              value=""
              onChange={(e) => { const v = e.target.value; if (v) handleSectionImageSelect(v); e.target.value = ''; }}
              className="px-3 py-2 border border-cream-300 rounded-xl bg-white text-cream-800 text-sm focus:ring-2 focus:ring-cinnabar-500/30"
            >
              <option value="">Choose from existing…</option>
              {homeImages.map((f) => (
                <option key={f.path} value={f.url || f.path}>{f.name}</option>
              ))}
            </select>
            <input type="file" accept=".jpeg,.jpg,.png,.webp,.gif,.pdf" onChange={handleSectionImageUpload} disabled={saving} className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-cream-200 file:text-cream-800" />
            <p className="text-xs text-cream-500 mt-1">Accepted: .jpeg, .jpg, .png, .webp, .gif, .pdf</p>
          </div>
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Professional experience</h2>
          <ul className="space-y-2">
            {displayProfessional.map((c) => (
              <CompanyCard key={c.id} company={c} type="professional" ctx={companyCardCtx} />
            ))}
          </ul>
          <button type="button" onClick={() => addCompany('professional')} disabled={saving} className="mt-3 text-sm text-cinnabar-600 hover:underline font-medium">+ Add company</button>
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Leadership experience</h2>
          <ul className="space-y-2">
            {displayLeadership.map((c) => (
              <CompanyCard key={c.id} company={c} type="leadership" ctx={companyCardCtx} />
            ))}
          </ul>
          <button type="button" onClick={() => addCompany('leadership')} disabled={saving} className="mt-3 text-sm text-cinnabar-600 hover:underline font-medium">+ Add company</button>
        </section>

        <div className="flex flex-col items-center gap-4 text-center pt-2 pb-6">
          {[...pendingCompanyDeletes].length > 0 && (
            <span className="text-sm text-cream-600">
              <strong>Marked for removal:</strong> {[...pendingCompanyDeletes].length} company(ies). Save to confirm.
            </span>
          )}
          <button type="button" onClick={handleSaveAll} disabled={saving} className="w-full sm:w-auto min-w-[200px] px-6 py-3 bg-cinnabar-500 text-white font-display font-semibold rounded-xl hover:bg-cinnabar-600 focus:ring-2 focus:ring-cinnabar-500/30 disabled:opacity-50 shadow-md hover:shadow-lg transition-all">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
