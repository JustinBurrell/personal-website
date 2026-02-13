import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const trailConfig = { stiffness: 250, damping: 20, mass: 0.8 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  const handleMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove]);

  const cursorSize = isHovering ? 48 : 16;
  const trailSize = isHovering ? 56 : 32;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'none',
          x: cursorXSpring,
          y: cursorYSpring,
          width: cursorSize,
          height: cursorSize,
          marginLeft: -cursorSize / 2,
          marginTop: -cursorSize / 2,
          backgroundColor: 'transparent',
          border: `2px solid #C53D2F`,
          borderRadius: '50%',
          mixBlendMode: 'difference',
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
          marginLeft: -cursorSize / 2,
          marginTop: -cursorSize / 2,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* Trail effect */}
      <motion.div
        className="cursor-trail"
        style={{
          position: 'fixed',
          zIndex: 9998,
          pointerEvents: 'none',
          x: trailXSpring,
          y: trailYSpring,
          width: trailSize,
          height: trailSize,
          marginLeft: -trailSize / 2,
          marginTop: -trailSize / 2,
          border: '1px solid rgba(197, 61, 47, 0.2)',
          backgroundColor: 'transparent',
          borderRadius: '50%',
          mixBlendMode: 'difference',
        }}
        animate={{
          width: trailSize,
          height: trailSize,
          marginLeft: -trailSize / 2,
          marginTop: -trailSize / 2,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
