import React, { memo } from 'react';
import { motion } from 'framer-motion';

const InitialLoader = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Name with elegant typography */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 tracking-tight"
        >
          Justin Burrell
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-600 mb-12 font-light"
        >
          Software Engineer & Technology Enthusiast
        </motion.p>
        
        {/* Loading animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            
            {/* Spinning inner ring */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
        
        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-gray-500 mt-6 font-medium"
        >
          Loading your experience...
        </motion.p>
      </div>
    </motion.div>
  );
});

export default InitialLoader; 