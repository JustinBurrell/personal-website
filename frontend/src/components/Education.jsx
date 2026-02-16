import React, { useState } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useGlobalData } from '../hooks/useGlobalData';
import { Element } from 'react-scroll';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { safeScrollTo } from '../utils/scrollUtils';
import { FaTimes } from 'react-icons/fa';
import { StaggerContainer, StaggerItem } from '../assets/ui/StaggerContainer';
import { portfolioService } from '../services/supabase';
import { useScrollLock } from '../hooks/useScrollLock';

const ImageModal = ({ src, alt, onClose }) => {
  useScrollLock(!!src);

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-cream-800/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-3xl w-full flex justify-center"
          onClick={e => e.stopPropagation()}
        >
          <img src={src} alt={alt} className="max-h-[80vh] w-auto rounded-2xl border border-cream-300" />
          <button
            className="absolute top-3 right-3 bg-cream-50/90 hover:bg-cream-50 rounded-full p-3 border border-cream-300 transition-all"
            onClick={onClose}
            aria-label="Close image modal"
          >
            <FaTimes className="text-cream-500 hover:text-cinnabar-500 text-lg" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const EducationCard = ({ edu, translatedEdu, type, index, onImageClick, relevantCoursesText, organizationInvolvementText, graduationText, completionText, getTranslatedCourse, getTranslatedOrg }) => {
  const dateLabel = type === 'Certificate' ? completionText : graduationText;

  return (
    <StaggerItem>
      <Card hoverable className="overflow-hidden">
        <div className="grid md:grid-cols-12 gap-0 items-stretch">
          <div className="md:col-span-7 p-6 md:p-8">
            <h3 className="text-2xl font-display font-bold text-cream-800 mb-2">
              {edu.nameUrl ? (
                <a
                  href={edu.nameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cinnabar-500 transition-colors"
                >
                  {translatedEdu.name}
                </a>
              ) : (
                translatedEdu.name
              )}
            </h3>

            <div className="space-y-1 mb-4">
              {translatedEdu.schoolType && (
                <p className="font-body text-cream-500">
                  {translatedEdu.schoolType}
                  {translatedEdu.major && ` in ${translatedEdu.major}`}
                </p>
              )}
              <p className="font-mono text-xs text-cream-400 uppercase tracking-wider">
                {dateLabel} {translatedEdu.completionDate || edu.completionDate}
              </p>
              {edu.gpa && (
                <p className="font-mono text-xs text-cream-400 uppercase tracking-wider">GPA: {edu.gpa}</p>
              )}
            </div>

            {edu.description && (
              <p className="font-body text-cream-500 leading-relaxed mb-4">{translatedEdu.description}</p>
            )}

            {edu.relevantCourses && edu.relevantCourses.length > 0 && (
              <div className="mb-4">
                <h4 className="font-display text-sm font-semibold text-cream-700 uppercase tracking-wide mb-2">{relevantCoursesText}</h4>
                <div className="flex flex-col gap-1">
                  {edu.relevantCourses.map((course, idx) => {
                    const translatedCourse = getTranslatedCourse(course, translatedEdu);
                    return (
                      <a
                        key={idx}
                        href={course.courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cinnabar-500 hover:text-cinnabar-700 text-sm font-body underline decoration-cinnabar-200 underline-offset-4 transition-colors"
                      >
                        {translatedCourse.course}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {edu.organizationInvolvement && edu.organizationInvolvement.length > 0 && (
              <div>
                <h4 className="font-display text-sm font-semibold text-cream-700 uppercase tracking-wide mb-2">{organizationInvolvementText}</h4>
                <div className="flex flex-col gap-1">
                  {edu.organizationInvolvement.map((org, idx) => {
                    const translatedOrg = getTranslatedOrg(org, translatedEdu, edu);
                    return (
                      <div key={idx} className="text-sm font-body">
                        <span className="font-semibold text-cinnabar-500">{translatedOrg.organization}</span>
                        <span className="text-cream-500"> — {translatedOrg.role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {edu.educationImageUrl && (
            <div className="md:col-span-5 bg-cream-200 flex items-center justify-center p-6">
              <img
                src={edu.educationImageUrl.startsWith('http') ? edu.educationImageUrl : portfolioService.getAssetUrl(edu.educationImageUrl)}
                alt={`${translatedEdu.name}`}
                className="max-h-[380px] w-auto object-contain rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => onImageClick({ src: edu.educationImageUrl.startsWith('http') ? edu.educationImageUrl : portfolioService.getAssetUrl(edu.educationImageUrl), alt: `${translatedEdu.name}` })}
              />
            </div>
          )}
        </div>
      </Card>
    </StaggerItem>
  );
};

const Education = () => {
  const { translatedData, currentLanguage, isLoading } = useLanguage();
  const { data: portfolioData, loading, error } = useGlobalData();
  const location = useLocation();
  const [modalImage, setModalImage] = useState(null);

  const educationTitle = useTranslateText("Education");
  const relevantCoursesText = useTranslateText("Relevant Courses");
  const organizationInvolvementText = useTranslateText("Organization Involvement");
  const schoolingText = useTranslateText("Schooling");
  const certificationsText = useTranslateText("Certifications");
  const programsText = useTranslateText("Programs");
  const graduationText = useTranslateText("Graduation:");
  const completionText = useTranslateText("Completion:");

  useScrollSpy();

  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      safeScrollTo(location.state.scrollTo, { delay: 200 });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (isLoading || !translatedData || !translatedData.education || !translatedData.education[0]) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="h-20 bg-cream-200 animate-pulse rounded-2xl w-3/4 mb-6"></div>
            <div className="h-6 bg-cream-200 animate-pulse rounded w-1/2"></div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { education: translatedEducation } = translatedData;
  const educationGroup = translatedEducation[0];

  const originalEducation = portfolioData?.education?.[0];
  const educationList = originalEducation?.education || [];

  const sortByDateDesc = (arr) =>
    [...arr].sort((a, b) => {
      const dateA = new Date(a.completionDate);
      const dateB = new Date(b.completionDate);
      return dateB - dateA;
    });

  const schooling = sortByDateDesc(educationList.filter(e => (e.educationType || e.education_type) === 'School'));
  const certifications = sortByDateDesc(educationList.filter(e => (e.educationType || e.education_type) === 'Certificate'));
  const programs = sortByDateDesc(educationList.filter(e => (e.educationType || e.education_type) === 'Program'));

  const getTranslatedItem = (originalItem) => {
    if (currentLanguage === 'en') return originalItem;
    const originalIndex = educationList.findIndex(item =>
      item.name === originalItem.name &&
      (item.educationType || item.education_type) === (originalItem.educationType || originalItem.education_type)
    );
    if (originalIndex === -1) return originalItem;
    const translatedItem = translatedEducation[0].education[originalIndex];
    if (!translatedItem) return originalItem;
    return translatedItem;
  };

  const getTranslatedCourse = (originalCourse, translatedEdu) => {
    if (currentLanguage === 'en') return originalCourse;
    if (!translatedEdu.relevantCourses) return originalCourse;
    const translatedCourse = translatedEdu.relevantCourses.find(c => c.courseUrl === originalCourse.courseUrl);
    return translatedCourse || originalCourse;
  };

  const getTranslatedOrg = (originalOrg, translatedEdu, edu) => {
    if (currentLanguage === 'en') return originalOrg;
    if (!translatedEdu.organizationInvolvement) return originalOrg;
    let translatedOrg = translatedEdu.organizationInvolvement.find(o =>
      o.organization === originalOrg.organization && o.role === originalOrg.role
    );
    if (!translatedOrg) {
      const idx = edu.organizationInvolvement?.findIndex(o => o.organization === originalOrg.organization && o.role === originalOrg.role);
      if (idx !== undefined && idx > -1 && translatedEdu.organizationInvolvement[idx]) {
        translatedOrg = translatedEdu.organizationInvolvement[idx];
      }
    }
    return translatedOrg || originalOrg;
  };

  if (loading) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="font-body text-xl text-cream-500">Loading education data...</div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  if (error) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="font-body text-xl text-cinnabar-500">Error loading education data: {error}</div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  if (!portfolioData || !originalEducation) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="font-body text-xl text-cream-500">No education data available</div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const navPills = [
    { label: schoolingText, to: 'schooling-section' },
    { label: certificationsText, to: 'certifications-section' },
    { label: programsText, to: 'programs-section' },
  ];

  const renderSection = (title, items, type) => (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-0.5 bg-cinnabar-500 rounded-full"></div>
        <h3 className="text-2xl font-display font-bold text-cream-800">{title}</h3>
      </div>
      <StaggerContainer className="space-y-6 max-w-5xl">
        {items.map((edu, index) => {
          const translatedEdu = getTranslatedItem(edu);
          return (
            <EducationCard
              key={edu.name + index}
              edu={edu}
              translatedEdu={translatedEdu}
              type={type}
              index={index}
              onImageClick={setModalImage}
              relevantCoursesText={relevantCoursesText}
              organizationInvolvementText={organizationInvolvementText}
              graduationText={graduationText}
              completionText={completionText}
              getTranslatedCourse={getTranslatedCourse}
              getTranslatedOrg={getTranslatedOrg}
            />
          );
        })}
      </StaggerContainer>
    </motion.div>
  );

  return (
    <AnimationWrapper>
      {modalImage && (
        <ImageModal src={modalImage.src} alt={modalImage.alt} onClose={() => setModalImage(null)} />
      )}
      <section id="education" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="pt-16 pb-12 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <motion.h1
                className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-cream-800 tracking-tight leading-[0.95] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {educationTitle}
              </motion.h1>
              <motion.p
                className="text-xl font-body text-cream-500 leading-relaxed max-w-2xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {educationGroup.description}
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {navPills.map((pill) => (
                  <button
                    key={pill.to}
                    className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-cream-300 text-cream-500 hover:border-cinnabar-500 hover:text-cinnabar-500 transition-colors"
                    onClick={() => safeScrollTo(pill.to)}
                  >
                    {pill.label}
                  </button>
                ))}
              </motion.div>
            </div>
            {(() => {
              const sectionImageUrl = educationGroup.educationImageUrl ?? educationGroup.education_image_url ?? educationGroup.educationimageurl ?? '';
              const displayUrl = sectionImageUrl ? (sectionImageUrl.startsWith('http') ? sectionImageUrl : portfolioService.getAssetUrl(sectionImageUrl)) : '';
              return displayUrl ? (
                <motion.div
                  className="md:col-span-4 hidden md:flex justify-end items-start"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 2 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <img
                    src={displayUrl}
                    alt="Education"
                    className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl border border-cream-300"
                  />
                </motion.div>
              ) : null;
            })()}
          </div>

          {/* Schooling Section */}
          <Element name="schooling-section" id="schooling-section">
            {renderSection(schoolingText, schooling, 'School')}
          </Element>

          {/* Certifications Section */}
          <Element name="certifications-section" id="certifications-section">
            {renderSection(certificationsText, certifications, 'Certificate')}
          </Element>

          {/* Programs Section */}
          <Element name="programs-section" id="programs-section">
            {renderSection(programsText, programs, 'Program')}
          </Element>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Education;
