import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimationWrapper = ({ children }) => {
  // Mouse Navigation
  useEffect(() => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add smooth scrolling for mouse wheel events
    const handleWheel = (e) => {
      e.preventDefault();
      
      const delta = e.deltaY;
      const scrollSpeed = 1.5; // Adjust this value to control scroll speed
      
      window.scrollBy({
        top: delta * scrollSpeed,
        behavior: 'smooth'
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      // Cleanup
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
