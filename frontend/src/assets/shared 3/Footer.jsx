import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiReact } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="w-full bg-cream-800 border-t border-cream-700 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <span className="font-mono text-xs uppercase tracking-wide text-cream-400">© 2026 Justin Burrell</span>
            <a
              href="https://www.linkedin.com/in/thejustinburrell/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-400 hover:text-cinnabar-400 transition-colors"
            >
              <FaLinkedin className="text-lg sm:text-xl" />
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center flex-wrap justify-center space-x-2 font-mono text-xs uppercase tracking-wide">
            <span className="text-cream-400">Built with</span>
            <SiReact className="text-lg sm:text-xl text-cream-400 animate-spin-slow" />
            <span className="text-cream-400">React</span>
            <span className="text-cream-500 mx-2">&middot;</span>
            <a
              href="https://github.com/JustinBurrell/personalWebsiteProject"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-400 hover:text-cinnabar-400 transition-colors flex items-center space-x-1"
            >
              <FaGithub className="text-lg sm:text-xl" />
              <span>Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
