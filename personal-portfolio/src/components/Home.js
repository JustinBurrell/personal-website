import React from 'react';
import SectionTitle from '../assets/ui/SectionTitle';
import Card from '../assets/ui/Card';
import Button from '../assets/ui/Button';
import portfolioData from '../data/portfolioData.ts';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Home = () => {
  const { home } = portfolioData;

  return (
    <section id="home" className="min-h-screen py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
          {/* Title, Description, and Image grid */}
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left side: Content */}
            <div className="md:col-span-3">
              <Card variant="transparent" className="h-full flex flex-col justify-center p-2">
                <div className="space-y-3">
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
                    {home.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                    {home.description}
                  </p>
                  {/* Organizations */}
                  <div className="flex flex-wrap gap-1 justify-center pt-2">
                    {home.organizations.map((org, index) => (
                      <Button
                        key={index}
                        as="a"
                        href={org.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="organization"
                        size="small"
                        customColor={org.orgColor}
                      >
                        {org.name}
                      </Button>
                    ))}
                  </div>
                  {/* Resume and Social Links */}
                  <div className="flex items-center justify-center gap-8 pt-3">
                    <Button
                      as="a"
                      href={home.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-base rounded-lg transition-colors"
                    >
                      Resume
                    </Button>
                    <a
                      href={home.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <FaLinkedin size={32} />
                    </a>
                    <a
                      href={home.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <FaGithub size={32} />
                    </a>
                    <a
                      href={`mailto:${home.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <FaEnvelope size={32} />
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right side: Image */}
            <div className="md:col-span-2 flex items-start justify-center">
              <img
                src={home.imageUrl}
                alt="Justin Burrell"
                className="rounded-lg shadow-lg w-full max-w-xs h-auto object-cover"
              />
            </div>
          </div>

          {/* Qualities grid */}
          <Card className="w-full">
            <div className="grid md:grid-cols-3 gap-8 p-6">
              {home.qualities.map((quality, index) => (
                <div key={index} className="flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    {quality.attribute}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center flex-grow">
                    {quality.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Home;