import React from 'react';
import SectionTitle from '../../assets/ui/SectionTitle';
import Card from '../../assets/ui/Card';
import Button from '../../assets/ui/Button';
import portfolioData from '../../data/portfolioData.ts';

const About = () => {
  return (
    <section id="about" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>About Me</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <Card>
              <p className="text-lg text-gray-700">
                Hello! I'm Justin, a passionate developer...
              </p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-semibold mb-3">Skills</h3>
                {/* Skills content */}
              </Card>
              <Card>
                <h3 className="text-xl font-semibold mb-3">Interests</h3>
                {/* Interests content */}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
