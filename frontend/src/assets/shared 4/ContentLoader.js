import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Cache for preloaded images
const imageCache = new Map();

// Utility function to preload images with caching
const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map((url) => {
      if (!url) return Promise.resolve();
      
      // Return cached promise if image is already loaded
      if (imageCache.has(url)) {
        return imageCache.get(url);
      }

      // Create new promise for uncached image
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          resolve();
        };
        img.onerror = (err) => {
          imageCache.delete(url); // Remove failed image from cache
          reject(err);
        };
      });

      // Cache the promise
      imageCache.set(url, promise);
      return promise;
    })
  );
};

// Utility function to extract image URLs from data
const extractImageUrls = (data) => {
  const urls = new Set();
  
  const traverse = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'imageUrl' || key === 'url' || key === 'src') {
        if (typeof value === 'string') urls.add(value);
      } else if (Array.isArray(value)) {
        value.forEach(item => traverse(item));
      } else if (typeof value === 'object') {
        traverse(value);
      }
    });
  };

  traverse(data);
  return Array.from(urls);
};

// Cache for route data
const routeDataCache = new Map();

const ContentLoader = ({ children, data, routeKey }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Preload images in background (non-blocking)
    const preloadImagesInBackground = async () => {
      try {
        const cacheKey = routeKey || JSON.stringify(data);
        const cachedData = routeDataCache.get(cacheKey);
        
        if (cachedData) {
          // If data is cached, only check for new images
          const imageUrls = extractImageUrls(data);
          const newImageUrls = imageUrls.filter(url => !imageCache.has(url));
          
          if (newImageUrls.length > 0) {
            // Preload new images in background (non-blocking)
            preloadImages(newImageUrls).catch(err => {
              console.warn('Error preloading images:', err);
            });
        }
        } else {
          // First time loading this route - preload images in background
        const imageUrls = extractImageUrls(data);
          if (imageUrls.length > 0) {
            // Preload images in background (non-blocking)
            preloadImages(imageUrls).catch(err => {
              console.warn('Error preloading images:', err);
            });
          }

        // Cache the route data
        routeDataCache.set(cacheKey, data);
        }
      } catch (err) {
        console.warn('Error preloading content:', err);
        setError(err);
      }
    };

    // Preload images in background without blocking render
    if (data) {
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadImagesInBackground, { timeout: 1000 });
      } else {
        setTimeout(preloadImagesInBackground, 0);
      }
    }
  }, [data, routeKey]);

  if (error) {
    // Still show content even if preloading fails
    console.warn('ContentLoader error:', error);
  }

  // Always render children immediately - no blocking
  return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
  );
};

export default ContentLoader; 