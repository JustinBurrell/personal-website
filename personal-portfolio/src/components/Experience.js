import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Experience = () => {
  const { experience } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="experience" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-2">{exp.position}</h3>
                <p className="text-gray-600 mb-2">{exp.company} • {exp.location}</p>
                <p className="text-gray-600 mb-4">{exp.startDate} - {exp.endDate}</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-gray-700">{resp}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                {exp.technologies && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Experience;