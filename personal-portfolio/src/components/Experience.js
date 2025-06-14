import React, { useState } from 'react';
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

  // Helper to render grouped experience cards (for both professional and leadership)
  const renderGroupedExperience = (companies) => (
    <div className="space-y-12">
      {companies.map((company, cidx) => (
        <motion.div
          key={company.company + cidx}
          className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6, delay: cidx * 0.1, type: 'spring', stiffness: 100, damping: 18 }}
        >
          <motion.div
            className="border-b-2 border-gray-300 pb-2 mb-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20px' }}
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
              viewport={{ once: true, margin: '-20px' }}
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
                <span className="font-semibold text-sm text-gray-700 mr-2">Skills:</span>
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
                  <span className="font-semibold text-sm text-gray-700 mr-2">Technologies:</span>
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
            <motion.h3
              className="text-2xl font-bold text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {professionalText}
            </motion.h3>
            {renderGroupedExperience(expData.professionalexperience)}
          </motion.div>

          {/* Leadership Experience Section */}
          <motion.div
            id="leadership-experience-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.h3
              className="text-2xl font-bold text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {leadershipText}
            </motion.h3>
            {renderGroupedExperience(expData.leadershipexperience)}
          </motion.div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

// Simple modal for image lightbox
const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <img src={imageUrl} alt="Experience Full" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg" onClick={e => e.stopPropagation()} />
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
      <div className="flex gap-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded-full"
          onClick={() => setSelected((selected - 1 + images.length) % images.length)}
          aria-label="Previous image"
        >
          &#8592;
        </button>
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Experience ${idx + 1}`}
            className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${selected === idx ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => { setSelected(idx); setModalOpen(true); }}
          />
        ))}
        <button
          className="px-2 py-1 bg-gray-200 rounded-full"
          onClick={() => setSelected((selected + 1) % images.length)}
          aria-label="Next image"
        >
          &#8594;
        </button>
      </div>
      <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={images[selected]} />
    </div>
  );
};

export default Experience;