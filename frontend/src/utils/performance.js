// Comprehensive performance optimization and monitoring utilities
class PerformanceOptimizer {
  constructor() {
    this.optimizationsApplied = false;
    this.metrics = {
      routeLoadTimes: {},
      dataFetchTimes: {},
      imageLoadTimes: {},
      translationTimes: {},
      totalLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      webVitals: {}
    };
    
    this.startTime = performance.now();
    this.observers = [];
    
    this.initObservers();
  }

  // Initialize performance observers
  initObservers() {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
              console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  // Apply all performance optimizations
  applyOptimizations() {
    if (this.optimizationsApplied) return;
    
    console.log('🚀 Applying performance optimizations...');
    
    this.addResourceHints();
    this.optimizeImages();
    this.preloadCriticalResources();
    this.optimizeFonts();
    this.optimizeForMobile();
    
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

  // Optimize for mobile performance
  optimizeForMobile() {
    if (window.innerWidth <= 768) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
      
      // Optimize touch interactions
      document.documentElement.style.setProperty('--touch-action', 'manipulation');
    }
  }

  // PERFORMANCE MONITORING METHODS

  // Start timing a route load
  startRouteLoad(route) {
    this.metrics.routeLoadTimes[route] = {
      startTime: performance.now(),
      status: 'loading'
    };
    console.log(`🚀 Starting route load: ${route}`);
  }

  // End timing a route load
  endRouteLoad(route) {
    if (this.metrics.routeLoadTimes[route]) {
      const loadTime = performance.now() - this.metrics.routeLoadTimes[route].startTime;
      this.metrics.routeLoadTimes[route].loadTime = loadTime;
      this.metrics.routeLoadTimes[route].status = 'loaded';
      
      console.log(`⚡ ${route} loaded in ${loadTime.toFixed(2)}ms`);
      
      if (loadTime < 100) {
        console.log(`🚀 ${route} - INSTANT LOAD!`);
      } else if (loadTime > 1000) {
        console.warn(`⚠️ Slow load detected: ${route} took ${loadTime.toFixed(2)}ms`);
      }
    }
  }

  // Track data fetch time
  trackDataFetch(operation, duration) {
    this.metrics.dataFetchTimes[operation] = duration;
    console.log(`📊 Data fetch (${operation}): ${duration.toFixed(2)}ms`);
  }

  // Track image load time
  trackImageLoad(src, duration) {
    this.metrics.imageLoadTimes[src] = duration;
    console.log(`🖼️ Image load (${src}): ${duration.toFixed(2)}ms`);
  }

  // Track translation time
  trackTranslation(language, duration) {
    this.metrics.translationTimes[language] = duration;
    console.log(`🌐 Translation (${language}): ${duration.toFixed(2)}ms`);
  }

  // Track web vitals
  trackWebVital(name, value) {
    if (!this.metrics.webVitals) {
      this.metrics.webVitals = {};
    }
    this.metrics.webVitals[name] = value;
    console.log(`📊 Web Vital ${name}: ${value.toFixed(3)}`);
  }

  // Get performance summary
  getPerformanceSummary() {
    const totalTime = performance.now() - this.startTime;
    this.metrics.totalLoadTime = totalTime;

    const routeAverages = Object.values(this.metrics.routeLoadTimes)
      .filter(route => route.loadTime)
      .map(route => route.loadTime);

    const avgRouteLoadTime = routeAverages.length > 0 
      ? routeAverages.reduce((a, b) => a + b, 0) / routeAverages.length 
      : 0;

    const summary = {
      totalLoadTime: totalTime.toFixed(2),
      averageRouteLoadTime: avgRouteLoadTime.toFixed(2),
      fastestRoute: this.getFastestRoute(),
      slowestRoute: this.getSlowestRoute(),
      firstContentfulPaint: this.metrics.firstContentfulPaint.toFixed(2),
      routeCount: Object.keys(this.metrics.routeLoadTimes).length,
      instantLoads: this.countInstantLoads(),
      slowLoads: this.countSlowLoads()
    };

    return summary;
  }

  // Get fastest route
  getFastestRoute() {
    const routes = Object.entries(this.metrics.routeLoadTimes)
      .filter(([_, data]) => data.loadTime)
      .sort(([_, a], [__, b]) => a.loadTime - b.loadTime);
    
    return routes.length > 0 ? {
      route: routes[0][0],
      time: routes[0][1].loadTime.toFixed(2)
    } : null;
  }

  // Get slowest route
  getSlowestRoute() {
    const routes = Object.entries(this.metrics.routeLoadTimes)
      .filter(([_, data]) => data.loadTime)
      .sort(([_, a], [__, b]) => b.loadTime - a.loadTime);
    
    return routes.length > 0 ? {
      route: routes[0][0],
      time: routes[0][1].loadTime.toFixed(2)
    } : null;
  }

  // Count instant loads (< 100ms)
  countInstantLoads() {
    return Object.values(this.metrics.routeLoadTimes)
      .filter(route => route.loadTime && route.loadTime < 100).length;
  }

  // Count slow loads (> 1000ms)
  countSlowLoads() {
    return Object.values(this.metrics.routeLoadTimes)
      .filter(route => route.loadTime && route.loadTime > 1000).length;
  }

  // Log performance summary
  logPerformanceSummary() {
    const summary = this.getPerformanceSummary();
    
    console.log('📊 Performance Summary:');
    console.log('========================');
    console.log(`Total Load Time: ${summary.totalLoadTime}ms`);
    console.log(`Average Route Load: ${summary.averageRouteLoadTime}ms`);
    console.log(`First Contentful Paint: ${summary.firstContentfulPaint}ms`);
    console.log(`Routes Loaded: ${summary.routeCount}`);
    console.log(`Instant Loads: ${summary.instantLoads}`);
    console.log(`Slow Loads: ${summary.slowLoads}`);
    
    if (summary.fastestRoute) {
      console.log(`Fastest Route: ${summary.fastestRoute.route} (${summary.fastestRoute.time}ms)`);
    }
    
    if (summary.slowestRoute) {
      console.log(`Slowest Route: ${summary.slowestRoute.route} (${summary.slowestRoute.time}ms)`);
    }
    
    console.log('========================');
  }

  // Export metrics for external analysis
  exportMetrics() {
    return {
      ...this.metrics,
      summary: this.getPerformanceSummary(),
      timestamp: new Date().toISOString()
    };
  }

  // Reset metrics
  reset() {
    this.metrics = {
      routeLoadTimes: {},
      dataFetchTimes: {},
      imageLoadTimes: {},
      translationTimes: {},
      totalLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      webVitals: {}
    };
    this.startTime = performance.now();
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
}

// Create singleton instance
const performanceOptimizer = new PerformanceOptimizer();

// Apply optimizations immediately
performanceOptimizer.applyOptimizations();

// Log summary on page unload
window.addEventListener('beforeunload', () => {
  performanceOptimizer.logPerformanceSummary();
});

export default performanceOptimizer; 