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

  // Cache duration: 30 minutes
  const CACHE_DURATION = 30 * 60 * 1000;

  useEffect(() => {
    let mounted = true;

    const fetchGlobalData = async () => {
      try {
        // Don't set loading to true - show cached data immediately if available
        setError(null);
        
        logger.data('Fetching global portfolio data...');
        const startTime = performance.now();
        
        // Start preloading critical images immediately (non-blocking)
        imagePreloader.preloadCriticalImages();
        
        // Strategy: Load critical data first (home + about) for instant render
        // Then load remaining data in background
        const criticalStartTime = performance.now();
        const criticalData = await portfolioService.getCriticalData('en');
        
        if (!mounted) return;
        
        const criticalTime = performance.now() - criticalStartTime;
        logger.data(`Critical data (home+about) loaded in ${criticalTime.toFixed(2)}ms`);
        
        // Set critical data immediately for instant rendering
        setGlobalData(criticalData);
        setIsInitialLoad(false);
        
        // Preload images from critical data immediately
        if (criticalData) {
          imagePreloader.preloadDataImages(criticalData);
        }
        
        // Now load remaining data in background (non-blocking)
        const remainingDataPromise = (async () => {
          try {
            const [
              awardsData,
              educationData,
              experienceData,
              galleryData,
              projectsData
            ] = await Promise.all([
              portfolioService.getAwardsData('en'),
              portfolioService.getEducationData('en'),
              portfolioService.getExperienceData('en'),
              portfolioService.getGalleryData('en'),
              portfolioService.getProjectsData('en')
            ]);
            
            if (!mounted) return;
            
            // Merge with critical data
            const completeData = {
              ...criticalData,
              awards: awardsData,
              education: educationData,
              experience: experienceData,
              gallery: galleryData,
              projects: projectsData
            };
            
            setGlobalData(completeData);
            setLastFetch(Date.now());
            
            // Preload images from complete data
            imagePreloader.preloadDataImages(completeData);
            
            // Preload section images
            Object.keys(completeData).forEach(section => {
              if (section !== 'home' && section !== 'contact') {
                imagePreloader.preloadSectionImages(section);
              }
            });
            
            const endTime = performance.now();
            const fetchTime = endTime - startTime;
            logger.data(`Complete data loaded in ${fetchTime.toFixed(2)}ms`);
            performanceOptimizer.trackDataFetch('global_portfolio_data', fetchTime);
          } catch (err) {
            if (!mounted) return;
            logger.error('Error loading remaining data:', err);
            // Don't fail completely - we already have critical data
          }
        })();
        
        // Don't await - let it complete in background
        remainingDataPromise.catch(() => {});
        
      } catch (err) {
        if (!mounted) return;
        logger.error('Error fetching critical data:', err);
        setError(err.message);
        setIsInitialLoad(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Try to get cached data immediately (non-blocking)
    const loadCachedData = async () => {
      try {
        // Check IndexedDB cache first (fastest path - no network)
        // Try complete data first, then critical data as fallback
        const completeCacheKey = 'portfolio_optimized_en';
        const criticalCacheKey = 'critical_en';
        const indexedDBCache = (await import('../utils/indexedDBCache')).default;
        
        // Try complete data first
        let cachedData = await indexedDBCache.get(completeCacheKey);
        
        // If no complete data, try critical data
        if (!cachedData) {
          cachedData = await indexedDBCache.get(criticalCacheKey);
          if (cachedData) {
            logger.data('Loaded critical cached data from IndexedDB');
          }
        } else {
          logger.data('Loaded complete cached data from IndexedDB');
        }
        
        if (mounted && cachedData) {
          setGlobalData(cachedData);
          setLastFetch(Date.now());
          setIsInitialLoad(false);
          return true; // Cache hit
        }
      } catch (err) {
        // Ignore errors, will fetch fresh data
        logger.warn('Failed to load cached data:', err);
      }
      return false; // Cache miss
    };

    // Load cached data immediately (non-blocking)
    loadCachedData().then((cacheHit) => {
      // Always fetch fresh data in background to ensure it's up to date
      // But if cache hit, user sees content immediately
      if (!cacheHit) {
        // No cache - fetch immediately
        fetchGlobalData();
      } else {
        // Cache hit - fetch in background to refresh (non-blocking)
        // Use requestIdleCallback to not block main thread
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            fetchGlobalData();
          }, { timeout: 2000 });
        } else {
          setTimeout(() => {
            fetchGlobalData();
          }, 100);
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, []); // Only run once on mount

  const value = {
    data: globalData,
    loading,
    error,
    lastFetch,
    isInitialLoad,
    refetch: () => {
      setLastFetch(0); // Force refetch
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