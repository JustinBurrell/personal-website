import React, { useState, useRef, useEffect } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import Card from '../assets/ui/Card';
import { Link as ScrollLink, Element } from 'react-scroll';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaList, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { safeScrollTo } from '../utils/scrollUtils';

// Timeline component (moved inside Experience.js)
const Timeline = ({ experiences, type }) => {
  const scrollContainerRef = useRef(null);

  // Sort experiences by start date (most recent first)
  const sortedExperiences = [...experiences].flatMap(company => 
    company.positions.map(position => ({
      ...position,
      company: company.company,
      companyUrl: company.companyUrl,
      location: company.location
    }))
  ).sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB - dateA;
  });

  // Center the first card on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const cardWidth = 600; // Width of each card
      const scrollPosition = (containerWidth - cardWidth) / 2;
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600; // Increased scroll amount to match card width
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: currentScroll + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="text-gray-800 text-xl" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        aria-label="Scroll right"
      >
        <FaChevronRight className="text-gray-800 text-xl" />
      </button>

      {/* Timeline container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sortedExperiences.map((exp, index) => (
          <motion.div
            key={`${exp.company}-${exp.position}-${index}`}
            className="flex-none w-fit min-w-[200px] max-w-[70vw] snap-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Company header */}
              <div className="border-b-2 border-gray-300 pb-2 mb-4">
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold text-blue-700 hover:underline"
                >
                  {exp.company}
                </a>
                <span className="text-base text-gray-700 ml-2">{exp.location}</span>
              </div>

              {/* Position and date */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                <span className="italic text-lg text-gray-800">{exp.position}</span>
                <span className="text-gray-600 text-right md:ml-4 whitespace-nowrap">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>

              {/* Responsibilities */}
              <ul className="list-disc list-inside space-y-2 mb-4 mt-2">
                {exp.responsibilities.map((resp, i) => (
                  resp.trim().startsWith('Rotation') ? (
                    <div
                      key={`rotation-${i}`}
                      className="text-gray-700 text-base font-normal mb-1 mt-2"
                      style={{ fontStyle: 'italic' }}
                    >
                      {resp}
                    </div>
                  ) : (
                    <motion.li
                      key={i}
                      className="text-gray-700"
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

              {/* Skills */}
              {exp.skills && exp.skills.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mt-16"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <span className="font-semibold text-sm text-gray-700 mr-2">Skills:</span>
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Technologies */}
              {exp.technologies && exp.technologies.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mt-1 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                >
                  <span className="font-semibold text-sm text-gray-700 mr-2">Technologies:</span>
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Images gallery */}
              {exp.images && exp.images.length > 0 && (
                <div className="mt-4">
                  <ExperienceGallery images={exp.images} />
                </div>
              )}
            </div>
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

  // Use translation hook for static text
  const experienceTitle = useTranslateText("Experience");
  const professionalText = useTranslateText("Professional Experience");
  const leadershipText = useTranslateText("Leadership Experience");
  const viewTimelineText = useTranslateText("View Timeline Mode");
  const viewResumeText = useTranslateText("View Resume Mode");
  const skillsText = useTranslateText("Skills");
  const technologiesText = useTranslateText("Technologies");

  // Initialize scroll spy safely
  useScrollSpy();

  // Move all useEffect hooks to the top
  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      safeScrollTo(location.state.scrollTo, { delay: 200 });
      // Clear the state so it doesn't scroll again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Add loading state and null checks
  if (isLoading || !translatedData || !translatedData.experience || !translatedData.experience[0]) {
    return (
      <AnimationWrapper>
        <section id="experience" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-2 pt-16">
              <Card variant="transparent" className="p-0">
                <div className="grid md:grid-cols-5 gap-6 items-center">
                  <div className="md:col-span-3 flex flex-col justify-center p-6">
                    <div className="h-16 bg-gray-200 animate-pulse rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { experience } = translatedData;
  const expData = experience[0];

  // Helper to render grouped experience cards (for both professional and leadership)
  const renderGroupedExperience = (companies) => (
    <div className="space-y-12">
      {companies.map((company, cidx) => (
        <motion.div
          key={company.company + cidx}
          className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          viewport={{ once: false, margin: '-20px' }}
          transition={{ duration: 0.6, delay: cidx * 0.1, type: 'spring', stiffness: 100, damping: 18 }}
        >
          <motion.div
            className="border-b-2 border-gray-300 pb-2 mb-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.1 + cidx * 0.1 }}
          >
            <a
              href={company.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-blue-700 hover:underline"
            >
              {company.company}
            </a>
            <span className="text-lg text-gray-700 ml-2">{company.location}</span>
          </motion.div>
          {company.positions.map((pos, pidx) => (
            <motion.div
              key={pos.position + pidx}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              viewport={{ once: false, margin: '-20px' }}
              transition={{ duration: 0.5, delay: 0.2 + pidx * 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                <span className="italic text-lg text-gray-800">{pos.position}</span>
                <span className="text-gray-600 text-right md:ml-4 whitespace-nowrap">{pos.startDate} - {pos.endDate}</span>
              </div>
              {/* Render responsibilities in order, but style 'Rotation' lines as subheadings */}
              <ul className="list-disc list-inside space-y-2 mb-4 mt-2">
                {pos.responsibilities.map((resp, i) => (
                  resp.trim().startsWith('Rotation') ? (
                    <div
                      key={"rotation-" + i}
                      className="text-gray-700 text-base font-normal mb-1 mt-2"
                      style={{ fontStyle: 'italic' }}
                    >
                      {resp}
                    </div>
                  ) : (
                    <motion.li
                      key={i}
                      className="text-gray-700"
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
              <motion.div
                className="flex flex-wrap gap-2 mb-2 items-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span className="font-semibold text-sm text-gray-700 mr-2">{skillsText}:</span>
                {pos.skills.map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </motion.div>
              {pos.technologies && pos.technologies.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mt-1 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                >
                  <span className="font-semibold text-sm text-gray-700 mr-2">{technologiesText}:</span>
                  {pos.technologies.map((tech, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </motion.div>
              )}
              {/* Gallery at the bottom of the card if images exist */}
              {pos.images && pos.images.length > 0 && <ExperienceGallery images={pos.images} />}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'resume' ? 'timeline' : 'resume');
  };

  // Responsive sub bar (desktop and mobile/tablet)
  const subBarOptions = [
    { label: professionalText, to: 'professional-experience-section' },
    { label: leadershipText, to: 'leadership-experience-section' },
  ];

  return (
    <AnimationWrapper>
      <section id="experience" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          {/* Top Card: Experience Title/Description/Image */}
          <motion.div
            className="max-w-4xl mx-auto mb-2 pt-16"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 18 }}
          >
            <Card variant="transparent" className="p-0">
              <div className="grid md:grid-cols-5 gap-6 items-center">
                {/* Left: Title & Description */}
                <div className="md:col-span-3 flex flex-col justify-center p-6">
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{experienceTitle}</h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">{expData.description}</p>
                  <div className="flex gap-2 mt-6 items-center whitespace-nowrap">
                    <button
                      className="px-2 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-xs shrink-0"
                      onClick={() => safeScrollTo('professional-experience-section')}
                    >
                      {professionalText}
                    </button>
                    <button
                      className="px-2 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-xs shrink-0"
                      onClick={() => safeScrollTo('leadership-experience-section')}
                    >
                      {leadershipText}
                    </button>
                    <button
                      className="px-2 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-xs flex items-center gap-2 shrink-0"
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
                  </div>
                </div>
                {/* Right: Experience Image */}
                {expData.experienceImageUrl && (
                  <div className="md:col-span-2 flex justify-center items-stretch p-4">
                    <img
                      src={expData.experienceImageUrl}
                      alt="Experience"
                      className="h-full w-auto max-h-[400px] object-contain rounded-lg"
                      style={{ minHeight: '200px', maxHeight: '100%' }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Professional Experience Section */}
          <Element name="professional-experience-section">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
              className={viewMode === 'timeline' ? 'mb-6 mt-10' : 'mb-16 mt-20'}
            >
              <motion.h3
                className="text-2xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: false, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {professionalText}
              </motion.h3>
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
              className={viewMode === 'timeline' ? 'mb-6 mt-10' : 'mb-16 mt-20'}
            >
              <motion.h3
                className="text-2xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: false, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                {leadershipText}
              </motion.h3>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
      style={{ touchAction: 'none' }}
    >
      <button
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        disabled={!hasPrev}
        aria-label="Previous image"
      >
        &#8592;
      </button>
      <div
        className="flex items-center justify-center"
        style={{ maxHeight: '90vh', maxWidth: '90vw', overflow: 'hidden' }}
      >
        <img
          src={imageUrl}
          alt="Experience Full"
          className="rounded-lg shadow-lg select-none"
          style={{
            maxHeight: '90vh',
            maxWidth: '90vw',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </div>
      <button
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
        onClick={e => { e.stopPropagation(); onNext(); }}
        disabled={!hasNext}
        aria-label="Next image"
      >
        &#8594;
      </button>
      <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={onClose}>&times;</button>
    </div>
  );
};

// Small gallery for experience images
const ExperienceGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col items-center my-2">
      <div className="flex gap-2 mt-8 flex-wrap justify-center">
        {images.map((img, idx) => (
          <motion.img
            key={img}
            src={img}
            alt={`Experience ${idx + 1}`}
            className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${selected === idx ? 'border-blue-500' : 'border-transparent'}`}
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

export default Experience;