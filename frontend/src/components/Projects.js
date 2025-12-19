import React, { useState } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import Card from '../assets/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { Element } from 'react-scroll';

// Project Detail Modal Component
const ProjectModal = ({ project, isOpen, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              aria-label="Close modal"
            >
              <FaTimes className="text-gray-700 text-xl" />
            </button>

            {/* Project Image */}
            {project.imageUrl && (
              <div className="relative h-96 w-full bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Project Content */}
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>
                {project.date && (
                  <span className="text-sm text-gray-500 font-normal">- {project.date}</span>
                )}
              </div>

              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {project.description}
              </p>

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="text-gray-700">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Links */}
              <div className="flex gap-4 pt-4 border-t">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FaGithub className="text-xl" />
                    <span>View Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FaExternalLinkAlt className="text-xl" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Projects Grid Component
const ProjectsGrid = ({ projects, onProjectClick }) => {
  // Sort projects by date (most recent first)
  const sortedProjects = [...projects].sort((a, b) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return 0;
      const d = new Date(dateStr);
      return isNaN(d) ? 0 : d.getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {sortedProjects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
          onClick={() => onProjectClick(project)}
        >
          <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64 bg-gray-100 overflow-hidden">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <span className="text-gray-400 text-4xl font-bold">{project.title.charAt(0)}</span>
                </div>
              )}
              
              {/* Hover overlay with description */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100">
                <div className="text-white text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-3">
                    {project.description}
                  </p>
                  {project.date && (
                    <p className="text-xs text-gray-300 mt-2">{project.date}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Project title below image (visible on mobile) */}
            <div className="p-4 md:hidden">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{project.title}</h3>
              {project.date && (
                <p className="text-sm text-gray-500">{project.date}</p>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const Projects = () => {
  const { translatedData, isLoading } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);

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

          {/* Projects Grid Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5 }}
          >
            <Element name="projects-section">
              <ProjectsGrid 
                projects={projectData.project} 
                onProjectClick={(project) => setSelectedProject(project)}
              />
            </Element>
          </motion.div>

          {/* Project Detail Modal */}
          <ProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Projects;