import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Projects = () => {
  const { projects } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-gray-700">{highlight}</li>
                      ))}
                    </ul>
                    <div className="flex gap-4 mt-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Projects;