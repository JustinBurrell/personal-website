// Image preloader utility for instant image loading
class ImagePreloader {
  constructor() {
    this.preloadedImages = new Set();
    this.criticalImages = [
      '/assets/images/home/FLOC Headshot.jpeg',
      '/assets/images/about/About Background Photo.jpg',
      '/assets/images/gallery/Gallery Background Photo.jpg',
      '/assets/images/education/lehigh logo.png',
      '/assets/images/education/horace mann logo.png',
      '/assets/images/experiences/professional/ey/ey 1.jpg',
      '/assets/images/gallery/kappa/provincecouncil spr25 2.jpg'
    ];
    
    // Start preloading critical images immediately
    this.preloadCriticalImages();
  }

  // Preload a single image with timeout
  preloadImage(src, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(src)) {
        resolve(src);
        return;
      }

      const img = new Image();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout preloading image: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.preloadedImages.add(src);
        console.log(`🖼️ Preloaded: ${src}`);
        resolve(src);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        console.warn(`⚠️ Failed to preload: ${src}`);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      img.src = src;
    });
  }

  // Preload critical images immediately
  async preloadCriticalImages() {
    console.log('🔄 Preloading critical images...');
    const startTime = performance.now();
    
    try {
      // Use Promise.allSettled to not fail if some images fail
      const results = await Promise.allSettled(
        this.criticalImages.map(src => this.preloadImage(src))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      const endTime = performance.now();
      console.log(`✅ Critical images: ${successful} loaded, ${failed} failed in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('❌ Error preloading critical images:', error);
    }
  }

  // Preload images for a specific section with priority
  async preloadSectionImages(section) {
    const sectionImages = this.getSectionImages(section);
    if (sectionImages.length === 0) return;

    console.log(`🔄 Preloading ${section} images...`);
    const startTime = performance.now();
    
    try {
      // Split into priority batches for better performance
      const priorityImages = sectionImages.slice(0, 3);
      const remainingImages = sectionImages.slice(3);
      
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
      console.log(`✅ ${section} priority images preloaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error(`❌ Error preloading ${section} images:`, error);
    }
  }

  // Get images for a specific section
  getSectionImages(section) {
    const sectionImageMap = {
      education: [
        '/assets/images/education/lehigh logo.png',
        '/assets/images/education/horace mann logo.png',
        '/assets/images/education/all star code logo.webp',
        '/assets/images/education/prep for prep logo.png'
      ],
      experience: [
        '/assets/images/experiences/professional/ey/ey 1.jpg',
        '/assets/images/experiences/professional/ey/ey 2.jpg',
        '/assets/images/experiences/professional/ey/ey 3.jpg',
        '/assets/images/experiences/professional/ey/ey 4.jpg'
      ],
      gallery: [
        '/assets/images/gallery/kappa/provincecouncil spr25 2.jpg',
        '/assets/images/gallery/misc/tech week nyc 2025.jpg',
        '/assets/images/gallery/bsu/bsu new exec election.jpg'
      ],
      projects: [
        '/assets/images/projects/project1.jpg',
        '/assets/images/projects/project2.jpg'
      ],
      awards: [
        '/assets/images/awards/award1.jpg',
        '/assets/images/awards/award2.jpg'
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