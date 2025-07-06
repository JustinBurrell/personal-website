import React, { memo, useEffect } from 'react';
import { useGlobalData } from '../hooks/useGlobalData';
import { useLanguage } from '../features/language';
import ContentLoader from '../assets/shared/ContentLoader';
import { motion } from 'framer-motion';
import imagePreloader from '../utils/imagePreloader';
import performanceOptimizer from '../utils/performance';

// Optimized loading fallback
const LoadingFallback = memo(() => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </motion.div>
));

// Performance-optimized route component
const PerformanceRoute = memo(({ 
  component: Component, 
  section, 
  routeKey,
  showFooter = true,
  children 
}) => {
  const { data: globalData, loading: globalLoading } = useGlobalData();
  const { translatedData, isLoading: translationLoading } = useLanguage();
  
  // Get section data
  const sectionData = section ? globalData?.[section] : globalData;
  const translatedSectionData = section ? translatedData?.[section] : translatedData;
  
  // Performance monitoring and image preloading
  useEffect(() => {
    performanceOptimizer.startRouteLoad(routeKey);
    
    // Preload section images if section is specified
    if (section) {
      imagePreloader.preloadSectionImages(section);
    }
    
    return () => {
      performanceOptimizer.endRouteLoad(routeKey);
    };
  }, [routeKey, section]);

  // Show loading only if global data is not available
  if (globalLoading || !globalData) {
    return <LoadingFallback />;
  }

  // Show loading if translation is in progress (but data is available)
  if (translationLoading && !translatedSectionData) {
    return <LoadingFallback />;
  }

  // Use translated data if available, otherwise fall back to English
  const finalData = translatedSectionData || sectionData;

  return (
    <ContentLoader data={finalData} routeKey={routeKey}>
      <Component />
      {children}
    </ContentLoader>
  );
});

export default PerformanceRoute; 