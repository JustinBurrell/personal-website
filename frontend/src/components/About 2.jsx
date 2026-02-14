import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import SectionTitle from '../assets/ui/SectionTitle';
import { StaggerContainer, StaggerItem } from '../assets/ui/StaggerContainer';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
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
  SiDart,
  SiGooglecloud
} from 'react-icons/si';
import { Element } from 'react-scroll';

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
  'Dart': 'https://dart.dev/',
  'Google Cloud': 'https://cloud.google.com/'
};

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
  'Dart': '#0175C2',
  'Google Cloud': '#4285F4'
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
  'Dart': SiDart,
  'Google Cloud': SiGooglecloud
};

const renderTextWithLinks = (text) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cinnabar-500 hover:text-cinnabar-700 underline decoration-cinnabar-200 hover:decoration-cinnabar-500 underline-offset-4 transition-all font-semibold"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

const About = () => {
  const { translatedData, isLoading } = useLanguage();

  const journeyTitle = useTranslateText("My Journey");
  const skillsTitle = useTranslateText("Skills");
  const interestsTitle = useTranslateText("Interests");

  if (isLoading || !translatedData || !translatedData.about) {
    return (
      <AnimationWrapper>
        <Element name="about">
          <section id="about" className="py-24 bg-cream-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-12 bg-cream-300 animate-pulse rounded-2xl mb-12 w-48"></div>
              <div className="space-y-4">
                <div className="h-4 bg-cream-300 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-cream-300 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          </section>
        </Element>
      </AnimationWrapper>
    );
  }

  const { about } = translatedData;

  return (
    <AnimationWrapper>
      <Element name="about">
        <section id="about" className="py-24 bg-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>{journeyTitle}</SectionTitle>

            {/* Introduction */}
            <motion.div
              className="mb-16 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg font-body text-cream-500 leading-relaxed whitespace-pre-wrap">
                {renderTextWithLinks(about.introduction)}
              </p>
            </motion.div>

            {/* Animated Divider */}
            <motion.div
              className="h-px bg-cinnabar-500 mb-16"
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Skills and Interests - 7/5 split */}
            <div className="grid md:grid-cols-12 gap-12">
              {/* Skills */}
              <motion.div
                className="md:col-span-7"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-display font-semibold text-cream-800 mb-6">
                  {skillsTitle}
                </h3>
                <div className="bg-cream-100 rounded-2xl p-6">
                  <div className="flex flex-wrap gap-6 justify-start">
                    {about.skills.map((skill, index) => {
                      const Icon = skillIcons[skill];
                      return Icon ? (
                        <motion.div
                          key={index}
                          className="group relative cursor-pointer"
                          title={skill}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <a
                            href={skillUrls[skill]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Icon
                              className="text-5xl transition-transform"
                              style={{ color: skillIconColors[skill] }}
                            />
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-cream-800 text-cream-100 px-2 py-1 rounded-lg text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {skill}
                            </div>
                          </a>
                        </motion.div>
                      ) : null;
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Interests */}
              <motion.div
                className="md:col-span-5"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-display font-semibold text-cream-800 mb-6">
                  {interestsTitle}
                </h3>
                <StaggerContainer className="flex flex-wrap gap-2">
                  {about.interests.map((interest, index) => (
                    <StaggerItem key={index}>
                      <span className="inline-block font-mono text-xs uppercase tracking-wider bg-cream-100 text-cream-600 border border-cream-300 rounded-full px-4 py-1.5 hover:border-cinnabar-300 hover:text-cinnabar-500 transition-colors">
                        {interest}
                      </span>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>
            </div>
          </div>
        </section>
      </Element>
    </AnimationWrapper>
  );
};

export default About;
