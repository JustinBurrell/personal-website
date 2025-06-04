import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import portfolioData from '../../data/portfolioData.ts';

const Experience = () => {
  return (
    <section id="experience" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Experience</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <Card>
            {/* Section specific content */}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Experience;