import React, { useState, useRef, useEffect } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import Card from '../assets/ui/Card';
import { Element } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaList, FaClock, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { safeScrollTo } from '../utils/scrollUtils';

// Helper function to check if images should be hidden for a specific experience
const shouldHideImages = (company, position) => {
  const companyLower = company?.toLowerCase() || '';
  const positionLower = position?.toLowerCase() || '';

  const hideImageCompanies = [
    'frood', 'prep for prep', 'colgate',
    'lehigh university chapter of colorstack', 'colorstack',
    'omicron kappa', 'omicron kappa polemarch', 'kappa alpha psi',
    'black student union', 'men of color', 'student senate', 'office of admissions'
  ];

  const hideImagePositions = [
    'black student union president', 'student senate', 'office of admissions'
  ];

  for (const hideCompany of hideImageCompanies) {
    if (companyLower.includes(hideCompany.toLowerCase())) return true;
  }
  for (const hidePosition of hideImagePositions) {
    if (positionLower.includes(hidePosition.toLowerCase())) return true;
  }
  return false;
};

// Simple modal for image lightbox
const ImageModal = ({ isOpen, onClose, imageUrl, onPrev, onNext, hasPrev, hasNext }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-cream-800/80 backdrop-blur-sm"
        onClick={onClose}
      >
        {hasPrev && (
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-cream-50/90 hover:bg-cream-50 p-3 rounded-full border border-cream-300 hover:border-cinnabar-500 transition-all z-10"
            onClick={e => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-cream-600 text-lg" />
          </button>
        )}
        <div className="flex items-center justify-center" style={{ maxHeight: '90vh', maxWidth: '90vw' }}>
          <img
            src={imageUrl}
            alt="Experience"
            className="rounded-2xl border border-cream-300 select-none"
            style={{ maxHeight: '90vh', maxWidth: '90vw', userSelect: 'none', pointerEvents: 'none' }}
            draggable={false}
          />
        </div>
        {hasNext && (
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-cream-50/90 hover:bg-cream-50 p-3 rounded-full border border-cream-300 hover:border-cinnabar-500 transition-all z-10"
            onClick={e => { e.stopPropagation(); onNext(); }}
            aria-label="Next image"
          >
            <FaChevronRight className="text-cream-600 text-lg" />
          </button>
        )}
        <button
          className="absolute top-4 right-4 bg-cream-50/90 hover:bg-cream-50 rounded-full p-2 border border-cream-300 transition-all"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes className="text-cream-500 hover:text-cinnabar-500 text-xl" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

// Small gallery for experience images
const ExperienceGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col items-center my-2">
      <div className="flex gap-2 mt-6 flex-wrap justify-center">
        {images.map((img, idx) => (
          <motion.img
            key={img}
            src={img}
            alt={`Experience ${idx + 1}`}
            className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-colors ${selected === idx ? 'border-cinnabar-500' : 'border-cream-300 hover:border-cinnabar-300'}`}
            onClick={() => { setSelected(idx); setModalOpen(true); }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          />
        ))}
      </div>
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={images[selected]}
        onPrev={() => setSelected((selected - 1 + images.length) % images.length)}
        onNext={() => setSelected((selected + 1) % images.length)}
        hasPrev={images.length > 1}
        hasNext={images.length > 1}
      />
    </div>
  );
};

// Timeline component
const Timeline = ({ experiences, type }) => {
  const scrollContainerRef = useRef(null);

  const sortedExperiences = [...experiences].flatMap(company =>
    company.positions.map(position => ({
      ...position,
      company: company.company,
      companyUrl: company.companyUrl,
      location: company.location
    }))
  ).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  useEffect(() => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const cardWidth = 600;
      scrollContainerRef.current.scrollLeft = (containerWidth - cardWidth) / 2;
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: currentScroll + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10 bg-cream-50/90 hover:bg-cream-50 p-3 rounded-full border border-cream-300 hover:border-cinnabar-500 transition-all"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="text-cream-600 text-lg" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10 bg-cream-50/90 hover:bg-cream-50 p-3 rounded-full border border-cream-300 hover:border-cinnabar-500 transition-all"
        aria-label="Scroll right"
      >
        <FaChevronRight className="text-cream-600 text-lg" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedExperiences.map((exp, index) => (
          <motion.div
            key={`${exp.company}-${exp.position}-${index}`}
            className="flex-none w-fit min-w-[200px] max-w-[70vw] snap-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="border-b border-cream-300 pb-3 mb-4">
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-display font-bold text-cinnabar-500 hover:text-cinnabar-700 transition-colors"
                >
                  {exp.company}
                </a>
                <span className="font-mono text-xs text-cream-400 uppercase tracking-wider ml-3">{exp.location}</span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                <span className="font-body italic text-lg text-cream-700">{exp.position}</span>
                <span className="font-mono text-xs text-cream-400 uppercase tracking-wider md:ml-4 whitespace-nowrap">
                  {exp.startDate} — {exp.endDate}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-2 mb-4 mt-2">
                {exp.responsibilities.map((resp, i) => (
                  resp.trim().startsWith('Rotation') ? (
                    <div key={`rotation-${i}`} className="font-body italic text-cream-500 text-sm mb-1 mt-2">
                      {resp}
                    </div>
                  ) : (
                    <motion.li
                      key={i}
                      className="font-body text-cream-600 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    >
                      {resp}
                    </motion.li>
                  )
                ))}
              </ul>

              {exp.skills && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="font-mono text-xs bg-cream-200 text-cream-600 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="font-mono text-xs bg-cinnabar-50 text-cinnabar-500 border border-cinnabar-200 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {exp.images && exp.images.length > 0 && !shouldHideImages(exp.company, exp.position) && (
                <div className="mt-4">
                  <ExperienceGallery images={exp.images} />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Experience = () => {
  const { translatedData, isLoading } = useLanguage();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('resume');

  const experienceTitle = useTranslateText("Experience");
  const professionalText = useTranslateText("Professional Experience");
  const leadershipText = useTranslateText("Leadership Experience");
  const viewTimelineText = useTranslateText("View Timeline Mode");
  const viewResumeText = useTranslateText("View Resume Mode");
  const skillsText = useTranslateText("Skills");
  const technologiesText = useTranslateText("Technologies");

  useScrollSpy();

  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      safeScrollTo(location.state.scrollTo, { delay: 200 });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!translatedData || !translatedData.experience || !translatedData.experience[0]) {
    return (
      <AnimationWrapper>
        <section id="experience" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="h-20 bg-cream-200 animate-pulse rounded-2xl w-3/4 mb-6"></div>
            <div className="h-6 bg-cream-200 animate-pulse rounded w-1/2"></div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { experience } = translatedData;
  const expData = experience[0];

  const renderGroupedExperience = (companies) => (
    <div className="space-y-8 max-w-5xl">
      {companies.map((company, cidx) => (
        <motion.div
          key={company.company + cidx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: cidx * 0.08 }}
        >
          <Card className="p-0 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="border-b border-cream-300 pb-3 mb-6">
                <a
                  href={company.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-display font-bold text-cinnabar-500 hover:text-cinnabar-700 transition-colors"
                >
                  {company.company}
                </a>
                <span className="font-mono text-xs text-cream-400 uppercase tracking-wider ml-3">{company.location}</span>
              </div>

              {company.positions.map((pos, pidx) => (
                <div
                  key={pos.position + pidx}
                  className={`${pidx < company.positions.length - 1 ? 'mb-8 pb-8 border-b border-cream-200' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                    <span className="font-body italic text-lg text-cream-700">{pos.position}</span>
                    <span className="font-mono text-xs text-cream-400 uppercase tracking-wider md:ml-4 whitespace-nowrap">
                      {pos.startDate} — {pos.endDate}
                    </span>
                  </div>

                  <ul className="list-disc list-inside space-y-2 mb-4 mt-2">
                    {pos.responsibilities.map((resp, i) => (
                      resp.trim().startsWith('Rotation') ? (
                        <div key={"rotation-" + i} className="font-body italic text-cream-500 text-sm mb-1 mt-2">
                          {resp}
                        </div>
                      ) : (
                        <li key={i} className="font-body text-cream-600 text-sm">
                          {resp}
                        </li>
                      )
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="font-display text-xs font-semibold text-cream-600 uppercase tracking-wide mr-1">{skillsText}:</span>
                    {pos.skills.map((skill, i) => (
                      <span key={i} className="font-mono text-xs bg-cream-200 text-cream-600 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {pos.technologies && pos.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="font-display text-xs font-semibold text-cream-600 uppercase tracking-wide mr-1">{technologiesText}:</span>
                      {pos.technologies.map((tech, i) => (
                        <span key={i} className="font-mono text-xs bg-cinnabar-50 text-cinnabar-500 border border-cinnabar-200 px-3 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {pos.images && pos.images.length > 0 && !shouldHideImages(company.company, pos.position) && (
                    <ExperienceGallery images={pos.images} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'resume' ? 'timeline' : 'resume');
  };

  return (
    <AnimationWrapper>
      <section id="experience" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="pt-16 pb-12 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <motion.h1
                className="text-5xl md:text-7xl font-display font-bold text-cream-800 tracking-tight leading-[0.95] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {experienceTitle}
              </motion.h1>
              <motion.p
                className="text-xl font-body text-cream-500 leading-relaxed max-w-2xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {expData.description}
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-cream-300 text-cream-500 hover:border-cinnabar-500 hover:text-cinnabar-500 transition-colors"
                  onClick={() => safeScrollTo('professional-experience-section')}
                >
                  {professionalText}
                </button>
                <button
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-cream-300 text-cream-500 hover:border-cinnabar-500 hover:text-cinnabar-500 transition-colors"
                  onClick={() => safeScrollTo('leadership-experience-section')}
                >
                  {leadershipText}
                </button>
                <button
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-cinnabar-500 text-cinnabar-500 hover:bg-cinnabar-500 hover:text-white transition-colors flex items-center gap-2"
                  onClick={toggleViewMode}
                >
                  {viewMode === 'resume' ? (
                    <>
                      <FaClock className="text-xs" />
                      {viewTimelineText}
                    </>
                  ) : (
                    <>
                      <FaList className="text-xs" />
                      {viewResumeText}
                    </>
                  )}
                </button>
              </motion.div>
            </div>
            {expData.experienceImageUrl && (
              <motion.div
                className="md:col-span-4 flex justify-end"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={expData.experienceImageUrl}
                  alt="Experience"
                  className="w-48 h-48 object-cover rounded-2xl border border-cream-300"
                />
              </motion.div>
            )}
          </div>

          {/* Professional Experience Section */}
          <Element name="professional-experience-section">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
              className="mt-8 mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-0.5 bg-cinnabar-500 rounded-full"></div>
                <h3 className="text-2xl font-display font-bold text-cream-800">{professionalText}</h3>
              </div>
              {viewMode === 'resume' ? (
                renderGroupedExperience(expData.professionalexperience)
              ) : (
                <Timeline experiences={expData.professionalexperience} type="professional" />
              )}
            </motion.div>
          </Element>

          {/* Leadership Experience Section */}
          <Element name="leadership-experience-section">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
              className="mt-8 mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-0.5 bg-cinnabar-500 rounded-full"></div>
                <h3 className="text-2xl font-display font-bold text-cream-800">{leadershipText}</h3>
              </div>
              {viewMode === 'resume' ? (
                renderGroupedExperience(expData.leadershipexperience)
              ) : (
                <Timeline experiences={expData.leadershipexperience} type="leadership" />
              )}
            </motion.div>
          </Element>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Experience;
