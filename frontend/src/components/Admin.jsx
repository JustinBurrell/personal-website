import React from 'react';
import { Navigate, Link, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from '../features/auth';
import AdminSection from './admin/AdminSection';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'awards', label: 'Awards' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'projects', label: 'Projects' },
  { id: 'emails', label: 'Emails' },
];

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinnabar-500" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const base = '/admin';
  const path = location.pathname.slice(base.length) || '/';

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <header className="border-b border-cream-300 bg-cream-50 px-4 py-4">
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {SECTIONS.map(({ id, label }) => (
            <Link
              key={id}
              to={`${base}/${id}`}
              className={`px-3 py-2 rounded-lg text-sm font-display ${
                path === `/${id}` ? 'bg-cinnabar-500 text-white' : 'text-cream-700 hover:bg-cream-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 p-6 overflow-auto flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto flex-shrink-0">
          <Routes>
            <Route index element={<Navigate to={`${base}/home`} replace />} />
            <Route path=":section" element={<AdminSection />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
