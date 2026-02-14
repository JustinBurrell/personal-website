import React, { useState, useEffect } from 'react';
import { useAuth, adminGetEmails, adminDeleteEmail } from '../../features/auth';

function formatDateTime(createdAt) {
  if (!createdAt) return '—';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return createdAt;
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminSectionEmails() {
  const { getAccessToken } = useAuth();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminGetEmails(getAccessToken)
      .then((list) => {
        if (mounted) setEmails(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message);
          setEmails([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [getAccessToken]);

  const firstName = (row) => row.first_name ?? row.firstName ?? '';
  const lastName = (row) => row.last_name ?? row.lastName ?? '';
  const subject = (row) => row.subject ?? '';
  const message = (row) => row.message ?? '';
  const createdAt = (row) => row.created_at ?? row.createdAt ?? '';

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setError(null);
  };

  const handleConfirmDelete = async (id) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await adminDeleteEmail(id, getAccessToken);
      setEmails((prev) => prev.filter((row) => row.id !== id));
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
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-cream-800 text-2xl mb-1">Emails</h1>
        <p className="text-cream-600 text-sm">Messages sent to you from the contact form. Newest first.</p>
      </div>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinnabar-500" />
          </div>
        ) : emails.length === 0 ? (
          <section className="bg-white/60 rounded-2xl border border-cream-300/80 p-8 shadow-sm text-center">
            <p className="text-cream-600">No emails yet.</p>
          </section>
        ) : (
          <ul className="space-y-4">
            {emails.map((row) => (
              <li key={row.id}>
                <article className="bg-white/80 rounded-2xl border border-cream-300/80 border-l-4 border-l-cinnabar-400 pl-5 pr-5 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <span className="font-display font-semibold text-cream-800">
                      {firstName(row)} {lastName(row)}
                    </span>
                    <span className="text-xs text-cream-500 font-mono">
                      {formatDateTime(createdAt(row))}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-cinnabar-600 text-sm mb-2">
                    {subject(row)}
                  </h3>
                  <div className="text-cream-700 text-sm whitespace-pre-wrap border-t border-cream-200 pt-3 mt-3">
                    {message(row)}
                  </div>
                  <div className="mt-3 pt-3 border-t border-cream-200 flex justify-end items-center gap-2">
                    {confirmDeleteId === row.id ? (
                      <>
                        <span className="text-sm text-cream-600">Delete this message?</span>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(row.id)}
                          disabled={deletingId === row.id}
                          className="text-sm text-red-600 font-medium hover:underline disabled:opacity-50"
                        >
                          {deletingId === row.id ? 'Deleting…' : 'Yes, delete'}
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
                        disabled={deletingId !== null}
                        className="text-sm text-red-600 hover:underline disabled:opacity-50"
                      >
                        Delete message
                      </button>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
