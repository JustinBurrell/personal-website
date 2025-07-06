import { useEffect, useRef } from 'react';
import { scrollSpy, Events } from 'react-scroll';

/**
 * Custom hook for safely initializing and managing scrollspy
 * Provides error handling and proper cleanup to prevent runtime errors
 */
export const useScrollSpy = (options = {}) => {
  const {
    enabled = true,
    pathname = '/',
    delay = 100,
    maxRetries = 3
  } = options;

  const retryCountRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const initializeScrollSpy = () => {
      try {
        // Clear any existing event listeners first
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');

        // Register new event listeners with error handling
        Events.scrollEvent.register('begin', () => {
          // Optional: Add any begin scroll logic here
        });

        Events.scrollEvent.register('end', () => {
          // Optional: Add any end scroll logic here
        });

        // Initialize scrollspy with error handling
        if (typeof scrollSpy.update === 'function') {
          scrollSpy.update();
          retryCountRef.current = 0; // Reset retry count on success
        } else {
          console.warn('scrollSpy.update is not available');
        }
      } catch (error) {
        console.warn('ScrollSpy initialization failed:', error.message);
        
        // Retry logic for transient errors
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          timeoutRef.current = setTimeout(() => {
            initializeScrollSpy();
          }, delay * retryCountRef.current);
        } else {
          console.error('ScrollSpy failed to initialize after maximum retries');
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    timeoutRef.current = setTimeout(initializeScrollSpy, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      try {
        // Clean up event listeners
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
      } catch (error) {
        console.warn('Error cleaning up scrollspy events:', error.message);
      }
    };
  }, [enabled, pathname, delay, maxRetries]);

  // Return a function to manually update scrollspy if needed
  const updateScrollSpy = () => {
    try {
      if (typeof scrollSpy.update === 'function') {
        scrollSpy.update();
      }
    } catch (error) {
      console.warn('Manual scrollspy update failed:', error.message);
    }
  };

  return { updateScrollSpy };
}; 