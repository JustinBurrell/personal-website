import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiReact } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-md mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm sm:text-base">© 2025 Justin Burrell</span>
            <a
              href="https://www.linkedin.com/in/thejustinburrell/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0A66C2] hover:text-[#004182] transition-colors"
            >
              <FaLinkedin className="text-lg sm:text-xl" />
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center flex-wrap justify-center space-x-2 text-sm sm:text-base">
            <span className="text-gray-600">Created with</span>
            <SiReact className="text-lg sm:text-xl text-[#61DAFB] animate-spin-slow" />
            <span className="text-gray-600">React</span>
            <span className="text-gray-600 mx-2">•</span>
            <a
              href="https://github.com/JustinBurrell/personalWebsiteProject"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
            >
              <FaGithub className="text-lg sm:text-xl" />
              <span>Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
