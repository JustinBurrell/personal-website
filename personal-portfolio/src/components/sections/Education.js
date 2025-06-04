import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const Education = () => {
  return (
    <section id="education" className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle>Education</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <Card>
              <h3 className="text-2xl font-semibold mb-2">University Name</h3>
              <p className="text-gray-600 mb-2">Degree • Major</p>
              <p className="text-gray-500 mb-4">Expected Graduation: Year</p>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">Relevant Coursework</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Course 1</li>
                    <li>Course 2</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;