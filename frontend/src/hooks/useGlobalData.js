import { useState, useEffect, createContext, useContext } from 'react';
import { portfolioService } from '../services/supabase';
import imagePreloader from '../utils/imagePreloader';
import performanceMonitor from '../utils/performanceMonitor';
import LoadingProgress from '../assets/shared/LoadingProgress';

// Global data context
const GlobalDataContext = createContext();

// Global data provider component
export const GlobalDataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showProgress, setShowProgress] = useState(true);

  // Cache duration: 30 minutes
  const CACHE_DURATION = 30 * 60 * 1000;

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching global portfolio data...');
        const startTime = performance.now();
        
        // Start preloading critical images immediately
        imagePreloader.preloadCriticalImages();
        
        const data = await portfolioService.getPortfolioDataOptimized('en');
        
        const endTime = performance.now();
        const fetchTime = endTime - startTime;
        console.log(`✅ Global data loaded in ${fetchTime.toFixed(2)}ms`);
        
        // Track data fetch performance
        performanceMonitor.trackDataFetch('global_portfolio_data', fetchTime);
        
        setGlobalData(data);
        setLastFetch(Date.now());
        
        // Preload section images after data is loaded
        if (data) {
          // Preload images for all sections
          Object.keys(data).forEach(section => {
            if (section !== 'home' && section !== 'contact') {
              imagePreloader.preloadSectionImages(section);
            }
          });
        }
        
        // Mark initial load as complete
        setIsInitialLoad(false);
      } catch (err) {
        console.error('❌ Error fetching global data:', err);
        setError(err.message);
        setIsInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    // Check if we need to fetch data
    const shouldFetch = !globalData || (Date.now() - lastFetch) > CACHE_DURATION;
    
    if (shouldFetch) {
      fetchGlobalData();
    } else {
      console.log('📦 Using cached global data');
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [globalData, lastFetch, CACHE_DURATION]);

  const handleProgressComplete = () => {
    setShowProgress(false);
  };

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

  // Show progress loader during first load
  if (isInitialLoad && showProgress) {
    return <LoadingProgress onComplete={handleProgressComplete} />;
  }

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