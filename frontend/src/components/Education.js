import React, { useState } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { scrollSpy } from 'react-scroll';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Element } from 'react-scroll';

const Education = () => {
  const { translatedData, currentLanguage, isLoading } = useLanguage();
  const { data: portfolioData, loading, error } = usePortfolioData(currentLanguage);
  const location = useLocation();
  const [modalImage, setModalImage] = useState(null);

  // Use the translation hook for inline text
  const educationTitle = useTranslateText("Education");
  const relevantCoursesText = useTranslateText("Relevant Courses");
  const organizationInvolvementText = useTranslateText("Organization Involvement");
  const schoolingText = useTranslateText("Schooling");
  const certificationsText = useTranslateText("Certifications");
  const programsText = useTranslateText("Programs");
  const graduationText = useTranslateText("Graduation:");
  const completionText = useTranslateText("Completion:");

  // Move all useEffect hooks to the top
  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        scroller.scrollTo(location.state.scrollTo, {
          duration: 600,
          smooth: 'easeInOutQuart',
          offset: -80,
        });
        // Clear the state so it doesn't scroll again
        window.history.replaceState({}, document.title);
      }, 200);
    }
  }, [location.state]);

  React.useEffect(() => {
    scrollSpy.update();
  }, []);

  // Add loading state and null checks
  if (isLoading || !translatedData || !translatedData.education || !translatedData.education[0]) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-8 pt-24 pb-10">
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

  const { education: translatedEducation } = translatedData;
  const educationGroup = translatedEducation[0];
  
  // Use original data for filtering
  const originalEducation = portfolioData?.education?.[0];
  const educationList = originalEducation?.education || [];

  // Helper to sort by most recent completion date
  const sortByDateDesc = (arr) =>
    [...arr].sort((a, b) => {
      const dateA = new Date(a.completionDate);
      const dateB = new Date(b.completionDate);
      return dateB - dateA;
    });

  // Filter using original data
  const schooling = sortByDateDesc(educationList.filter(e => e.education_type === 'School'));
  const certifications = sortByDateDesc(educationList.filter(e => e.education_type === 'Certificate'));
  const programs = sortByDateDesc(educationList.filter(e => e.education_type === 'Program'));

  // Get translated versions of the filtered items
  const getTranslatedItem = (originalItem) => {
    if (currentLanguage === 'en') return originalItem;
    
    // Find the translated item by matching the original item's index in the array
    const originalIndex = educationList.findIndex(item => 
      item.name === originalItem.name && 
      item.education_type === originalItem.education_type
    );
    
    if (originalIndex === -1) {
      console.warn('Could not find original item in education list:', originalItem);
      return originalItem;
    }

    const translatedItem = translatedEducation[0].education[originalIndex];
    if (!translatedItem) {
      console.warn('Could not find translated item at index:', originalIndex);
      return originalItem;
    }

    return translatedItem;
  };

  // Get translated course
  const getTranslatedCourse = (originalCourse, translatedEdu) => {
    if (currentLanguage === 'en') return originalCourse;
    if (!translatedEdu.relevantCourses) return originalCourse;

    const translatedCourse = translatedEdu.relevantCourses.find(c => c.courseUrl === originalCourse.courseUrl);
    return translatedCourse || originalCourse;
  };

  // Get translated organization
  const getTranslatedOrg = (originalOrg, translatedEdu, edu) => {
    if (currentLanguage === 'en') return originalOrg;
    if (!translatedEdu.organizationInvolvement) return originalOrg;
    // Try to find by index if direct match fails
    let translatedOrg = translatedEdu.organizationInvolvement.find(o =>
      o.organization === originalOrg.organization && o.role === originalOrg.role
    );
    if (!translatedOrg) {
      const idx = edu.organizationInvolvement?.findIndex(o => o.organization === originalOrg.organization && o.role === originalOrg.role);
      if (idx !== undefined && idx > -1 && translatedEdu.organizationInvolvement[idx]) {
        translatedOrg = translatedEdu.organizationInvolvement[idx];
      }
    }
    if (!translatedOrg) {
      console.warn('Could not find translated org for:', originalOrg, 'in', translatedEdu.organizationInvolvement);
      return originalOrg;
    }
    return translatedOrg;
  };

  // Modal component
  const ImageModal = ({ src, alt, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="relative max-w-3xl w-full flex justify-center" onClick={e => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[80vh] w-auto rounded-lg shadow-2xl" />
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition"
          onClick={onClose}
          aria-label="Close image modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-600">Loading education data...</div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  // Show error state
  if (error) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-red-600">Error loading education data: {error}</div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  // Show loading state if no data
  if (!portfolioData || !originalEducation) {
    return (
      <AnimationWrapper>
        <section id="education" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-600">No education data available</div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  return (
    <AnimationWrapper>
      {/* Modal for full image view */}
      {modalImage && (
        <ImageModal src={modalImage.src} alt={modalImage.alt} onClose={() => setModalImage(null)} />
      )}
      <section id="education" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          {/* Top Card: Education Title/Description/Image */}
          <motion.div
            className="max-w-4xl mx-auto mb-8 pt-24 pb-10"
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
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{educationTitle}</h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6">{educationGroup.description}</p>
                  <div className="flex gap-2 mt-8 items-center whitespace-nowrap">
                    <button
                      className="px-2 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-xs shrink-0"
                      onClick={() => scroller.scrollTo('schooling-section', { duration: 600, smooth: 'easeInOutQuart', offset: -80 })}
                    >
                      {schoolingText}
                    </button>
                    <button
                      className="px-2 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-xs shrink-0"
                      onClick={() => scroller.scrollTo('certifications-section', { duration: 600, smooth: 'easeInOutQuart', offset: -80 })}
                    >
                      {certificationsText}
                    </button>
                    <button
                      className="px-2 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-xs shrink-0"
                      onClick={() => scroller.scrollTo('programs-section', { duration: 600, smooth: 'easeInOutQuart', offset: -80 })}
                    >
                      {programsText}
                    </button>
                  </div>
                </div>
                {/* Right: Education Image */}
                {educationGroup.educationImageUrl && (
                  <div className="md:col-span-2 flex justify-center items-stretch p-4 h-[500px]">
                    <img
                      src={educationGroup.educationImageUrl}
                      alt="Education"
                      className="h-full w-auto max-h-[500px] object-contain rounded-lg"
                      style={{ minHeight: '300px', maxHeight: '100%' }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Schooling Section */}
          <Element name="schooling-section">
            <motion.div
              className="max-w-4xl mx-auto mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
            >
              <motion.h3
                className="text-2xl font-bold text-center mb-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: false, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {schoolingText}
              </motion.h3>
              <div className="grid gap-8">
                {schooling.map((edu, index) => {
                  const translatedEdu = getTranslatedItem(edu);
                  return (
                    <motion.div
                      key={edu.name + index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      viewport={{ once: false, margin: '-20px' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-white rounded-lg shadow-lg p-6">
                        <div className="grid md:grid-cols-5 gap-6 items-stretch">
                          {/* Left: Education Details */}
                          <motion.div className="md:col-span-3 overflow-y-auto max-h-80 pr-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
                            <h3 className="text-2xl font-semibold mb-2">
                              {edu.nameUrl ? (
                                <a
                                  href={edu.nameUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                                >
                                  {translatedEdu.name}
                                </a>
                              ) : (
                                translatedEdu.name
                              )}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {translatedEdu.school_type}
                              {translatedEdu.major && ` in ${translatedEdu.major}`}
                            </p>
                            <p className="text-gray-600 mb-4">{graduationText} {translatedEdu.completionDate || edu.completionDate}</p>
                            {edu.gpa && (
                              <p className="text-gray-600 mb-4">GPA: {edu.gpa}</p>
                            )}
                            {/* Relevant Courses Section */}
                            {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold mb-2">{relevantCoursesText}</h4>
                                <div className="flex flex-col gap-1">
                                  {edu.relevantCourses.map((course, idx) => {
                                    const translatedCourse = getTranslatedCourse(course, translatedEdu);
                                    return (
                                      <a
                                        key={idx}
                                        href={course.courseUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-700 hover:underline text-sm transition-colors duration-200"
                                      >
                                        {translatedCourse.course}
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {/* Organization Involvement Section */}
                            {edu.organizationInvolvement && edu.organizationInvolvement.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2">{organizationInvolvementText}</h4>
                                <div className="flex flex-col gap-1">
                                  {edu.organizationInvolvement.map((org, idx) => {
                                    const translatedOrg = getTranslatedOrg(org, translatedEdu, edu);
                                    return (
                                      <div key={idx} className="text-rose-700 text-sm">
                                        <span className="font-semibold">{translatedOrg.organization}</span>
                                        <span className="font-normal"> – {translatedOrg.role}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </motion.div>
                          {/* Right: Education Image */}
                          {edu.educationImageUrl && (
                            <div className="md:col-span-2 flex justify-center items-center">
                              <img
                                src={edu.educationImageUrl}
                                alt={`${translatedEdu.name} education`}
                                className="h-48 w-auto max-w-full object-contain rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 mx-auto"
                                style={{ maxHeight: '12rem', minHeight: '8rem' }}
                                onClick={() => setModalImage({ src: edu.educationImageUrl, alt: `${translatedEdu.name} education` })}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </Element>

          {/* Certifications Section */}
          <Element name="certifications-section">
            <motion.div
              className="max-w-4xl mx-auto mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
            >
              <motion.h3
                className="text-2xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: false, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {certificationsText}
              </motion.h3>
              <div className="grid gap-8">
                {certifications.map((cert, index) => {
                  const translatedCert = getTranslatedItem(cert);
                  return (
                    <motion.div
                      key={cert.name + index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      viewport={{ once: false, margin: '-20px' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-white rounded-lg shadow-lg p-6">
                        <div className="grid md:grid-cols-5 gap-6 items-stretch">
                          {/* Left: Certification Details */}
                          <motion.div className="md:col-span-3 overflow-y-auto max-h-80 pr-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
                            <h3 className="text-2xl font-semibold mb-2">
                              {cert.nameUrl ? (
                                <a
                                  href={cert.nameUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                                >
                                  {translatedCert.name}
                                </a>
                              ) : (
                                translatedCert.name
                              )}
                            </h3>
                            <p className="text-gray-600 mb-4">{completionText} {translatedCert.completionDate || cert.completionDate}</p>
                            {cert.description && (
                              <p className="text-gray-600 mb-4">{translatedCert.description}</p>
                            )}
                          </motion.div>
                          {/* Right: Certification Image */}
                          {cert.educationImageUrl && (
                            <div className="md:col-span-2 flex justify-center items-center">
                              <img
                                src={cert.educationImageUrl}
                                alt={`${translatedCert.name} certification`}
                                className="h-48 w-auto max-w-full object-contain rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 mx-auto"
                                style={{ maxHeight: '12rem', minHeight: '8rem' }}
                                onClick={() => setModalImage({ src: cert.educationImageUrl, alt: `${translatedCert.name} certification` })}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </Element>

          {/* Programs Section */}
          <Element name="programs-section">
            <motion.div
              className="max-w-4xl mx-auto mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5 }}
            >
              <motion.h3
                className="text-2xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: false, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {programsText}
              </motion.h3>
              <div className="grid gap-8">
                {programs.map((prog, index) => {
                  const translatedProg = getTranslatedItem(prog);
                  return (
                    <motion.div
                      key={prog.name + index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      viewport={{ once: false, margin: '-20px' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-white rounded-lg shadow-lg p-6">
                        <div className="grid md:grid-cols-5 gap-6 items-stretch">
                          {/* Left: Program Details */}
                          <motion.div className="md:col-span-3 overflow-y-auto max-h-80 pr-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
                            <h3 className="text-2xl font-semibold mb-2">
                              {prog.nameUrl ? (
                                <a
                                  href={prog.nameUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                                >
                                  {translatedProg.name}
                                </a>
                              ) : (
                                translatedProg.name
                              )}
                            </h3>
                            <p className="text-gray-600 mb-4">{graduationText} {translatedProg.completionDate || prog.completionDate}</p>
                            {prog.description && (
                              <p className="text-gray-600 mb-4">{translatedProg.description}</p>
                            )}
                          </motion.div>
                          {/* Right: Program Image */}
                          {prog.educationImageUrl && (
                            <div className="md:col-span-2 flex justify-center items-center">
                              <img
                                src={prog.educationImageUrl}
                                alt={`${translatedProg.name} program`}
                                className="h-48 w-auto max-w-full object-contain rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 mx-auto"
                                style={{ maxHeight: '12rem', minHeight: '8rem' }}
                                onClick={() => setModalImage({ src: prog.educationImageUrl, alt: `${translatedProg.name} program` })}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </Element>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Education;