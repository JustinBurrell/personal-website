import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Awards = () => {
  const { awards } = portfolioData;

  return (
    <AnimationWrapper>
    <section id="awards" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Awards & Recognition</h2>
          <div className="max-w-4xl mx-auto grid gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-2">{award.title}</h3>
                <p className="text-gray-600 mb-2">{award.organization} - {award.date}</p>
                <p className="text-gray-700">{award.description}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
    </AnimationWrapper>
  );
};

export default Awards;