import React from 'react';

const About = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Me</h1>
        <div className="max-w-3xl mx-auto">
          {/* Add your about content here */}
          <p className="text-lg text-gray-700 mb-6">
            Your introduction goes here...
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
