import { useState, useEffect, createContext, useContext } from 'react';
import { portfolioService } from '../services/supabase';
import imagePreloader from '../utils/imagePreloader';
import performanceOptimizer from '../utils/performance';
import logger from '../utils/logger';

// Global data context
const GlobalDataContext = createContext();

// Global data provider component
export const GlobalDataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false - show content immediately
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Cache duration: 30 minutes
  const CACHE_DURATION = 30 * 60 * 1000;

  const fetchGlobalData = async (mounted = { current: true }) => {
    try {
      setError(null);

      logger.data('Fetching global portfolio data...');
      const startTime = performance.now();

      // Start preloading critical images immediately (non-blocking)
      imagePreloader.preloadCriticalImages();

      // Load all data in parallel for fastest overall load time
      const [
        homeData,
        aboutData,
        awardsData,
        educationData,
        experienceData,
        galleryData,
        projectsData
      ] = await Promise.all([
        portfolioService.getHomeData('en'),
        portfolioService.getAboutData('en'),
        portfolioService.getAwardsData('en'),
        portfolioService.getEducationData('en'),
        portfolioService.getExperienceData('en'),
        portfolioService.getGalleryData('en'),
        portfolioService.getProjectsData('en')
      ]);

      if (!mounted.current) return;

      const completeData = {
        home: homeData,
        about: aboutData,
        awards: awardsData,
        education: educationData,
        experience: experienceData,
        gallery: galleryData,
        projects: projectsData
      };

      setGlobalData(completeData);
      setLastFetch(Date.now());
      setIsInitialLoad(false);

      // Cache the complete data
      const cacheKey = 'portfolio_optimized_en';
      const indexedDBCache = (await import('../utils/indexedDBCache')).default;
      indexedDBCache.set(cacheKey, completeData, 30 * 60 * 1000).catch(err => {
        logger.warn('Failed to cache data:', err);
      });

      // Preload images from complete data (non-blocking)
      if (completeData) {
        imagePreloader.preloadDataImages(completeData);
      }

      const endTime = performance.now();
      const fetchTime = endTime - startTime;
      logger.data(`Complete data loaded in ${fetchTime.toFixed(2)}ms`);
      performanceOptimizer.trackDataFetch('global_portfolio_data', fetchTime);

    } catch (err) {
      if (!mounted.current) return;
      logger.error('Error fetching critical data:', err);
      setError(err.message);
      setIsInitialLoad(false);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const mounted = { current: true };

    // Try to get cached data immediately (non-blocking)
    const loadCachedData = async () => {
      try {
        // Check IndexedDB cache first (fastest path - no network)
        const completeCacheKey = 'portfolio_optimized_en';
        const indexedDBCache = (await import('../utils/indexedDBCache')).default;

        // Try to get complete cached data
        const cachedData = await indexedDBCache.get(completeCacheKey);

        if (mounted.current && cachedData) {
          setGlobalData(cachedData);
          setLastFetch(Date.now());
          setIsInitialLoad(false);
          logger.data('Loaded complete cached data from IndexedDB');
          return true; // Cache hit
        }
      } catch (err) {
        // Ignore errors, will fetch fresh data
        logger.warn('Failed to load cached data:', err);
      }
      return false; // Cache miss
    };

    // On initial mount, use cache-then-fetch strategy
    if (fetchTrigger === 0) {
      loadCachedData().then((cacheHit) => {
        if (!cacheHit) {
          fetchGlobalData(mounted);
        } else {
          // Cache hit - still fetch fresh data in background
          setTimeout(() => {
            fetchGlobalData(mounted);
          }, 0);
        }
      });
    } else {
      // Triggered by refetch — skip cache, go straight to Supabase
      fetchGlobalData(mounted);
    }

    return () => {
      mounted.current = false;
    };
  }, [fetchTrigger]);

  const value = {
    data: globalData,
    loading,
    error,
    lastFetch,
    isInitialLoad,
    refetch: () => {
      setFetchTrigger(prev => prev + 1);
    }
  };

  // Always render children immediately - no blocking loader
  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
};

// Hook to use global data
export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
};

// Hook to get specific section data
export const useSectionData = (sectionName) => {
  const { data, loading, error } = useGlobalData();
  
  return {
    data: data?.[sectionName] || null,
    loading,
    error
  };
}; 
