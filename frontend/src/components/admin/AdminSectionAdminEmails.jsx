import React, { useState, useEffect } from 'react';
import { useAuth, adminGetAdminEmails, adminPostAdminEmail, adminDeleteAdminEmail } from '../../features/auth';

export default function AdminSectionAdminEmails() {
  const { getAccessToken } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminGetAdminEmails(getAccessToken)
      .then((list) => {
        if (mounted) setAdmins(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message);
          setAdmins([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [getAccessToken]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    setAdding(true);
    setError(null);
    try {
      const created = await adminPostAdminEmail(email, getAccessToken);
      setAdmins((prev) => [...prev, created]);
      setNewEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setError(null);
  };

  const handleConfirmDelete = async (id) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await adminDeleteAdminEmail(id, getAccessToken);
      setAdmins((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Admin Emails</h1>
        <p className="text-cream-600 text-sm">Manage which email addresses have admin access.</p>
      </div>

      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      {/* Add new admin */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email@example.com"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 bg-white/80 font-mono text-sm text-cream-800 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-cinnabar-500/30 focus:border-cinnabar-400 transition-all"
        />
        <button
          type="submit"
          disabled={adding || !newEmail.trim()}
          className="px-5 py-2.5 rounded-xl bg-cinnabar-500 text-white font-mono text-sm font-medium hover:bg-cinnabar-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinnabar-500" />
          </div>
        ) : admins.length === 0 ? (
          <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-8 shadow-sm text-center">
            <p className="text-cream-600">No admin emails configured.</p>
          </section>
        ) : (
          <ul className="space-y-2">
            {admins.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between bg-white/80 rounded-xl border border-cream-300/80 px-5 py-3.5 shadow-sm"
              >
                <span className="font-mono text-sm text-cream-800">{row.email}</span>
                <div className="flex items-center gap-2">
                  {confirmDeleteId === row.id ? (
                    <>
                      <span className="text-sm text-cream-600">Remove?</span>
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(row.id)}
                        disabled={deletingId === row.id}
                        className="text-sm text-red-600 font-medium hover:underline disabled:opacity-50"
                      >
                        {deletingId === row.id ? 'Removing...' : 'Yes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelDelete}
                        disabled={deletingId === row.id}
                        className="text-sm text-cream-600 hover:underline disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(row.id)}
                      disabled={deletingId !== null || admins.length <= 1}
                      title={admins.length <= 1 ? 'Cannot remove the last admin' : 'Remove admin'}
                      className="text-sm text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
