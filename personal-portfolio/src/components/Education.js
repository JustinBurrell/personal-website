import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import portfolioData from '../data/portfolioData.ts';

const Education = () => {
  const { translatedData, currentLanguage } = useLanguage();
  const { education: translatedEducation } = translatedData;
  const educationGroup = translatedEducation[0];
  
  // Use original data for filtering
  const originalEducation = portfolioData.education[0];
  const educationList = originalEducation.education;

  const location = useLocation();

  // Use translation hook for static text
  const educationTitle = useTranslateText("Education");
  const relevantCoursesText = useTranslateText("Relevant Courses");
  const organizationInvolvementText = useTranslateText("Organization Involvement");
  const schoolingText = useTranslateText("Schooling");
  const certificationsText = useTranslateText("Certifications");
  const programsText = useTranslateText("Programs");

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
  const getTranslatedOrg = (originalOrg, translatedEdu) => {
    if (currentLanguage === 'en') return originalOrg;
    if (!translatedEdu.organizationInvolvement) return originalOrg;

    const translatedOrg = translatedEdu.organizationInvolvement.find(o => 
      o.organization === originalOrg.organization && o.role === originalOrg.role
    );
    return translatedOrg || originalOrg;
  };

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

  return (
    <AnimationWrapper>
      <section id="education" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          {/* Top Card: Education Title/Description/Image */}
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
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{educationTitle}</h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">{educationGroup.description}</p>
                  <div className="flex gap-2 mt-6 items-center whitespace-nowrap">
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
          <motion.div
            id="schooling-section"
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
                      <p className="text-gray-600 mb-4">Graduation: {edu.completionDate}</p>
                      {edu.gpa && (
                        <p className="text-gray-600 mb-4">GPA: {edu.gpa}</p>
                      )}
                      {/* Relevant Courses Section */}
                      {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">{relevantCoursesText}</h4>
                          <div className="flex flex-wrap gap-3">
                            {edu.relevantCourses.map((course, idx) => {
                              const translatedCourse = getTranslatedCourse(course, translatedEdu);
                              return (
                                <a
                                  key={idx}
                                  href={course.courseUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-200 transition-colors duration-200 ease-in-out flex items-center justify-center font-semibold text-sm"
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
                          <h4 className="text-lg font-semibold mb-4">{organizationInvolvementText}</h4>
                          <div className="flex flex-wrap gap-3">
                            {edu.organizationInvolvement.map((org, idx) => {
                              const translatedOrg = getTranslatedOrg(org, translatedEdu);
                              return (
                                <div
                                  key={idx}
                                  className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full flex flex-col items-center text-center font-semibold text-sm"
                                >
                                  <span className="font-medium">{translatedOrg.organization}</span>
                                  <span className="text-xs">{translatedOrg.role}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div
            id="certifications-section"
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
                      <p className="text-gray-600 mb-2">{cert.completionDate}</p>
                      {translatedCert.description && <p className="text-gray-700 mt-2">{translatedCert.description}</p>}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Programs Section */}
          <motion.div
            id="programs-section"
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
                      <p className="text-gray-600 mb-2">{prog.completionDate}</p>
                      {translatedProg.description && <p className="text-gray-700 mt-2">{translatedProg.description}</p>}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Education;