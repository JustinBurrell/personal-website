import React from 'react';
import { Navigate, Link, useLocation, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth';
import AdminSection from './admin/AdminSection';

const SECTIONS = [
  { id: 'home', label: 'Home', icon: '01' },
  { id: 'about', label: 'About', icon: '02' },
  { id: 'awards', label: 'Awards', icon: '03' },
  { id: 'education', label: 'Education', icon: '04' },
  { id: 'experience', label: 'Experience', icon: '05' },
  { id: 'gallery', label: 'Gallery', icon: '06' },
  { id: 'projects', label: 'Projects', icon: '07' },
  { id: 'emails', label: 'Emails', icon: '08' },
  { id: 'admin-emails', label: 'Admins', icon: '09' },
];

export default function Admin() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-cream-300" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border-t-2 border-cinnabar-500 animate-spin" />
          </div>
          <p className="font-mono text-xs text-cream-400 tracking-widest uppercase">
            Loading
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-cinnabar-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-cinnabar-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-cream-800 mb-2">
            Access Denied
          </h2>
          <p className="font-body text-cream-500 mb-1">
            Signed in as <span className="font-mono text-cream-600">{user.email}</span>
          </p>
          <p className="font-body text-cream-400 text-sm mb-8">
            This account doesn't have admin access.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="px-5 py-2.5 font-mono text-xs tracking-wide text-cream-600 hover:text-cream-800 transition-colors"
            >
              Back to site
            </Link>
            <button
              onClick={signOut}
              className="px-5 py-2.5 rounded-lg bg-cinnabar-500 text-white font-mono text-xs tracking-wide hover:bg-cinnabar-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const base = '/admin';
  const path = location.pathname.slice(base.length) || '/';
  const activeSection = SECTIONS.find(s => path === `/${s.id}`);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="relative bg-cream-100 border-b border-cream-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between pt-8 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-sm font-mono text-cream-400 hover:text-cinnabar-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to site
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs text-cream-400 tracking-wide">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="font-mono text-xs text-cream-400 hover:text-cinnabar-500 transition-colors tracking-wide"
              >
                Sign out
              </button>
            </motion.div>
          </div>

          {/* Title section */}
          <div className="pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="w-10 h-1 bg-cinnabar-500 rounded-full" />
              <span className="font-mono text-xs text-cinnabar-500 tracking-widest uppercase">
                Admin
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-cream-800 tracking-tight leading-[0.95] mb-3"
            >
              Content Manager
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base font-body text-cream-500 leading-relaxed max-w-lg"
            >
              Edit and manage your portfolio content, without touching Supabase.
            </motion.p>
          </div>

          {/* Section navigation */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide -mb-px"
          >
            {SECTIONS.map(({ id, label, icon }, index) => {
              const isActive = path === `/${id}`;
              return (
                <Link
                  key={id}
                  to={`${base}/${id}`}
                  className="relative flex-shrink-0 group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.04 }}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all duration-200
                      ${isActive
                        ? 'bg-white/80 border border-cream-200/60 border-b-transparent shadow-sm'
                        : 'text-cream-500 hover:text-cream-700 hover:bg-cream-200/40'
                      }
                    `}
                  >
                    <span
                      className={`
                        font-mono text-[10px] tracking-wider transition-colors duration-200
                        ${isActive ? 'text-cinnabar-500' : 'text-cream-300 group-hover:text-cream-400'}
                      `}
                    >
                      {icon}
                    </span>
                    <span
                      className={`
                        font-display text-sm font-medium transition-colors duration-200
                        ${isActive ? 'text-cream-800' : ''}
                      `}
                    >
                      {label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </motion.nav>
        </div>
      </header>

      {/* Content area */}
      <main className="flex-1 bg-white/40 border-t border-cream-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active section indicator */}
          {activeSection && (
            <motion.div
              key={activeSection.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 pt-8 pb-2"
            >
              <span className="font-mono text-xs text-cream-300 tracking-wider">
                {activeSection.icon}
              </span>
              <span className="font-mono text-xs text-cream-400 tracking-widest uppercase">
                {activeSection.label}
              </span>
              <div className="flex-1 h-px bg-cream-200/60" />
            </motion.div>
          )}

          <motion.div
            key={path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-4xl mx-auto py-6 pb-16"
          >
            <Routes>
              <Route index element={<Navigate to={`${base}/home`} replace />} />
              <Route path=":section" element={<AdminSection />} />
            </Routes>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200/60 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <span className="font-mono text-[11px] text-cream-300 tracking-wide">
            Admin Panel
          </span>
          <Link
            to="/"
            className="font-mono text-[11px] text-cream-400 hover:text-cinnabar-500 transition-colors tracking-wide"
          >
            View live site
          </Link>
        </div>
      </footer>
    </div>
  );
}
