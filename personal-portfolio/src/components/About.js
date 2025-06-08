import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const About = () => {
  const { about } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="about" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">About Me</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {about.introduction}
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {about.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {about.interests.map((interest, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default About;
