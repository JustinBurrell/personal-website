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