import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';

const Education = () => {
  const { education } = portfolioData;

  return (
    <AnimationWrapper>
      <section id="education" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Education</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {education.map((edu, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-2">
                  {edu.nameUrl ? (
                    <a
                      href={edu.nameUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                    >
                      {edu.name}
                    </a>
                  ) : (
                    edu.name
                  )}
                </h3>
                <p className="text-gray-600 mb-2">
                  {edu.education_type}
                  {edu.major && ` in ${edu.major}`}
                </p>
                <p className="text-gray-600 mb-4">Graduation: {edu.completionDate}</p>
                {edu.gpa && (
                  <p className="text-gray-600 mb-4">GPA: {edu.gpa}</p>
                )}
                
                {/* Relevant Courses Section */}
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">Relevant Courses</h4>
                    <div className="flex flex-wrap gap-3">
                      {edu.relevantCourses.map((course, idx) => (
                        <a
                          key={idx}
                          href={course.courseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors duration-200 ease-in-out flex items-center justify-center"
                        >
                          {course.course}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Organization Involvement Section */}
                {edu.organizationInvolvement && edu.organizationInvolvement.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Organization Involvement</h4>
                    <div className="flex flex-wrap gap-3">
                      {edu.organizationInvolvement.map((org, idx) => (
                        <div
                          key={idx}
                          className="bg-rose-100 text-rose-700 px-4 py-2 rounded-lg flex flex-col items-center text-center"
                        >
                          <span className="font-medium">{org.organization}</span>
                          <span className="text-sm">{org.role}</span>
                        </div>
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