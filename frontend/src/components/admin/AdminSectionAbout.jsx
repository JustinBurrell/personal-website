import React, { useState, useEffect } from 'react';
import {
  useAuth,
  adminPatchSection,
  adminGetSectionItems,
  adminPostSectionItem,
  adminPatchSectionItem,
  adminDeleteSectionItem,
} from '../../features/auth';
import { portfolioService } from '../../services/supabase';

export default function AdminSectionAbout({ data, onSave }) {
  const { getAccessToken } = useAuth();
  const [editForm, setEditForm] = useState({ introduction: '' });
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [skillEdits, setSkillEdits] = useState({});
  const [pendingNewSkills, setPendingNewSkills] = useState([]);
  const [pendingSkillDeletes, setPendingSkillDeletes] = useState(new Set());
  const [interestEdits, setInterestEdits] = useState({});
  const [pendingNewInterests, setPendingNewInterests] = useState([]);
  const [pendingInterestDeletes, setPendingInterestDeletes] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setEditForm({ introduction: data.introduction ?? '' });
    }
  }, [data]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, i] = await Promise.all([
          adminGetSectionItems('about', { itemType: 'skills' }, getAccessToken),
          adminGetSectionItems('about', { itemType: 'interests' }, getAccessToken),
        ]);
        if (mounted) {
          setSkills(Array.isArray(s) ? s : []);
          setInterests(Array.isArray(i) ? i : []);
          setSkillEdits({});
          setPendingNewSkills([]);
          setPendingSkillDeletes(new Set());
          setInterestEdits({});
          setPendingNewInterests([]);
          setPendingInterestDeletes(new Set());
        }
      } catch {
        if (mounted) {
          setSkills([]);
          setInterests([]);
        }
      }
    })();
    return () => { mounted = false; };
  }, [getAccessToken]);

  const handleSaveAllAbout = async () => {
    setError(null);
    setSaving(true);
    try {
      await adminPatchSection('about', { introduction: editForm.introduction }, getAccessToken);
      for (const id of pendingSkillDeletes) {
        await adminDeleteSectionItem('about', id, { itemType: 'skills' }, getAccessToken);
      }
      for (const s of skills) {
        if (pendingSkillDeletes.has(s.id)) continue;
        const patch = skillEdits[s.id];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('about', s.id, { itemType: 'skills', ...patch }, getAccessToken);
        }
      }
      for (const skill of pendingNewSkills) {
        const val = (skill.skill ?? '').trim();
        if (val) await adminPostSectionItem('about', { itemType: 'skills', skill: val }, getAccessToken);
      }
      for (const id of pendingInterestDeletes) {
        await adminDeleteSectionItem('about', id, { itemType: 'interests' }, getAccessToken);
      }
      for (const i of interests) {
        if (pendingInterestDeletes.has(i.id)) continue;
        const patch = interestEdits[i.id];
        if (patch && Object.keys(patch).length) {
          await adminPatchSectionItem('about', i.id, { itemType: 'interests', ...patch }, getAccessToken);
        }
      }
      for (const interest of pendingNewInterests) {
        const val = (interest.interest ?? '').trim();
        if (val) await adminPostSectionItem('about', { itemType: 'interests', interest: val }, getAccessToken);
      }
      await portfolioService.clearCache();
      await onSave();
      const [sList, iList] = await Promise.all([
        adminGetSectionItems('about', { itemType: 'skills' }, getAccessToken),
        adminGetSectionItems('about', { itemType: 'interests' }, getAccessToken),
      ]);
      setSkills(Array.isArray(sList) ? sList : []);
      setInterests(Array.isArray(iList) ? iList : []);
      setSkillEdits({});
      setPendingNewSkills([]);
      setPendingSkillDeletes(new Set());
      setInterestEdits({});
      setPendingNewInterests([]);
      setPendingInterestDeletes(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const displaySkills = skills
    .filter((s) => !pendingSkillDeletes.has(s.id))
    .map((s) => ({ ...s, skill: skillEdits[s.id]?.skill ?? s.skill ?? '' }));
  const displayInterests = interests
    .filter((i) => !pendingInterestDeletes.has(i.id))
    .map((i) => ({ ...i, interest: interestEdits[i.id]?.interest ?? i.interest ?? '' }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">About</h1>
        <p className="text-cream-600 text-sm">Edit the hero and section content. Save at the bottom to apply changes.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-8">
        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-4">Introduction</h2>
          <p className="text-sm text-cream-600 mb-3">The main about text shown at the top of the section.</p>
          <textarea
            value={editForm.introduction}
            onChange={(e) => setEditForm((f) => ({ ...f, introduction: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2.5 border border-cream-300 rounded-xl bg-white text-cream-800 focus:ring-2 focus:ring-cinnabar-500/30 focus:border-cinnabar-500 transition-shadow resize-y"
          />
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Skills</h2>
          <p className="text-sm text-cream-600 mb-4">List of skills. Edit in place or add new; remove will apply when you Save.</p>
          <ul className="space-y-2 mb-4">
            {displaySkills.map((s) => (
              <li key={s.id} className="flex items-center gap-2 p-3 bg-cream-100/80 rounded-xl">
                <input
                  type="text"
                  value={s.skill}
                  onChange={(e) => setSkillEdits((prev) => ({ ...prev, [s.id]: { skill: e.target.value } }))}
                  className="flex-1 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  placeholder="Skill"
                />
                <button
                  type="button"
                  onClick={() => setPendingSkillDeletes((prev) => new Set(prev).add(s.id))}
                  className="text-red-600 hover:underline text-sm py-1"
                >
                  Remove
                </button>
              </li>
            ))}
            {pendingNewSkills.map((item, i) => (
              <li key={`new-s-${i}`} className="flex items-center gap-2 p-3 bg-cinnabar-50/80 rounded-xl border border-cinnabar-200">
                <input
                  type="text"
                  value={item.skill ?? ''}
                  onChange={(e) => setPendingNewSkills((prev) => prev.map((x, j) => (j === i ? { ...x, skill: e.target.value } : x)))}
                  className="flex-1 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  placeholder="New skill"
                />
                <button
                  type="button"
                  onClick={() => setPendingNewSkills((prev) => prev.filter((_, j) => j !== i))}
                  className="text-red-600 hover:underline text-sm py-1"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPendingNewSkills((prev) => [...prev, { skill: '' }])}
            className="text-sm text-cinnabar-600 hover:underline font-medium"
          >
            + Add skill
          </button>
        </section>

        <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-6 shadow-sm">
          <h2 className="font-display font-semibold text-cream-800 text-lg mb-2">Interests</h2>
          <p className="text-sm text-cream-600 mb-4">List of interests. Edit in place or add new; remove will apply when you Save.</p>
          <ul className="space-y-2 mb-4">
            {displayInterests.map((i) => (
              <li key={i.id} className="flex items-center gap-2 p-3 bg-cream-100/80 rounded-xl">
                <input
                  type="text"
                  value={i.interest}
                  onChange={(e) => setInterestEdits((prev) => ({ ...prev, [i.id]: { interest: e.target.value } }))}
                  className="flex-1 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cinnabar-500/30"
                  placeholder="Interest"
                />
                <button
                  type="button"
                  onClick={() => setPendingInterestDeletes((prev) => new Set(prev).add(i.id))}
                  className="text-red-600 hover:underline text-sm py-1"
                >
                  Remove
                </button>
              </li>
            ))}
            {pendingNewInterests.map((item, idx) => (
              <li key={`new-i-${idx}`} className="flex items-center gap-2 p-3 bg-cinnabar-50/80 rounded-xl border border-cinnabar-200">
                <input
                  type="text"
                  value={item.interest ?? ''}
                  onChange={(e) => setPendingNewInterests((prev) => prev.map((x, j) => (j === idx ? { ...x, interest: e.target.value } : x)))}
                  className="flex-1 px-2.5 py-1.5 border border-cream-300 rounded-lg text-sm bg-white"
                  placeholder="New interest"
                />
                <button
                  type="button"
                  onClick={() => setPendingNewInterests((prev) => prev.filter((_, j) => j !== idx))}
                  className="text-red-600 hover:underline text-sm py-1"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPendingNewInterests((prev) => [...prev, { interest: '' }])}
            className="text-sm text-cinnabar-600 hover:underline font-medium"
          >
            + Add interest
          </button>
        </section>

        <div className="pt-2 pb-6 flex flex-col items-center text-center">
          {((pendingSkillDeletes?.size > 0) || (pendingInterestDeletes?.size > 0)) && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-full max-w-2xl">
              <strong>Marked for removal:</strong>{' '}
              {[
                ...(pendingSkillDeletes?.size ? [...pendingSkillDeletes].map((id) => skills.find((s) => s.id === id)?.skill || 'Skill').join(', ') : []),
                ...(pendingInterestDeletes?.size ? [...pendingInterestDeletes].map((id) => interests.find((i) => i.id === id)?.interest || 'Interest').join(', ') : []),
              ].filter(Boolean).join('; ')}
              . You must click Save changes to confirm.
            </p>
          )}
          <button
            type="button"
            onClick={handleSaveAllAbout}
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
