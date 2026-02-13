import React, { useState } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import Card from '../assets/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { Element } from 'react-scroll';

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-cream-800/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-cream-50 border border-cream-300 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-cream-50/90 hover:bg-cream-50 rounded-full p-2 border border-cream-300 transition-all"
              aria-label="Close modal"
            >
              <FaTimes className="text-cream-500 hover:text-cinnabar-500 text-xl" />
            </button>

            {project.imageUrl && (
              <div className="relative h-96 w-full bg-cream-200 rounded-t-2xl overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                <h2 className="text-3xl font-display font-bold text-cream-800">{project.title}</h2>
                {project.date && (
                  <span className="font-mono text-sm text-cream-400 uppercase tracking-wider">{project.date}</span>
                )}
              </div>

              <p className="font-body text-cream-500 mb-6 text-lg leading-relaxed">
                {project.description}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold text-cream-800 mb-3">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="font-body text-cream-500">{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-display font-semibold text-cream-800 mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="font-mono text-xs uppercase tracking-wider bg-cinnabar-50 text-cinnabar-500 border border-cinnabar-200 rounded-full px-3 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-cream-300">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream-500 hover:text-cinnabar-500 transition-colors font-display font-medium">
                    <FaGithub className="text-xl" />
                    <span>View Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream-500 hover:text-cinnabar-500 transition-colors font-display font-medium">
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

const ProjectsGrid = ({ projects, onProjectClick }) => {
  const sortedProjects = [...projects].sort((a, b) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return 0;
      const d = new Date(dateStr);
      return isNaN(d) ? 0 : d.getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto justify-items-center">
      {sortedProjects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="group cursor-pointer w-full max-w-xl"
          onClick={() => onProjectClick(project)}
        >
          <Card hoverable className="overflow-hidden">
            <div className="relative h-64 bg-cream-200 overflow-hidden">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-200 to-cream-300">
                  <span className="text-cream-400 text-4xl font-display font-bold">{project.title.charAt(0)}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-cream-800/0 group-hover:bg-cream-800/80 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100">
                <div className="text-cream-50 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-display font-bold mb-2">{project.title}</h3>
                  <p className="text-sm font-body text-cream-200 line-clamp-3">{project.description}</p>
                  {project.date && (
                    <p className="font-mono text-xs text-cream-300 mt-2 uppercase tracking-wider">{project.date}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 md:hidden">
              <h3 className="text-lg font-display font-bold text-cream-800 mb-1">{project.title}</h3>
              {project.date && (
                <p className="font-mono text-xs text-cream-400 uppercase tracking-wider">{project.date}</p>
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

  const projectsTitle = useTranslateText("Projects");

  if (!translatedData || !translatedData.projects || !translatedData.projects[0]) {
    return (
      <AnimationWrapper>
        <section id="projects" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="h-20 bg-cream-200 animate-pulse rounded-2xl w-3/4 mb-6"></div>
            <div className="h-6 bg-cream-200 animate-pulse rounded w-1/2"></div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { projects } = translatedData;
  const projectData = projects[0];

  return (
    <AnimationWrapper>
      <section id="projects" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
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
                {projectsTitle}
              </motion.h1>
              <motion.p
                className="text-xl font-body text-cream-500 leading-relaxed max-w-2xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {projectData.description}
              </motion.p>
              <motion.a
                href="https://github.com/JustinBurrell"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cinnabar-500 hover:text-cinnabar-700 transition-colors font-display font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FaGithub className="text-2xl" />
                <span>View GitHub</span>
              </motion.a>
            </div>
            {projectData.projectImageUrl && (
              <motion.div
                className="md:col-span-4 flex justify-end items-start"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={projectData.projectImageUrl}
                  alt="Projects"
                  className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl border border-cream-300"
                />
              </motion.div>
            )}
          </div>

          {/* Projects Grid */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Element name="projects-section">
              <ProjectsGrid
                projects={projectData.project}
                onProjectClick={(project) => setSelectedProject(project)}
              />
            </Element>
          </motion.div>

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
