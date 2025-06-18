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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Check if this route's data is already cached
        const cacheKey = routeKey || JSON.stringify(data);
        const cachedData = routeDataCache.get(cacheKey);
        
        if (cachedData) {
          // If data is cached, only check for new images
          const imageUrls = extractImageUrls(data);
          const newImageUrls = imageUrls.filter(url => !imageCache.has(url));
          
          if (newImageUrls.length === 0) {
            // All images are already cached, show content immediately
            setIsLoading(false);
            return;
          }
          
          // Only preload new images
          await preloadImages(newImageUrls);
          setIsLoading(false);
          return;
        }

        // First time loading this route
        setIsLoading(true);
        setError(null);

        // Extract and preload all images
        const imageUrls = extractImageUrls(data);
        await preloadImages(imageUrls);

        // Cache the route data
        routeDataCache.set(cacheKey, data);
        
        // Add a small delay only for first load
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error preloading content:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    loadContent();
  }, [data, routeKey]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading content. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentLoader; 