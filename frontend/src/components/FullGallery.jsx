import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import SectionTitle from '../assets/ui/SectionTitle';
import { useSectionData } from '../hooks/useGlobalData';

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

const easeOut = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay: i * 0.08 },
  }),
};

function GalleryCard({ item, index, onClick }) {
  const imageUrl = item.imageUrl || '';

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="group cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-cream-300/60 bg-cream-200/40 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title || ''}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-cream-200 flex items-center justify-center">
              <span className="font-mono text-xs text-cream-400 uppercase tracking-wider">No image</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-cream-800/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-display font-semibold text-cream-800 text-lg leading-tight line-clamp-1 group-hover:text-cinnabar-600 transition-colors duration-200">
          {item.title}
        </h3>

        {item.description && (
          <p className="font-body text-cream-500 text-sm leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {item.category?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.category.map((cat, catIdx) => (
              <span
                key={catIdx}
                className="font-mono text-[10px] uppercase tracking-wider bg-cinnabar-50 text-cinnabar-500 border border-cinnabar-200/60 rounded-full px-2.5 py-0.5"
              >
                {cat.categoryName}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function GalleryModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cream-800/80 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-cream-50 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-cream-100/90 border border-cream-300/60 text-cream-600 hover:text-cinnabar-500 hover:border-cinnabar-300 transition-colors duration-200 backdrop-blur-sm"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        {item.imageUrl && (
          <div className="w-full bg-cream-200/50">
            <img
              src={item.imageUrl}
              alt={item.title || ''}
              className="w-full max-h-[55vh] object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display font-bold text-cream-800 text-2xl sm:text-3xl leading-tight">
              {item.title}
            </h2>
            {item.date && (
              <span className="font-mono text-xs text-cream-400 tracking-wide whitespace-nowrap pt-2">
                {item.date}
              </span>
            )}
          </div>

          {item.category?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.category.map((cat, catIdx) => (
                <span
                  key={catIdx}
                  className="font-mono text-xs uppercase tracking-wider bg-cinnabar-50 text-cinnabar-500 border border-cinnabar-200 rounded-full px-3 py-1"
                >
                  {cat.categoryName}
                </span>
              ))}
            </div>
          )}

          {(item.fullDescription || item.description) && (
            <div className="pt-2 border-t border-cream-200/80">
              <p className="font-body text-cream-600 leading-relaxed whitespace-pre-wrap">
                {item.fullDescription || item.description}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FullGallery() {
  const { data: gallery, loading } = useSectionData('gallery');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClose = useCallback(() => setSelectedItem(null), []);

  const sortedItems = useMemo(() => {
    if (!gallery || !Array.isArray(gallery)) return [];
    return [...gallery].sort((a, b) => parseDateKey(b.date) - parseDateKey(a.date));
  }, [gallery]);

  if (loading || !gallery) {
    return (
      <AnimationWrapper>
        <section className="py-24 bg-cream-100 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-5 w-24 bg-cream-200 animate-pulse rounded-lg mb-10" />
            <div className="h-12 w-48 bg-cream-200 animate-pulse rounded-2xl mb-4" />
            <div className="h-5 w-96 max-w-full bg-cream-200 animate-pulse rounded-lg mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/3] bg-cream-200 animate-pulse rounded-2xl" />
                  <div className="h-5 w-3/4 bg-cream-200 animate-pulse rounded-lg" />
                  <div className="h-4 w-1/2 bg-cream-200 animate-pulse rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  return (
    <AnimationWrapper>
      <section className="py-24 bg-cream-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Gallery</SectionTitle>

          <motion.p
            className="font-body text-cream-500 mb-16 text-lg max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          >
            A collection of moments from my professional and academic journey.
          </motion.p>

          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {sortedItems.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onClick={setSelectedItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-body text-cream-400 text-lg">No gallery items yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <GalleryModal item={selectedItem} onClose={handleClose} />
        )}
      </AnimatePresence>
    </AnimationWrapper>
  );
}
