import React from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import Card from '../assets/ui/Card';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';
import { motion } from 'framer-motion';

const Awards = () => {
  const { translatedData, isLoading } = useLanguage();

  // Use translation hook for static text
  const awardsTitle = useTranslateText("Awards & Recognition");

  // Add loading state and null checks
  if (isLoading || !translatedData || !translatedData.awards || !translatedData.awards[0]) {
    return (
      <AnimationWrapper>
        <section id="awards" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-2 pt-16">
              <Card variant="transparent" className="p-0">
                <div className="grid md:grid-cols-5 gap-6 items-center">
                  <div className="md:col-span-3 flex flex-col justify-center p-6">
                    <div className="h-16 bg-gray-200 animate-pulse rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    );
  }

  const { awards } = translatedData;
  const awardGroup = awards[0];

  return (
    <AnimationWrapper>
      <section id="awards" className="py-16 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          {/* Top Card: Awards Title/Description/Image */}
          <motion.div
            className="max-w-4xl mx-auto mb-2 pt-16"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 18 }}
          >
            <Card variant="transparent" className="p-0">
              <div className="grid md:grid-cols-5 gap-6 items-center">
                {/* Left: Title & Description */}
                <div className="md:col-span-3 flex flex-col justify-center p-6">
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">{awardsTitle}</h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">{awardGroup.description}</p>
                </div>
                {/* Right: Award Image */}
                {awardGroup.awardImageUrl && (
                  <div className="md:col-span-2 flex justify-center items-stretch p-4">
                    <img
                      src={awardGroup.awardImageUrl}
                      alt="Awards"
                      className="h-full w-auto max-h-[400px] object-contain rounded-lg"
                      style={{ minHeight: '200px', maxHeight: '100%' }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Awards List */}
          <div className="max-w-4xl mx-auto grid gap-8 mt-12">
            {awardGroup.award.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-semibold mb-2">{award.title}</h3>
                  <p className="text-gray-600 mb-2">{award.organization} - {award.date}</p>
                  <p className="text-gray-700">{award.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Awards;