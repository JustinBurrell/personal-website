import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

const LoadingProgress = memo(({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading your experience...' },
      { progress: 40, text: 'Preparing content...' },
      { progress: 60, text: 'Optimizing images...' },
      { progress: 80, text: 'Almost ready...' },
      { progress: 95, text: 'Final touches...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        setProgress(100);
        setLoadingText('Welcome!');
        clearInterval(interval);
        
        // Call onComplete after a short delay
        setTimeout(() => {
          onComplete && onComplete();
        }, 500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center z-50"
    >
      <div className="text-center w-full max-w-md px-6">
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
        
        {/* Progress bar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress percentage */}
          <motion.p
            key={progress}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-gray-600"
          >
            {progress}%
          </motion.p>
        </motion.div>
        
        {/* Loading text */}
        <motion.p
          key={loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-500 font-medium"
        >
          {loadingText}
        </motion.p>
        
        {/* Loading animation */}
        {progress < 100 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center mt-6"
          >
            <div className="relative">
              <div className="w-8 h-8 border-2 border-indigo-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default LoadingProgress; 