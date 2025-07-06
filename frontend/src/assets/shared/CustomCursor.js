import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Add event listeners
    window.addEventListener('mousemove', updateMousePosition);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'none',
          width: '16px',
          height: '16px',
          backgroundColor: 'transparent',
          border: '2px solid #dc2626',
          borderRadius: '50%',
          mixBlendMode: 'difference'
        }}
      />
      
      {/* Single trail effect */}
      <motion.div
        className="cursor-trail"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
          mass: 0.8
        }}
        style={{
          position: 'fixed',
          zIndex: 9998,
          pointerEvents: 'none',
          width: '32px',
          height: '32px',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          mixBlendMode: 'difference'
        }}
      />
    </>
  );
};

export default CustomCursor; 