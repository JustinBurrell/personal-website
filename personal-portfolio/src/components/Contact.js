import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Contact = () => {
  const { home } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="contact" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 mb-6">
                I'm always open to new opportunities and collaborations. Feel free to reach out!
              </p>
              <a
                href={`mailto:${home.email}`}
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send Email
              </a>
            </div>
            <div className="flex justify-center space-x-8">
              <a
                href={home.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={home.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Contact;