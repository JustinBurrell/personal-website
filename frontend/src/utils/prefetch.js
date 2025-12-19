// Prefetch utility for instant navigation
import { portfolioService } from '../services/supabase';
import imagePreloader from './imagePreloader';

class PrefetchManager {
  constructor() {
    this.prefetchedRoutes = new Set();
    this.prefetchPromises = new Map();
  }

  // Prefetch data for a specific section
  async prefetchSection(section) {
    if (this.prefetchedRoutes.has(section)) {
      return; // Already prefetched
    }

    // Check if already prefetching
    if (this.prefetchPromises.has(section)) {
      return this.prefetchPromises.get(section);
    }

    const prefetchPromise = (async () => {
      try {
        // Prefetch the section data
        await portfolioService.getSection(section, 'en');
        
        // Preload section images
        imagePreloader.preloadSectionImages(section);
        
        this.prefetchedRoutes.add(section);
        this.prefetchPromises.delete(section);
      } catch (error) {
        console.warn(`Failed to prefetch ${section}:`, error);
        this.prefetchPromises.delete(section);
      }
    })();

    this.prefetchPromises.set(section, prefetchPromise);
    return prefetchPromise;
  }

  // Prefetch all route data in background (low priority)
  async prefetchAllRoutes() {
    const sections = ['education', 'experience', 'projects', 'awards', 'gallery'];
    
    // Use requestIdleCallback if available, otherwise setTimeout
    const schedulePrefetch = (section) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.prefetchSection(section);
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          this.prefetchSection(section);
        }, 100);
      }
    };

    // Prefetch sections with delay to not block main thread
    sections.forEach((section, index) => {
      setTimeout(() => {
        schedulePrefetch(section);
      }, index * 200);
    });
  }

  // Check if route is prefetched
  isPrefetched(section) {
    return this.prefetchedRoutes.has(section);
  }
}

// Create singleton instance
const prefetchManager = new PrefetchManager();

// Start prefetching all routes after initial load
if (typeof window !== 'undefined') {
  // Wait for page to be interactive
  if (document.readyState === 'complete') {
    setTimeout(() => {
      prefetchManager.prefetchAllRoutes();
    }, 2000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        prefetchManager.prefetchAllRoutes();
      }, 2000);
    });
  }
}

export default prefetchManager;

