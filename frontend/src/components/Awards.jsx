import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import SectionTitle from '../assets/ui/SectionTitle';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '../assets/ui/StaggerContainer';
import { portfolioService } from '../services/supabase';

const Awards = () => {
  const { translatedData, isLoading } = useLanguage();

  const awardsTitle = useTranslateText("Awards & Recognition");

  if (!translatedData || !translatedData.awards || !translatedData.awards[0]) {
    return (
      <AnimationWrapper>
        <section id="awards" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="h-20 bg-cream-200 animate-pulse rounded-2xl w-3/4 mb-6"></div>
            <div className="h-6 bg-cream-200 animate-pulse rounded w-1/2"></div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { awards } = translatedData;
  const awardGroup = awards[0];

  return (
    <AnimationWrapper>
      <section id="awards" className="py-24 bg-cream-100 min-h-[calc(100vh-5rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="pt-16 pb-12 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <motion.h1
                className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-cream-800 tracking-tight leading-[0.95] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {awardsTitle}
              </motion.h1>
              <motion.p
                className="text-xl font-body text-cream-500 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {awardGroup.description}
              </motion.p>
            </div>
            {awardGroup.awardImageUrl && (
              <motion.div
                className="md:col-span-4 hidden md:flex justify-end items-start"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 2 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={awardGroup.awardImageUrl.startsWith('http') ? awardGroup.awardImageUrl : portfolioService.getAssetUrl(awardGroup.awardImageUrl)}
                  alt="Awards"
                  className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl border border-cream-300"
                />
              </motion.div>
            )}
          </div>

          {/* Numbered Editorial Award List */}
          <StaggerContainer className="max-w-4xl space-y-0 mt-8">
            {awardGroup.award.map((award, index) => (
              <StaggerItem key={index}>
                <div className={`grid grid-cols-[auto_1fr] gap-8 py-8 ${
                  index < awardGroup.award.length - 1 ? 'border-b border-cream-300' : ''
                }`}>
                  {/* Large Number */}
                  <div className="font-display text-6xl font-bold text-cinnabar-200 leading-none pt-1 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-display font-bold text-cream-800 mb-2">{award.title}</h3>
                    <p className="font-mono text-sm text-cream-400 uppercase tracking-wider mb-3">
                      {award.organization} &middot; {award.date}
                    </p>
                    <p className="font-body text-cream-500 leading-relaxed">{award.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Awards;
