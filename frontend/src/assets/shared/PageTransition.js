import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  useEffect(() => {
    // Ensure we're at the top before the animation starts
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        width: '100%',
        minHeight: '100vh', // Ensure content takes at least full viewport height
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 