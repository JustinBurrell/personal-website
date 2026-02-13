import logger from './logger.js';

// Image preloader utility for instant image loading
class ImagePreloader {
  constructor() {
    this.preloadedImages = new Set();
    this.preloadingImages = new Set(); // Track images currently being preloaded
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    // Start preloading critical images immediately
    this.preloadCriticalImages();
  }

  // Get full Supabase URL for an asset
  getAssetUrl(filePath) {
    return `${this.supabaseUrl}/storage/v1/object/public/assets/${filePath}`;
  }

  // Preload a single image with timeout and deduplication
  preloadImage(src, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // If already preloaded, resolve immediately
      if (this.preloadedImages.has(src)) {
        resolve(src);
        return;
      }

      // If currently preloading, wait for existing promise
      if (this.preloadingImages.has(src)) {
        // Wait a bit and check again (simple deduplication)
        setTimeout(() => {
          if (this.preloadedImages.has(src)) {
            resolve(src);
          } else {
            // If still not loaded, try again (shouldn't happen often)
            this.preloadImage(src, timeout).then(resolve).catch(reject);
          }
        }, 100);
        return;
      }

      // Mark as preloading
      this.preloadingImages.add(src);

      const img = new Image();
      const timeoutId = setTimeout(() => {
        this.preloadingImages.delete(src);
        reject(new Error(`Timeout preloading image: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.preloadedImages.add(src);
        this.preloadingImages.delete(src);
        logger.imagePreload('Preloaded:', src);
        resolve(src);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        this.preloadingImages.delete(src);
        logger.warn(`Failed to preload: ${src}`);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      img.src = src;
    });
  }

  // Extract image URLs from data recursively
  extractImageUrls(data) {
    const imageUrls = new Set();
    
    const extract = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      
      if (Array.isArray(obj)) {
        obj.forEach(extract);
        return;
      }
      
      Object.entries(obj).forEach(([key, value]) => {
        // Check for common image URL keys
        if (key === 'imageUrl' || key === 'awardImageUrl' || key === 'educationImageUrl' || 
            key === 'experienceImageUrl' || key === 'projectImageUrl' || key === 'galleryImageUrl') {
          if (value && typeof value === 'string') {
            imageUrls.add(value);
          }
        } else if (typeof value === 'object' && value !== null) {
          extract(value);
        }
      });
    };
    
    extract(data);
    return Array.from(imageUrls);
  }

  // Preload critical images immediately
  async preloadCriticalImages() {
    logger.imagePreload('Preloading critical images...');
    const startTime = performance.now();
    
    try {
      // Only preload images that we know exist
      const criticalImages = [
        'assets/images/home/FLOC Headshot.jpeg',
        'assets/images/about/About Background Photo.jpg'
      ];
      
      const criticalUrls = criticalImages.map(path => this.getAssetUrl(path));
      
      // Use Promise.allSettled to not fail if some images fail
      const results = await Promise.allSettled(
        criticalUrls.map(src => this.preloadImage(src))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      const endTime = performance.now();
      logger.imagePreload(`Critical images: ${successful} loaded, ${failed} failed in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      logger.error('Error preloading critical images:', error);
    }
  }

  // Preload images from actual data
  async preloadDataImages(data) {
    if (!data) return;
    
    const imageUrls = this.extractImageUrls(data);
    if (imageUrls.length === 0) return;
    
    logger.imagePreload(`Preloading ${imageUrls.length} images from data...`);
    const startTime = performance.now();
    
    try {
      // Split into priority batches for better performance
      const priorityImages = imageUrls.slice(0, 5);
      const remainingImages = imageUrls.slice(5);
      
      // Load priority images first
      await Promise.allSettled(
        priorityImages.map(src => this.preloadImage(src))
      );
      
      // Load remaining images in background
      if (remainingImages.length > 0) {
        setTimeout(() => {
          Promise.allSettled(
            remainingImages.map(src => this.preloadImage(src))
          );
        }, 100);
      }
      
      const endTime = performance.now();
      logger.imagePreload(`Data images preloaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      logger.error('Error preloading data images:', error);
    }
  }

  // Preload images for a specific section with priority
  async preloadSectionImages(section) {
    logger.imagePreload(`Preloading ${section} images...`);
    const startTime = performance.now();
    
    try {
      // Only preload images that we know exist
      const sectionImages = this.getSectionImages(section);
      if (sectionImages.length === 0) return;
      
      // Convert to full URLs if they're relative paths
      const sectionUrls = sectionImages.map(path => 
        path.startsWith('http') ? path : this.getAssetUrl(path)
      );
      
      // Split into priority batches for better performance
      const priorityImages = sectionUrls.slice(0, 3);
      const remainingImages = sectionUrls.slice(3);
      
      // Load priority images first
      await Promise.allSettled(
        priorityImages.map(src => this.preloadImage(src))
      );
      
      // Load remaining images in background
      if (remainingImages.length > 0) {
        setTimeout(() => {
          Promise.allSettled(
            remainingImages.map(src => this.preloadImage(src))
          );
        }, 100);
      }
      
      const endTime = performance.now();
      logger.imagePreload(`${section} priority images preloaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      logger.error(`Error preloading ${section} images:`, error);
    }
  }

  // Get images for a specific section (relative paths)
  getSectionImages(section) {
    // Only include images that actually exist in your storage
    const sectionImageMap = {
      education: [
        'assets/images/education/lehigh logo.png',
        'assets/images/education/horace mann logo.jpg', // Changed from .png to .jpg
        'assets/images/education/ibm logo.png',
        'assets/images/education/all star code logo.webp',
        'assets/images/education/prep for prep logo.png'
      ],
      experience: [
        'assets/images/experiences/professional/ey/ey 1.jpg'
      ],
      gallery: [
        'assets/images/gallery/kappa/provincecouncil spr25 2.jpg'
      ],
      projects: [
        'assets/images/projects/Student Score Predictor Cover.png',
        'assets/images/projects/Personal Website Cover.png',
        'assets/images/projects/KiNECT Website Cover.png'
      ],
      awards: [
        'assets/images/awards/About Background.gif'
      ]
    };

    return sectionImageMap[section] || [];
  }

  // Check if image is preloaded
  isPreloaded(src) {
    return this.preloadedImages.has(src);
  }

  // Clear preloaded images (useful for memory management)
  clearPreloadedImages() {
    this.preloadedImages.clear();
  }
}

// Create singleton instance
const imagePreloader = new ImagePreloader();

export default imagePreloader; 