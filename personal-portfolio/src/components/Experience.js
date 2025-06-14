import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import Card from '../assets/ui/Card';
import { scroller, Link as ScrollLink } from 'react-scroll';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Experience = () => {
  const { translatedData } = useLanguage();
  const { experience } = translatedData;
  const expData = experience[0]; // Assuming only one experience object as per new structure
  const location = useLocation();

  // Use translation hook for static text
  const experienceTitle = useTranslateText("Experience");
  const professionalText = useTranslateText("Professional Experience");
  const leadershipText = useTranslateText("Leadership Experience");

  // Helper to render experience cards
  const renderExperienceList = (list) => (
    <div className="space-y-8">
      {list.map((exp, idx) => (
        <motion.div
          key={idx}
          className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold text-blue-700 hover:underline"
            >
              {exp.company}
            </a>
            <span className="text-gray-600 text-right md:ml-4 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
            <span className="italic text-lg text-gray-800">{exp.position}</span>
            <span className="text-gray-500 text-sm md:ml-4">{exp.location}</span>
          </div>
          <ul className="list-disc list-inside space-y-2 mb-4 mt-2">
            {exp.responsibilities.map((resp, i) => (
              <li key={i} className="text-gray-700">{resp}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mb-2 items-center">
            <span className="font-semibold text-sm text-gray-700 mr-2">Skills:</span>
            {exp.skills.map((skill, i) => (
              <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
          {exp.technologies && exp.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <span className="font-semibold text-sm text-gray-700 mr-2">Technologies:</span>
              {exp.technologies.map((tech, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Responsive sub bar (desktop and mobile/tablet)
  const subBarOptions = [
    { label: professionalText, to: 'professional-experience-section' },
    { label: leadershipText, to: 'leadership-experience-section' },
  ];

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
      <section id="experience" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          {/* Top Card: Experience Title/Description/Image */}
          <motion.div
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="transparent" className="p-0">
              <div className="grid md:grid-cols-5 gap-6 items-center">
                {/* Left: Title & Description */}
                <div className="md:col-span-3 flex flex-col justify-center p-6">
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{experienceTitle}</h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">{expData.description}</p>
                  <div className="flex gap-2 mt-6">
                    <button
                      className="px-3 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-sm"
                      onClick={() => scroller.scrollTo('professional-experience-section', { duration: 600, smooth: 'easeInOutQuart', offset: -80 })}
                    >
                      {professionalText}
                    </button>
                    <button
                      className="px-3 py-1 rounded-full font-semibold border bg-gray-100 text-blue-700 border-blue-700 text-sm"
                      onClick={() => scroller.scrollTo('leadership-experience-section', { duration: 600, smooth: 'easeInOutQuart', offset: -80 })}
                    >
                      {leadershipText}
                    </button>
                  </div>
                </div>
                {/* Right: Experience Image */}
                {expData.experienceImageUrl && (
                  <div className="md:col-span-2 flex justify-center items-center p-4">
                    <img
                      src={expData.experienceImageUrl}
                      alt="Experience"
                      className="w-full h-full object-cover rounded-lg max-h-72"
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Professional Experience Section */}
          <motion.div
            id="professional-experience-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-6">{professionalText}</h3>
            {renderExperienceList(expData.professionalexperience)}
          </motion.div>

          {/* Leadership Experience Section */}
          <motion.div
            id="leadership-experience-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-center mb-6">{leadershipText}</h3>
            {renderExperienceList(expData.leadershipexperience)}
          </motion.div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Experience;