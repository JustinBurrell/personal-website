import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../assets/ui/SectionTitle';
import Card from '../assets/ui/Card';
import Button from '../assets/ui/Button';
import { scroller } from 'react-scroll';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { useLocation } from 'react-router-dom';
import { scrollSpy } from 'react-scroll';
import { Element } from 'react-scroll';

const Home = () => {
  const { translatedData, isLoading } = useLanguage();
  const location = useLocation();

  // Use the translation hook for inline text
  const organizationsLabel = useTranslateText("Organizations:");
  const viewResumeText = useTranslateText("View Resume");
  const contactMeText = useTranslateText("Contact Me");

  // Move all useEffect hooks to the top
  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        scroller.scrollTo(location.state.scrollTo, {
          duration: 600,
          smooth: 'easeInOutQuart',
          offset: -80,
        });
        // Clear the state so it doesn't scroll again
        window.history.replaceState({}, document.title);
      }, 200);
    }
  }, [location.state]);

  React.useEffect(() => {
    scrollSpy.update();
  }, []);

  // Add loading state and null checks
  if (isLoading || !translatedData || !translatedData.home) {
    return (
      <AnimationWrapper>
        <section id="home" className="min-h-screen py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-20 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-5 gap-6 pt-24">
                <div className="md:col-span-3">
                  <Card variant="transparent" className="h-full flex flex-col justify-center p-2">
                    <div className="space-y-3">
                      <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </Card>
                </div>
                <div className="md:col-span-2">
                  <Card className="h-full">
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { home } = translatedData;

  return (
    <AnimationWrapper>
      <section id="home" className="min-h-screen py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-20 max-w-6xl mx-auto">
            {/* Title, Description, and Image grid */}
            <div className="grid md:grid-cols-5 gap-6 pt-24">
              {/* Left side: Content */}
              <motion.div 
                className="md:col-span-3"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20px" }}
                transition={{ duration: 0.5 }}
              >
                <Card variant="transparent" className="h-full flex flex-col justify-center p-2">
                  <div className="space-y-3">
                    <motion.h1 
                      className="text-5xl md:text-6xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-20px" }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {home.title}
                    </motion.h1>
                    <motion.p 
                      className="text-xl md:text-2xl text-gray-600 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-20px" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {home.description}
                    </motion.p>
                    {/* Organizations */}
                    <motion.div 
                      className="flex flex-wrap gap-1 justify-center py-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-20px" }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <span className="text-sm text-gray-600 mr-2 self-center">{organizationsLabel}</span>
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
                    </motion.div>
                    {/* Divider */}
                    <motion.div 
                      className="w-full h-px bg-gray-300 mx-auto"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ margin: "-20px" }}
                      transition={{ duration: 0.7, delay: 0.4 }}
                    />
                    {/* Resume and Contact Buttons */}
                    <motion.div 
                      className="flex flex-wrap gap-4 mt-6 justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-20px" }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Button
                        as="a"
                        href={home.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                      >
                        {viewResumeText}
                      </Button>
                      <Button
                        onClick={() => {
                          scroller.scrollTo('contact', {
                            duration: 800,
                            delay: 0,
                            smooth: 'easeInOutQuart'
                          });
                        }}
                        variant="secondary"
                      >
                        {contactMeText}
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
              {/* Right side: Image */}
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full">
                  <img
                    src={home.imageUrl}
                    alt="Justin Burrell"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Card>
              </motion.div>
            </div>

            {/* Qualities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full">
                <div className="grid md:grid-cols-3 gap-8 p-6">
                  {home.qualities.map((quality, index) => (
                    <motion.div 
                      key={index} 
                      className="flex flex-col h-full"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ margin: "-20px" }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        {quality.attribute}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-center flex-grow">
                        {quality.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;