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
        
        // Fetch data (will use cache if available)
        const data = await portfolioService.getPortfolioDataOptimized('en');
        
        if (!mounted) return;
        
        const endTime = performance.now();
        const fetchTime = endTime - startTime;
        logger.data(`Global data loaded in ${fetchTime.toFixed(2)}ms`);
        
        // Track data fetch performance
        performanceOptimizer.trackDataFetch('global_portfolio_data', fetchTime);
        
        setGlobalData(data);
        setLastFetch(Date.now());
        
        // Preload images from actual data (non-blocking)
        if (data) {
          // Preload all images found in the data
          imagePreloader.preloadDataImages(data);
          
          // Also preload section images as fallback
          Object.keys(data).forEach(section => {
            if (section !== 'home' && section !== 'contact') {
              imagePreloader.preloadSectionImages(section);
            }
          });
        }
        
        // Mark initial load as complete
        setIsInitialLoad(false);
      } catch (err) {
        if (!mounted) return;
        logger.error('Error fetching global data:', err);
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
        // The getPortfolioDataOptimized will check cache first
        // This allows us to show cached data instantly
        const cachedData = await portfolioService.getPortfolioDataOptimized('en');
        if (mounted && cachedData) {
          setGlobalData(cachedData);
          setIsInitialLoad(false);
          logger.data('Loaded cached data instantly');
        }
      } catch (err) {
        // Ignore errors, will fetch fresh data
      }
    };

    // Load cached data immediately (non-blocking)
    loadCachedData();

    // Always fetch fresh data in background to ensure it's up to date
    // This runs in parallel with cached data load
    fetchGlobalData();

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