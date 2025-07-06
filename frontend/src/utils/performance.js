// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      databaseQueries: [],
      translationCalls: [],
      pageLoads: [],
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  // Track database query performance
  trackDatabaseQuery(queryName, startTime) {
    const duration = performance.now() - startTime;
    this.metrics.databaseQueries.push({
      query: queryName,
      duration,
      timestamp: Date.now()
    });
    
    console.log(`Database query '${queryName}' took ${duration.toFixed(2)}ms`);
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow database query detected: ${queryName} took ${duration.toFixed(2)}ms`);
    }
  }

  // Track translation performance
  trackTranslationCall(textLength, startTime) {
    const duration = performance.now() - startTime;
    this.metrics.translationCalls.push({
      textLength,
      duration,
      timestamp: Date.now()
    });
    
    console.log(`Translation call took ${duration.toFixed(2)}ms for ${textLength} characters`);
  }

  // Track page load performance
  trackPageLoad(pageName, startTime) {
    const duration = performance.now() - startTime;
    this.metrics.pageLoads.push({
      page: pageName,
      duration,
      timestamp: Date.now()
    });
    
    console.log(`Page '${pageName}' loaded in ${duration.toFixed(2)}ms`);
  }

  // Track cache performance
  trackCacheHit() {
    this.metrics.cacheHits++;
  }

  trackCacheMiss() {
    this.metrics.cacheMisses++;
  }

  // Get performance summary
  getSummary() {
    const dbQueries = this.metrics.databaseQueries;
    const translations = this.metrics.translationCalls;
    const pageLoads = this.metrics.pageLoads;

    return {
      database: {
        totalQueries: dbQueries.length,
        averageTime: dbQueries.length > 0 
          ? dbQueries.reduce((sum, q) => sum + q.duration, 0) / dbQueries.length 
          : 0,
        slowestQuery: dbQueries.length > 0 
          ? dbQueries.reduce((max, q) => q.duration > max.duration ? q : max, dbQueries[0])
          : null
      },
      translation: {
        totalCalls: translations.length,
        averageTime: translations.length > 0 
          ? translations.reduce((sum, t) => sum + t.duration, 0) / translations.length 
          : 0,
        totalCharacters: translations.reduce((sum, t) => sum + t.textLength, 0)
      },
      pages: {
        totalLoads: pageLoads.length,
        averageLoadTime: pageLoads.length > 0 
          ? pageLoads.reduce((sum, p) => sum + p.duration, 0) / pageLoads.length 
          : 0
      },
      cache: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        hitRate: this.metrics.cacheHits + this.metrics.cacheMisses > 0 
          ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100 
          : 0
      }
    };
  }

  // Log performance summary
  logSummary() {
    const summary = this.getSummary();
    console.group('Performance Summary');
    console.log('Database:', summary.database);
    console.log('Translation:', summary.translation);
    console.log('Pages:', summary.pages);
    console.log('Cache:', summary.cache);
    console.groupEnd();
  }

  // Clear metrics
  clear() {
    this.metrics = {
      databaseQueries: [],
      translationCalls: [],
      pageLoads: [],
      cacheHits: 0,
      cacheMisses: 0
    };
  }
}

// Create global instance
export const performanceMonitor = new PerformanceMonitor();

// Performance decorator for functions
export const trackPerformance = (name) => (fn) => {
  return async (...args) => {
    const startTime = performance.now();
    try {
      const result = await fn(...args);
      performanceMonitor.trackDatabaseQuery(name, startTime);
      return result;
    } catch (error) {
      performanceMonitor.trackDatabaseQuery(name, startTime);
      throw error;
    }
  };
};

// Performance optimization utilities
class PerformanceOptimizer {
  constructor() {
    this.optimizationsApplied = false;
  }

  // Apply all performance optimizations
  applyOptimizations() {
    if (this.optimizationsApplied) return;
    
    console.log('🚀 Applying performance optimizations...');
    
    this.addResourceHints();
    this.optimizeImages();
    this.preloadCriticalResources();
    this.optimizeFonts();
    
    this.optimizationsApplied = true;
    console.log('✅ Performance optimizations applied');
  }

  // Add resource hints for faster loading
  addResourceHints() {
    const hints = [
      // DNS prefetch for external domains
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://supabase.co' },
      
      // Preconnect to critical domains
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'preconnect', href: 'https://supabase.co' },
      
      // Preload critical CSS
      { rel: 'preload', href: '/src/index.css', as: 'style' },
      { rel: 'preload', href: '/src/App.css', as: 'style' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.entries(hint).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    });
  }

  // Optimize image loading
  optimizeImages() {
    // Add loading="lazy" to non-critical images
    const images = document.querySelectorAll('img:not([data-critical])');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Add decoding="async" for better performance
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      // Critical images
      { href: '/assets/images/home/FLOC Headshot.jpeg', as: 'image', type: 'image/jpeg' },
      { href: '/assets/images/about/About Background Photo.jpg', as: 'image', type: 'image/jpeg' },
      { href: '/assets/images/gallery/Gallery Background Photo.jpg', as: 'image', type: 'image/jpeg' },
      
      // Critical fonts
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      Object.entries(resource).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    });
  }

  // Optimize font loading
  optimizeFonts() {
    // Add font-display: swap for better perceived performance
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      if (!link.href.includes('&display=swap')) {
        link.href += '&display=swap';
      }
    });
  }

  // Measure and log performance metrics
  measurePerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      console.log('📊 Performance Metrics:');
      console.log(`- DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
      console.log(`- Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
      
      paint.forEach(entry => {
        console.log(`- ${entry.name}: ${Math.round(entry.startTime)}ms`);
      });
    }
  }

  // Optimize bundle loading
  optimizeBundleLoading() {
    // Add modulepreload for critical modules
    const criticalModules = [
      '/static/js/main.chunk.js',
      '/static/js/runtime-main.js'
    ];

    criticalModules.forEach(module => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = module;
      document.head.appendChild(link);
    });
  }

  // Optimize for mobile performance
  optimizeForMobile() {
    if (window.innerWidth <= 768) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
      
      // Optimize touch interactions
      document.documentElement.style.setProperty('--touch-action', 'manipulation');
    }
  }
}

// Create singleton instance
const performanceOptimizer = new PerformanceOptimizer();

// Apply optimizations immediately
performanceOptimizer.applyOptimizations();

export default performanceOptimizer; 