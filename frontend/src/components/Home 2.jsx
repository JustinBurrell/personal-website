import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import Button from '../assets/ui/Button';
import TextReveal from '../assets/ui/TextReveal';
import { StaggerContainer, StaggerItem } from '../assets/ui/StaggerContainer';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { useLocation } from 'react-router-dom';

import { useScrollSpy } from '../hooks/useScrollSpy';
import { safeScrollTo } from '../utils/scrollUtils';

const Home = () => {
  const { translatedData, isLoading } = useLanguage();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const organizationsLabel = useTranslateText("Organizations:");
  const viewResumeText = useTranslateText("View Resume");
  const contactMeText = useTranslateText("Contact Me");

  useScrollSpy();

  React.useEffect(() => {
    if (location.state && location.state.scrollTo) {
      safeScrollTo(location.state.scrollTo, { delay: 200 });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!translatedData || !translatedData.home) {
    return (
      <AnimationWrapper>
        <section id="home" className="min-h-screen py-2 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-24 space-y-6">
              <div className="h-20 bg-cream-200 animate-pulse rounded-2xl w-3/4"></div>
              <div className="h-8 bg-cream-200 animate-pulse rounded-2xl w-1/2"></div>
              <div className="h-8 bg-cream-200 animate-pulse rounded-2xl w-2/3"></div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { home } = translatedData;

  return (
    <AnimationWrapper>
      <section id="home" className="min-h-screen bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="min-h-screen flex items-center relative">
            <div className="grid md:grid-cols-12 gap-8 w-full py-16">
              {/* Left: Content */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <TextReveal
                  text={home.title}
                  className="text-6xl md:text-8xl font-display font-bold text-cream-800 tracking-tight leading-[0.95]"
                />

                <motion.p
                  className="text-xl md:text-2xl font-body text-cream-500 leading-relaxed max-w-2xl mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {home.description}
                </motion.p>

                {/* Organizations - single line, scroll on small screens */}
                <motion.div
                  className="flex flex-nowrap items-center gap-2 mt-8 overflow-x-auto scrollbar-hide min-h-9"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-cream-400 self-center mr-2 shrink-0">{organizationsLabel}</span>
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
                      className="rounded-lg shrink-0 whitespace-nowrap"
                    >
                      {org.name}
                    </Button>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4 mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    as="a"
                    href={home.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="large"
                  >
                    {viewResumeText}
                  </Button>
                  <Button
                    onClick={() => {
                      safeScrollTo('contact', {
                        duration: 800,
                        delay: 0,
                        smooth: 'easeInOutQuart'
                      });
                    }}
                    variant="outline"
                    size="large"
                  >
                    {contactMeText}
                  </Button>
                </motion.div>
              </div>

              {/* Right: Image */}
              <motion.div
                className="md:col-span-5 flex items-center justify-end"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div style={{ y: imageY }} className="relative">
                  <img
                    src={home.imageUrl}
                    alt="Justin Burrell"
                    className="w-full max-w-md rounded-2xl border-4 border-cream-200 object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Qualities Section - 3 columns: Aspiring software | Analytical problem solver | Culture driven leader */}
          <StaggerContainer className="grid md:grid-cols-3 gap-12 pb-24 max-w-5xl">
            {home.qualities.map((quality, index) => (
              <StaggerItem key={index}>
                <div className="w-12 h-1 bg-cinnabar-500 mb-4 rounded-full" />
                <h3 className="text-2xl font-display font-semibold text-cream-800 mb-3">
                  {quality.attribute}
                </h3>
                <p className="font-body text-cream-500 leading-relaxed">
                  {quality.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
