import React from 'react';
import SectionTitle from '../../assets/ui/SectionTitle';
import Card from '../../assets/ui/Card';
import Button from '../../assets/ui/Button';
import portfolioData from '../../data/portfolioData.ts';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Home = () => {
  const { home } = portfolioData;

  return (
    <section id="home" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left side: Title and Description */}
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">
                {home.title}
              </h1>
              <p className="text-lg text-gray-600">
                {home.description}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Button
                  as="a"
                  href={home.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Resume
                </Button>
                <a
                  href={home.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href={home.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href={`mailto:${home.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>

            {/* Right side: Image */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src={home.imageUrl}
                alt="Justin Burrell"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Home;