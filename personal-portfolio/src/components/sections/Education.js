import React from 'react';

const Education = () => {
  return (
    <section id="education" className="min-h-screen flex items-center justify-center bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Education</h2>
        <div className="max-w-3xl mx-auto">
          {/* Add your education content here */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">University Name</h3>
            <p className="text-gray-600">Degree • Major</p>
            <p className="text-gray-500">Graduation Year</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
