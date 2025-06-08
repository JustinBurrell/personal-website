import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Education = () => {
  const { education } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="education" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Education</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {education.map((edu, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-2">{edu.school}</h3>
                <p className="text-gray-600 mb-2">{edu.education_type} in {edu.major}</p>
                <p className="text-gray-600 mb-4">Graduation: {edu.graduationDate}</p>
                {edu.gpa && (
                  <p className="text-gray-600 mb-4">GPA: {edu.gpa}</p>
                )}
                {edu.relevantCourses && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Relevant Courses</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.relevantCourses.map((course, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {course}
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

export default Education;