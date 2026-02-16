import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalData } from '../../hooks/useGlobalData';
import { useAuth } from '../../features/auth';
import {
  adminPatchSection,
  adminUploadFile,
  adminGetSectionItems,
  adminPostSectionItem,
  adminPatchSectionItem,
  adminDeleteSectionItem,
} from '../../features/auth';
import { portfolioService } from '../../services/supabase';
import AdminSectionAbout from './AdminSectionAbout';
import AdminSectionAwards from './AdminSectionAwards';
import AdminSectionEducation from './AdminSectionEducation';
import AdminSectionExperience from './AdminSectionExperience';
import AdminSectionGallery from './AdminSectionGallery';
import AdminSectionProjects from './AdminSectionProjects';
import AdminSectionEmails from './AdminSectionEmails';
import AdminSectionAdminEmails from './AdminSectionAdminEmails';

const SECTIONS = ['home', 'about', 'awards', 'education', 'experience', 'gallery', 'projects', 'emails', 'admin-emails'];

export default function AdminSection() {
  const { section } = useParams();
  const { data: globalData, loading: globalLoading, refetch } = useGlobalData();
  const { getAccessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [homeOrgs, setHomeOrgs] = useState([]);
  const [homeQualities, setHomeQualities] = useState([]);
  const [orgEdits, setOrgEdits] = useState({});
  const [pendingNewOrgs, setPendingNewOrgs] = useState([]);
  const [pendingOrgDeletes, setPendingOrgDeletes] = useState(new Set());
  const [qualEdits, setQualEdits] = useState({});
  const [pendingNewQualities, setPendingNewQualities] = useState([]);
  const [pendingQualDeletes, setPendingQualDeletes] = useState(new Set());

  useEffect(() => {
    if (!SECTIONS.includes(section)) {
      setLoading(false);
      return;
    }
    if (section === 'emails' || section === 'admin-emails') {
      setData([]);
      setLoading(false);
      return;
    }
    if (globalData && globalData[section] !== undefined) {
      setData(globalData[section]);
      if (section === 'home' && globalData[section]) {
        const home = globalData[section];
        setEditForm({
          title: home.title ?? '',
          description: home.description ?? '',
          resumeUrl: home.resumeUrl ?? '',
          imageUrl: home.imageUrl ?? home.image_url ?? '',
        });
        setHomeOrgs(Array.isArray(home.organizations) ? home.organizations : []);
        setHomeQualities(Array.isArray(home.qualities) ? home.qualities : []);
        setOrgEdits({});
        setPendingNewOrgs([]);
        setPendingOrgDeletes(new Set());
        setQualEdits({});
        setPendingNewQualities([]);
        setPendingQualDeletes(new Set());
      }
    }
    setLoading(false);
  }, [section, globalData]);

  useEffect(() => {
    if (section !== 'home' || !getAccessToken) return;
    let mounted = true;
    (async () => {
      try {
        const [orgs, quals] = await Promise.all([
          adminGetSectionItems('home', { itemType: 'organizations' }, getAccessToken),
          adminGetSectionItems('home', { itemType: 'qualities' }, getAccessToken),
        ]);
        if (mounted) {
          setHomeOrgs(Array.isArray(orgs) ? orgs : []);
          setHomeQualities(Array.isArray(quals) ? quals : []);
        }
      } catch {
        if (mounted) { setHomeOrgs([]); setHomeQualities([]); }
      }
    })();
    return () => { mounted = false; };
  }, [section, getAccessToken]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `images/home/hero-${Date.now()}.${ext}`;
      const { path: uploadedPath } = await adminUploadFile(file, { section: 'home', path }, getAccessToken);
      setEditForm((f) => ({ ...f, imageUrl: uploadedPath }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const handleSaveAllHome = async () => {
    setError(null);
    setSaving(true);
    try {
      await adminPatchSection('home', {
        title: editForm.title,
        description: editForm.description,
        resumeUrl: editForm.resumeUrl || undefined,
        imageUrl: editForm.imageUrl || undefined,
      }, getAccessToken);
      for (const id of pendingOrgDeletes) {
        await adminDeleteSectionItem('home', id, { itemType: 'organizations' }, getAccessToken);
      }
      for (const org of homeOrgs) {
        if (pendingOrgDeletes.has(org.id)) continue;
        const patch = orgEdits[org.id];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('home', org.id, { itemType: 'organizations', ...patch }, getAccessToken);
        }
      }
      for (const org of pendingNewOrgs) {
        await adminPostSectionItem('home', { itemType: 'organizations', name: org.name, orgUrl: org.orgUrl || '', orgColor: org.orgColor || '#6b7280' }, getAccessToken);
      }
      for (const id of pendingQualDeletes) {
        await adminDeleteSectionItem('home', id, { itemType: 'qualities' }, getAccessToken);
      }
      for (const q of homeQualities) {
        if (pendingQualDeletes.has(q.id)) continue;
        const patch = qualEdits[q.id];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('home', q.id, { itemType: 'qualities', ...patch }, getAccessToken);
        }
      }
      for (const qual of pendingNewQualities) {
        await adminPostSectionItem('home', { itemType: 'qualities', attribute: qual.attribute, description: qual.description || '' }, getAccessToken);
      }
      await portfolioService.clearCache();
      await refetch();
      setOrgEdits({});
      setPendingNewOrgs([]);
      setPendingOrgDeletes(new Set());
      setQualEdits({});
      setPendingNewQualities([]);
      setPendingQualDeletes(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!SECTIONS.includes(section)) {
    return <p className="text-cream-600">Unknown section: {section}</p>;
  }

  if (globalLoading || loading || data === undefined) {
    return (
      <div className="flex items-center gap-2 text-cream-600">
        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-cinnabar-500" />
        Loading…
      </div>
    );
  }

  if (section === 'home') {
    const displayOrgs = homeOrgs
      .filter((o) => !pendingOrgDeletes.has(o.id))
      .map((o) => ({ ...o, name: orgEdits[o.id]?.name ?? o.name ?? '', orgUrl: orgEdits[o.id]?.orgUrl ?? o.orgUrl ?? o.orgurl ?? '', orgColor: orgEdits[o.id]?.orgColor ?? o.orgColor ?? o.orgcolor ?? '#555' }));
    const displayQualities = homeQualities
      .filter((q) => !pendingQualDeletes.has(q.id))
      .map((q) => ({ ...q, attribute: qualEdits[q.id]?.attribute ?? q.attribute ?? '', description: qualEdits[q.id]?.description ?? q.description ?? '' }));
    const currentResumeUrl = editForm.resumeUrl || data?.resumeUrl;
    const currentImageUrl = editForm.imageUrl || data?.imageUrl || data?.image_url;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Home</h1>
          <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
        </div>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <div className="space-y-8">
          <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
            <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Headline & intro</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editForm.title ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 focus:border-cinnabar-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream-700 mb-1.5">Description</label>
                <textarea
                  value={editForm.description ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 focus:border-cinnabar-500 transition-shadow resize-y"
                />
              </div>
            </div>
          </section>

          <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
            <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Resume</h2>
            <p className="text-sm text-cream-600 mb-3">Stored as &quot;Justin Burrell Resume.pdf&quot;. Upload a new PDF to replace it.</p>
            {currentResumeUrl && (
              <p className="mb-3">
                <a
                  href={currentResumeUrl.startsWith('http') ? currentResumeUrl : portfolioService.getAssetUrl(currentResumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cinnabar-600 hover:underline text-sm"
                >
                  View current resume
                </a>
              </p>
            )}
            <input
              type="file"
              accept=".pdf,application/pdf"
              disabled={saving}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setError(null);
                setSaving(true);
                try {
                  const path = 'documents/Justin Burrell Resume.pdf';
                  const { path: uploadedPath } = await adminUploadFile(file, { section: 'home', path }, getAccessToken);
                  setEditForm((f) => ({ ...f, resumeUrl: uploadedPath }));
                } catch (err) { setError(err.message); }
                finally { setSaving(false); e.target.value = ''; }
              }}
              className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-cream-200 file:text-cream-800 file:text-sm"
            />
          </section>

          <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
            <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Hero image</h2>
            <p className="text-sm text-cream-600 mb-3">The large image at the top of the home page.</p>
            {currentImageUrl && (
              <div className="mb-3">
                <img
                  src={currentImageUrl.startsWith('http') ? currentImageUrl : portfolioService.getAssetUrl(currentImageUrl)}
                  alt="Hero"
                  className="max-h-44 w-auto object-contain rounded-xl border border-cream-300 shadow-sm"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            {!currentImageUrl && <p className="text-sm text-cream-500 mb-3">No hero image yet.</p>}
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
            <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Organizations</h2>
            <p className="text-sm text-cream-600 mb-4">Buttons under the hero: name, link, and color.</p>
            <ul className="space-y-3 mb-4">
              {displayOrgs.map((org) => (
                <li key={org.id} className="flex flex-wrap items-center gap-2 p-3 bg-cream-100/80 rounded-xl">
                  <input
                    type="text"
                    placeholder="Name"
                    value={org.name}
                    onChange={(e) => setOrgEdits((prev) => ({ ...prev, [org.id]: { ...prev[org.id], name: e.target.value } }))}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={org.orgUrl}
                    onChange={(e) => setOrgEdits((prev) => ({ ...prev, [org.id]: { ...prev[org.id], orgUrl: e.target.value } }))}
                    className="flex-1 min-w-[140px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  />
                  <span className="flex items-center gap-1.5">
                    <input
                      type="color"
                      title="Button color"
                      value={org.orgColor && String(org.orgColor).match(/^#?[0-9A-Fa-f]{6}$/) ? (org.orgColor.startsWith('#') ? org.orgColor : `#${org.orgColor}`) : '#555555'}
                      onChange={(e) => setOrgEdits((prev) => ({ ...prev, [org.id]: { ...prev[org.id], orgColor: e.target.value } }))}
                      className="h-9 w-10 cursor-pointer rounded-lg border border-cream-400"
                    />
                    <input
                      type="text"
                      placeholder="#hex"
                      value={org.orgColor}
                      onChange={(e) => setOrgEdits((prev) => ({ ...prev, [org.id]: { ...prev[org.id], orgColor: e.target.value } }))}
                      className="w-20 px-2 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => setPendingOrgDeletes((prev) => new Set(prev).add(org.id))}
                    className="text-red-600 hover:underline text-sm py-1"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {pendingNewOrgs.map((org, i) => (
                <li key={`new-${i}`} className="flex flex-wrap items-center gap-2 p-3 bg-cinnabar-50/80 rounded-xl border border-cinnabar-200">
                  <input
                    type="text"
                    placeholder="Name"
                    value={org.name}
                    onChange={(e) => setPendingNewOrgs((prev) => prev.map((o, j) => (j === i ? { ...o, name: e.target.value } : o)))}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={org.orgUrl}
                    onChange={(e) => setPendingNewOrgs((prev) => prev.map((o, j) => (j === i ? { ...o, orgUrl: e.target.value } : o)))}
                    className="flex-1 min-w-[140px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  />
                  <span className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={org.orgColor && String(org.orgColor).match(/^#?[0-9A-Fa-f]{6}$/) ? (org.orgColor.startsWith('#') ? org.orgColor : `#${org.orgColor}`) : '#6b7280'}
                      onChange={(e) => setPendingNewOrgs((prev) => prev.map((o, j) => (j === i ? { ...o, orgColor: e.target.value } : o)))}
                      className="h-9 w-10 cursor-pointer rounded-lg border border-cream-400"
                    />
                    <input
                      type="text"
                      placeholder="#hex"
                      value={org.orgColor}
                      onChange={(e) => setPendingNewOrgs((prev) => prev.map((o, j) => (j === i ? { ...o, orgColor: e.target.value } : o)))}
                      className="w-20 px-2 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => setPendingNewOrgs((prev) => prev.filter((_, j) => j !== i))}
                    className="text-red-600 hover:underline text-sm py-1"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setPendingNewOrgs((prev) => [...prev, { name: '', orgUrl: '', orgColor: '#6b7280' }])}
              className="text-sm text-cinnabar-600 hover:underline font-medium"
            >
              + Add organization
            </button>
          </section>

          <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
            <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Qualities</h2>
            <p className="text-sm text-cream-600 mb-4">Short attributes and descriptions (e.g. &quot;Creative&quot; / &quot;Design &amp; code&quot;).</p>
            <ul className="space-y-3 mb-4">
              {displayQualities.map((q) => (
                <li key={q.id} className="flex flex-wrap items-center gap-2 p-3 bg-cream-100/80 rounded-xl">
                  <input
                    type="text"
                    placeholder="Attribute"
                    value={q.attribute}
                    onChange={(e) => setQualEdits((prev) => ({ ...prev, [q.id]: { ...prev[q.id], attribute: e.target.value } }))}
                    className="flex-1 min-w-[100px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={q.description}
                    onChange={(e) => setQualEdits((prev) => ({ ...prev, [q.id]: { ...prev[q.id], description: e.target.value } }))}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setPendingQualDeletes((prev) => new Set(prev).add(q.id))}
                    className="text-red-600 hover:underline text-sm py-1"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {pendingNewQualities.map((qual, i) => (
                <li key={`new-q-${i}`} className="flex flex-wrap items-center gap-2 p-3 bg-cinnabar-50/80 rounded-xl border border-cinnabar-200">
                  <input
                    type="text"
                    placeholder="Attribute"
                    value={qual.attribute}
                    onChange={(e) => setPendingNewQualities((prev) => prev.map((q, j) => (j === i ? { ...q, attribute: e.target.value } : q)))}
                    className="flex-1 min-w-[100px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={qual.description}
                    onChange={(e) => setPendingNewQualities((prev) => prev.map((q, j) => (j === i ? { ...q, description: e.target.value } : q)))}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setPendingNewQualities((prev) => prev.filter((_, j) => j !== i))}
                    className="text-red-600 hover:underline text-sm py-1"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setPendingNewQualities((prev) => [...prev, { attribute: '', description: '' }])}
              className="text-sm text-cinnabar-600 hover:underline font-medium"
            >
              + Add quality
            </button>
          </section>

          <div className="pt-2 pb-6 flex flex-col items-center text-center">
            {((pendingOrgDeletes?.size > 0) || (pendingQualDeletes?.size > 0)) && (
              <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full max-w-2xl">
                <strong>Marked for removal:</strong>{' '}
                {[
                  ...(pendingOrgDeletes?.size ? [...pendingOrgDeletes].map((id) => homeOrgs.find((o) => o.id === id)?.name || 'Organization').join(', ') : []),
                  ...(pendingQualDeletes?.size ? [...pendingQualDeletes].map((id) => homeQualities.find((q) => q.id === id)?.attribute || 'Quality').join(', ') : []),
                ].filter(Boolean).join('; ')}
                . You must click Save changes to confirm.
              </p>
            )}
            <button
              type="button"
              onClick={handleSaveAllHome}
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

  const onSave = async () => {
    await portfolioService.clearCache();
    refetch();
  };

  if (section === 'about') return <AdminSectionAbout data={data} onSave={onSave} />;
  if (section === 'awards') return <AdminSectionAwards data={data} onSave={onSave} />;
  if (section === 'education') return <AdminSectionEducation data={data} onSave={onSave} />;
  if (section === 'experience') return <AdminSectionExperience data={data} onSave={onSave} />;
  if (section === 'gallery') return <AdminSectionGallery data={data} onSave={onSave} />;
  if (section === 'projects') return <AdminSectionProjects data={data} onSave={onSave} />;
  if (section === 'emails') return <AdminSectionEmails />;
  if (section === 'admin-emails') return <AdminSectionAdminEmails />;

  return (
    <div>
      <h1 className="font-display font-bold text-cream-800 text-2xl mb-4 capitalize">
        Edit: {section}
      </h1>
      <p className="text-cream-600 mb-4">
        No editor for this section. Current data (read-only):
      </p>
      <pre className="bg-cream-200 p-4 rounded-xl text-sm overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
