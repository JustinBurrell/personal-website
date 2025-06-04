import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import portfolioData from '../../data/portfolioData.ts';

const Projects = () => {
  return (
    <section id="projects" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Projects</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <Card>
            {/* Section specific content */}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Projects;