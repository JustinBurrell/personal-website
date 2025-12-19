import React, { useRef, useEffect } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import Card from '../assets/ui/Card';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Element } from 'react-scroll';

// Timeline component for projects
const Timeline = ({ projects }) => {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Sort projects by date (most recent first)
  const sortedProjects = [...projects].sort((a, b) => {
    // Parse date as YYYY/MM/DD for comparison, fallback to 0 if invalid
    const parseDate = (dateStr) => {
      if (!dateStr) return 0;
      const d = new Date(dateStr);
      return isNaN(d) ? 0 : d.getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  // Center the first card on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const cardWidth = containerWidth;
      const scrollPosition = (containerWidth - cardWidth) / 2;
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, []);

  // Update active index on scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const index = Math.round(scrollLeft / containerWidth);
      setActiveIndex(index);
    }
  };

  // Scroll to a specific card
  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const scroll = (direction) => {
    let newIndex = activeIndex + (direction === 'left' ? -1 : 1);
    newIndex = Math.max(0, Math.min(projects.length - 1, newIndex));
    scrollToIndex(newIndex);
  };

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      {/* Scroll buttons further from the card */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        aria-label="Scroll left"
        style={{ left: '-4.5rem' }}
      >
        <FaChevronLeft className="text-gray-800 text-xl" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        aria-label="Scroll right"
        style={{ right: '-4.5rem' }}
      >
        <FaChevronRight className="text-gray-800 text-xl" />
      </button>

      {/* Timeline container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {sortedProjects.map((project, index) => (
          <motion.div
            key={project.title}
            className="flex-none w-full snap-center"
            style={{ minWidth: '100%', maxWidth: '100%' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <div className="flex flex-col h-full">
                {/* Project Image */}
                {project.imageUrl && (
                  <div className="relative h-96 flex items-center justify-center bg-white rounded-t-lg">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="max-h-96 w-full object-contain"
                    />
                  </div>
                )}

                {/* Project Content */}
                <div className="p-6 flex-grow">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <motion.h3
                      className="text-2xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.5 }}
                    >
                      {project.title}
                    </motion.h3>
                    {project.date && (
                      <span className="text-sm text-gray-500 font-normal">- {project.date}</span>
                    )}
                  </div>
                  <motion.p
                    className="text-gray-600 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-2 mb-4">
                      {project.highlights.map((highlight, i) => (
                        <motion.li
                          key={i}
                          className="text-gray-700"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-20px' }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                        >
                          {highlight}
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Project Links */}
                  <div className="flex gap-4 mt-auto pt-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      >
                        <FaGithub className="text-lg" />
                        <span>View Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      >
                        <FaExternalLinkAlt className="text-lg" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* Slider dots below the cards */}
      <div className="flex justify-center items-center gap-2 mt-2">
        {projects.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border-2 ${activeIndex === idx ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-400'} transition-all duration-200`}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to project ${idx + 1}`}
            style={{ outline: 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const { translatedData, isLoading } = useLanguage();

  // Use translation hook for static text
  const projectsTitle = useTranslateText("Projects");

  // Show skeleton if data not available yet - but don't block on isLoading
  // This allows instant rendering while data loads in background
  if (!translatedData || !translatedData.projects || !translatedData.projects[0]) {
    return (
      <AnimationWrapper>
        <section id="projects" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
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

  const { projects } = translatedData;
  const projectData = projects[0];

  return (
    <AnimationWrapper>
      <section id="projects" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          {/* Top Card: Projects Title/Description/Image */}
          <motion.div
            className="max-w-4xl mx-auto mb-2 pt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="transparent" className="p-0">
              <div className="grid md:grid-cols-5 gap-6 items-center">
                {/* Left: Title & Description */}
                <div className="md:col-span-3 flex flex-col justify-center p-6">
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{projectsTitle}</h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">{projectData.description}</p>
                  <div className="flex gap-2 mt-6 items-center">
                    <a
                      href="https://github.com/JustinBurrell"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <FaGithub className="text-2xl" />
                      <span>View GitHub</span>
                    </a>
                  </div>
                </div>
                {/* Right: Project Image */}
                {projectData.projectImageUrl && (
                  <div className="md:col-span-2 flex justify-center items-stretch p-4">
                    <img
                      src={projectData.projectImageUrl}
                      alt="Projects"
                      className="h-full w-auto max-h-[400px] object-contain rounded-lg"
                      style={{ minHeight: '200px', maxHeight: '100%' }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5 }}
          >
            <Element name="projects-section">
              <Timeline projects={projectData.project} />
            </Element>
          </motion.div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Projects;