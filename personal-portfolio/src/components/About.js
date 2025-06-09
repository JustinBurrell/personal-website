import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import portfolioData from '../data/portfolioData.ts';
import { 
  FaPython, 
  FaJava, 
  FaJs, 
  FaDatabase, 
  FaHtml5, 
  FaCss3Alt, 
  FaReact, 
  FaDocker, 
  FaGitAlt 
} from 'react-icons/fa';
import { 
  SiDotnet,
  SiApachemaven, 
  SiFlutter, 
  SiFirebase,
  SiC,
  SiKubernetes,
  SiDart
} from 'react-icons/si';

// Define official website URLs for each technology
const skillUrls = {
  'Python': 'https://www.python.org/',
  'Java': 'https://www.java.com/',
  'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'SQL': 'https://www.mysql.com/',
  'C': 'https://en.cppreference.com/w/c/language',
  'HTML': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'React': 'https://reactjs.org/',
  'Maven': 'https://maven.apache.org/',
  'Flutter': 'https://flutter.dev/',
  'ASP.NET': 'https://dotnet.microsoft.com/',
  'Firebase': 'https://firebase.google.com/',
  'Docker': 'https://www.docker.com/',
  'Git': 'https://git-scm.com/',
  'Kubernetes': 'https://kubernetes.io/',
  'Dart': 'https://dart.dev/'
};

// Define icon colors based on official brand colors
const skillIconColors = {
  'Python': '#3776AB',
  'Java': '#007396',
  'JavaScript': '#F7DF1E',
  'SQL': '#4479A1',
  'C': '#A8B9CC',
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'React': '#61DAFB',
  'Maven': '#C71A36',
  'Flutter': '#02569B',
  'ASP.NET': '#512BD4',
  'Firebase': '#FFCA28',
  'Docker': '#2496ED',
  'Git': '#F05032',
  'Kubernetes': '#326CE5',
  'Dart': '#0175C2'
};

const skillIcons = {
  'Python': FaPython,
  'Java': FaJava,
  'JavaScript': FaJs,
  'SQL': FaDatabase,
  'C': SiC,
  'HTML': FaHtml5,
  'CSS': FaCss3Alt,
  'React': FaReact,
  'Maven': SiApachemaven,
  'Flutter': SiFlutter,
  'ASP.NET': SiDotnet,
  'Firebase': SiFirebase,
  'Docker': FaDocker,
  'Git': FaGitAlt,
  'Kubernetes': SiKubernetes,
  'Dart': SiDart
};

const renderTextWithLinks = (text) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-rose-500 hover:text-emerald-600 font-bold transition-colors"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

const About = () => {
  const { about } = portfolioData;

  return (
    <AnimationWrapper>
    <section id="about" className="min-h-screen py-16">
      <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-16 max-w-6xl mx-auto">
            <Card className="p-8">
              {/* Title */}
              <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">My Journey</h2>

              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {renderTextWithLinks(about.introduction)}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-300 mx-auto mb-12"></div>

              {/* Bottom section: Skills and Interests */}
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-center">Skills</h3>
                    <div className="flex flex-wrap gap-6 justify-center">
                      {about.skills.map((skill, index) => {
                        const Icon = skillIcons[skill];
                        return Icon ? (
                          <div
                            key={index}
                            className="group relative cursor-pointer"
                            title={`Click to visit ${skill} website`}
                          >
                            <a
                              href={skillUrls[skill]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <Icon 
                                className="text-4xl transition-transform hover:scale-125" 
                                style={{ color: skillIconColors[skill] }}
                              />
                            </a>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {skill}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-center">Interests</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {about.interests.map((interest, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
        </div>
      </div>
    </section>
    </AnimationWrapper>
  );
};

export default About;
