// Comprehensive performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      routeLoadTimes: {},
      dataFetchTimes: {},
      imageLoadTimes: {},
      translationTimes: {},
      totalLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0
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
      largestContentfulPaint: 0
    };
    this.startTime = performance.now();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Log summary on page unload
window.addEventListener('beforeunload', () => {
  performanceMonitor.logPerformanceSummary();
});

export default performanceMonitor; 