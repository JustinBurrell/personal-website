import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import portfolioData from '../data/portfolioData.ts';

const About = () => {
  const { about } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="about" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-16 max-w-6xl mx-auto">
            <Card className="p-8">
              {/* Title */}
              <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">My Journey</h2>

              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {about.introduction}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-300 mx-auto mb-12"></div>

              {/* Bottom section: Skills and Interests */}
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-center">Skills</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {about.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-center">Interests</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {about.interests.map((interest, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default About;
